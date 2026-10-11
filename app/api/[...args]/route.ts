import {NextRequest, NextResponse} from "next/server";

const e404 = () => NextResponse.json({
    message: "Not Found",
}, {
    status: 404
})

const handle = async (req: NextRequest) => {
    try {
        const _p = req.nextUrl.pathname.split("/").filter(Boolean).slice(1).join('/');
        const PATH = _p.endsWith("/") ? _p + "index" : _p;

        let file = await import("../../../backend/routes/" + PATH + ".ts")
            .catch(() => undefined) as { default: any } | undefined;

        if (!file?.default) {
            const parts = PATH.split("/");
            if (parts.length > 1) {
                const dynamicPath = [...parts.slice(0, -1), "[slug]"].join("/");
                file = await import("../../../backend/routes/" + dynamicPath + ".ts")
                    .catch(() => undefined) as { default: any } | undefined;
            }
        }

        if (!file?.default) return e404();

        return file.default(req);
    } catch (e: any) {
        console.error("API route error:", e);
        return e404();
    }
}

export {
    handle as GET,
    handle as POST,
    handle as PUT,
    handle as PATCH,
    handle as DELETE,
}
