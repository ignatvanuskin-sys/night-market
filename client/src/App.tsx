import { Suspense, lazy, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import RouteMeta from "./components/RouteMeta";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Policies from "./pages/Policies";
const Lookbook = lazy(() => import("./pages/Lookbook"));

// Style reminder: NIGHT MARKET uses Occult Luxury Editorial — near-black gallery space,
// asymmetrical commerce composition, restrained Ember Orange signals, and readable dark UI.
function LoadingScreen({ route = false }: { route?: boolean }) {
  return (
    <motion.div className={`nm-loading-screen ${route ? "is-route" : ""}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: route ? 0.16 : 0.28 }} role="status" aria-live="polite" aria-label="Loading NIGHT MARKET">
      <div className="nm-loading-orbit" aria-hidden="true"><span /></div>
      <div className="nm-loading-wordmark"><strong>NIGHT</strong><em>MARKET</em></div>
      <span className="nm-loading-caption">{route ? "Opening the archive" : "Objects for after dark"}</span>
    </motion.div>
  );
}

function RouteShell() {
  const [location] = useLocation();
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setBooting(false), reducedMotion ? 80 : 720);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <RouteMeta path={location} />
      <AnimatePresence>{booting && <LoadingScreen />}</AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div key={location} className="nm-route-shell" initial={{ opacity: 0, y: 14, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(3px)" }} transition={{ duration: 0.34, ease: [0.23, 1, 0.32, 1] }}>
          <Suspense fallback={<LoadingScreen route />}><Switch>
            <Route path="/lookbook" component={Lookbook} />
            <Route path="/favorites" component={Favorites} />
            <Route path="/policies" component={Policies} />
            <Route path="/" component={Home} />
          </Switch></Suspense>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return <ErrorBoundary><TooltipProvider><Toaster theme="dark" /><RouteShell /></TooltipProvider></ErrorBoundary>;
}
