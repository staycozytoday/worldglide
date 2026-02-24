"use client";

import { useState } from "react";

export default function CompanyLogo({
  src,
  company,
}: {
  src?: string;
  company: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span className="w-5 h-5 shrink-0 rounded-sm bg-[var(--color-border)] flex items-center justify-center text-[9px] text-[var(--color-text-muted)] font-mono uppercase">
        {company.charAt(0)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={company}
      width={20}
      height={20}
      className="w-5 h-5 shrink-0 rounded-sm object-contain bg-white"
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
