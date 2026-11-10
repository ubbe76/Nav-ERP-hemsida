export interface RepoStats {
  stars: number | null;
  release: { tag: string; url: string } | null;
}

const API = "https://api.github.com/repos/ubbe76/Nav-ERP";

async function getJson(fetchImpl: typeof fetch, url: string, token: string | undefined): Promise<unknown> {
  try {
    const res = await fetchImpl(url, {
      headers: { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      // Static export refuses uncached fetches; at build time this is fetched once.
      cache: "force-cache",
      signal: AbortSignal.timeout(5000),
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

// Fetched at build time. Any failure (rate limit, private repo, offline) only
// drops the numbers from the page — the build never fails on GitHub.
export async function fetchRepoStats(
  fetchImpl: typeof fetch = fetch,
  token: string | undefined = process.env.GITHUB_TOKEN,
): Promise<RepoStats> {
  const [repo, release] = await Promise.all([getJson(fetchImpl, API, token), getJson(fetchImpl, `${API}/releases/latest`, token)]);
  const stars = (repo as { stargazers_count?: unknown } | null)?.stargazers_count;
  const r = release as { tag_name?: unknown; html_url?: unknown } | null;
  return {
    stars: typeof stars === "number" ? stars : null,
    release: typeof r?.tag_name === "string" && typeof r.html_url === "string" ? { tag: r.tag_name, url: r.html_url } : null,
  };
}

let cached: Promise<RepoStats> | undefined;

/** Memoised per build worker: header and footer share one request pair. */
export function getRepoStats(): Promise<RepoStats> {
  return (cached ??= fetchRepoStats());
}

// Färdplanen: the open suggestions on GitHub (label "förslag"), fetched at
// build time like the stats above. The issues are the plan — the page never
// keeps a list of its own that could drift from them. null = could not be
// read (rate limit, offline); the page then links to GitHub instead.
export type RoadmapPriority = "hög" | "medel" | "låg";

export interface RoadmapItem {
  number: number;
  title: string;
  url: string;
  priority: RoadmapPriority | null;
  /** The other labels: the areas the suggestion touches ("lager", "kalkyl" …). */
  areas: string[];
}

const SUGGESTION_LABEL = "förslag";
const PRIORITY_PREFIX = "prio: ";
const PRIORITIES: readonly RoadmapPriority[] = ["hög", "medel", "låg"];

export async function fetchRoadmap(
  fetchImpl: typeof fetch = fetch,
  token: string | undefined = process.env.GITHUB_TOKEN,
): Promise<RoadmapItem[] | null> {
  const body = await getJson(fetchImpl, `${API}/issues?state=open&labels=${encodeURIComponent(SUGGESTION_LABEL)}&per_page=100`, token);
  if (!Array.isArray(body)) return null;
  const items: RoadmapItem[] = [];
  for (const raw of body as Record<string, unknown>[]) {
    // The issues endpoint lists pull requests too.
    if (raw.pull_request) continue;
    if (typeof raw.number !== "number" || typeof raw.title !== "string" || typeof raw.html_url !== "string") continue;
    const labels = Array.isArray(raw.labels)
      ? raw.labels.map((l) => (typeof l === "string" ? l : (l as { name?: unknown })?.name)).filter((n): n is string => typeof n === "string")
      : [];
    const prio = labels.find((l) => l.startsWith(PRIORITY_PREFIX))?.slice(PRIORITY_PREFIX.length);
    items.push({
      number: raw.number,
      title: raw.title,
      url: raw.html_url,
      priority: PRIORITIES.find((p) => p === prio) ?? null,
      areas: labels.filter((l) => l !== SUGGESTION_LABEL && !l.startsWith(PRIORITY_PREFIX)),
    });
  }
  // Priority first (none last), then the oldest suggestion first.
  const rank = (p: RoadmapPriority | null) => (p === null ? PRIORITIES.length : PRIORITIES.indexOf(p));
  return items.sort((a, b) => rank(a.priority) - rank(b.priority) || a.number - b.number);
}
