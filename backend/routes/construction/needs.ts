import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {getRequestUser, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
    }

    const currentUser = await getRequestUser();

    const body = await req.json().catch(() => ({})) as Record<string, any>;
    const projectId = body.project_id;
    const needs = body.needs as Array<{ job_id: string; description?: string }>;

    if (!projectId || !needs || !Array.isArray(needs) || needs.length === 0) {
        return NextResponse.json({
            message: "پروژه و حداقل یک نیاز الزامی است",
            status: false,
        }, { status: 400 });
    }

    const project = await prisma.constructionProject.findUnique({ where: { id: projectId } });
    if (!project) {
        return NextResponse.json({ message: "پروژه یافت نشد", status: false }, { status: 404 });
    }

    const isOwner = project.user_id && project.user_id === currentUser?.id;
    const isAdmin = currentUser?.role === "admin";
    if (!isOwner && !isAdmin) {
        return NextResponse.json({ message: "فقط ایجادکننده پروژه یا مدیر می‌تواند نیاز اضافه کند", status: false }, { status: 403 });
    }

    await prisma.projectNeed.createMany({
        data: needs.map((n) => ({
            project_id: projectId,
            job_id: n.job_id,
            description: n.description || null,
        })),
    });

    return NextResponse.json({
        message: "نیازها با موفقیت ثبت شد",
        status: true,
    });
}
