// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
import { Suspense, lazy } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load the components to optimize initial load time
const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));
const MazeGame = lazy(() => import('./components/MazeGame'));
const MazeGameExperiment = lazy(() => import('./components/MazeGameExperiment'));

// Uncomment the following in order to load everything at once
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import MazeGame from "./components/MazeGame";
// import MazeGameExperiment from "./components/MazeGameExperiment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* <Toaster />
      <Sonner />
      Add in if a Toaster or Sonner is ever needed */}
      <BrowserRouter basename="/TylerMitton/">
        <Suspense fallback={<div className="min-h-screen bg-[#E2E4E6] dark:bg-zinc-800" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/MazeGame" element={<MazeGame />} />
            <Route path="/MazeGameExperiment" element={<MazeGameExperiment />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
