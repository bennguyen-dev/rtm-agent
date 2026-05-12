"use client";

import { Lock } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      setError("Incorrect password. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-4 shadow-sm">
            <Lock className="h-3 w-3" />
            Team Access Only
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            RTM Generator
          </h1>
          <p className="text-sm text-slate-500">
            Enter the team password to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl"
        >
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            placeholder="••••••••"
            autoFocus
            required
            aria-invalid={!!error}
            aria-describedby={error ? "password-error" : undefined}
            className={`w-full rounded-lg border px-4 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4 ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                : "border-slate-300 focus:border-primary focus:ring-primary/10"
            }`}
          />

          {error && (
            <p
              id="password-error"
              role="alert"
              className="mt-2 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have the password? Ask your team lead.
        </p>
      </div>
    </div>
  );
}