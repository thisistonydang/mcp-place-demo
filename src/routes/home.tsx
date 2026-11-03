import { PixelGrid } from "#/components/pixel-grid";

export function Home() {
  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 pb-10 sm:px-7">
      <section className="px-2 pt-10 pb-8 text-center sm:pt-14">
        <h1 className="mx-auto w-fit bg-[linear-gradient(90deg,var(--theme-iris)_0%,var(--theme-foam)_33%,var(--theme-love)_66%,var(--theme-gold)_100%)] bg-clip-text text-[clamp(2.5rem,7vw,4.5rem)] leading-none font-semibold tracking-[-0.065em] text-transparent">
          mcp/place
        </h1>
      </section>
      <section className="mx-auto flex max-w-[720px] justify-center rounded-2xl border border-overlay bg-surface p-4 shadow-sm sm:p-8">
        <PixelGrid />
      </section>
      <footer className="pt-8 text-center text-xs text-muted">
        Built with <BuildLink href="https://tanstack.com">TanStack</BuildLink>,{" "}
        <BuildLink href="https://neon.com">Neon</BuildLink>, and{" "}
        <BuildLink href="https://vercel.com">Vercel</BuildLink>.
      </footer>
    </div>
  );
}

function BuildLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a
      className="text-foam underline underline-offset-3 hover:text-text"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
