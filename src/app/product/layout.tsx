import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "worldglide ･ product",
  description: "100% remote product jobs. no country restrictions. worldwide.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
