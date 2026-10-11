import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function (req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;
    const projectId = body.project_id;
    const action = body.action;

    if (!projectId || !action) {
        return NextResponse.json({
            message: "project_id و action الزامی است",
            status: false,
        }, { status: 400 });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    const project = await prisma.constructionProject.update({
        where: { id: projectId },
        data: { status: newStatus },
    });

    if (action === "approve") {
        const needs = await prisma.projectNeed.findMany({
            where: { project_id: projectId },
            select: { job_id: true, description: true },
        });

        if (needs.length > 0) {
            await prisma.notification.createMany({
                data: needs.map((n) => ({
                    job_id: n.job_id,
                    project_id: projectId,
                    description: n.description || `پروژه ${project.project_name} به نیاز این شغل دارد`,
                })),
            });
        }
    }

    return NextResponse.json({
        message: action === "approve" ? "پروژه تایید شد" : "پروژه رد شد",
        status: true,
        project,
    });
}
