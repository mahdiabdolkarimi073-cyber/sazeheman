import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireAdmin, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    let admin;
    try {
        admin = await requireAdmin();
    } catch (e) {
        if (e instanceof AuthError) return authErrorResponse(e);
        throw e;
    }

    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;
    const businessId = body.business_id;
    const action = body.action;

    if (!businessId || !action) {
        return NextResponse.json({
            message: "business_id و action الزامی است",
            status: false,
        }, { status: 400 });
    }

    if (action !== "approve" && action !== "reject") {
        return NextResponse.json({
            message: "action باید approve یا reject باشد",
            status: false,
        }, { status: 400 });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    const business = await prisma.business.update({
        where: { id: businessId },
        data: { status: newStatus },
    });

    if (action === "approve" && business.user_id) {
        await prisma.userNotification.create({
            data: {
                user_id: business.user_id,
                title: "کسب‌وکار شما تأیید شد",
                description: `کسب‌وکار «${business.business_name}» تأیید و در فهرست عمومی قرار گرفت.`,
            },
        }).catch(() => {});
    }

    return NextResponse.json({
        message: action === "approve" ? "کسب‌وکار تایید شد" : "کسب‌وکار رد شد",
        status: true,
        business,
    });
}
