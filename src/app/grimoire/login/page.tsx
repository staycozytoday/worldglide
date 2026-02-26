import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "worldglide ･ grimoire",
};

export default function LoginPage() {
  return (
    <div className="max-w-[960px] mx-auto px-8 pt-16 pb-24">
      <div className="max-w-[480px]">
        <div className="mb-16">
          <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-[1.1] text-[var(--color-text)]">
            grimoire
          </h1>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-4 max-w-[320px] leading-relaxed">
            pop your email in to unlock the spellbook. you'll get a one-time portal spell that opens the admin realm.
          </p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
