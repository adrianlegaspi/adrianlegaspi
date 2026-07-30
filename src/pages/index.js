import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
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
  const { locale } = useRouter();
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
        <meta name="author" content="Adrian Legaspi" />
        <meta name="keywords" content={t('keywords')} />
        
        {/* OG Meta Tags with improved image format */}
        <meta property="og:title" content={t('title')} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://legaspi.dev" />
        <meta property="og:image" content="https://legaspi.dev/og-image.png" />
        <meta property="og:image:alt" content={t('ogImageAlt')} />
        <meta property="og:site_name" content="Adrian Legaspi" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="es_ES" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('title')} />
        <meta name="twitter:description" content={t('description')} />
        <meta name="twitter:image" content="https://legaspi.dev/og-image.png" />
        
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Adrian Legaspi',
              url: 'https://legaspi.dev',
              image: 'https://legaspi.dev/assets/img/adrian-legaspi-profile.png',
              jobTitle: 'Software Engineer',
              worksFor: {
                '@type': 'Organization',
                name: 'Freelance'
              },
              sameAs: [
                'https://github.com/adrianlegaspi',
                'https://linkedin.com/in/adrianlegaspi'
              ],
              knowsAbout: ['AI Development', 'React', 'Next.js', 'JavaScript', 'Python', 'Node.js']
            })
          }}
        />
      </Head>

      {/* -----------------------------------------------------------------
         Taskbar. Top-docked, which Win95 genuinely supported — the bar
         could be dragged to any screen edge.
      ------------------------------------------------------------------ */}
      <header className="sticky top-0 z-50 h-10">
        <div className="bevel-raised h-full w-full">
          <div className="flex h-full items-center gap-[3px] px-[3px]">
            {/* Start button */}
            <button
              type="button"
              onClick={() => setStartMenuOpen(!startMenuOpen)}
              className={`
                relative mr-1 flex h-[85%] shrink-0 items-center px-1.5
                cursor-pointer font-chrome
                ${startMenuOpen ? 'bevel-pressed' : 'btn-retro'}
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
                    bevel-raised
                    fixed left-0 sm:absolute sm:left-1 z-50
                    w-full sm:w-64
                    top-9 sm:top-full sm:-mt-1
                    p-[3px]
                    flex flex-col
                    overflow-y-auto
                    max-h-[calc(100vh-9px)] sm:max-h-[500px]
                  "
                >
                  {/* Start menu header - mobile only */}
                  <div className="sm:hidden flex items-center justify-between bg-titlebar px-2 py-1">
                    <span className="font-chrome text-titlebar-text text-xs font-bold">Menu</span>
                    <button
                      onClick={() => setStartMenuOpen(false)}
                      className="window-control"
                      aria-label="Close menu"
                    >
                      <span className="font-bold">×</span>
                    </button>
                  </div>

                  {/* Menu items */}
                  <div className="py-[3px]">
                    {[
                      { href: '#about', label: 'About', icon: 'hn-user' },
                      { href: '#solutions', label: 'Solutions', icon: 'hn-technology' },
                      { href: '#contact', label: 'Contact', icon: 'hn-envelope' },
                    ].map(({ href, label, icon }) => (
                      <a
                        key={href}
                        href={href}
                        onClick={() => setStartMenuOpen(false)}
                        className="menu-item flex items-center px-3 py-2 text-ink"
                      >
                        <i className={`hn ${icon} text-xs mr-3`} aria-hidden="true" />
                        <span className="font-chrome text-sm">{label}</span>
                      </a>
                    ))}
                  </div>

                  {/* Tray strip */}
                  <div className="mt-auto pt-[3px]">
                    <div className="bevel-groove mb-[3px]" />
                    <div className="flex items-center justify-between px-2 py-1">
                      <span className="font-chrome text-chrome-text text-[10px]">
                        Adrian Legaspi © {new Date().getFullYear()}
                      </span>

                      <div className="flex gap-[3px]">
                        <LangSwitcher />
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Spacer to push the tray right */}
            <div className="flex-1" />

            {/* System tray — a sunken well holding the indicators */}
            <div className="flex h-full shrink-0 items-center gap-[3px] py-[3px]">
              <div className="bevel-groove-v mx-0.5 h-[70%]" aria-hidden="true" />

              <LangSwitcher />
              <ThemeToggle />

              {/* Clock */}
              <div className="bevel-sunken hidden h-[26px] items-center px-2 sm:flex">
                <span className="font-chrome text-ink text-[11px] leading-none tabular-nums">
                  {currentTime}
                </span>
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
