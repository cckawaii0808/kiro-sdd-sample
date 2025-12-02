import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/getting-started">
            快速開始 →
          </Link>
          <Link className="button button--secondary button--lg" to="/demo" style={{marginLeft: '1rem'}}>
            體驗 Demo
          </Link>
        </div>
      </div>
    </header>
  );
}

function Feature({title, description}: {title: string; description: string}) {
  return (
    <div className="col col--4">
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <Feature
            title="規格驅動開發"
            description="從明確的規格文件開始，確保開發方向清晰，減少返工和溝通成本。"
          />
          <Feature
            title="AI 輔助開發"
            description="使用 Kiro CLI 與 AI 協作，自動生成開發計畫、追蹤進度、管理知識庫。"
          />
          <Feature
            title="完整工作流程"
            description="涵蓋從規格定義、任務規劃、程式碼實作到版本控制的完整開發循環。"
          />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`首頁`}
      description="學習使用 Kiro CLI 進行規格驅動開發">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
