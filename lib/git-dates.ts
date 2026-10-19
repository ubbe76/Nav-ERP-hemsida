import { execFileSync } from "node:child_process";

const git = (repoDir: string, args: string[]) =>
  execFileSync("git", ["-C", repoDir, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();

/**
 * Date (YYYY-MM-DD) of the last commit touching each file, keyed by the given
 * path. Empty when git can't vouch for the dates: not a repository, or a
 * shallow clone, where every file would get the one fetched commit's date.
 * Files without a commit (new, untracked) are left out.
 */
export function gitDates(repoDir: string, files: string[]): Record<string, string> {
  try {
    if (git(repoDir, ["rev-parse", "--is-shallow-repository"]) !== "false") return {};
    const dates: Record<string, string> = {};
    for (const file of files) {
      const date = git(repoDir, ["log", "-1", "--format=%cs", "--", file]);
      if (date) dates[file] = date;
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
