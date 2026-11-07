import { Link } from "@tanstack/react-router";

import { authClient } from "#/lib/auth";

export function Navbar() {
  const session = authClient.useSession();

  return (
    <header>
      <nav
        aria-label="Main navigation"
        className="flex h-16 items-center justify-between border-b border-overlay bg-base px-4"
      >
        <Link
          aria-label="MCP Place home"
          className="inline-flex items-center gap-2.5 text-sm font-bold tracking-[-0.02em] hover:text-iris"
          to="/"
        >
          <span
            aria-hidden="true"
            className="grid size-8 grid-cols-2 grid-rows-2 gap-0.5 rounded-[9px] border border-iris/35 p-1.5"
          >
            <span className="bg-iris" />
            <span className="bg-foam" />
            <span className="bg-love" />
            <span className="bg-gold" />
          </span>
          <span>mcp/place</span>
        </Link>

        {session.data?.user ? (
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden text-subtle sm:inline">
              {session.data.user.email}
            </span>
            <button
              className="rounded-lg border border-overlay px-3 py-2 font-bold hover:border-love hover:text-love"
              onClick={() => void authClient.signOut()}
              type="button"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            className="rounded-lg bg-iris px-3 py-2 text-xs font-bold text-base hover:opacity-90"
            to="/signup"
          >
            Sign up
          </Link>
        )}
      </nav>
    </header>
  );
}
