import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import colors from "../../themes/colors_visitors.js";

const username = process.env.GITHUB_ACTOR;
const token = process.env.ACCESS_TOKEN;
const REST_API = "https://api.github.com";

const excludedRepos = process.env.EXCLUDED_REPOS
  ? process.env.EXCLUDED_REPOS.split(",").map((r) => r.trim().toLowerCase())
  : [];

if (!token) {
  console.error("Error: ACCESS_TOKEN is not defined in environment variables.");
  process.exit(1);
}

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
        throw new Error("Failed to get data from GitHub REST API.");
      }
    } while (response.status === 202);

    return response.json();
  }
}

async function getRepos(username, queries) {
  const repos = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await queries.queryRest(
      `/users/${username}/repos?page=${page}&per_page=100`
    );
    if (response.length === 0) {
      hasMore = false;
    } else {
      repos.push(...response.map((repo) => repo.name));
      page++;
    }
  }

  return repos;
}

async function getRepoViews(repos, queries) {
  const repoStats = [];

  for (const repo of repos) {
    try {
      const r = await queries.queryRest(
        `/repos/${username}/${repo}/traffic/views`
      );

      if (r.uniques && r.uniques > 0) {
        const firstView = r.views[0];
        const lastView = r.views[r.views.length - 1];

        const formatDate = (timestamp) => {
          const date = new Date(timestamp);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          return `${day}.${month}`;
        };

        const dateRange =
          firstView && lastView
            ? `${formatDate(firstView.timestamp)} - ${formatDate(
                lastView.timestamp
              )}`
            : "N/A";

        repoStats.push({
          name: repo,
          uniques: r.uniques,
          dateRange,
        });
      }
    } catch (error) {}
  }

  return repoStats;
}

function buildTemplateData(colors, repos) {
  const rowCount = repos.length > 5 ? 5 : repos.length;
  const rowHeight = rowCount > 0 ? 100 / rowCount : 0;
  const topRepos = repos.sort((a, b) => b.uniques - a.uniques).slice(0, 5);
  const animationDelays = calculateAnimationDelays(rowCount);
  const reposWithAnimation = topRepos.map((repo, index) => ({
    ...repo,
    animationDelay: animationDelays[index],
  }));

  return {
    ...colors.light,
    ...Object.fromEntries(
      Object.entries(colors.dark).map(([k, v]) => [k + "Dark", v])
    ),
    repos: reposWithAnimation,
    rowHeight,
    animationDelays, 
  };
}

function calculateAnimationDelays(count) {
  const startDelay = 1.4; 
  const endDelay = 2.9; 
  const interval = count > 1 ? (endDelay - startDelay) / (count - 1) : 0;
  return Array.from({ length: count }, (_, i) =>
    i === count - 1 ? endDelay : startDelay + i * interval
  );
}

async function main() {
  try {
    const queries = new GitHubQueries(token);
    let repos = await getRepos(username, queries);
    repos = repos.filter((repo) => !excludedRepos.includes(repo.toLowerCase()));
    const repoStats = await getRepoViews(repos, queries);

    const templatePath = path.resolve(
      path.dirname(new URL(import.meta.url).pathname),
      "..",
      "templates",
      "template_visitors.hbs"
    );
    const templateSvg = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(templateSvg);

    const templateData = buildTemplateData(colors, repoStats);
    const svg = template(templateData);

    const svgDir = path.resolve(
      path.dirname(new URL(import.meta.url).pathname),
      "..",
      "..",
      "output"
    );
    if (!fs.existsSync(svgDir)) {
      fs.mkdirSync(svgDir, { recursive: true });
    }
    const svgFilePath = path.join(svgDir, "stats_visitors.svg");
    fs.writeFileSync(svgFilePath, svg);
    console.log(`SVG file created: ${svgFilePath}`);
  } catch (error) {
    console.error("Error generating SVG:", error);
  }
}

main();
