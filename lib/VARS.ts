export const VARS = {
    BACKEND_URL: "/api",
    FRONTEND_URL: process.env['FRONTEND_URL'] || "http://localhost:3000"
} as const;

export const DebugMode = process.env['NODE_ENV'] === 'development';