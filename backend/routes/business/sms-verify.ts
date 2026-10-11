import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function (req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;
    const phone = (body.phone || "").toString().trim();
    const code = (body.code || "").toString().trim();

    if (!phone || !code) {
        return NextResponse.json({
            message: "شماره تلفن و کد الزامی است",
            status: false,
        }, { status: 400 });
    }

    await prisma.business.updateMany({
        where: { phone },
        data: { phone_verified: true },
    });

    return NextResponse.json({
        message: "شماره تایید شد",
        status: true,
    });
}
