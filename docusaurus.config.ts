import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import logger from '@docusaurus/logger';
import type * as Preset from '@docusaurus/preset-classic';
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import path from "path";
import YAML from "yaml";
import {existsSync, readFileSync} from "node:fs";
import {Tag} from "@docusaurus/utils";

type VariablesType = { [key: string]: string }
const variablesCache: { [key: string]: VariablesType } = {};

function getDocVariables(filePath: string): VariablesType|null {
	let vars = variablesCache[filePath];
	if (!vars) {
		const px = filePath.match(/(^.+\/version-\d+\.\d+)\//)
		if (!px) {
			return null;
		}
		const vp = path.join(px[1], "variables.yml");
		if (!existsSync(vp)) {
			return null;
		}
		vars = YAML.parse(readFileSync(vp, "utf-8"))
		variablesCache[filePath] = vars;
	}
	return vars
}

const config: Config = {
	title: 'Telepresence',
	tagline: 'Fast, local development for Kubernetes and OpenShift Microservices',
	favicon: 'img/favicon.ico',
	url: 'https://telepresence.io',
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: '/',

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'telepresenceio', // Usually your GitHub org/username.
	projectName: 'telepresence', // Usually your repo name.

	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	presets: [
		[
			'classic',
			{
				blog: {
					beforeDefaultRemarkPlugins: [remarkGithubAdmonitionsToDirectives],
				},
				docs: {
					editUrl: ({docPath}) => {
						return `https://github.com/telepresenceio/telepresence/tree/release/v2/docs/${docPath}`
					},
					exclude: ['**/release-notes.md', '**/README.md', '**/CONTRIBUTING.md'],
					includeCurrentVersion: false,
					beforeDefaultRemarkPlugins: [remarkGithubAdmonitionsToDirectives],
					async sidebarItemsGenerator(args) {
						const {docs, version: {versionName, contentPath}} = args;
						type LinkItem = {
							link?: string,
							title: string,
							items?: LinkItem[]
						}
						const idSet = new Set<string>(docs.map(doc => doc.id))
						const linkToItem = ((linkItem: LinkItem) => {
							if (linkItem.link) {
								idSet.delete(linkItem.link);
								if(linkItem.link.startsWith("https://")) {
									return {
										type: 'link',
										label: linkItem.title,
										href: linkItem.link
									}
								}
								return {
									type: 'doc',
									label: linkItem.title,
									id: linkItem.link
								}
							}
							return {
								type: 'category',
								label: linkItem.title,
								items: linkItem.items.map(linkToItem)
							}
						})
						const linksPath = path.join(contentPath, "doc-links.yml");
						const items = YAML.parse(readFileSync(linksPath, "utf-8")).map(linkToItem);
						for (const id of idSet) {
							logger.warn(`"${path.join(versionName, 'doc-links.yml')}" has no entry for id "${id}"`);
						}
						return items;
					},
				},
				sitemap: {
					lastmod: "datetime",
				},
				theme: {
					customCss: ['./src/css/custom.css', './src/css/telepresence.scss'],
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		themeConfig: {
			colorMode: {
				respectPrefersColorScheme: true,
			},
		},
		image: 'img/telepresence-social.jpg',
		navbar: {
			title: 'Telepresence',
			logo: {
				alt: 'Telepresence',
				src: 'img/logo.svg',
			},
			items: [
				{
					type: 'doc',
					position: 'left',
					docId: 'quick-start',
					label: 'Docs',
				},
				{
					to: 'blog',
					position: 'left',
					label: 'Blog'
				},
				{
					to: 'case-studies',
					position: 'left',
					label: 'Case studies',
				},
				{
					to: 'community',
					position: 'left',
					label: 'Community',
				},
				{
					to: 'about',
					position: 'left',
					label: 'About',
				},
				{
					href: 'https://github.com/telepresenceio/telepresence',
					position: 'right',
					className: 'header-github-link',
					'aria-label': 'GitHub repository',
				},
			],
		},
		footer: {
			copyright: `
        <div>
          The Linux Foundation® has registered trademarks and uses trademarks. For a list of trademarks of The Linux
          Foundation, please see our <a href="https://www.linuxfoundation.org/legal/trademark-usage">Trademark Usage
          page</a>
        </div>
        <div>
          Built with
          <a href="https://docusaurus.io/">Docusaurus
            <img src="/img/docusaurus.png" alt="logo" style="height: 24px; vertical-align: middle"/>
          </a>
        </div>`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,

	markdown: {
		preprocessor({filePath, fileContent}) {
			const vars = getDocVariables(filePath);
			return vars? fileContent.replace(/\$(\S+)\$/g, (match, key) => {
				const value = vars[key];
				return (typeof value !== 'undefined') ? value : match;
			}): fileContent;
		},
	},

	plugins: ["docusaurus-plugin-sass", "./src/plugins/configure-svgo.ts"],

	customFields: {
		canonicalBaseUrl: "https://telepresence.io",
	}
};

export default config;
