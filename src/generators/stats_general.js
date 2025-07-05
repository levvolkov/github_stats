import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import colors from "../../themes/colors_general.js";

const username = process.env.GITHUB_ACTOR;
const token = process.env.ACCESS_TOKEN;

const excludedRepos = process.env.EXCLUDED_REPOS
  ? process.env.EXCLUDED_REPOS.split(",").map((r) => r.trim().toLowerCase())
  : [];

if (!token) {
  console.error("Error: ACCESS_TOKEN is not defined in environment variables.");
  process.exit(1);
}

const GRAPHQL_API = "https://api.github.com/graphql";
const REST_API = "https://api.github.com";

class GitHubQueries {
  constructor(token) {
    this.token = token;
  }

  async queryRest(endpoint) {
    let response;
    do {
      response = await fetch(`${REST_API}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 202) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else if (!response.ok) {
        await response.text();
        throw new Error("Не удалось получить данные из GitHub REST API.");
      }
    } while (response.status === 202);

    return response.json();
  }
}

class UserStats {
  constructor(username, queries, repos) {
    this.username = username;
    this.queries = queries;
    this.repos = repos;
    this._linesChanged = null;
    this._views = null;
  }

  async linesChanged() {
    if (this._linesChanged !== null) {
      return this._linesChanged;
    }

    let additions = 0;
    let deletions = 0;

    for (const repo of await this.repos) {
      try {
        const r = await this.queries.queryRest(
          `/repos/${repo}/stats/contributors`
        );

        if (!Array.isArray(r)) {
          continue;
        }

        for (const authorObj of r) {
          if (
            typeof authorObj !== "object" ||
            !authorObj.author ||
            typeof authorObj.author !== "object"
          ) {
            continue;
          }

          const author = authorObj.author.login || "";
          if (author !== this.username) {
            continue;
          }

          for (const week of authorObj.weeks || []) {
            additions += week.a || 0;
            deletions += week.d || 0;
          }
        }
      } catch (error) {
        // ignore errors for individual repos
      }
    }

    this._linesChanged = additions + deletions;
    return this._linesChanged;
  }

  async views() {
    if (this._views !== null) {
      return this._views;
    }

    let total = 0;

    for (const repo of await this.repos) {
      try {
        const r = await this.queries.queryRest(`/repos/${repo}/traffic/views`);

        if (!r.views || !Array.isArray(r.views)) {
          continue;
        }

        for (const view of r.views) {
          total += view.count || 0;
        }
      } catch (error) {
        // ignore errors for individual repos
      }
    }

    this._views = total;
    return total;
  }
}

async function fetchFromGitHub(query, variables = {}) {
  const response = await fetch(GRAPHQL_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    await response.text();
    throw new Error("Failed to get data from GitHub API.");
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error("Failed to get data from GitHub API.");
  }
  return data.data;
}

async function main() {
  try {
    const query = `
      query {
        user(login: "${username}") {
          name
          repositories(first: 100) {
            totalCount
            nodes {
              nameWithOwner
              stargazers {
                totalCount
              }
              forkCount
            }
          }
          contributionsCollection {
            totalCommitContributions
          }
        }
      }
    `;

    const data = await fetchFromGitHub(query);
    const user = data.user;

    const filteredRepoNodes = user.repositories.nodes.filter((repo) => {
      const full = repo.nameWithOwner.toLowerCase();
      const short = full.split("/")[1];
      return !excludedRepos.includes(full) && !excludedRepos.includes(short);
    });

    const repos = filteredRepoNodes.map((repo) => repo.nameWithOwner);
    const queries = new GitHubQueries(token);
    const userStats = new UserStats(username, queries, repos);
    const totalLinesChanged = await userStats.linesChanged();
    const views = await userStats.views();

    const stats = {
      name: user.name || username,
      stars: filteredRepoNodes.reduce(
        (sum, repo) => sum + repo.stargazers.totalCount,
        0
      ),
      forks: filteredRepoNodes.reduce((sum, repo) => sum + repo.forkCount, 0),
      contributions: user.contributionsCollection.totalCommitContributions,
      linesChanged: totalLinesChanged,
      views: views,
      repos: filteredRepoNodes.length,
    };

    const dataForTemplate = {
      ...colors.light,
      ...Object.fromEntries(
        Object.entries(colors.dark).map(([k, v]) => [k + "Dark", v])
      ),
      ...stats,
    };

    const templatePath = path.resolve(
      path.dirname(new URL(import.meta.url).pathname),
      "..",
      "templates",
      "template_general.hbs"
    );

    const svgContent = Handlebars.compile(
      fs.readFileSync(templatePath, "utf8")
    )(dataForTemplate);

    const svgDir = path.resolve(
      path.dirname(new URL(import.meta.url).pathname),
      "..",
      "..",
      "output"
    );
    if (!fs.existsSync(svgDir)) {
      fs.mkdirSync(svgDir, { recursive: true });
    }

    const outputPath = path.join(svgDir, "stats_general.svg");
    fs.writeFileSync(outputPath, svgContent);
    console.log(`SVG file created: ${outputPath}`);
  } catch (error) {
    console.error("Error generating SVG:", error);
  }
}

main();
