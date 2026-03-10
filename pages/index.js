import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>AI Code Reviewer</title>
        <meta name="description" content="AI that reviews your GitHub PRs" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          🤖 AI Code Reviewer
        </h1>

        <p className={styles.description}>
          Automatic code reviews powered by AI
        </p>

        <div className={styles.grid}>
          <a href="/api/auth/mock" className={styles.card}>
            <h2>Login with GitHub →</h2>
            <p>Connect your GitHub account to start</p>
          </a>

          <a href="/dashboard" className={styles.card}>
            <h2>Dashboard →</h2>
            <p>View your PR reviews</p>
          </a>

          <a href="/docs" className={styles.card}>
            <h2>Documentation →</h2>
            <p>Learn how it works</p>
          </a>

          <a href="/pricing" className={styles.card}>
            <h2>Pricing →</h2>
            <p>Free for open source</p>
          </a>
        </div>
      </main>
    </div>
  );
}