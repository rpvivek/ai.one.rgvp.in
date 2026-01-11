import type { Config } from "@react-router/dev/config";

export default {
  // Enable SSR for all routes
  ssr: true,
  
  // Prerender static routes for optimal SEO
  async prerender() {
    return [
      "/",
      "/login",
      "/forgot-password",
    ];
  },

  // Enable server bundles for production
  serverBundles: ({ branch }) => {
    const isAuthRoute = branch.some(
      (route) => route.id === "routes/login" || route.id === "routes/forgot-password"
    );
    return isAuthRoute ? "auth" : "main";
  },

  // Build directory configuration
  buildDirectory: "./build",
  
  // App directory where routes are defined
  appDirectory: "./src",
  
  // Server build path
  serverBuildFile: "index.js",
} satisfies Config;