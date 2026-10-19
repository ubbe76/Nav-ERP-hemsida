// /llms.txt (llmstxt.org): a Markdown map of the site for language models,
// built from the same lists as the sitemap so it never goes stale.
import { FEATURE_AREAS } from "@/content/areas";
import { MANUAL_META } from "@/content/manual-meta";
import { RELEASES } from "@/content/releases";
import { MANUAL_CHAPTERS } from "./manual";
import { SITE, absoluteUrl } from "./site";

const link = (title: string, path: string, note: string) => `- [${title}](${absoluteUrl(path)}): ${note}`;

export function llmsTxt(): string {
  return [
    `# ${SITE.name}`,
    "",
    `> ${SITE.name} är ett affärssystem (ERP) med öppen källkod för mindre och medelstora tillverkande företag i ` +
      "Sverige. Det samlar artiklar, lager, inköp, försäljning, tillverkning, tid, kalkyl och bokföring i ett system, " +
      "är gratis under GPL-3.0 och körs på företagets egen server med Docker och PostgreSQL.",
    "",
    `${SITE.name} byggs av Urban Källefors och är i alfa: senaste version är ${RELEASES[0]!.version}, ` +
      "som går att prova men ännu inte är redo för skarp drift. Sajten och manualen är på svenska.",
    "",
    "## Sidor",
    "",
    link("Startsidan", "/", "vad Nav|ERP är, vad det kostar och hur kalkylen byggs upp"),
    link("Kom igång", "/kom-igang/", "installation med Docker, import av register, uppdatering och backup"),
    link("Gratis affärssystem", "/gratis-affarssystem/", "vad det kostar att köra Nav|ERP i fem år, och serverkraven"),
    link("Vanliga frågor", "/fragor/", "hur färdigt systemet är, data och backup, flytt från ett gammalt system, säkerhet"),
    link("Öppen källkod", "/oppen-kallkod/", "vad GPL-3.0 betyder för ett företag"),
    link("Om Nav|ERP", "/om/", "vem som bygger systemet och hur man når projektet"),
    link("Versioner", "/versioner/", "nyheter och ändringar i varje version"),
    "",
    "## Funktioner",
    "",
    ...FEATURE_AREAS.map((a) => link(a.title, `/funktioner/${a.slug}/`, a.description)),
    "",
    "## Manual",
    "",
    ...MANUAL_CHAPTERS.map((c) =>
      link(c.title, `/hjalp/${c.slug}/`, MANUAL_META[c.slug]?.description ?? c.description),
    ),
    "",
    "## Valfritt",
    "",
    `- [Källkoden på GitHub](${SITE.repoUrl}): koden, ärenden och diskussioner`,
    "",
  ].join("\n");
}
