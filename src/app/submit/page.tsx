"use client";

import SubmitForm from "@/components/SubmitForm";

export default function SubmitPage() {
  return (
    <div className="max-w-[960px] mx-auto px-8 pt-16 md:pt-24 pb-24">
      <div className="max-w-[480px]">
        <div className="mb-16">
          <h1 className="text-[32px] md:text-[40px] font-medium tracking-tight leading-[1.1]">
            post a job
          </h1>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-4 max-w-[320px] leading-relaxed">
            free. reviewed manually for quality. only 100% worldwide remote
            positions. no country restrictions.
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)] mt-4 font-mono">
            live for 2 weeks ･ reviewed in 24h
          </p>
        </div>

        <SubmitForm />
      </div>
    </div>
  );
}
