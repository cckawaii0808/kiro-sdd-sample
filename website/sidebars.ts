import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'getting-started',
    {
      type: 'category',
      label: '核心概念',
      items: [
        'concepts/spec-driven-dev',
        'concepts/react-architecture',
      ],
    },
    'workflow',
    {
      type: 'category',
      label: '實際範例',
      items: [
        'examples/this-website',
        'examples/login-calculator-tutorial',
        'examples/agent-config',
        'examples/api-spec-example',
      ],
    },
    'commands',
    {
      type: 'category',
      label: '指南',
      items: [
        'guides/api-documentation',
      ],
    },
    {
      type: 'category',
      label: '測試',
      items: [
        'testing-automation',
        'testing-guide',
      ],
    },
  ],
};

export default sidebars;
