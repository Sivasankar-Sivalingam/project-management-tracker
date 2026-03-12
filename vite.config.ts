import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      // Only measure coverage for source files in src/
      include: ["src/**/*.{ts,tsx}"],
      // Exclude files that are non-essential for coverage:
      // - entry point (main.tsx)
      // - pure type definition files
      // - CSS / asset files (not JS-computable)
      // - static mock/seed data
      // - the test setup file itself
      // - the test files themselves
      exclude: [
        "src/main.tsx",
        "src/types/**",
        "src/**/*.css",
        "src/mockData/**",
        "src/setupTests.ts",
        "src/tests/**",
        "src/assets/**",
      ],
    },
  },
});
