import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {getRequestUser} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const id = segments[segments.length - 1];

    const file = await prisma.fileUpload.findUnique({ where: { id } });
    if (!file) {
        return NextResponse.json({ message: "فایل یافت نشد", status: false }, { status: 404 });
    }

    const currentUser = await getRequestUser();
    if (file.user_id !== currentUser?.id && currentUser?.role !== "admin") {
        return NextResponse.json({ message: "دسترسی غیرمجاز", status: false }, { status: 403 });
    }

    return new NextResponse(file.data, {
        status: 200,
        headers: {
            "Content-Type": file.mime_type,
            "Content-Length": String(file.size),
            "Cache-Control": "private, max-age=3600",
        },
    });
}
