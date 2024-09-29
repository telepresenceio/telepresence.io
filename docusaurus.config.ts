import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import logger from '@docusaurus/logger';
import type * as Preset from '@docusaurus/preset-classic';
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import path from "path";
import YAML from "yaml";
import {readFileSync} from "node:fs";

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
				docs: {
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl: ({docPath}) => {
						return `https://github.com/telepresenceio/telepresence/tree/thallgren/add-documentation/docs/${docPath}`
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

	plugins: ["docusaurus-plugin-sass", "./src/plugins/configure-svgo.ts"],

	customFields: {
		canonicalBaseUrl: "https://www.getambassador.io"
	}
};

export default config;
