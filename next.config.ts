import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    output: "standalone",
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
        const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";
        return [
            {
                source: "/sitemap.xml",
                destination: backend + "/sitemaps",
            },
            {
                source: "/posts_sitemap.xml",
                destination: backend + "/sitemaps/posts",
            },
            {
                source: "/pages_sitemap.xml",
                destination: backend + "/sitemaps/pages",
            },
            {
                source: "/creators_sitemap.xml",
                destination: backend + "/sitemaps/creators",
            },
        ];
    },
};

export default nextConfig;
