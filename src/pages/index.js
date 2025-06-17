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
      <header className="flex justify-between items-center p-4 sticky top-0 bg-paper/80 dark:bg-ink/80 z-10 border-b-2 border-ink/20 dark:border-paper/20 backdrop-blur transition-all duration-300 relative group">
        {/* Animated vertical scan line */}
        <div className="absolute top-0 bottom-0 w-px bg-current opacity-20 animate-pulse" 
          style={{ 
            left: '50%', 
            animation: 'pulse 4s ease-in-out infinite, moveLeftRight 15s ease-in-out infinite' 
          }}></div>
          
        {/* Header noise texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="h-full w-full" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
              opacity: 0.1
            }}
          ></div>
        </div>
        
        {/* Logo with hover effect */}
        <div className="font-bold text-lg relative overflow-hidden group/logo">
          <span className="inline-block group-hover/logo:animate-glitch">Adrián Legaspi</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current opacity-50 group-hover/logo:w-full transition-all duration-500"></span>
        </div>
        
        {/* Animated divider */}
        <div className="absolute top-1/2 transform -translate-y-1/2 right-[140px] opacity-20 hidden md:block">
          <div className="flex flex-col gap-1">
            <div className="h-px w-6 bg-current"></div>
            <div className="h-px w-6 bg-current"></div>
            <div className="h-px w-6 bg-current"></div>
          </div>
        </div>
        
        <div className="flex gap-5 items-center relative z-10">
          <LangSwitcher />
          <ThemeToggle />
          
          {/* Status indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs opacity-60">
            <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
            <span>ONLINE</span>
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
