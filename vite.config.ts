

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import Critters from "critters";

const crittersWhitelist = [
  // --- Navigation ---
  "fixed", "top-0", "left-0", "right-0", "z-50",
  "bg-[#D4D5D8]/50", "backdrop-blur-md",
  "border-b", "border-gray-300", "dark:bg-gray-900/60", "dark:border-gray-700",
  "transition-all", "duration-300", "shadow-sm",
  "mx-auto", "px-6", "sm:px-8",
  "flex", "justify-between", "items-center", "h-16",
  "cursor-pointer", "text-3xl", "font-normal", "text-gray-900", "dark:text-gray-100",
  "hidden", "md:flex", "space-x-8",
  "relative", "text-gray-600", "hover:text-gray-900", "text-sm", "group",
  "dark:text-gray-300", "dark:hover:text-gray-100",
  "absolute", "bottom-0", "left-0", "w-0", "h-0.5",
  "bg-gray-900", "group-hover:w-full", "dark:bg-gray-100",
  "flex", "items-center", "space-x-1",
  "px-4", "py-2", "bg-gray-600", "text-white", "rounded-md",
  "hover:bg-gray-900", "transform", "hover:scale-105",
  "dark:bg-gray-700", "dark:hover:bg-gray-500",
  "md:hidden", "p-2", "py-4", "border-t", "border-gray-100",
  "dark:border-gray-700", "block",

  // --- Hero ---
  "pt-24", "pb-16", "max-w-4xl",
  "text-4xl", "sm:text-5xl", "lg:text-6xl", "leading-tight", "mb-6",
  "text-gray-900", "dark:text-gray-100",
  "text-gray-600", "dark:text-gray-400",
  "text-lg", "max-w-2xl", "leading-relaxed",

  // --- Projects section ---
  "py-16", "mb-12", "grid", "grid-cols-1",
  "md:grid-cols-2", "lg:grid-cols-3", "gap-8", "lg:gap-12",
  "items-start", "scroll-mt-16",
  "bg-[#F0F1F4]", "dark:bg-gray-800",
  "text-3xl", "sm:text-4xl", "mb-4",
  "text-gray-900", "dark:text-gray-100",
  "text-gray-600", "dark:text-gray-400",
  "max-w-2xl",

  // --- ProjectCard ---
  "flex", "flex-col", "h-full", "bg-transparent",
  "relative", "overflow-hidden", "mb-4",
  "aspect-[4/3]", "bg-gray-100", "dark:bg-gray-800",
  "w-full", "h-full", "object-cover",
  "transition-transform", "duration-500", "group-hover:scale-105",
  "absolute", "inset-0", "bg-black/0",
  "group-hover:bg-black/10", "transition-colors", "duration-300",
  "space-y-2", "text-sm", "uppercase", "tracking-wide",
  "text-gray-500", "dark:text-gray-400",
  "font-normal", "text-xl",
  "text-gray-900", "group-hover:text-gray-600", "dark:text-gray-200",
  "leading-relaxed",
  "cursor-pointer", "block", "text-left", "border-none", "p-0",
];




export default defineConfig(({ mode }) => ({
  base: "/TylerMitton/",
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "inline", 
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === "https://fireflame135.github.io",
            handler: "CacheFirst",
            options: {
              cacheName: "my-site-assets",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 90,
              },
            },
          },
        ],
      },
    }),
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
        for (const [fileName, asset] of Object.entries(bundle)) {
          if (fileName.endsWith(".html") && "source" in asset) {
            asset.source = await critters.process(asset.source as string);
          }
        }
      },
    },
  ],
}));
