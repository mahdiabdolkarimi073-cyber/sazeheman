import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireAdmin, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
    }

    try {
        await requireAdmin();
    } catch (e) {
        if (e instanceof AuthError) return authErrorResponse(e);
        throw e;
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;
    const projectId = body.project_id;
    const action = body.action;
    const rejectionReason = (body.rejection_reason || "").toString().trim();

    if (!projectId || !action) {
        return NextResponse.json({
            message: "project_id و action الزامی است",
            status: false,
        }, { status: 400 });
    }

    if (action !== "approve" && action !== "reject") {
        return NextResponse.json({
            message: "action باید approve یا reject باشد",
            status: false,
        }, { status: 400 });
    }

    if (action === "reject" && !rejectionReason) {
        return NextResponse.json({
            message: "ذکر دلیل رد الزامی است",
            status: false,
        }, { status: 400 });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    const project = await prisma.constructionProject.update({
        where: { id: projectId },
        data: {
            status: newStatus,
            rejection_reason: action === "reject" ? rejectionReason : null,
        },
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

    if (project.user_id) {
        await prisma.userNotification.create({
            data: {
                user_id: project.user_id,
                title: action === "approve" ? "پروژه شما تأیید شد" : "پروژه شما رد شد",
                description: action === "approve"
                    ? `پروژه «${project.project_name}» توسط مدیر تأیید شد و اکنون روی نقشه عمومی نمایش داده می‌شود.`
                    : `پروژه «${project.project_name}» رد شد. دلیل: ${rejectionReason}`,
            },
        });
    }

    return NextResponse.json({
        message: action === "approve" ? "پروژه تایید شد" : "پروژه رد شد",
        status: true,
        project,
    });
}
