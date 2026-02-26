"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

const inputClass = `w-full h-[40px] px-2 text-[12px] bg-transparent border-b border-[var(--color-border)]
  focus:outline-none focus:border-[var(--color-text)]
  placeholder:text-[var(--color-text-muted)] transition-colors`;

const labelClass = "block text-[11px] text-[var(--color-text-muted)] mb-1 font-mono";

const CATEGORIES = ["product", "engineering", "design"] as const;

export default function SubmitForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [category, setCategory] = useState<string>("product");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // honeypot
    if (formData.get("website_url")) {
      setState("success");
      return;
    }

    const data = {
      title: formData.get("title") as string,
      company: formData.get("company") as string,
      category,
      url: formData.get("url") as string,
      contactEmail: formData.get("contactEmail") as string,
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "something went wrong");
      }

      setState("success");
      form.reset();
    } catch (err) {
      setState("error");
      setErrorMsg(
        err instanceof Error ? err.message : "something went wrong"
      );
    }
  }

  if (state === "success") {
    return (
      <div className="py-16 animate-fade-in">
        <p className="text-[13px] font-medium">✓ job submitted</p>
        <p className="text-[12px] text-[var(--color-text-muted)] mt-2">
          we&apos;ll review your listing within 24 hours &amp; notify you via email once it&apos;s live.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" id="website_url" name="website_url" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>title</label>
        <input type="text" id="title" name="title" required placeholder="ninja rockstar" className={inputClass} />
      </div>

      <div>
        <label htmlFor="company" className={labelClass}>company</label>
        <input type="text" id="company" name="company" required placeholder="olympus optical" className={inputClass} />
      </div>

      <div>
        <span className={labelClass}>type</span>
        <div className="flex gap-2 mt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`h-[32px] flex-1 text-[11px] font-mono transition-colors ${
                category === cat
                  ? "bg-[var(--color-text)] text-[var(--color-bg)]"
                  : "bg-transparent text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-text)] hover:text-[var(--color-text)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="url" className={labelClass}>link</label>
        <input type="url" id="url" name="url" required placeholder="https://company.com/careers/role" className={inputClass} />
      </div>

      <div>
        <label htmlFor="contactEmail" className={labelClass}>email</label>
        <input type="email" id="contactEmail" name="contactEmail" required placeholder="your@email.com" className={inputClass} />
        <p className="text-[10px] text-[var(--color-text-muted)] mt-1 font-mono">invisible to the public. used mainly to contact you in the future.</p>
      </div>

      {state === "error" && (
        <p className="text-[12px] text-[var(--color-text)]">✗ {errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full h-[40px] text-[11px] font-mono bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {state === "submitting" ? "sending..." : "submit"}
      </button>

      <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
        by submitting, you confirm this is a 100% remote position available worldwide. otherwise it won't be published. sending you a virtual hug.
      </p>
    </form>
  );
}
