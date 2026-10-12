import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    experimental: {
        cpus: 1,
    },
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        remotePatterns: [
            new URL("https://storage.c2.liara.space/**"),
            new URL("https://cdn.donofa.com/**"),
            new URL("https://*.donofa.com/**"),
            new URL("https://files.kick.com/**"),
            new URL("http://localhost/**"),
            new URL("http://localhost:3000/**"),
            new URL("http://127.0.0.1/**"),
        ]
    },
    async rewrites() {
        return [];
    },
};

export default nextConfig;
