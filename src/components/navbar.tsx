import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <header>
      <nav
        aria-label="Main navigation"
        className="flex h-16 items-center border-b border-overlay bg-base px-4"
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
      </nav>
    </header>
  );
}
