"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  const urlError = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        setError("something went wrong. try again.");
      }
    } catch {
      setError("network error. try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-8">
        <div className="h-[40px] flex items-center text-[13px] text-[var(--color-text)]">
          check your email for the login link.
        </div>
        <p className="text-[11px] text-[var(--color-text-muted)] mt-2">
          the link expires in 15 minutes.
        </p>
        <button
          onClick={() => { setSent(false); setEmail(""); }}
          className="mt-4 text-[11px] text-[var(--color-text-muted)] underline"
        >
          try a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      {urlError === "invalid-or-expired" && (
        <p className="text-[11px] text-red-500">
          that link has expired or already been used. request a new one.
        </p>
      )}
      {urlError === "missing-token" && (
        <p className="text-[11px] text-red-500">
          invalid login link. request a new one below.
        </p>
      )}
      {error && (
        <p className="text-[11px] text-red-500">{error}</p>
      )}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="w-full h-[40px] px-3 text-[13px] bg-transparent border border-[var(--color-border)] rounded-md focus:outline-none focus:border-[var(--color-text)] transition-colors placeholder:text-[var(--color-text-muted)]"
      />

      <button
        type="submit"
        disabled={loading || !email.trim()}
        className="w-full h-[40px] bg-[var(--color-text)] text-[var(--color-bg)] text-[13px] font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        {loading ? "sending..." : "send login link"}
      </button>
    </form>
  );
}
