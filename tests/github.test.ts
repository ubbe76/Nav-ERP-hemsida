import { describe, expect, it } from "vitest";
import { fetchRepoStats, fetchRoadmap } from "@/lib/github";

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

describe("fetchRoadmap", () => {
  const ISSUES = `${REPO}/issues?state=open&labels=${encodeURIComponent("förslag")}&per_page=100`;
  const issue = (number: number, labels: string[], extra: Record<string, unknown> = {}) => ({
    number,
    title: `Förslag ${number}`,
    html_url: `https://github.com/ubbe76/Nav-ERP/issues/${number}`,
    labels: labels.map((name) => ({ name })),
    ...extra,
  });

  it("sorterar efter prioritet, sedan äldst först, och skiljer områdena från etiketterna", async () => {
    const items = await fetchRoadmap(
      fakeFetch({
        [ISSUES]: {
          status: 200,
          body: [
            issue(32, ["förslag", "prio: låg", "kalkyl"]),
            issue(8, ["förslag", "prio: medel", "tillverkning", "lager"]),
            issue(40, ["förslag"]),
            issue(11, ["förslag", "prio: låg", "lager"]),
            issue(50, ["förslag"], { pull_request: {} }),
          ],
        },
      }),
      undefined,
    );
    expect(items).toEqual([
      { number: 8, title: "Förslag 8", url: "https://github.com/ubbe76/Nav-ERP/issues/8", priority: "medel", areas: ["tillverkning", "lager"] },
      { number: 11, title: "Förslag 11", url: "https://github.com/ubbe76/Nav-ERP/issues/11", priority: "låg", areas: ["lager"] },
      { number: 32, title: "Förslag 32", url: "https://github.com/ubbe76/Nav-ERP/issues/32", priority: "låg", areas: ["kalkyl"] },
      { number: 40, title: "Förslag 40", url: "https://github.com/ubbe76/Nav-ERP/issues/40", priority: null, areas: [] },
    ]);
  });

  it("ger null när GitHub inte svarar, så sidan länkar dit i stället", async () => {
    expect(await fetchRoadmap(fakeFetch({ [ISSUES]: { status: 403 } }), undefined)).toBeNull();
    expect(await fetchRoadmap(fakeFetch({}), undefined)).toBeNull();
  });
});
