import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "worldglide ･ jobs without borders for people without limits",
  description:
    "curated remote roles from global, remote-first teams. no country limits, only product, engineering & design work you can do from wherever feels like home.",
  openGraph: {
    title: "worldglide — remote jobs. any location. one internet.",
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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.gif" type="image/gif" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
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
