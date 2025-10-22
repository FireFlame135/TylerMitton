// src/App.tsx
import { Suspense, lazy } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from "react-router-dom";

// Lazy load the components to optimize initial load time
const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const MazeGame = lazy(() => import('./components/MazeGame'));
const LinkedInRedirect = lazy(() => import('./components/LinkedIn'));

const queryClient = new QueryClient();

// Create a root layout component that includes the <Suspense> fallback and ScrollRestoration
const RootLayout = () => (
  <Suspense fallback={<div className="min-h-screen bg-[#E2E4E6] dark:bg-zinc-800" />}>
    <Outlet />
    <ScrollRestoration />
  </Suspense>
);


// Define routes using the data router structure
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/Articles", element: <ArticlesPage /> },
      { path: "/Articles/:slug", element: <BlogPost /> },
      { path: "/MazeGame", element: <MazeGame /> },
      { path: "*", element: <NotFound /> },
      { path: "/LinkedIn", element: <LinkedInRedirect /> },
    ],
  },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;