import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";

// Style reminder: NIGHT MARKET uses Occult Luxury Editorial — near-black gallery space,
// asymmetrical commerce composition, restrained Ember Orange signals, and readable dark UI.
export default function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster theme="dark" />
        <Home />
      </TooltipProvider>
    </ErrorBoundary>
  );
}
