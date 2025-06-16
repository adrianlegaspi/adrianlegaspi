import '@hackernoon/pixel-icon-library/fonts/iconfont.css';
import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { NextIntlProvider } from 'next-intl';
import { useRouter } from 'next/router';
import Head from 'next/head';

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
        <Component {...pageProps} />
      </NextIntlProvider>
    </ThemeProvider>
  );
}

export default MyApp;
