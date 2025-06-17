import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
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
  return { props: { messages } };
}

export default function Home() {
  const t = useTranslations('home');
  const [currentTime, setCurrentTime] = useState('');

  /* ------------------------------------------------------------------ */
  /*  Clock — stable callback + cleanup                                 */
  /* ------------------------------------------------------------------ */
  const updateTime = useCallback(() => {
    setCurrentTime(
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    );
  }, []);

  useEffect(() => {
    updateTime(); // first paint
    const id = setInterval(updateTime, 60_000);
    return () => clearInterval(id);
  }, [updateTime]);

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <link rel="canonical" href="https://adrianlegaspi.dev" />
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta property="og:title" content={t('title')} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:image" content="/og-default.svg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* -----------------------------------------------------------------
         Task bar (Win-95 vibes)
      ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-50 h-9 shadow-md">
        <div className="h-full w-full border-b border-ink dark:border-paper bg-gradient-to-b from-paper/90 to-paper dark:from-ink/90 dark:to-ink">
          <div className="flex h-full items-center">
            {/* Start-like button */}
            <button
              type="button"
              className="
                mr-2 flex h-[90%] items-center px-2
                cursor-pointer transition-all
                border border-ink dark:border-paper
                bg-gradient-to-b from-paper to-paper/80 dark:from-ink dark:to-ink/80
                shadow-[1px_1px_0_rgba(255,249,239,0.9),_-1px_-1px_0_rgba(4,0,5,0.8)]
                dark:shadow-[1px_1px_0_rgba(4,0,5,0.9),_-1px_-1px_0_rgba(255,249,239,0.8)]
                hover:bg-ink/10 dark:hover:bg-paper/10
                active:translate-y-[1px] active:shadow-none
              "
            >
              <span className="mr-1 text-xs font-mono font-bold tracking-tight text-comment">$</span>
              <span className="text-sm font-mono">AL</span>
            </button>

            {/* Windows-style tabs */}
            <nav className="flex h-full">
              {[
                { href: '#about', label: 'About' },
                { href: '#projects', label: 'Projects' },
                { href: '#stack', label: 'Stack', hideOn: 'sm' },
                { href: '#contact', label: 'Contact', hideOn: 'sm' },
              ].map(({ href, label, hideOn }) => (
                <a
                  key={href}
                  href={href}
                  className={`
                    relative mx-1 flex h-[85%] items-center rounded-t-sm px-3 transition-colors
                    border-t border-l border-r border-ink dark:border-paper
                    bg-paper/80 dark:bg-ink/80 hover:bg-paper dark:hover:bg-ink
                    after:absolute after:left-0 after:right-0 after:bottom-[-1px] after:h-[1px] after:bg-paper dark:after:bg-ink
                    ${hideOn ? `hidden ${hideOn}:flex` : ''}
                  `}
                >
                  <span className="mr-1 text-xs text-comment">/*</span>
                  <span className="text-xs">{label}</span>
                  <span className="ml-1 text-xs text-comment">*/</span>
                </a>
              ))}
            </nav>

            {/* Right-side tray */}
            <div className="absolute right-0 top-0 flex h-full items-center">
              {/* Online badge */}
              <div className="mx-1 hidden h-[80%] items-center px-3 md:flex
                border border-ink dark:border-paper bg-paper/70 dark:bg-ink/70
                shadow-[inset_1px_1px_1px_rgba(4,0,5,0.3),inset_-1px_-1px_0_rgba(255,249,239,0.3)]
                dark:shadow-[inset_1px_1px_1px_rgba(255,249,239,0.3),inset_-1px_-1px_0_rgba(4,0,5,0.3)]
              ">
                <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-green-400 dark:bg-green-500" />
                <span className="text-[10px] font-mono">ONLINE</span>
              </div>

              {/* Clock */}
              <div className="mx-1 hidden h-[80%] items-center justify-center px-3 sm:flex
                border border-ink dark:border-paper bg-paper/70 dark:bg-ink/70
                shadow-[inset_1px_1px_1px_rgba(4,0,5,0.3),inset_-1px_-1px_0_rgba(255,249,239,0.3)]
                dark:shadow-[inset_1px_1px_1px_rgba(255,249,239,0.3),inset_-1px_-1px_0_rgba(4,0,5,0.3)]
              ">
                <span className="text-[10px] font-mono">{currentTime}</span>
              </div>

              {/* Language + theme */}
              <div className="mx-1 flex h-[80%]">
                {[LangSwitcher, ThemeToggle].map((Comp, idx) => (
                  <div
                    key={idx}
                    className="
                      mx-0.5 flex h-full items-center justify-center px-2
                      border border-ink dark:border-paper bg-paper/70 dark:bg-ink/70
                      shadow-[1px_1px_0_rgba(255,249,239,0.3),_-1px_-1px_0_rgba(4,0,5,0.3)]
                      dark:shadow-[1px_1px_0_rgba(4,0,5,0.3),_-1px_-1px_0_rgba(255,249,239,0.3)]
                      hover:bg-ink/10 dark:hover:bg-paper/10
                      active:translate-y-[1px] active:shadow-none
                    "
                  >
                    <Comp />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ----------------------------------------------------------------- */}
      {/*  Content                                                          */}
      {/* ----------------------------------------------------------------- */}
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
