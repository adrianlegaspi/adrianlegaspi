import Head from 'next/head';
import { useTranslations } from 'next-intl';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Stack from '../components/Stack';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import LangSwitcher from '../components/LangSwitcher';
import ThemeToggle from '../components/ThemeToggle';

export async function getStaticProps({ locale }) {
  const messages = (await import(`../locales/${locale}/common.json`)).default;
  return {
    props: { messages },
  };
}

export default function Home() {
  const t = useTranslations('home');
  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <link rel="canonical" href="https://adrianlegaspi.dev" />
        <meta property="og:title" content={t('title')} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:image" content="/og-default.svg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className="flex justify-between items-center p-4 sticky top-0 bg-paper dark:bg-ink z-10 border-b border-ink/10 dark:border-paper/10 backdrop-blur">
        <div className="font-bold">Adrián Legaspi</div>
        <div className="flex gap-4 items-center">
          <LangSwitcher />
          <ThemeToggle />
        </div>
      </header>
      <main>
        <Hero />
        <About />
        <Projects />
        <Stack />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
