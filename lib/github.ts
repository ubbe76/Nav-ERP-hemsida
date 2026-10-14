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
