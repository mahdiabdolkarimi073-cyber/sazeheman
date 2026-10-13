import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireUser, requireAdmin, getRequestUser, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    const currentUser = await getRequestUser();

    if (req.method === "GET") {
        if (currentUser?.role === "admin") {
            const tickets = await prisma.supportTicket.findMany({
                orderBy: { created_at: "desc" },
                include: { replies: true },
                take: 100,
            });
            return NextResponse.json({ tickets, status: true });
        }

        if (!currentUser) {
            return NextResponse.json({ message: "احراز هویت نشده است", status: false }, { status: 401 });
        }

        const tickets = await prisma.supportTicket.findMany({
            where: { user_id: currentUser.id },
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
                user_id: currentUser?.id || null,
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

    if (req.method === "PUT") {
        let admin;
        try {
            admin = await requireAdmin();
        } catch (e) {
            if (e instanceof AuthError) return authErrorResponse(e);
            throw e;
        }

        const body = await req.json().catch(() => ({})) as Record<string, any>;
        const id = body.id;
        if (!id) {
            return NextResponse.json({ message: "شناسه تیکت الزامی است", status: false }, { status: 400 });
        }

        if (body.action === "reply") {
            if (!body.message) {
                return NextResponse.json({ message: "متن پاسخ الزامی است", status: false }, { status: 400 });
            }

            const reply = await prisma.ticketReply.create({
                data: {
                    ticket_id: id,
                    user_id: admin.id,
                    message: body.message,
                    is_admin: true,
                },
            });

            await prisma.supportTicket.update({
                where: { id },
                data: { status: "answered" },
            });

            return NextResponse.json({ status: true, reply });
        }

        if (body.action === "close") {
            await prisma.supportTicket.update({
                where: { id },
                data: { status: "closed" },
            });
            return NextResponse.json({ status: true });
        }

        return NextResponse.json({ message: "action نامعتبر است", status: false }, { status: 400 });
    }

    return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
}
