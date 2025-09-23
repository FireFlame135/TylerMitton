// import { defineConfig } from "vite"; 
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { VitePWA } from 'vite-plugin-pwa'

// export default defineConfig(({ mode }) => ({
//   base: '/TylerMitton/', 
//   server: {
//     host: "::",
//     port: 8080,
//   },
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   plugins: [
//     VitePWA({
//       registerType: 'autoUpdate',
//       workbox: {
//         runtimeCaching: [
//           {
//             urlPattern: ({ url }) => url.origin === 'https://fireflame135.github.io',
//             handler: 'CacheFirst',
//             options: {
//               cacheName: 'my-site-assets',
//               expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 90 }, // 90 days
//             },
//           },
//         ],
//       },
//     }),
//   ],
// }));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import Critters from "critters";

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
      injectRegister: "script",
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
