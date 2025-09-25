

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { VitePWA } from "vite-plugin-pwa";
import Critters from "critters";

const crittersWhitelist = [
  // group hover & hover effects
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

  // dark mode
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

  // spacing & layout
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

  // typography
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

  // borders & rounding
  "rounded",
  "rounded-md",
  "rounded-lg",
  "border",
  "border-t",
  "border-gray-300",
  "border-gray-700",
  "shadow",
  "shadow-sm",

  // opacity & transforms
  "opacity-0",
  "opacity-100",
  "-translate-y-1/2",
  "translate-x-0",
  "translate-x-10",
  "transform",
  "object-cover",
];



export default defineConfig(({ mode }) => ({
  // base: mode === 'github' ? '/TylerMitton/' : './',  // use '/' for Cloudflare but TylerMitton for GitHub Pages
  base: '/',
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
    // VitePWA({
    //   registerType: "autoUpdate",
    //   injectRegister: "inline", 
    //   workbox: {
    //     runtimeCaching: [
    //       {
    //         urlPattern: ({ url }) =>
    //           url.origin === "https://fireflame135.github.io",
    //         handler: "CacheFirst",
    //         options: {
    //           cacheName: "my-site-assets",
    //           expiration: {
    //             maxEntries: 100,
    //             maxAgeSeconds: 60 * 60 * 24 * 90,
    //           },
    //         },
    //       },
    //     ],
    //   },
    // }),
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
