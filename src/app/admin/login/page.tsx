import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login — worldglide",
};

export default function LoginPage() {
  return (
    <div className="max-w-[960px] mx-auto px-8 pt-24 pb-24">
      <div className="max-w-[320px]">
        <h1 className="text-[24px] font-medium tracking-tight">
          admin
        </h1>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-2 max-w-[320px]">
          enter your email to receive a login link.
        </p>

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
