# Redigera webbplatsen i Sanity

Alla texter (svenska, engelska och arabiska), bilder, länkar, kontaktuppgifter, menyer, sidfoten och startsidans sektionsordning redigeras i Sanity Studio.
**Paket och priser hanteras inte i Sanity.** De hämtas från Stripe (`api/products.ts`). Texterna runt paketen, som rubriker och knapptexter, redigeras i Sanity.

Om Sanity inte är konfigurerat eller ett fält lämnas tomt visas webbplatsens standardinnehåll.

## Kom igång

1. **Skapa Sanity-projektet**
   ```sh
   cd studio
   npm install
   npx sanity login
   npx sanity init --bare        # skapar ett projekt och visar projektets ID
   ```
   Kopiera `studio/.env.example` till `studio/.env` och fyll i `SANITY_STUDIO_PROJECT_ID`.

2. **Anslut webbplatsen.** Lägg till följande i rotmappens `.env`:
   ```
   VITE_SANITY_PROJECT_ID=<your project id>
   VITE_SANITY_DATASET=production
   ```
   Lägg till samma variabler i Vercel under Project → Settings → Environment Variables.

3. **Tillåt webbplatsen att läsa från Sanity.** Gå till sanity.io/manage → ditt projekt → API → CORS origins och lägg till
   `http://localhost:5173` samt webbplatsens domän, till exempel `https://kornu.se`. Inga inloggningsuppgifter behövs.

4. **Kopiera standardinnehållet till Sanity.** Skapa en token på sanity.io/manage → API → Tokens med behörigheten *Editor*. Lägg den i rotmappens `.env` som `SANITY_WRITE_TOKEN` och kör från projektets rotmapp:
   ```sh
   npm run seed:sanity -- --dry-run   # optional preview → sanity-seed-preview.json
   npm run seed:sanity
   ```
   Kommandot laddar upp bilderna i `public/images` och skapar alla dokument. Om du kör det igen **skrivs Sanity-innehållet över** med standardinnehållet från projektet. Kör det därför bara vid första installationen eller när du avsiktligt vill återställa innehållet.
   Webbplatsen behöver inte skrivtokenen. Ta bort den från `.env` när du är klar.

   För att skapa de åtta separata hjälp- och policysidorna utan att ersätta befintligt innehåll, kör:
   ```sh
   npm run seed:sanity -- --policies-only
   ```
      Kommandot skapar varje sid-dokument om det saknas och kopierar eventuell text från den äldre samlingssidan. Befintliga sid-dokument skrivs inte över.

   5. **Publicera Studio** så redaktörer kan logga in:
   ```sh
   cd studio
   npm run deploy               # publiceras på https://<name>.sanity.studio
   ```
   Du kan också starta Studio lokalt med `npm run dev` (http://localhost:3333).

## Innehåll i Studio

Sidomenyn följer webbplatsens struktur. Varje mapp innehåller sidans sektioner och deras texter, bilder, knapptexter, länkar och listor. Dra listobjekt för att ändra ordning.

| Mapp i sidomenyn | Innehåll |
|---|---|
| 🏠 Startsida | Startsidessektioner, toppsektion, fördelar, vägen till körkortet, pakettexter, teorifrågor, simulator, bromssträcka, recensioner, avslutande uppmaning, karta, trafiklärare och galleri |
| 📚 Kurssida | Sidhuvud, kurskort och vägen till körkortet |
| 📦 Paketsida | Sidhuvud och texter. Paket och priser hanteras i Stripe. |
| 🎮 Simulatorsida / 🖼️ Gallerisida / ℹ️ Om oss | Sidhuvud, texter, bilder och foton |
| ✉️ Kontaktsida | Sidhuvud, etiketter, avslutande uppmaning, kontaktformulär och karta |
| 💳 Betalningssidor | Texter för genomförd och avbruten betalning |
| ⚖️ Hjälp och juridik | Åtta separata dokument: Vanliga frågor, Villkor & information, Integritetspolicy, Kontaktinformation, Användarvillkor, Fraktpolicy, Rättsligt meddelande och Återbetalningspolicy |
| ⚙️ Alla sidor | Sidhuvud och meny, sidfot med sociala medier och juridiska länkar, kontaktformulär samt webbplatsinställningar |

En sektion som används på flera sidor, till exempel den gröna avslutande uppmaningen, kan visas i flera mappar. Det är samma innehåll, så en ändring uppdateras överallt.

Länkar kan peka till en sida (`/packages`, `/contact`, `/vanliga-fragor`), en sektion på samma sida (`#paket`), en webbadress (`https://…`) eller `tel:` / `mailto:`.

Sidfotens hjälplänkar, juridiska länkar, Facebook-, Instagram- och TikTok-adresser samt länken till körkortstillstånd ändras under **Alla sidor → Sidfot**. Varje sida har ett eget dokument i **Hjälp och juridik**. Länken till körkortstillstånd går som standard till Transportstyrelsen.

Sanitys svenska gränssnitt aktiveras via användarmenyn: välj **Svenska** under språk. Sidomenyer, fält och hjälptexter i projektet är översatta till svenska.

Textfält har **Svenska / English / العربية**. Om ett språk lämnas tomt visas den svenska texten på webbplatsen.

## Publicera ändringar

Webbplatsen hämtar publicerat innehåll från Sanitys CDN och sparar det i webbläsaren inför nästa besök. När du klickar på **Publish** visas ändringen vid nästa sidladdning. CDN:en kan behöva upp till en minut för att uppdateras. Webbplatsen behöver inte byggas om eller publiceras på nytt.
