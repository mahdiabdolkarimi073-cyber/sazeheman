import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function (req: NextRequest) {
    if (req.method === "GET") {
        const tickets = await prisma.supportTicket.findMany({
            orderBy: { created_at: "desc" },
            include: { replies: true },
            take: 50,
        });
        return NextResponse.json({ tickets, status: true });
    }

    if (req.method === "POST") {
        const body = await req.json().catch(() => ({})) as Record<string, any>;

        const required = ["name", "phone", "subject", "message"];
        for (const field of required) {
            if (!body[field]) {
                return NextResponse.json({
                    message: `${field} الزامی است`,
                    status: false,
                }, { status: 400 });
            }
        }

        const ticket = await prisma.supportTicket.create({
            data: {
                name: body.name,
                phone: body.phone,
                email: body.email || null,
                subject: body.subject,
                category: body.category || "general",
                priority: body.priority || "normal",
                message: body.message,
                status: "open",
            },
        });

        return NextResponse.json({
            message: "تیکت شما با موفقیت ثبت شد",
            status: true,
            ticket,
        });
    }

    return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
}
