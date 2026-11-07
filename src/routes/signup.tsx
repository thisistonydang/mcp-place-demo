import { useState } from "react";
import type { FormEvent } from "react";

import { authClient } from "#/lib/auth";

export function Signup() {
  const session = authClient.useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await authClient.signUp.email({ email, name, password });
      if (result.error) {
        setError(result.error.message ?? "Could not create your account.");
        return;
      }

      await session.refetch();
      setPassword("");
    } catch {
      setError("Could not create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (session.isPending) {
    return <p className="mx-auto max-w-md px-4 py-16 text-muted">Loading…</p>;
  }

  if (session.data?.user) {
    return (
      <section className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-overlay bg-surface p-6 shadow-sm">
          <p className="text-xs font-bold tracking-widest text-foam uppercase">
            Signed in
          </p>
          <h1 className="mt-2 text-2xl font-semibold">Welcome back</h1>
          <p className="mt-4 text-sm text-subtle">
            Current user: {session.data.user.email}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-overlay bg-surface p-6 shadow-sm">
        <p className="text-xs font-bold tracking-widest text-foam uppercase">
          Neon Auth
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-subtle">
          Sign up with your name, email, and password.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Field
            autoComplete="name"
            label="Name"
            onChange={setName}
            type="text"
            value={name}
          />
          <Field
            autoComplete="email"
            label="Email"
            onChange={setEmail}
            type="email"
            value={email}
          />
          <Field
            autoComplete="new-password"
            label="Password"
            minLength={8}
            onChange={setPassword}
            type="password"
            value={password}
          />

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
            {isSubmitting ? "Creating account…" : "Sign up"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  autoComplete,
  label,
  minLength,
  onChange,
  type,
  value,
}: {
  autoComplete: string;
  label: string;
  minLength?: number;
  onChange: (value: string) => void;
  type: "email" | "password" | "text";
  value: string;
}) {
  const id = label.toLowerCase();

  return (
    <label className="block text-sm" htmlFor={id}>
      <span className="mb-1.5 block font-semibold">{label}</span>
      <input
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-overlay bg-base px-3 py-2.5 text-text outline-none focus:border-iris focus:ring-2 focus:ring-iris/20"
        id={id}
        minLength={minLength}
        onChange={(event) => onChange(event.target.value)}
        required
        type={type}
        value={value}
      />
    </label>
  );
}
