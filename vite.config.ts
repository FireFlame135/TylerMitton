// vite.config.ts
/**
 * Vite configuration for the portfolio website build system.
 * Author: Tyler Mitton
 * Configures React, Tailwind CSS optimization, and sitemap generation.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { VitePWA } from "vite-plugin-pwa";
// @ts-ignore - Critters types are not properly exported
import Critters from "critters";
import sitemap from "vite-plugin-sitemap";

// Tailwind classes to preserve during CSS purification
const crittersWhitelist = [
  // Group hover & hover effects
  "group-hover:scale-105",
  "group-hover:bg-black/10",
  "group-hover:text-gray-600",
  "hover:scale-105",
  "hover:bg-gray-900",
  "hover:bg-gray-600",
  "hover:text-gray-900",
  "hover:shadow-xl",
  "transition-colors",
  "transition-all",
  "transition-shadow",
  "duration-200",
  "duration-300",
  "duration-500",

  // Dark mode
  "dark:bg-gray-800",
  "dark:bg-gray-900",
  "dark:bg-gray-900/60",
  "dark:bg-gray-100",
  "dark:bg-gray-700",
  "dark:bg-zinc-900",
  "dark:text-gray-100",
  "dark:text-gray-200",
  "dark:text-gray-300",
  "dark:text-gray-400",
  "dark:text-gray-50",
  "dark:font-bold",
  "dark:hover:bg-gray-500",
  "dark:hover:text-gray-100",
  "dark:border-gray-700",
  "dark:hover:shadow-2xl",

  // Spacing & layout
  "px-6",
  "py-3",
  "py-6",
  "py-16",
  "pt-24",
  "pb-16",
  "mx-auto",
  "mb-4",
  "mb-6",
  "mb-12",
  "max-w-2xl",
  "max-w-4xl",
  "max-w-7xl",
  "w-full",
  "h-full",
  "flex",
  "flex-col",
  "sm:flex-row",
  "items-center",
  "justify-between",
  "gap-2",
  "gap-4",
  "gap-6",
  "gap-8",
  "gap-12",
  "grid",
  "grid-cols-1",
  "md:grid-cols-2",
  "lg:grid-cols-3",
  "lg:grid-cols-2",
  "space-y-2",
  "space-y-4",
  "space-y-6",
  "space-y-8",
  "space-x-1",
  "space-x-2",
  "space-x-3.5",
  "space-x-4",
  "space-x-6",
  "overflow-hidden",
  "relative",
  "absolute",
  "inset-0",
  "aspect-[4/3]",

  // Typography
  "text-xs",
  "text-sm",
  "text-lg",
  "text-xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
  "text-6xl",
  "font-normal",
  "font-bold",
  "uppercase",
  "tracking-wide",
  "leading-relaxed",
  "text-gray-400",
  "text-gray-500",
  "text-gray-600",
  "text-gray-700",
  "text-gray-900",
  "text-gray-950",

  // Borders & rounding
  "rounded",
  "rounded-md",
  "rounded-lg",
  "border",
  "border-t",
  "border-gray-300",
  "border-gray-700",
  "shadow",
  "shadow-sm",

  // Opacity & transforms
  "opacity-0",
  "opacity-100",
  "-translate-y-1/2",
  "translate-x-0",
  "translate-x-10",
  "transform",
  "object-cover",
];

export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    // React SWC compiler
    react(),
    // Generate sitemap for SEO
    sitemap({
      hostname: 'https://tylermitton.com',
      dynamicRoutes: [
        '/',
        '/Articles',
        '/Articles/how-i-taught-myself-modern-front-end-development',
        '/Articles/the-process-of-design-thinking',
        '/Articles/protac-linker-engineering',
        '/Articles/MarkdownTutorial',
        '/MazeGame',
      ],
      changefreq: 'weekly',
      priority: 0.8,
    }),
    // Custom Critters plugin for critical CSS extraction
    {
      name: "vite-plugin-critters",
      enforce: "post",
      apply: "build",
      async generateBundle(_, bundle) {
        const critters = new Critters({
          preload: "swap",
          compress: true,
          pruneSource: true,
          whitelist: crittersWhitelist
        });
        // Process HTML files to inline critical CSS
        for (const [fileName, asset] of Object.entries(bundle)) {
          if (fileName.endsWith(".html") && "source" in asset) {
            asset.source = await critters.process(asset.source as string);
          }
        }
      },
    },
  ],
}));
