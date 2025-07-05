import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import colors from "../../themes/colors_langs.js";

const username = process.env.GITHUB_ACTOR;
const token = process.env.ACCESS_TOKEN;
const exclusionThreshold = 0.9;

const excludedLangs = process.env.EXCLUDED_LANGS
  ? process.env.EXCLUDED_LANGS.split(",").map((l) => l.trim().toLowerCase())
  : [];

const excludedRepos = process.env.EXCLUDED_REPOS
  ? process.env.EXCLUDED_REPOS.split(",").map((r) => r.trim().toLowerCase())
  : [];

if (!token) {
  console.error(
    "Error: ACCESS_TOKEN is not defined in the environment variables."
  );
  process.exit(1);
}

const GRAPHQL_API = "https://api.github.com/graphql";

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
    const errorText = await response.text();
    console.error("GitHub API Error:", errorText);
    throw new Error("Failed to fetch data from GitHub API.");
  }

  const data = await response.json();
  if (data.errors) {
    console.error("GitHub API Error:", JSON.stringify(data.errors, null, 2));
    throw new Error("Failed to fetch data from GitHub API.");
  }
  return data.data;
}

async function fetchTopLanguages() {
  const query = `
    query {
      user(login: "${username}") {
        repositories(first: 100, ownerAffiliations: OWNER) {
          nodes {
            nameWithOwner
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges {
                size
                node {
                  name
                  color
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await fetchFromGitHub(query);
  const languages = {};

  for (const repo of data.user.repositories.nodes) {
    if (!repo.nameWithOwner) continue;
    const repoName = repo.nameWithOwner.toLowerCase();
    const shortName = repoName.split("/")[1];

    if (excludedRepos.includes(repoName) || excludedRepos.includes(shortName))
      continue;

    for (const langEdge of repo.languages.edges) {
      const lang = langEdge.node.name;
      const size = langEdge.size;
      const color = langEdge.node.color;

      if (!languages[lang]) {
        languages[lang] = { size: 0, color };
      }
      languages[lang].size += size;
    }
  }

  const totalBytes = Object.values(languages).reduce(
    (sum, lang) => sum + lang.size,
    0
  );

  const filteredEntries = Object.entries(languages).filter(
    ([name, lang]) =>
      !excludedLangs.includes(name.toLowerCase()) &&
      (lang.size / totalBytes) * 100 < exclusionThreshold * 100
  );

  const filteredTotal = filteredEntries.reduce(
    (sum, [_, lang]) => sum + lang.size,
    0
  );

  const filteredLanguages = filteredEntries
    .map(([name, lang]) => ({
      lang: name,
      percent: filteredTotal > 0 ? (lang.size / filteredTotal) * 100 : 0,
      percentFixed:
        filteredTotal > 0
          ? ((lang.size / filteredTotal) * 100).toFixed(2)
          : "0.00",
      color: lang.color,
    }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 11);

  const N = filteredLanguages.length;
  const startDelay = 0.85;
  const endAt = 2.9;
  const step = N > 1 ? (endAt - startDelay) / (N - 1) : 0;
  filteredLanguages.forEach((lang, i) => {
    lang.delay = (startDelay + i * step).toFixed(2);
  });

  return filteredLanguages;
}

async function main() {
  try {
    const languageStats = await fetchTopLanguages();

    const data = {
      ...colors.light,
      ...Object.fromEntries(
        Object.entries(colors.dark).map(([k, v]) => [k + "Dark", v])
      ),
      languages: languageStats,
    };

    const templatePath = path.resolve(
      path.dirname(new URL(import.meta.url).pathname),
      "..",
      "templates",
      "template_langs.hbs"
    );
    const templateSvg = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(templateSvg);

    const svg = template(data);

    const svgDir = path.resolve(
      path.dirname(new URL(import.meta.url).pathname),
      "..",
      "..",
      "output"
    );
    if (!fs.existsSync(svgDir)) {
      fs.mkdirSync(svgDir, { recursive: true });
    }
    const outputPath = path.join(svgDir, "stats_langs.svg");
    fs.writeFileSync(outputPath, svg);
    console.log(`SVG file created: ${outputPath}`);
  } catch (error) {
    console.error("Error generating SVG:", error);
  }
}

main();
