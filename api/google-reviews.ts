import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

type Request = { method?: string };
type Response = { status: (code: number) => Response; json: (body: unknown) => void; setHeader: (name: string, value: string) => void };

type GoogleReview = {
  reviewId: string;
  reviewer?: { displayName?: string; profilePhotoUrl?: string; isAnonymous?: boolean };
  starRating?: "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "STAR_RATING_UNSPECIFIED";
  comment?: string;
  createTime: string;
  updateTime?: string;
};

type GoogleReviewsPage = { reviews?: GoogleReview[]; averageRating?: number; totalReviewCount?: number; nextPageToken?: string };

export type ReviewPayload = { id: string; author: string; photo: string | null; rating: number; text: string; createTime: string };

const STAR_VALUES: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
// Google caps pageSize at 50; two pages is plenty for a carousel.
const MAX_PAGES = 2;
// Served from Vercel's CDN for 6 hours, then refreshed in the background. If Google is down,
// the last good response keeps being served for up to a week.
const CACHE_HEADER = "public, s-maxage=21600, stale-while-revalidate=604800";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed." });

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_BUSINESS_ACCOUNT_ID, GOOGLE_BUSINESS_LOCATION_ID } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN || !GOOGLE_BUSINESS_ACCOUNT_ID || !GOOGLE_BUSINESS_LOCATION_ID) {
    return res.status(500).json({ error: "Google reviews are not configured." });
  }

  try {
    const accessToken = await getAccessToken(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN);
    const accountId = GOOGLE_BUSINESS_ACCOUNT_ID.replace(/^accounts\//, "");
    const locationId = GOOGLE_BUSINESS_LOCATION_ID.replace(/^locations\//, "");
    const minRating = Number(process.env.GOOGLE_REVIEWS_MIN_RATING ?? 4) || 1;

    const collected: GoogleReview[] = [];
    let averageRating: number | undefined;
    let totalReviewCount: number | undefined;
    let pageToken: string | undefined;

    for (let page = 0; page < MAX_PAGES; page += 1) {
      const url = new URL(`https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`);
      url.searchParams.set("pageSize", "50");
      url.searchParams.set("orderBy", "updateTime desc");
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (!response.ok) throw new Error(`Reviews request failed (${response.status}): ${await response.text()}`);
      const data = (await response.json()) as GoogleReviewsPage;

      collected.push(...(data.reviews ?? []));
      averageRating ??= data.averageRating;
      totalReviewCount ??= data.totalReviewCount;
      pageToken = data.nextPageToken;
      if (!pageToken) break;
    }

    const reviews: ReviewPayload[] = collected
      .map((review) => ({
        id: review.reviewId,
        author: review.reviewer?.isAnonymous ? "Google user" : review.reviewer?.displayName?.trim() || "Google user",
        photo: review.reviewer?.profilePhotoUrl ?? null,
        rating: STAR_VALUES[review.starRating ?? ""] ?? 0,
        text: originalComment(review.comment),
        createTime: review.createTime,
      }))
      .filter((review) => review.text && review.rating >= minRating);

    res.setHeader("Cache-Control", CACHE_HEADER);
    return res.status(200).json({
      averageRating: averageRating ? Math.round(averageRating * 10) / 10 : null,
      totalReviewCount: totalReviewCount ?? null,
      reviews,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    console.error("Google reviews fetch failed", message);
    // Not cached, so the next request retries; the CDN keeps serving the last good copy meanwhile.
    res.setHeader("Cache-Control", "no-store");
    return res.status(502).json({ error: "Google reviews are temporarily unavailable." });
  }
}

// Access tokens live for one hour, so a fresh one is minted from the long-lived refresh token on every (uncached) request.
async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: "refresh_token" }),
  });
  if (!response.ok) throw new Error(`Token refresh failed (${response.status}): ${await response.text()}`);
  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Token refresh returned no access_token.");
  return data.access_token;
}

// Google appends machine translations as "<translated>\n\n(Original)\n<original>"; keep only the reviewer's own words.
function originalComment(comment: string | undefined) {
  if (!comment) return "";
  const original = comment.split("(Original)")[1];
  const text = original ?? comment.replace(/^\(Translated by Google\)\s*/, "");
  return text.split("(Translated by Google)")[0].trim();
}
