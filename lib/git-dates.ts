import { execFileSync } from "node:child_process";

const git = (repoDir: string, args: string[]) =>
  execFileSync("git", ["-C", repoDir, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();

/**
 * Time of the last commit touching each file, as an ISO timestamp in UTC (so
 * they sort as strings), keyed by the given path. Empty when git can't vouch
 * for the dates: not a repository, or a shallow clone, where every file would
 * get the one fetched commit's date.
 * Files without a commit (new, untracked) are left out.
 */
export function gitDates(repoDir: string, files: string[]): Record<string, string> {
  try {
    if (git(repoDir, ["rev-parse", "--is-shallow-repository"]) !== "false") return {};
    const dates: Record<string, string> = {};
    for (const file of files) {
      // Full time, not just the day: a second change the same day must still
      // move the sitemap's lastmod, or IndexNow never hears of it.
      const seconds = git(repoDir, ["log", "-1", "--format=%ct", "--", file]);
      if (seconds) dates[file] = new Date(Number(seconds) * 1000).toISOString();
    }
    return dates;
  } catch {
    return {};
  }
}

/** The latest of the given dates, or undefined when there are none. */
export function latest(dates: Array<string | undefined>): string | undefined {
  return dates.filter((d): d is string => Boolean(d)).sort().at(-1);
}
