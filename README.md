# GitHub Stats Cards

Generate SVG cards with GitHub statistics (commits, stars, unique visitors, and more) that you can use in your profile or repository README. 

<p>
<picture>
  <source srcset="https://github.com/levvolkov/github_stats/blob/main/output/stats_commits.svg#gh-dark-mode-only" media="(prefers-color-scheme: dark)">
  <img src="https://github.com/levvolkov/github_stats/blob/main/output/stats_commits.svg">
</picture>
<picture>
  <source srcset="https://github.com/levvolkov/github_stats/blob/main/output/stats_langs.svg#gh-dark-mode-only" media="(prefers-color-scheme: dark)">
  <img src="https://github.com/levvolkov/github_stats/blob/main/output/stats_langs.svg">
</picture>
<picture>
  <source srcset="https://github.com/levvolkov/github_stats/blob/main/output/stats_general.svg#gh-dark-mode-only" media="(prefers-color-scheme: dark)">
  <img src="https://github.com/levvolkov/github_stats/blob/main/output/stats_general.svg">
</picture>
<picture>
  <source srcset="https://github.com/levvolkov/github_stats/blob/main/output/stats_visitors.svg#gh-dark-mode-only" media="(prefers-color-scheme: dark)">
  <img src="https://github.com/levvolkov/github_stats/blob/main/output/stats_visitors.svg">
</picture>
</p>

## Features

- **Efficiently fetch user statistics:** Using GitHub's GraphQL and REST APIs.
- **Generate informative SVGs:** Display stars, forks, contributions, lines changed, views, and other metrics.
- **Hourly automatic updates:** Regenerate images automatically each hour if changes occur.
- **Manual triggering anytime:** Launch the workflow manually through GitHub Actions whenever desired.
- **Default setting includes all repositories:** By default, statistics include all your repositories, including forks.
- **Customizable exclusions:** Easily add exclusions for specific repositories or forked projects.
- **Styling customization:** Change styles and colors of statistic cards according to preferences.
- **Dark/Light theme support:** Visualize data in both light and dark modes within SVG outputs.

## Installation and Usage

1. **Create a personal [GitHub access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens):**
   - Go to: **Settings** → **Developer settings** → <br> **Personal access tokens** → **Tokens (classic)** → <br> **Generate new token** → **Generate new token (classic)**
   - Set the expiration date for your GitHub personal token. After expiration, you will need to update the token for the workflow to work correctly.
   - Set the following permissions:
     - [x] **repo**
     - [x] **read:user**
   - Copy the token right after creation — you will not be able to view it again.

