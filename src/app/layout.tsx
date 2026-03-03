import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "worldglide ･ careers without borders for humans without limits",
  description:
    "curated remote roles from global, remote-first teams. no country limits, only product, engineering & design work you can do from wherever feels like home.",
  openGraph: {
    title: "worldglide ･ careers without borders for humans without limits.",
    description:
      "curated remote roles from global, remote-first teams. no country limits, only product, engineering & design work you can do from wherever feels like home.",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light')}catch(e){}})()`,
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
