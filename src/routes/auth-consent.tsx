import { useEffect, useState } from "react";

import { authClient, oauthClient } from "#/lib/auth";

type OAuthClient = {
  name: string;
  redirectUris: Array<string>;
};

export function AuthConsent() {
  const [client, setClient] = useState<OAuthClient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = new URLSearchParams(window.location.search);
  const scope = params.get("scope") ?? "profile";
  const resources = params.getAll("resource");

  useEffect(() => {
    const search = window.location.search;
    const clientId = new URLSearchParams(search).get("client_id") ?? "";

    authClient.getSession().then(async ({ data }) => {
      if (!data?.user) {
        window.location.replace(`/auth/sign-in${search}`);
        return;
      }

      const result = await oauthClient.oauth2.publicClient({
        query: { client_id: clientId },
      });
      if (result.error) {
        setError("This authorization request is invalid or expired.");
        return;
      }

      setClient({
        name: result.data.client_name ?? "An application",
        redirectUris: result.data.redirect_uris ?? [],
      });
    });
  }, []);

  async function answer(accept: boolean) {
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await oauthClient.oauth2.consent({ accept });
      if (result.error) {
        setError(
          "This authorization request expired. Return to the agent and try again.",
        );
      }
    } catch {
      setError("Could not save your choice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const redirectHosts = client?.redirectUris.map((uri) => {
    try {
      return new URL(uri).host;
    } catch {
      return uri;
    }
  });
  const onlyLoopback =
    redirectHosts?.length &&
    redirectHosts.every((host) =>
      /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host),
    );

  return (
    <section className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-2xl border border-overlay bg-surface p-6 shadow-sm">
        <p className="text-xs font-bold tracking-widest text-foam uppercase">
          Agent permission
        </p>
        <h1 className="mt-2 text-2xl font-semibold">
          Allow {client?.name ?? "this agent"}?
        </h1>
        <p className="mt-3 text-sm text-subtle">
          This agent wants permission to call the mcp/place MCP server and paint
          squares on the shared grid as you.
        </p>

        <dl className="mt-6 space-y-3 rounded-xl bg-base p-4 text-sm">
          <div>
            <dt className="font-bold">Requested access</dt>
            <dd className="mt-1 break-words text-subtle">{scope}</dd>
          </div>
          {resources.length ? (
            <div>
              <dt className="font-bold">Resource</dt>
              <dd className="mt-1 break-all text-subtle">
                {resources.join(", ")}
              </dd>
            </div>
          ) : null}
          {redirectHosts?.length ? (
            <div>
              <dt className="font-bold">Returns to</dt>
              <dd className="mt-1 break-words text-subtle">
                {redirectHosts.join(", ")}
              </dd>
            </div>
          ) : null}
        </dl>

        {onlyLoopback ? (
          <p className="mt-4 rounded-lg border border-gold/50 bg-gold/10 p-3 text-sm text-gold">
            This agent returns to an app running on your computer. Continue only
            if you started it.
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 text-sm text-love" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            className="rounded-lg border border-overlay px-4 py-2.5 text-sm font-bold hover:border-love hover:text-love disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting || !client}
            onClick={() => void answer(false)}
            type="button"
          >
            Deny
          </button>
          <button
            className="rounded-lg bg-iris px-4 py-2.5 text-sm font-bold text-base hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting || !client}
            onClick={() => void answer(true)}
            type="button"
          >
            {isSubmitting ? "Saving…" : "Allow"}
          </button>
        </div>
      </div>
    </section>
  );
}
