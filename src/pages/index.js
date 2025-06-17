import Head from 'next/head';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
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
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Update time initially
    updateTime();
    
    // Set up interval to update time every minute
    const interval = setInterval(updateTime, 60000);
    
    // Clean up interval
    return () => clearInterval(interval);
  }, []);
  
  const updateTime = () => {
    setCurrentTime(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true}));
  };
  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <link rel="canonical" href="https://adrianlegaspi.dev" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta property="og:title" content={t('title')} />
        <meta property="og:description" content={t('description')} />
        <meta property="og:image" content="/og-default.svg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className="sticky top-0 z-50 bg-paper dark:bg-ink border-b-2 border-ink dark:border-paper shadow-ink dark:shadow-paper h-9 relative group">
        {/* Taskbar background with noise texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="h-full w-full" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
              opacity: 0.1
            }}
          ></div>
        </div>

        <div className="flex h-full">
          {/* Start button */}
          <div className="flex items-center border-r-2 border-ink dark:border-paper px-2 hover:bg-ink/10 dark:hover:bg-paper/10 cursor-pointer group/start transition-colors">
            <span className="text-xs font-mono font-bold tracking-tight mr-1 text-comment">$</span>
            <span className="text-sm font-mono">AL</span>
          </div>

          {/* App section with "opened apps" */}
          <div className="flex">
            <a href="#about" className="flex items-center h-full px-3 border-r border-ink dark:border-paper hover:bg-ink/10 dark:hover:bg-paper/10 transition-colors">
              <span className="text-xs text-comment mr-1">/*</span>
              <span className="text-xs">About</span>
              <span className="text-xs text-comment ml-1">*/</span>
            </a>
            <a href="#projects" className="flex items-center h-full px-3 border-r border-ink dark:border-paper hover:bg-ink/10 dark:hover:bg-paper/10 transition-colors">
              <span className="text-xs text-comment mr-1">/*</span>
              <span className="text-xs">Projects</span>
              <span className="text-xs text-comment ml-1">*/</span>
            </a>
            <a href="#stack" className="hidden sm:flex items-center h-full px-3 border-r border-ink dark:border-paper hover:bg-ink/10 dark:hover:bg-paper/10 transition-colors">
              <span className="text-xs text-comment mr-1">/*</span>
              <span className="text-xs">Stack</span>
              <span className="text-xs text-comment ml-1">*/</span>
            </a>
            <a href="#contact" className="hidden sm:flex items-center h-full px-3 border-r border-ink dark:border-paper hover:bg-ink/10 dark:hover:bg-paper/10 transition-colors">
              <span className="text-xs text-comment mr-1">/*</span>
              <span className="text-xs">Contact</span>
              <span className="text-xs text-comment ml-1">*/</span>
            </a>
          </div>
        </div>

        {/* Right side system tray */}
        <div className="absolute right-0 top-0 h-full flex items-center">
          <div className="hidden md:flex items-center h-full px-3 border-l border-ink dark:border-paper">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-mono">ONLINE</span>
            </div>
          </div>

          {/* Clock */}
          <div className="hidden sm:flex items-center h-full px-3 border-l border-ink dark:border-paper bg-ink/5 dark:bg-paper/5">
            <span className="text-[10px] font-mono">
              {mounted ? currentTime : ''}  
            </span>
          </div>

          {/* Language & Theme */}
          <div className="flex h-full">
            <div className="flex items-center h-full px-2 border-l border-ink dark:border-paper hover:bg-ink/10 dark:hover:bg-paper/10">
              <LangSwitcher />
            </div>
            <div className="flex items-center h-full px-2 border-l border-ink dark:border-paper hover:bg-ink/10 dark:hover:bg-paper/10">
              <ThemeToggle />
            </div>
          </div>
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
