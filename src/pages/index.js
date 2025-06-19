import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useState, useEffect, useCallback } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Solutions from '../components/Solutions';
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
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  
  // Handle theme mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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
      <header className="sticky top-0 z-50 h-10 shadow-md">
        <div className="h-full w-full border-b border-ink dark:border-paper bg-gradient-to-b from-paper/90 to-paper dark:from-ink/90 dark:to-ink">
          <div className="flex h-full items-center">
            {/* Start menu button */}
            <button
              type="button"
              onClick={() => setStartMenuOpen(!startMenuOpen)}
              className={`
                ml-2
                relative mr-3 flex h-[90%] items-center p-1.5
                cursor-pointer
                border border-ink dark:border-paper
                ${startMenuOpen ? 'bg-paper dark:bg-ink active:shadow-[inset_1px_1px_1px_rgba(0,0,0,0.7)]' : 'bg-paper dark:bg-ink'}
                ${!startMenuOpen ? 'shadow-[1px_1px_0_rgba(255,255,255,0.7),_-1px_-1px_0_rgba(0,0,0,0.4)]' : ''}
                dark:shadow-[1px_1px_0_rgba(255,255,255,0.3),_-1px_-1px_0_rgba(0,0,0,0.6)]
                hover:bg-ink/10 dark:hover:bg-paper/10
                active:translate-y-[1px] active:translate-x-[1px] active:shadow-[inset_1px_1px_1px_rgba(0,0,0,0.7)]
                transition-none
                ${startMenuOpen ? 'after:absolute after:left-0 after:right-0 after:bottom-[-1px] after:h-[1px] after:bg-paper dark:after:bg-ink' : ''}
              `}
              aria-expanded={startMenuOpen}
              aria-controls="start-menu"
            >
              <img 
                src={mounted ? `/assets/img/adrianlegaspi-logo-${theme === 'dark' ? 'light' : 'dark'}.png` : '/assets/img/adrianlegaspi-logo.png'} 
                alt="Adrian Legaspi Logo" 
                className="h-full w-auto scale-110"
              />
            </button>
            
            {/* Start menu overlay */}
            {startMenuOpen && (
              <>
                {/* Backdrop for closing when clicking outside (desktop only) */}
                <div 
                  className="fixed inset-0 z-40 hidden sm:block" 
                  onClick={() => setStartMenuOpen(false)} 
                  aria-hidden="true"
                />
                
                {/* Start menu */}
                <div 
                  id="start-menu"
                  className="
                    fixed left-0 sm:absolute sm:left-1 z-50 
                    w-full sm:w-64 
                    top-9 sm:top-full sm:-mt-1
                    bg-paper dark:bg-ink
                    border border-ink dark:border-paper
                    shadow-[2px_2px_10px_rgba(4,0,5,0.2)]
                    flex flex-col
                    overflow-y-auto
                    max-h-[calc(100vh-9px)] sm:max-h-[500px]
                  "
                >
                  {/* Start menu header - mobile only */}
                  <div className="sm:hidden flex items-center justify-between p-4 border-b border-ink dark:border-paper">
                    <span className="text-xl font-bold font-mono">Menu</span>
                    <button 
                      onClick={() => setStartMenuOpen(false)}
                      className="p-2"
                      aria-label="Close menu"
                    >
                      <span className="text-xl font-mono">×</span>
                    </button>
                  </div>
                  
                  {/* Menu items */}
                  <div className="py-2">
                    {[
                      { href: '#about', label: 'About', icon: 'hn-user' },
                      { href: '#solutions', label: 'Solutions', icon: 'hn-puzzle' },
                      { href: '#contact', label: 'Contact', icon: 'hn-moon' },
                    ].map(({ href, label, icon }) => (
                      <a
                        key={href}
                        href={href}
                        onClick={() => setStartMenuOpen(false)}
                        className="
                          flex items-center px-4 py-3 hover:bg-ink/10 dark:hover:bg-paper/10
                          border-l-[3px] border-transparent hover:border-l-[3px] hover:border-accent
                          transition-colors
                        "
                      >
                        <i className={`hn ${icon} text-xs mr-3`} aria-hidden="true" />
                        <span className="font-mono text-sm">{label}</span>
                      </a>
                    ))}
                  </div>
                  
                  {/* Footer items */}
                  <div className="mt-auto border-t border-ink dark:border-paper/20 py-2">
                    <div className="flex items-center justify-between px-4 py-2">
                      <span className="text-xs font-mono opacity-70">Adrian Legaspi © {new Date().getFullYear()}</span>
                      
                      <div className="flex space-x-3">
                        <LangSwitcher />
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Spacer to push items to right */}
            <div className="flex-1"></div>

            {/* Right-side tray */}
            <div className="absolute right-0 top-0 flex h-full items-center">
              {/* Placeholder for spacing if needed */}

              {/* Clock */}
              <div className="mx-1 hidden h-[80%] items-center justify-center px-4 sm:flex
                bg-paper/70 dark:bg-ink/70
              ">
                <span className="text-xs font-mono">{currentTime}</span>
              </div>

              {/* Language + theme */}
              <div className="mr-2 flex h-full items-center gap-2 py-0.5">
                {/* Direct components without wrapping divs to ensure full clickable area */}
                <LangSwitcher />
                <ThemeToggle />
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
        <Solutions />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
