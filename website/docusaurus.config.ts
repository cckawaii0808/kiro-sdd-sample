import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import projectConfig from '../project.config.json';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Kiro CLI 規格驅動開發',
  tagline: '使用 AI 輔助工具實現高效的規格驅動開發流程',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: projectConfig.deployment.url,
  baseUrl: projectConfig.deployment.baseUrl,

  organizationName: projectConfig.github.organization,
  projectName: projectConfig.github.repository,

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'zh-Hant',
    locales: ['zh-Hant', 'en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Kiro CLI',
      logo: {
        alt: 'Kiro CLI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '文件',
        },
        {
          to: '/demo',
          label: '互動 Demo',
          position: 'left',
        },
        {
          href: 'https://github.com/your-username/my-project',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文件',
          items: [
            {
              label: '快速開始',
              to: '/docs/getting-started',
            },
            {
              label: '核心概念',
              to: '/docs/concepts/spec-driven-dev',
            },
          ],
        },
        {
          title: '資源',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/your-username/my-project',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Kiro CLI 教學專案. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
