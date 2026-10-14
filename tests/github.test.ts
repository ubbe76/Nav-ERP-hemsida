import { describe, expect, it } from "vitest";
import { fetchRepoStats } from "@/lib/github";

const REPO = "https://api.github.com/repos/ubbe76/Nav-ERP";
const RELEASE = `${REPO}/releases/latest`;

function fakeFetch(routes: Record<string, { status: number; body?: unknown }>, seen: RequestInit[] = []): typeof fetch {
  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    seen.push(init ?? {});
    const route = routes[String(input)];
    if (!route) throw new TypeError("fetch failed");
    return new Response(JSON.stringify(route.body ?? {}), { status: route.status });
  }) as typeof fetch;
}

describe("fetchRepoStats", () => {
  it("läser stjärnor och senaste release", async () => {
    const stats = await fetchRepoStats(
      fakeFetch({
        [REPO]: { status: 200, body: { stargazers_count: 42 } },
        [RELEASE]: { status: 200, body: { tag_name: "v0.4.0", html_url: "https://github.com/ubbe76/Nav-ERP/releases/tag/v0.4.0" } },
      }),
      undefined,
    );
    expect(stats).toEqual({ stars: 42, release: { tag: "v0.4.0", url: "https://github.com/ubbe76/Nav-ERP/releases/tag/v0.4.0" } });
  });

  it("klarar sig utan release", async () => {
    const stats = await fetchRepoStats(
      fakeFetch({ [REPO]: { status: 200, body: { stargazers_count: 3 } }, [RELEASE]: { status: 404 } }),
      undefined,
    );
    expect(stats).toEqual({ stars: 3, release: null });
  });

  it("ger tomma värden för ett privat repo eller rate limit", async () => {
    const stats = await fetchRepoStats(fakeFetch({ [REPO]: { status: 404 }, [RELEASE]: { status: 403 } }), undefined);
    expect(stats).toEqual({ stars: null, release: null });
  });

  it("ger tomma värden när nätverket saknas", async () => {
    expect(await fetchRepoStats(fakeFetch({}), undefined)).toEqual({ stars: null, release: null });
  });

  it("skickar token när den finns", async () => {
    const seen: RequestInit[] = [];
    await fetchRepoStats(fakeFetch({}, seen), "hemlig");
    expect(seen[0]?.headers).toMatchObject({ Authorization: "Bearer hemlig" });
  });
});
