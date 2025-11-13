// src/App.tsx
/**
 * Main application component managing routing, providers, and layout.
 * Author: Tyler Mitton
 * Configures React Router, query client, and theme providers for the entire application.
 */

import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load pages to optimize initial bundle size
const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const MazeGame = lazy(() => import('./components/MazeGame'));
const LinkedInRedirect = lazy(() => import('./components/LinkedIn'));

// Generate dynamic XML sitemap for SEO
const Sitemap = () => {
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tylermitton.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tylermitton.com/Articles</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tylermitton.com/Articles/how-i-taught-myself-modern-front-end-development</loc>
    <lastmod>2025-07-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://tylermitton.com/Articles/the-process-of-design-thinking</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://tylermitton.com/Articles/protac-linker-engineering</loc>
    <lastmod>2025-03-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://tylermitton.com/Articles/MarkdownTutorial</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://tylermitton.com/MazeGame</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  return (
    <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
      {sitemapContent}
    </div>
  );
};

// Initialize React Query client for data fetching and caching
const queryClient = new QueryClient();

// Root layout wrapper with suspense fallback and scroll restoration
const RootLayout = () => (
  <Suspense fallback={<div className="min-h-screen bg-[#E2E4E6] dark:bg-zinc-800" />}>
    <Outlet />
    <ScrollRestoration />
  </Suspense>
);

// Define application routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/Articles", element: <ArticlesPage /> },
      { path: "/Articles/:slug", element: <BlogPost /> },
      { path: "/MazeGame", element: <MazeGame /> },
      { path: "/sitemap.xml", element: <Sitemap /> },
      { path: "*", element: <NotFound /> },
      { path: "/LinkedIn", element: <LinkedInRedirect /> },
    ],
  },
]);

// Main app wrapper with all necessary providers
const App = () => (
  <HelmetProvider>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </HelmetProvider>
);

export default App;