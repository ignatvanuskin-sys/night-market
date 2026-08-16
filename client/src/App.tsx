import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
const Lookbook = lazy(() => import("./pages/Lookbook"));

// Style reminder: NIGHT MARKET uses Occult Luxury Editorial — near-black gallery space,
// asymmetrical commerce composition, restrained Ember Orange signals, and readable dark UI.
function RouteShell() {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location} className="nm-route-shell" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}>
        <Suspense fallback={<div className="nm-route-loading" role="status">Opening the archive…</div>}><Switch>
          <Route path="/lookbook" component={Lookbook} />
          <Route path="/" component={Home} />
        </Switch></Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return <ErrorBoundary><TooltipProvider><Toaster theme="dark" /><RouteShell /></TooltipProvider></ErrorBoundary>;
}
