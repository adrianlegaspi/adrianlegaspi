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
  const router = useRouter();
  const { locale, defaultLocale, asPath } = router;
  const [showLoading, setShowLoading] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  
  // Set the HTML lang attribute dynamically based on locale
  useEffect(() => {
    if (document && document.documentElement) {
      document.documentElement.lang = locale || defaultLocale;
    }
  }, [locale, defaultLocale]);
  
  useEffect(() => {
    // Check if user has visited before
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem('hasVisited');
      if (!hasVisited) {
        // First time visitor - show full loading screen
        setShowLoading(true);
        setIsReturningUser(false);
      } else {
        // Returning visitor - show welcome message with progress bar only
        setShowLoading(true);
        setIsReturningUser(true);
      }
    }
  }, []);

  const handleLoadComplete = () => {
    setShowLoading(false);
    
    // Ensure no unwanted scrolling happens when the app loads
    if (typeof window !== 'undefined') {
      // Save to localStorage that user has seen the loading screen
      localStorage.setItem('hasVisited', 'true');
      window.scrollTo(0, 0);
    }
  };

  const canonicalUrl = `https://adrianlegaspi.dev${asPath === '/' ? '' : asPath}`;

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <NextIntlProvider
        locale={locale}
        messages={pageProps.messages || {}}
        defaultLocale={defaultLocale}
      >
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="canonical" href={canonicalUrl} />
          <link rel="alternate" hrefLang="en" href={`https://adrianlegaspi.dev${asPath === '/' ? '' : asPath}`} />
          <link rel="alternate" hrefLang="es" href={`https://adrianlegaspi.dev/es${asPath === '/' ? '' : asPath}`} />
          <link rel="alternate" hrefLang="x-default" href={`https://adrianlegaspi.dev${asPath === '/' ? '' : asPath}`} />
        </Head>
        <GA />
        {showLoading ? (
          <LoadingScreen 
            onLoadComplete={handleLoadComplete} 
            simpleMode={isReturningUser} 
          />
        ) : (
          <Component {...pageProps} />
        )}
      </NextIntlProvider>
    </ThemeProvider>
  );
}

export default MyApp;
