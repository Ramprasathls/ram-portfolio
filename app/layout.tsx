import './globals.css';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { AnimatedThemeToggler } from '@/components/animated-theme-toggler';
import { SiteDock } from '@/components/site-dock';

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-open-sans',
})


export const metadata: Metadata = {
  metadataBase: new URL('https://next-mdx-blog.vercel.app'),
  alternates: {
    canonical: '/'
  },
  title: {
    default: 'Ram Loganda',
    template: '%s | Ram Loganda'
  },
  description: 'My portfolio, blog, and personal website.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={openSans.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`
          }}
        />
      </head>
      <body className="antialiased tracking-tight">
        <AnimatedThemeToggler className="fixed top-4 right-4 z-50 p-2 rounded-full text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors" />
        <SiteDock />
        <div className="min-h-screen overflow-x-clip flex flex-col justify-between pt-0 md:pt-8 p-8 pb-28 dark:bg-zinc-950 bg-white text-gray-900 dark:text-zinc-200">
          <main className="max-w-[60ch] mx-auto w-full space-y-6">
            {children}
          </main>
          <Analytics />
        </div>
      </body>
    </html>
  );
}
