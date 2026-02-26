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
      <div>
        <p className="text-[13px] text-[var(--color-text)]">
          ✓ check your email for some magic
        </p>
        <p className="text-[11px] text-[var(--color-text-muted)] mt-2">
          the teleport spell expires in 8 minutes.
        </p>
        <button
          onClick={() => { setSent(false); setEmail(""); }}
          className="mt-4 text-[11px] font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {urlError === "invalid-or-expired" && (
        <p className="text-[11px] text-[var(--color-text)]">
          ✗ that link has expired or already been used. request a new one.
        </p>
      )}
      {urlError === "missing-token" && (
        <p className="text-[11px] text-[var(--color-text)]">
          ✗ invalid login link. request a new one below.
        </p>
      )}
      {error && (
        <p className="text-[11px] text-[var(--color-text)]">✗ {error}</p>
      )}

      <div>
        <label htmlFor="email" className="block text-[11px] text-[var(--color-text-muted)] mb-1 font-mono">email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full h-[40px] px-2 text-[12px] bg-transparent border-b border-[var(--color-border)] focus:outline-none focus:border-[var(--color-text)] placeholder:text-[var(--color-text-muted)] transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !email.trim()}
        className="w-full h-[40px] text-[11px] font-mono bg-[var(--color-text)] text-[var(--color-bg)] hover:opacity-80 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "casting..." : "send"}
      </button>
    </form>
  );
}
