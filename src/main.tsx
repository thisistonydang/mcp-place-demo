import { RealtimeProvider } from "@neon/realtime-react";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Navbar } from "#/components/navbar";
import { realtimeClient } from "#/lib/realtime";
import { Home } from "#/routes/home";
import "#/styles.css";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-dvh bg-base font-mono text-text">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  ),
  notFoundComponent: () => (
    <main className="grid min-h-[70vh] place-items-center text-center">
      <div>
        <p className="text-4xl font-bold">404</p>
        <Link className="text-foam underline" to="/">
          Return home
        </Link>
      </div>
    </main>
  ),
});
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const routeTree = rootRoute.addChildren([indexRoute]);
const router = createRouter({ routeTree, defaultPreload: "intent" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <RealtimeProvider client={realtimeClient}>
      <RouterProvider router={router} />
    </RealtimeProvider>
  </StrictMode>,
);
