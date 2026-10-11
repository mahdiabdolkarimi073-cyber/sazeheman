export const VARS = {
    BACKEND_URL: process.env['NEXT_PUBLIC_BACKEND_URL'] || process.env['BACKEND_URL'] || "http://localhost:3000/api",
    FRONTEND_URL: process.env['FRONTEND_URL'] || "http://localhost:3000"
} as const;

export const DebugMode = process.env['NODE_ENV'] === 'development';