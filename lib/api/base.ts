import { HTTP_METHOD } from "next/dist/server/web/http";
import { DebugMode, VARS } from "@/lib/VARS";
import { BaseApiType } from "@/lib/api/base.type";
import { setApiInfo } from "@/lib/hooks/useApiInfo";


// Deep unknown type - uses 'any' for easy casting without TypeScript errors
type DeepUnknown = any;

export async function api<
    T = never,  // Optional generic for custom type override
    M extends keyof BaseApiType = "GET",
    P extends string = string
>(
    path: P,
    body?: Record<string, any> | FormData,
    _method?: M | HTTP_METHOD,
    headers?: Record<string, string | null | undefined>
) {

    const isSilence = body instanceof FormData ? body.has("_silence") : !!body?.['_silence'];

    if (!!body && isSilence) {
        if (body instanceof FormData) {
            body.delete('_silence');
        } else {
            delete body['_silence'];
        }
    }

    const isAbsolute = path.startsWith("http:") || path.startsWith("https:");
    const backendUrl = VARS.BACKEND_URL;
    let url: URL;
    if (isAbsolute) {
        url = new URL(path);
    } else {
        const base = typeof window !== 'undefined' ? window.location.origin : (VARS.FRONTEND_URL || "http://localhost:3000");
        url = new URL(base + (backendUrl.startsWith("/") ? backendUrl : "/" + backendUrl) + (path.startsWith("/") ? path : "/" + path));
    }
    const method = _method || "GET";
    const isJson = typeof body === 'object' && !(body instanceof FormData);

    if (method === "GET" && body && isJson) {
        for (const [key, value] of Object.entries(body)) {
            if (typeof value !== 'undefined') url.searchParams.set(key, String(value));
        }
    }

    let token: string | undefined;
    if (typeof window === 'undefined') {
        const cookies = (await import("next/headers").then(e => e.cookies()));
        token = cookies.get('token')?.value;
    } else {
        token = window.userToken;
    }

    type Res = [T] extends [never]
        ? P extends keyof BaseApiType[M]
        ? BaseApiType[M][P]
        : DeepUnknown
        : T;

    const start = DebugMode ? Date.now() : undefined;
    if (start) {
        console.log('API', method, url.pathname, '...');
    }

    if (typeof window !== 'undefined') { // Changing to IR CDN
        url = convertToIRUrl(url);
    }

const res = await fetch(url, {
        method,
        body: method !== "GET" && body ? isJson ? JSON.stringify(body) : body : undefined,
        headers: {
            ...(isJson && ({
                "Content-Type": "application/json; charset=utf-8",
            })),
            "User-Agent": typeof window === "undefined" ? "SazehemanNextJs" : navigator.userAgent,
            ...(token && { Authorization: `Bearer ${token}` }),
            "Accept": "application/json",
            ...(headers || {})
        },
        credentials: "include"
    });

    return res.json()
        .then(e => ({
            data: e as Res,
            message: e?.message ?? e?.msg ?? "OK",
            ok: typeof e?.status !== 'undefined' ? e.status : res.status < 399 && res.ok
        }))
        .then(e => {
            if (start) {
                const diff = Date.now() - start;
                console.log('API', method, url.pathname, diff, 'ms');
            }
            if (!e.ok) {
                if (e.message && typeof window !== 'undefined' && !isSilence) {
                    window.alert(e.message);
                }
                const errors = (e as any)?.data?.errors;
                if (!!errors) {
                    setApiInfo({
                        code: res.status,
                        errors,
                        message: e.message + ""
                    })
                }
                throw e;
            }
            return e;
        });
}


export type ApiType<M, P> = M extends keyof BaseApiType
    ? P extends keyof BaseApiType[M]
    ? BaseApiType[M][P]
    : unknown
    : unknown

export function convertToIRUrl<T extends string | URL>(u: T, hostname = false): T {
    try {
        if (typeof window === 'undefined') return u;
        if (!window.location.hostname.endsWith(".ir")) return u;
        const url = new URL((hostname ? "https://":"") + u);
        const args = url.hostname.split(".");
        url.hostname = [...args.slice(0, -1), 'ir'].join(".");
        return hostname ? url.hostname as T:typeof u === 'string' ? url.toString() as T : url as T;
    } catch (e) {
        return u;
    }
}