// One-time helper: gets a long-lived Google refresh token and prints the Business Profile
// account/location IDs needed by api/google-reviews.ts.
//
//   1. Put GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
//   2. npm run google:auth
//   3. Open the printed URL, sign in with the Google account that manages Kör Nu's Business Profile
//   4. Copy the printed values into .env and the Vercel project's environment variables
import http from "http";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const PORT = 5555;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
const SCOPE = "https://www.googleapis.com/auth/business.manage";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env first.");
  process.exit(1);
}

const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.search = new URLSearchParams({
  client_id: clientId,
  redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope: SCOPE,
  // offline + consent guarantees Google returns a refresh token.
  access_type: "offline",
  prompt: "consent",
}).toString();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", REDIRECT_URI);
  if (url.pathname !== "/callback") return res.writeHead(404).end();

  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400).end(`Authorization failed: ${url.searchParams.get("error") ?? "no code"}`);
    return;
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: REDIRECT_URI, grant_type: "authorization_code" }),
    });
    const tokens = (await tokenResponse.json()) as { access_token?: string; refresh_token?: string; error_description?: string };
    if (!tokens.access_token) throw new Error(tokens.error_description ?? "Token exchange failed.");

    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" }).end("Done. You can close this tab and return to the terminal.");

    console.log("\nGOOGLE_REFRESH_TOKEN=" + (tokens.refresh_token ?? "(none returned: remove the app at myaccount.google.com/permissions and retry)"));
    await printLocations(tokens.access_token);
  } catch (error) {
    res.writeHead(500).end("Something went wrong, see the terminal.");
    console.error(error);
  } finally {
    server.close();
  }
});

async function printLocations(accessToken: string) {
  const headers = { Authorization: `Bearer ${accessToken}` };
  const accounts = (await (await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", { headers })).json()) as { accounts?: { name: string; accountName?: string }[] };

  for (const account of accounts.accounts ?? []) {
    const locations = (await (await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title&pageSize=100`, { headers })).json()) as { locations?: { name: string; title?: string }[] };
    for (const location of locations.locations ?? []) {
      console.log(`\n# ${account.accountName ?? account.name} / ${location.title ?? location.name}`);
      console.log(`GOOGLE_BUSINESS_ACCOUNT_ID=${account.name.replace("accounts/", "")}`);
      console.log(`GOOGLE_BUSINESS_LOCATION_ID=${location.name.replace("locations/", "")}`);
    }
  }
  if (!accounts.accounts?.length) console.log("\nNo Business Profile accounts found for this Google user (or the API is not enabled/approved yet).", accounts);
}

server.listen(PORT, () => {
  console.log(`Add ${REDIRECT_URI} as an authorized redirect URI on the OAuth client, then open:\n\n${authUrl}\n`);
});
