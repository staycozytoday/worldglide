"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

const inputClass = `w-full h-[40px] px-2 text-[12px] bg-transparent border-b border-[var(--color-border)]
  focus:outline-none focus:border-[var(--color-text)]
  placeholder:text-[var(--color-text-muted)]`;

const FORMSPREE_ID = "xpqyaogo";

export default function SubmitForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

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

    formData.set("category", "creative");

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new Error("something went wrong");
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
        <input type="text" id="title" name="title" required placeholder="title" className={inputClass} />
      </div>

      <div>
        <input type="text" id="company" name="company" required placeholder="company" className={inputClass} />
      </div>

      <div>
        <input
          type="url"
          id="url"
          name="url"
          required
          placeholder="link"
          pattern="https?://.+\..+"
          title="enter a valid url like example.com"
          className={inputClass}
          onBlur={(e) => {
            const v = e.target.value.trim();
            if (v && !/^https?:\/\//.test(v)) {
              e.target.value = `https://${v}`;
            }
          }}
        />
      </div>

      <div>
        <input type="email" id="contactEmail" name="contactEmail" required placeholder="email" className={inputClass} />
        <p className="text-[10px] text-[var(--color-text-muted)] mt-2 font-mono">invisible to the public.</p>
      </div>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full h-[40px] text-[11px] font-mono bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-80 disabled:opacity-40"
      >
        {state === "submitting" ? "sending..." : state === "error" ? "try again" : "submit"}
      </button>

      {state === "error" ? (
        <p className="text-[10px] text-[var(--color-text)] font-mono">
          ✗ {errorMsg}
        </p>
      ) : (
        <p className="text-[10px] text-[var(--color-text-muted)] font-mono">
          by submitting, you confirm this is a 100% remote position available worldwide. otherwise it won&apos;t be published.
        </p>
      )}
    </form>
  );
}
