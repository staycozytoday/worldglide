import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "worldglide ･ design",
  description: "100% remote design jobs. no country restrictions. worldwide.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
