# Hemsida för Nav|ERP

Den publika webbplatsen för [Nav|ERP](https://github.com/ubbe76/Nav-ERP): en statiskt exporterad
Next.js-sajt på svenska. Design och beslut: `docs/superpowers/specs/2026-10-14-hemsida-design.md`.

## Kom igång

```bash
npm install
npm run dev        # http://localhost:3000 — synkar först innehåll från Nav-ERP
```

## Innehåll från Nav-ERP

Manualen, skärmdumparna, färgtokens, kapitellistan och logotypen kopieras in från ERP-repot vid
`dev`, `build`, `test` och `typecheck` (`npm run sync`). De kopierade filerna är gitignorerade och
redigeras aldrig här — ändra dem i Nav-ERP.

| Källa i Nav-ERP | Hamnar i |
|---|---|
| `docs/manual/*.md` | `content/manual/` |
| `docs/assets/screenshot-*.png` | `public/screenshots/` |
| `apps/web/styles/tokens.css` | `styles/tokens.css` |
| `apps/web/lib/manual.ts` | `lib/upstream/manual.ts` |
| `apps/web/components/ui/Wordmark.*` | `components/upstream/` |

Källan är `NAV_ERP_DIR`, annars `../dev`, annars en klon av GitHub-repot.

Skärmdumpar namnges `screenshot-<nyckel>.png` (ljust), `-dark.png` och `-dracula.png`. Saknas en
variant visas närmaste. En ny skärmdump används genom att lägga till nyckeln i `content/screenshots.ts`.

## Kommandon

| Kommando | Vad |
|---|---|
| `npm run build` | Statisk export till `out/`, följd av länkkontroll |
| `npm test` | Vitest: synk, manual, teman, kontrast, länkar, texter |
| `npm run test:e2e` | Playwright mot `out/` (kör `build` först) |
| `npm run test:visual` | Helsidesskärmdumpar i alla tre teman till `e2e-screens/` |

## Miljövariabler

| Variabel | Används till |
|---|---|
| `NAV_ERP_DIR` | Var Nav-ERP finns (standard `../dev`) |
| `SITE_URL` | Sajtens origin i sitemap och delningsbilder |
| `BASE_PATH` | Underkatalog, t.ex. `/hemsida` för `<användare>.github.io/hemsida/` |
| `GITHUB_TOKEN` | Valfri: höjer GitHubs rate limit för stjärnor och release |

## Publicering

GitHub Actions (`.github/workflows/deploy.yml`) bygger, testar och publicerar till GitHub Pages vid
push till `main` och varje natt. Första gången:

1. Skapa ett GitHub-repo för hemsidan och pusha.
2. Settings → Pages → Source: **GitHub Actions**.
3. Är Nav-ERP privat: skapa en finkornig token med läsrätt till Nav-ERP och spara den som
   secreten `NAV_ERP_SECRET`.
4. Egen domän: Settings → Pages → Custom domain. `SITE_URL` och `BASE_PATH` följer med automatiskt.

`out/` är ren statik och kan lika gärna läggas på Cloudflare Pages, Netlify eller valfri webbserver.

## Regler för texterna

- Allt på svenska. Produktnamnet skrivs Nav|ERP.
- Inga konkurrenter nämns vid namn (testas).
- Inga påhittade kunder, citat eller siffror.
- Påståenden om funktioner ska gå att hitta i manualen.

## Licens

GPL-3.0-or-later, som Nav-ERP.
