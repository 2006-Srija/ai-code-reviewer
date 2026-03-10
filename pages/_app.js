import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import ThemeToggle from '../components/ThemeToggle';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>AI Code Reviewer - Intelligent PR Analysis</title>
        <meta name="description" content="🤖 AI-powered GitHub PR reviewer that automatically detects bugs, security issues, and performance problems in your code." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
      <ThemeToggle />
    </SessionProvider>
  );
}

export default MyApp;