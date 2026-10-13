import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireUser, AuthError, authErrorResponse} from "@/lib/api/auth";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME = [
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "application/pdf",
];

export default async function (req: NextRequest) {
    let user;
    try {
        user = await requireUser();
    } catch (e) {
        if (e instanceof AuthError) return authErrorResponse(e);
        throw e;
    }

    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
    }

    const formData = await req.formData().catch(() => null);
    if (!formData) {
        return NextResponse.json({ message: "فرمت داده نامعتبر است", status: false }, { status: 400 });
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
        return NextResponse.json({ message: "فایل ارسال نشده است", status: false }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
        return NextResponse.json({ message: "حداکثر حجم فایل ۵ مگابایت است", status: false }, { status: 400 });
    }

    if (!ALLOWED_MIME.includes(file.type)) {
        return NextResponse.json({ message: "نوع فایل مجاز نیست", status: false }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploaded = await prisma.fileUpload.create({
        data: {
            user_id: user.id,
            filename: file.name,
            mime_type: file.type,
            size: file.size,
            data: buffer,
        },
    });

    return NextResponse.json({
        message: "فایل با موفقیت آپلود شد",
        status: true,
        file_id: uploaded.id,
        url: `/api/file/${uploaded.id}`,
    });
}
