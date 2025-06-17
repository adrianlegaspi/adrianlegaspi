import '@hackernoon/pixel-icon-library/fonts/iconfont.css';
import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { NextIntlProvider } from 'next-intl';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';

function GA() {
  if (!process.env.NEXT_PUBLIC_GA_ID) return null;
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');`,
        }}
      />
    </>
  );
}

function MyApp({ Component, pageProps }) {
  const { locale, defaultLocale } = useRouter();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // For dev purposes - always show loading screen on refresh
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hasVisited');
      setShowLoading(true);
    }
  }, []);

  const handleLoadComplete = () => {
    setShowLoading(false);
    
    // Ensure no unwanted scrolling happens when the app loads
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <NextIntlProvider
        locale={locale}
        messages={pageProps.messages || {}}
        defaultLocale={defaultLocale}
      >
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <GA />
        {showLoading ? (
          <LoadingScreen onLoadComplete={handleLoadComplete} />
        ) : (
          <Component {...pageProps} />
        )}
      </NextIntlProvider>
    </ThemeProvider>
  );
}

export default MyApp;
