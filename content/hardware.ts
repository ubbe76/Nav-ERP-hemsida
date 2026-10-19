// What the server needs, from a measurement on 2026-10-19 (version 0.3.0-alpha,
// a server with 4 cores and about 600 articles in the database): the three
// containers used about 180 MB of memory in total when idle; building the
// images from scratch peaked at about 0.9 GB more and took about 10 minutes;
// the images took 3.8 GB of disk and the database 80 MB. Re-measure when the
// stack changes. Shown on /gratis-affarssystem/ and /kom-igang/.
export const HARDWARE = {
  summary:
    "Uppmätt på version 0.3.0-alpha, på en server med 4 processorkärnor och en databas med omkring 600 artiklar.",
  points: [
    "Minne: databasen, API:et och webben använde tillsammans omkring 180 MB i vila. Att bygga om dem vid installation och uppdatering krävde upp till 0,9 GB till. 2 GB minne räcker, 4 GB ger marginal.",
    "Disk: programmet tar 3,8 GB och databasen 80 MB. Docker sparar dessutom en byggcache som växer med varje uppdatering. Räkna med minst 20 GB och rensa cachen ibland med docker builder prune.",
    "Processor: bygget tog omkring 10 minuter med 4 kärnor. Med färre kärnor går bygget långsammare, men det påverkar inte hur snabbt systemet svarar sedan.",
  ],
} as const;
