import { getStripe } from "./stripe/server.js";

type Request = { method?: string; headers: Record<string, string | string[] | undefined> };
type Response = { status: (code: number) => Response; json: (body: unknown) => void };

type CatalogProductPayload = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  priceId: string;
  lessons?: string;
  duration?: string;
  features: string[];
  popular: boolean;
  badge?: string;
  sortOrder: number;
  collections: string[];
  image?: string | null;
  originalPrice?: number | null;
};

const EXCLUDED_PRODUCT_IDS = new Set(["payment-test"]);
const TRUE_VALUES = new Set(["true", "1", "yes", "on"]);

export default async function handler(req: Request, res: Response) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed." });
  if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error: "Stripe is not configured." });

  try {
    const stripe = getStripe();
    const products = await listAllProducts(stripe);
    const catalog: CatalogProductPayload[] = [];

    for (const product of products) {
      const priceInspection = await inspectPrices(stripe, product);
      const websiteVisibleValue = product.metadata?.website_visible;
      const websiteVisible = isWebsiteVisible(websiteVisibleValue);
      const excludedById = EXCLUDED_PRODUCT_IDS.has(product.id);
      const exclusionReason = excludedById
        ? "product_id_excluded"
        : !priceInspection.selectedPrice
          ? "no_valid_active_one_time_sek_price"
          : !websiteVisible
            ? "website_visible_not_true"
            : null;

      console.info("Stripe catalog product diagnostic", {
        name: product.name,
        id: product.id,
        active: product.active,
        defaultPrice: priceInspection.defaultPriceInfo,
        activePriceCount: priceInspection.activePriceCount,
        rejectedActivePriceCounts: priceInspection.rejectedActivePriceCounts,
        selectedPrice: priceInspection.selectedPrice ? safePriceInfo(priceInspection.selectedPrice) : null,
        website_visible: websiteVisibleValue ?? null,
        collections: product.metadata?.collections ?? null,
        excludedById,
        exclusionReason,
      });

      if (exclusionReason) continue;
      const price = priceInspection.selectedPrice!;

      const metadata = product.metadata ?? {};
      const features = collectFeatures(metadata);
      const collections = normalizeList(metadata.collections);
      const originalPrice = parsePriceNumber(metadata.original_price ?? metadata.compare_at_price ?? metadata.compare_at_amount ?? metadata.list_price);

      catalog.push({
        id: product.id,
        name: product.name,
        description: product.description || metadata.description || "Körkortspaket från Kör Nu Trafikskola.",
        price: price.unit_amount ? Math.round(price.unit_amount / 100) : 0,
        currency: price.currency ?? "sek",
        priceId: price.id ?? "",
        lessons: metadata.lessons || undefined,
        duration: metadata.duration || undefined,
        features,
        popular: isTrue(metadata.popular),
        badge: metadata.badge || undefined,
        sortOrder: parseSortOrder(metadata.sort_order),
        collections,
        image: product.images?.[0] || null,
        originalPrice: originalPrice ?? undefined,
      });
    }

    catalog.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "sv"));
    return res.status(200).json({ products: catalog });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    console.error("Stripe catalog fetch failed", message);
    return res.status(500).json({ error: "The product catalog is temporarily unavailable. Please retry." });
  }
}

async function listAllProducts(stripe: ReturnType<typeof getStripe>) {
  const products: Awaited<ReturnType<typeof stripe.products.list>>["data"] = [];
  let startingAfter: string | undefined;

  while (true) {
    const page = await stripe.products.list({
      active: true,
      limit: 100,
      starting_after: startingAfter,
      expand: ["data.default_price"],
    });

    products.push(...page.data);
    if (!page.has_more) break;
    const lastProductId = page.data[page.data.length - 1]?.id;
    if (!lastProductId) throw new Error("Stripe product pagination returned an empty page with more results.");
    startingAfter = lastProductId;
  }

  return products;
}

async function inspectPrices(stripe: ReturnType<typeof getStripe>, product: { id: string; default_price?: string | { id?: string; active?: boolean; type?: string; currency?: string; unit_amount?: number | null } | null }) {
  const activePrices: Awaited<ReturnType<typeof stripe.prices.list>>["data"] = [];
  let startingAfter: string | undefined;

  while (true) {
    const page = await stripe.prices.list({ product: product.id, active: true, limit: 100, starting_after: startingAfter });
    activePrices.push(...page.data);
    if (!page.has_more) break;
    const lastPriceId = page.data[page.data.length - 1]?.id;
    if (!lastPriceId) throw new Error(`Stripe price pagination returned an empty page for product ${product.id}.`);
    startingAfter = lastPriceId;
  }

  const defaultPriceId = typeof product.default_price === "string"
    ? product.default_price
    : product.default_price?.id;
  let defaultPrice = typeof product.default_price === "object" && product.default_price
    ? product.default_price
    : activePrices.find((price) => price.id === defaultPriceId) ?? null;

  if (!defaultPrice && defaultPriceId) {
    try {
      defaultPrice = await stripe.prices.retrieve(defaultPriceId);
    } catch {
      defaultPrice = null;
    }
  }

  const rejectedActivePriceCounts = { notOneTime: 0, notSek: 0, missingOrInvalidAmount: 0 };
  const validCandidates = activePrices.filter((price) => {
    if (price.type !== "one_time") {
      rejectedActivePriceCounts.notOneTime += 1;
      return false;
    }
    if (price.currency !== "sek") {
      rejectedActivePriceCounts.notSek += 1;
      return false;
    }
    if (price.unit_amount == null || price.unit_amount <= 0) {
      rejectedActivePriceCounts.missingOrInvalidAmount += 1;
      return false;
    }
    return true;
  });

  const validDefault = defaultPrice && defaultPrice.active && defaultPrice.type === "one_time" && defaultPrice.currency === "sek" && (defaultPrice.unit_amount ?? 0) > 0
    ? activePrices.find((price) => price.id === defaultPrice!.id) ?? null
    : null;

  validCandidates.sort((a, b) => (a.unit_amount ?? 0) - (b.unit_amount ?? 0) || a.id.localeCompare(b.id));

  return {
    selectedPrice: validDefault ?? validCandidates[0] ?? null,
    activePriceCount: activePrices.length,
    defaultPriceInfo: defaultPrice ? safePriceInfo(defaultPrice) : defaultPriceId ? { id: defaultPriceId, unavailable: true } : null,
    rejectedActivePriceCounts,
  };
}

function safePriceInfo(price: { id?: string; type?: string; active?: boolean; currency?: string; unit_amount?: number | null }) {
  return {
    id: price.id ?? null,
    type: price.type ?? null,
    active: price.active ?? null,
    currency: price.currency ?? null,
    unit_amount: price.unit_amount ?? null,
  };
}

function collectFeatures(metadata: Record<string, string>) {
  const explicit = normalizeList(metadata.features);
  const extra: string[] = [];
  for (let index = 1; index <= 4; index += 1) {
    const value = metadata[`feature_${index}`];
    if (value) extra.push(...normalizeList(value));
  }

  const merged = [...explicit, ...extra];
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of merged) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

function normalizeList(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(/[|,]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseSortOrder(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isTrue(value: unknown): boolean {
  const stringValue = typeof value === "string" ? value.trim().toLowerCase() : String(value ?? "").trim().toLowerCase();
  return TRUE_VALUES.has(stringValue);
}

function isWebsiteVisible(value: unknown): boolean {
  return isTrue(value);
}

function parsePriceNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const normalized = typeof value === "string" ? value.trim() : String(value);
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return undefined;
  return parsed > 0 ? parsed : undefined;
}
