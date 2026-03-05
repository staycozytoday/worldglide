import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "worldglide ･ saved",
  description: "your saved jobs.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
