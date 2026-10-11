import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function (req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;
    const projectId = body.project_id;
    const needs = body.needs as Array<{ job_id: string; description?: string }>;

    if (!projectId || !needs || !Array.isArray(needs) || needs.length === 0) {
        return NextResponse.json({
            message: "پروژه و حداقل یک نیاز الزامی است",
            status: false,
        }, { status: 400 });
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