2. **Create a repository from the template:**
   - Click [Use this template](https://github.com/levvolkov/github_stats/generate) and create a new repository based on the template.
> [!NOTE]\
>  Next, for a more comfortable project setup, you will need to follow the steps and use the links while in `README.md` of your copy of the template.
   

3. **Add the token as a secret to your repository:**
   - Go to the **Settings** tab of your new repository.
   - In the left menu, select **Secrets and variables** → **Actions** or use [this link](../../settings/secrets/actions).
   - Click **New repository secret**.
   - In the **Name** field, enter: `ACCESS_TOKEN`.
   - In the **Value** field, paste the previously copied personal access token.
   - Save the secret.

4. **Run the workflow to generate statistics:**
   - Go to the **[Actions](../../actions/workflows/update-stats.yml)** tab of your repository.
   - Select the **Update GitHub stats SVG** workflow from the list on the left.
   - Click the **Run workflow** button (top right corner).

5. **Add the statistics to your GitHub profile README:**
   - Copy and paste the following code blocks into your markdown content.
   - Change the `username` value to your GitHub username.
   - Change the `repository_name` value to the name of your GitHub repository where the svg is generated.

 ```md
 <!-- Statistics: Commit series -->
 <picture>
   <source srcset="https://raw.githubusercontent.com/username/repository_name/main/output/stats_commits.svg#gh-dark-mode-only" media="(prefers-color-scheme: dark)">
   <img src="https://raw.githubusercontent.com/username/repository_name/main/output/stats_commits.svg">
 </picture>
 ```
 ```md
 <!-- Statistics: Programming languages -->
 <picture>
   <source srcset="https://raw.githubusercontent.com/username/repository_name/main/output/stats_langs.svg#gh-dark-mode-only"  media="(prefers-color-scheme: dark)">
   <img src="https://raw.githubusercontent.com/username/repository_name/main/output/stats_langs.svg">
 </picture>
 ```
 ```md
 <!-- Statistics: General statistics -->
 <picture>
   <source srcset="https://raw.githubusercontent.com/username/repository_name/main/output/stats_general.svg#gh-dark-mode-only"  media="(prefers-color-scheme: dark)">
   <img src="https://raw.githubusercontent.com/username/repository_name/main/output/stats_general.svg">
 </picture>
 ```
 ```md
 <!-- Statistics: Unique repository visitors -->
 <picture>
   <source srcset="https://raw.githubusercontent.com/username/repository_name/main/output/stats_visitors.svg#gh-dark-mode-only"  media="(prefers-color-scheme: dark)">
   <img src="https://raw.githubusercontent.com/username/repository_name/main/output/stats_visitors.svg">
 </picture>
 ```

<br>

> [!WARNING]\
> Some GitHub statistics (views, unique visitors, traffic) are updated with a delay due to GitHub API limitations!

<br>

## Customizing the displayed statistics

1. **Ignoring certain languages**
   - Go to the **Settings** tab of your new repository.
   - In the left menu, select **Secrets and variables** → **Actions** or use [this link](../../settings/secrets/actions).
   - Click **New repository secret**.
   - In the **Name** field, enter: `EXCLUDED_LANGS`.
   - In the **Value** field, enter a comma-separated list of languages you want to exclude from statistics, for example: `html, tex`.
   - Save the secret and re-run the [workflow](../../actions/workflows/update-stats.yml).

2. **Ignore specific repositories or forks**
   - Go to the **Settings** tab of your new repository.
   - In the left menu, select **Secrets and variables** → **Actions** or use [this link](../../settings/secrets/actions).
   - Click **New repository secret**.
   - In the **Name** field, enter: `EXCLUDED_REPOS`.
   - In the **Value** field, enter a comma-separated list of repositories that you want to exclude from statistics, for example: `github_stats`.
   - Save the secret and re-run the [workflow](../../actions/workflows/update-stats.yml).

<br>

## Customizing SVG Styles

The appearance settings are stored in the [`themes/`](themes/) folder. You can easily change the [colors](https://colorscheme.ru/html-colors.html), set a card background, or change the time zone in the [Commit series](themes/colors_commits.js#L30) card to any of the [supported time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Additionally, you can disable the time zone display altogether by setting the value to `"none"`.

1. **Where to configure**

<table>
	<tr align="center">
		<td> 
			<picture>
				<source srcset="https://raw.githubusercontent.com/levvolkov/github_stats/main/output/stats_commits.svg#gh-dark-mode-only" media="(prefers-color-scheme: dark)">
        <img src="https://raw.githubusercontent.com/levvolkov/github_stats/main/output/stats_commits.svg">
			</picture>
		</td> 
		<td>
			<picture>
				<source srcset="https://raw.githubusercontent.com/levvolkov/github_stats/main/output/stats_langs.svg#gh-dark-mode-only" media="(prefers-color-scheme: dark)">
				<img width="100%" src="https://raw.githubusercontent.com/levvolkov/github_stats/main/output/stats_langs.svg">
			</picture>
		</td> 
		<td>
			<picture>
				<source srcset="https://raw.githubusercontent.com/levvolkov/github_stats/main/output/stats_general.svg#gh-dark-mode-only" media="(prefers-color-scheme: dark)">
        <img width="93%" src="https://raw.githubusercontent.com/levvolkov/github_stats/main/output/stats_general.svg">
			</picture>
		</td> 
		<td> 
			<picture>
				<source srcset="https://raw.githubusercontent.com/levvolkov/github_stats/main/output/stats_visitors.svg#gh-dark-mode-only" media="(prefers-color-scheme: dark)">
        <img src="https://raw.githubusercontent.com/levvolkov/github_stats/main/output/stats_visitors.svg">
			</picture>
		</td> 
	</tr> 
	<tr align="center"> 
		<td><code><a href="themes/colors_commits.js">colors_commits.js</a></code></td> 
		<td><code><a href="themes/colors_langs.js">colors_langs.js</a></code></td>  
		<td><code><a href="themes/colors_general.js">colors_general.js</a></code></td>
		<td><code><a href="themes/colors_visitors.js">colors_visitors.js</a></code></td>
	</tr> 
	<tr align="center"> 
		<td>Commit series</td> 
		<td>Programming languages</td>
		<td>General statistics</td> 
		<td>Unique repository visitors</td> 
	</tr> 
</table>

2. **How to change**
- Open the desired [style file](themes/) in your copy of the repository.
- Change the values as you wish.
- Save the file and re-run the [workflow](../../actions/workflows/update-stats.yml) (if it doesn't start automatically).