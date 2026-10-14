# Hemsida för Nav|ERP — design

**Datum:** 2026-10-14
**Status:** Godkänd i dialog, väntar på granskning av skriven spec

## 1. Syfte och mål

Nav|ERP är ett öppet källkod-ERP (GPL-3.0-or-later) för mindre och medelstora
svenska tillverkande företag, självhostat med Docker. Hemsidan ska nå svenska
företag som kan ha nytta av det.

**Primärt mål:** besökaren testar själv — laddar ner från GitHub och kör
`docker compose up`. Det finns ingen säljprocess, SaaS eller kontaktformulär.

**Målgrupp:** verksamheten först (VD, produktionschef, inköpare, ekonomi),
tekniken sedan (IT-ansvarig, samlad på `/kom-igang`).

**Framgång:**
- En produktionschef förstår inom 10 sekunder på startsidan vad Nav|ERP gör,
  att det är gratis och vad nästa steg är.
- En IT-ansvarig kommer från startsidan till ett körande system på några
  minuter via `/kom-igang`.

**Avgränsningar och regler:**
- Allt innehåll på svenska. Ingen engelsk version i v1.
- **Monitor (G5) eller andra konkurrenter nämns aldrig vid namn**, någonstans
  på sidan. Bakgrunden beskrivs neutralt ("byggt av någon som arbetar dagligen
  med inköp, tillverkning och kalkyl").
- Inget påhittat socialt bevis: inga kundlogotyper, citat eller
  användarsiffror som inte är sanna.
- Inga cookies och ingen spårning i v1. Typsnitt bakas in vid bygget, inga
  anrop till tredje part från besökarens webbläsare.
- Inte i v1: blogg/nyheter, ändringslogg, engelska, sökning i manualen,
  kontaktformulär, statistik.

## 2. Sidstruktur

```
/                                   Startsida
/funktioner                         Översikt — rutnät med de sex områdena
  /funktioner/tillverkning          TO, beredning (struktur + rutt), behovsberäkning,
                                    beläggning, pågående arbete, legoresurser
  /funktioner/lager-och-artiklar    Artikelkort, artikelöversikt (behov/inkommande/
                                    disponibelt), lagerlogg, lagerplatser,
                                    inventering, lagervärdering, import
  /funktioner/inkop-och-forsaljning Offert → kundorder → utleverans → faktura,
                                    prislistor/kundpriser, förfrågan → inköpsorder →
                                    inleverans, frakt via Sendify, reskontra,
                                    bank- och betalfiler
  /funktioner/kalkyl                För-/efterkalkyl, påslag (TO/MO/LO/Affo),
                                    kalkylutfall, marginal
  /funktioner/personal-tid-lon      Stämpelterminal, tidrapporter, scheman, ATF,
                                    attest, övertid, löneunderlag, PAXml
  /funktioner/ekonomi               Kontoplan, verifikat, huvudbok, BR/RR, moms,
                                    SIE, anläggningsregister, årsbokslut,
                                    automatkontering
/kom-igang                          För IT: krav, docker compose, första inloggning,
                                    import av grunddata, backup, uppdatering
/oppen-kallkod                      Varför GPL, vad det betyder för företaget
                                    (ingen inlåsning, egen data, inga licensavgifter),
                                    bakgrund, bidra, licens
/hjalp                              Manualens innehållsförteckning
  /hjalp/[kapitel]                  Kapitel renderade från dev/docs/manual/*.md
```

`/hjalp` använder samma sökväg som i appen, så manualens interna länkar
(t.ex. `/hjalp/system#kalkyler`) fungerar utan omskrivning.

**Sidhuvud (alla sidor):** logotyp, Funktioner, Kom igång, Manual, Öppen
källkod, temaväljare, GitHub-länk med antal stjärnor, primärknapp
"Ladda ner" → `/kom-igang`. På mobil fälls navigeringen ihop till en meny.

**Sidfot:** länkar till alla sidor, licens (GPL-3.0-or-later), senaste
release från GitHub, länk till källkoden.

## 3. Startsidan

Uppifrån och ned:

1. **Hero.** Rubrik i stil med *"Affärssystemet för svensk tillverkning.
   Öppet, självhostat och utan licensavgifter."* Underrubrik med kedjan
   artikel → lager → inköp/försäljning → tillverkning → tid → kalkyl →
   bokföring i en mening. Primär CTA **"Kom igång gratis"** → `/kom-igang`,
   sekundär **"Se funktionerna"** → `/funktioner`. Skärmdump av översikten i
   appram, temaväxlande.
2. **Navet** (signaturelement, se 4.4): de sex områdena som ekrar runt
   kalkylen i mitten, med en rad text per område och länk till dess
   funktionssida.
3. **Tre värdeargument:**
   - *Ingen licenskostnad, ingen inlåsning.* GPL — ni äger koden och datan.
   - *Byggt från verkstadsgolvet.* Ur daglig praktisk erfarenhet av inköp,
     tillverkning och kalkyl.
   - *Svenskt på riktigt.* SIE, PAXml, bankfiler, moms, ATF, svenska begrepp.
4. **Produkten i bild.** 3–4 riktiga skärmdumpar med korta bildtexter
   (artikelkortets beredning, artikelöversikten, tillverkningsordrar,
   stämpelterminalen om bild finns). Ingen marknadsgrafik.
5. **Kalkyl.** Förkalkyl mot efterkalkyl med en enkel visualisering av
   påslagen TO, MO, LO och Affo. Länk till `/funktioner/kalkyl`.
6. **"Vad det kostar".** Programvaran är gratis. Ni står för en server (t.ex.
   en VPS för ett par hundra kronor i månaden) och någon som installerar.
7. **Avslutande CTA för IT.** Kodblock `git clone … && docker compose up -d`
   med kopieringsknapp, knapp till `/kom-igang`, länk till GitHub.

## 4. Visuellt formspråk

### 4.1 Grund

Appens designgrund används oförändrad: Space Grotesk (rubriker, siffror),
Figtree (brödtext, UI), sval grå neutralskala, radier 10/14/16/18 px,
tabulära siffror. Färgtokens kommer från appens
`apps/web/styles/tokens.css` (se 5.2) och följer dess temakontrakt:
komponenter använder bara semantiska tokens, aldrig hex-värden eller
`--neutral-*`.

### 4.2 Accent

Hemsidan använder appens accenttokens oförändrade, så att knappar och
länkar ser likadana ut som i produkten:

- **Ljust och Mörkt:** `--accent` `#337A58` med vit text
  (`--accent-text`, ≈5,2:1, WCAG AA) på primärknappar. `--accent-fg` för
  länkar och rubrikaccenter (`#337A58` ljust, `#48C58C` mörkt).
- **Dracula:** lila `#BD93F9` med mörk text, rosa rubrikaccent.
- Logotypens `#2E9E6B` används bara i logotyp, navsymbol och dekor — aldrig
  som textfärg (3,4:1 mot vitt). Logotyp och navsymbol behåller sina gröna
  färger i alla teman (`--wordmark-*`-tokens).
- Allt annat är monokromt. Statusfärger förekommer bara i skärmdumparna.

Behöver hemsidan tokens som appen saknar (t.ex. hero-storlekar) läggs de i
`styles/site.css`. Färgtokens som gäller per tema definieras då i alla tre
temablock enligt samma kontrakt. Appens fil ändras inte.

### 4.3 Teman

Tre teman: **Ljust, Mörkt, Dracula**, samma etiketter och samma
`localStorage`-nyckel (`nav-erp-theme`) som appen. Utan sparat val följer
sidan `prefers-color-scheme` (ljust/mörkt). Ett inline-skript i `<head>`
sätter `data-theme` före första renderingen, samma mönster som appens
`themeBootScript`. Åtkomst till `localStorage` sker inom try/catch.

### 4.4 Uttryck

- Hero-rubrik ≈64–72 px desktop, spärrning −0.035em. Skalar ned på mobil.
- Sektioner med 120–160 px luft, innehållsbredd max ≈1200 px, brödtext max
  ≈65 tecken per rad.
- **Navet:** en SVG i logotypens formspråk — sex ekrar runt ett centrum.
  Ekrarna är Artiklar & lager, Inköp, Försäljning, Tillverkning,
  Personal & tid, Ekonomi. Centrum är **Kalkyl** ("allt rinner in hit").
  Ekrarna ritas ut en gång när blocket kommer i bild. På mobil faller det
  tillbaka till en lodrät lista med samma innehåll.
- Skärmdumpar i appram: radie 18 px, tunn kant, mjuk skugga.
- Rörelse: in-tonade element med 8 px glidning; allt avstängt vid
  `prefers-reduced-motion`.
- Ikoner: `lucide-react`, samma version som appen.
- Manualsidor: lugnare layout — kapitelnavigering till vänster, rubriker i
  kapitlet till höger, läsbredd i mitten. Ingen uttrycksfull grafik.

### 4.5 Skärmdumpar per tema

Varje skärmdump har en logisk nyckel (t.ex. `dashboard`, `article`) och upp
till tre varianter. Valt tema visar sin variant; saknas den faller det
tillbaka Dracula → Mörkt → Ljust. Växlingen sker med CSS på `data-theme`
(alla varianter i markup, endast en synlig), eftersom `<picture>` inte kan
läsa `data-theme`. Bilder utanför skärm laddas lat (`loading="lazy"`).

## 5. Teknisk uppbyggnad

### 5.1 Stack

- Next.js 16 (App Router), React 19, TypeScript `strict` — samma versioner
  som `dev/apps/web`.
- `output: 'export'` → statisk HTML i `out/`. `images.unoptimized: true`.
  `trailingSlash: true` så att sökvägar fungerar på statiska värdar.
- Vanlig CSS: tokens + CSS Modules per komponent. Ingen Tailwind.
- Typsnitt via `next/font/google` (bakas in vid bygget).
- Fristående projekt i `hemsida/` med eget git-repo.

### 5.2 Innehåll från `dev/` — `scripts/sync-content.ts`

Körs före `dev` och `build` (npm `predev`/`prebuild`). Kopierar:

| Från (i Nav-ERP) | Till (i hemsida) |
|---|---|
| `docs/manual/*.md` | `content/manual/` |
| `docs/assets/*.png`, `*.svg` | `public/screenshots/` |
| `apps/web/styles/tokens.css` | `styles/tokens.css` |
| `apps/web/lib/manual.ts` | `lib/upstream/manual.ts` |

Källan är `NAV_ERP_DIR` (standard `../dev`). Finns katalogen inte (t.ex. i
CI) görs en grund kloning av `https://github.com/ubbe76/Nav-ERP` till en
temporär katalog. Saknas en förväntad fil avbryts bygget med ett tydligt
felmeddelande som namnger filen. De kopierade filerna listas i `.gitignore`.

Logotyper (`nav-erp-logo*.svg`, `nav-erp-symbol.svg`) och favicons finns i
`/home/ubbe/Nav-ERP/design/logo/`, som ligger utanför ERP-repot. De kopieras
en gång och checkas in i hemsidans `public/brand/` respektive `public/`.

### 5.3 Manualen

- Kapitellistan kommer från appen: `MANUAL_CHAPTERS` (slug, titel,
  beskrivning, grupp, fil, ordning) och `slugifyHeading` importeras från den
  synkade `lib/upstream/manual.ts`. Hemsidan har ingen egen kapitellista.
  Appens `loadChapterHtml` används inte (den läser en sökväg relativ till
  appen); hemsidan har en egen laddare i `lib/manual.ts` som läser från
  `content/manual/`.
- `/hjalp/[kapitel]` genereras via `generateStaticParams` från
  `MANUAL_CHAPTERS`. Saknas filen för ett kapitel avbryts bygget.
- Rendering med `marked` och en heading-renderer som sätter
  `id={slugifyHeading(text)}` — samma regel som appen, så att `#kalkyler`,
  `#belaggning` osv. fungerar.
- Innehållsförteckning för höger spalt byggs från `##`-rubrikerna.
- `/hjalp` grupperar kapitlen efter appens `group`.

### 5.4 Funktionssidor

Data-drivna: `content/features/<omrade>.ts` exporterar rubrik, ingress,
punktgrupper, skärmdumpsnyckel och länk(ar) till manualkapitel. En
gemensam sidmall `app/funktioner/[omrade]/page.tsx` renderar dem.
`/funktioner` och navet på startsidan läser samma data.

### 5.5 Komponenter

| Komponent | Uppgift |
|---|---|
| `SiteHeader` | Logotyp, navigering, temaväljare, GitHub, CTA; mobilmeny |
| `SiteFooter` | Länkar, licens, version |
| `ThemeToggle` | Byter `data-theme`, sparar valet |
| `HubDiagram` | Navet (SVG), med mobil reservlayout |
| `Screenshot` | Temaväxlande bild i appram |
| `FeatureSection` | Rubrik + punkter + bild, för funktionssidor |
| `CodeBlock` | Kodblock med kopieringsknapp |
| `CtaBand` | Avslutande uppmaning |
| `ManualLayout` | Tre spalter för manualen |

### 5.6 GitHub-data

`lib/github.ts` hämtar stjärnor och senaste release från GitHubs API en gång
vid bygget (använder `GITHUB_TOKEN` om den finns). Vid fel eller tidsgräns
returneras `null` och sidan visas utan siffrorna — bygget går aldrig sönder
av detta.

### 5.7 SEO

Metadata per sida (titel, beskrivning, Open Graph), `sitemap.xml`,
`robots.txt`, `lang="sv"`, Open Graph-bild för startsidan.
Bas-URL konfigureras med `SITE_URL` (domänen är inte bestämd).

### 5.8 Driftsättning

GitHub Actions: vid push till `main` och nattligt (cron) — sync, build,
tester, publicering till GitHub Pages. Nattbygget hämtar uppdaterad manual
och skärmdumpar. `out/` är ren statik och kan flyttas till Cloudflare
Pages/Netlify utan kodändring.

## 6. Felhantering

- Saknad innehållskälla eller saknad förväntad fil → bygget avbryts med
  tydligt meddelande.
- GitHub API otillgängligt → siffror utelämnas, bygget fortsätter.
- `localStorage` otillgängligt → temat följer systemet, inget fel.
- Okänt sparat tema-id → ignoreras, systemets läge används.
- Ingen JavaScript → all text och navigering fungerar; temaväljare och
  kopieringsknapp är de enda som kräver JS.

## 7. Tester

- **Vitest:** synk-skriptet (källa lokal/saknad, saknad fil), manualrendering
  (ankare matchar appens slugs, kapitelordning, interna länkar),
  skärmdumpsfallback (Dracula → Mörkt → Ljust).
- **Länkkontroll:** efter bygget kontrolleras att varje intern länk och
  ankare i `out/` pekar på något som finns.
- **Temakontrakt:** varje tema definierar alla tokens som hemsidan använder;
  kontrast för knapptext mot knappbakgrund ≥4,5:1 i alla tre teman.
- **Playwright:** skärmdumpar av startsidan, en funktionssida och ett
  manualkapitel i alla tre teman, desktop- och mobilbredd, för visuell
  granskning. Kontroll av att sidan inte scrollar horisontellt på mobil.

## 8. Öppna punkter (påverkar inte designen)

- Domännamn (`SITE_URL`).
- Eventuell cookiefri statistik (Plausible/Umami) i en senare version.
- Fler skärmdumpar (t.ex. stämpelterminalen, kalkylen, Dracula-varianter)
  kan tas med Playwright mot en instans med exempeldata — utanför v1 om de
  inte redan finns.
