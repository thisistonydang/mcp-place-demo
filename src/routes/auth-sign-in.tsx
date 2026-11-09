import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { authClient, oauthClient } from "#/lib/auth";

export function AuthSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prompts = params.get("prompt")?.split(" ") ?? [];
    if (prompts.includes("login") || prompts.includes("create")) return;

    authClient.getSession().then(async ({ data }) => {
      if (!data?.user) return;
      const result = await oauthClient.oauth2.continue({ selected: true });
      if (result.error) {
        setError(
          "This sign-in link expired. Return to the agent and try again.",
        );
      }
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(result.error.message ?? "Invalid email or password.");
        return;
      }
      if (result.data.redirect) return;

      const next = await oauthClient.oauth2.continue({ selected: true });
      if (next.error) {
        setError(
          "This sign-in link expired. Return to the agent and try again.",
        );
      }
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-overlay bg-surface p-6 shadow-sm">
        <p className="text-xs font-bold tracking-widest text-foam uppercase">
          Agent access
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Sign in to mcp/place</h1>
        <p className="mt-2 text-sm text-subtle">
          Sign in before allowing your agent to paint the shared grid.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm" htmlFor="oauth-email">
            <span className="mb-1.5 block font-semibold">Email</span>
            <input
              autoComplete="email"
              className="w-full rounded-lg border border-overlay bg-base px-3 py-2.5 text-text outline-none focus:border-iris focus:ring-2 focus:ring-iris/20"
              id="oauth-email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="block text-sm" htmlFor="oauth-password">
            <span className="mb-1.5 block font-semibold">Password</span>
            <input
              autoComplete="current-password"
              className="w-full rounded-lg border border-overlay bg-base px-3 py-2.5 text-text outline-none focus:border-iris focus:ring-2 focus:ring-iris/20"
              id="oauth-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {error ? (
            <p className="text-sm text-love" role="alert">
              {error}
            </p>
          ) : null}

          <button
            className="w-full rounded-lg bg-iris px-4 py-2.5 text-sm font-bold text-base hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Signing in…" : "Sign in and continue"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-subtle">
          Need an account?{" "}
          <a
            className="font-bold text-foam underline underline-offset-2"
            href={`/signup${window.location.search}`}
          >
            Sign up
          </a>
        </p>
      </div>
    </section>
  );
}
