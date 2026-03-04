import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "worldglide ･ engineering",
  description: "100% remote engineering jobs. no country restrictions. worldwide.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
