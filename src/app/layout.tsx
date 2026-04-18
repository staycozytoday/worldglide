import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { IBM_Plex_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "worldglide · design jobs for humans without limits",
  description:
    "hand-picked, truly global creative roles. product design, ui, ux, creative direction. open to candidates anywhere in the world.",
  openGraph: {
    title: "worldglide · design jobs for humans without limits",
    description:
      "hand-picked, truly global creative roles. product design, ui, ux, creative direction. open to candidates anywhere in the world.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${ibmPlexMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.gif" type="image/gif" />
        <meta name="theme-color" content="#e3e5e8" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var th=t&&['light','dark','purple','orange'].indexOf(t)>-1?t:'light';document.documentElement.setAttribute('data-theme',th);document.documentElement.style.colorScheme=th==='light'?'light':'dark';var c={light:'#e3e5e8',dark:'#161618',purple:'#6432FF',orange:'#FF6432'};var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',c[th]||'#e3e5e8')}catch(e){}})()`,
          }}
        />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="a62a4be2-bff2-46c3-8a19-7c16bd5b8d1b"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <Suspense>
          <Header />
          <main className="flex-1">{children}</main>
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}
