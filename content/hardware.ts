// What the server needs, measured on 2026-11-19 on version 0.8.20.
// - The build, from scratch (--no-cache) on a server with 4 cores: api alone
//   5 min 11 s and +1.9 GB memory at the peak, web alone 5 min 48 s and
//   +1.8 GB, both at once (docker compose up -d --build) 11 min 49 s and
//   +3.2 GB. An update on the demo (2 cores, cache, one image at a time) took
//   about 10 minutes.
// - Memory in use: about 350 MB idle for the three containers, up to about
//   800 MB under the load test; the whole demo machine stayed under 1.6 GB.
// - Disk: the images 3.1 GB (docker system df); the demo's database 20 MB
//   (42 articles), 24 MB after the load test's 700 orders; the demo's build
//   cache had grown to 17 GB over about 14 updates.
// - Load test against the demo (2 cores, 3.8 GB): virtual users with 5–15 s
//   between actions. 20 users (sellers creating and delivering orders, shop
//   floor stamping in and out, readers): page view median 0.29 s, CPU about a
//   third. 40 users: median 0.38 s, 95th percentile 1.3 s (order card 3.4 s),
//   CPU 57 %. Scripts and results in the private repo's verktyg/lasttest.
// Re-measure when the stack changes. Shown on /gratis-affarssystem/ and /kom-igang/.
export const HARDWARE = {
  summary:
    "Uppmätt på version 0.8.20 i november 2026. Bygget mättes på en server med 4 processorkärnor, och driften med ett lasttest mot demon, som har 2 kärnor och 3,8 GB minne.",
  points: [
    "Minne: databasen, API:et och webben använder tillsammans omkring 350 MB i vila och upp till 800 MB under hög last. Att bygga programmet vid installation och uppdatering kräver 1,9 GB till om API:et och webben byggs efter varandra (docker compose build api, sedan docker compose build web) och 3,2 GB om de byggs samtidigt, som docker compose up -d --build gör. 4 GB minne räcker om de byggs efter varandra, och 8 GB ger marginal.",
    "Disk: programmet tar 3,1 GB. Demons databas, ett påhittat företag med 42 artiklar, tar 20 MB och växte med 4 MB när lasttestet lade och levererade 700 ordrar. Docker sparar dessutom en byggcache som växer med omkring 1 GB per uppdatering. Räkna med 40 GB och rensa cachen ibland med docker builder prune.",
    "Processor: bygget från början tog knappt 12 minuter med 4 kärnor, lika lång tid om API:et och webben byggdes samtidigt som efter varandra. En uppdatering, där Docker återanvänder det som inte har ändrats, tog omkring 10 minuter på demons 2 kärnor.",
    "Användare samtidigt: i lasttestet arbetade 20 användare samtidigt mot demon. Säljare lade och levererade ordrar, verkstaden stämplade in och ut, och andra bläddrade bland listor och kort, var och en med 5 till 15 sekunder mellan klicken. Sidorna svarade på 0,3 sekunder i median, och processorn arbetade i snitt till en tredjedel. Med 40 användare låg medianen kvar under 0,4 sekunder, men de långsammaste svaren tog 1 till 3 sekunder. 2 kärnor räcker alltså för ett mindre företag, och 4 ger marginal.",
  ],
} as const;
