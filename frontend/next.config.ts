import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this folder so Next doesn't infer it from a
  // stray lockfile elsewhere on the machine (silences the multi-lockfile warning).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
