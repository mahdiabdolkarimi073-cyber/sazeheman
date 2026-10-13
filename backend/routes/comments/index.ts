import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireAdmin, getRequestUser, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    if (req.method === "GET") {
        const url = new URL(req.url);
        const adminOnly = url.searchParams.get("admin") === "true";

        if (adminOnly) {
            try {
                await requireAdmin();
            } catch (e) {
                if (e instanceof AuthError) return authErrorResponse(e);
                throw e;
            }
            const comments = await prisma.userComment.findMany({
                orderBy: { created_at: "desc" },
                take: 100,
            });
            return NextResponse.json({ comments, status: true });
        }

        const comments = await prisma.userComment.findMany({
            where: { status: "approved" },
            orderBy: { created_at: "desc" },
            take: 50,
        });
        return NextResponse.json({ comments, status: true });
    }

    if (req.method === "POST") {
        const body = await req.json().catch(() => ({})) as Record<string, any>;

        if (!body.name || !body.text) {
            return NextResponse.json({
                message: "نام و متن نظر الزامی است",
                status: false,
            }, { status: 400 });
        }

        const currentUser = await getRequestUser();
        const rating = body.rating ? Math.min(5, Math.max(1, parseInt(body.rating))) : 5;

        const comment = await prisma.userComment.create({
            data: {
                user_id: currentUser?.id || null,
                name: body.name,
                phone: body.phone || null,
                text: body.text,
                rating,
                status: "pending",
            },
        });

        return NextResponse.json({
            message: "نظر شما ثبت شد و پس از تایید نمایش داده می‌شود",
            status: true,
            comment,
        });
    }

    if (req.method === "PUT") {
        try {
            await requireAdmin();
        } catch (e) {
            if (e instanceof AuthError) return authErrorResponse(e);
            throw e;
        }

        const body = await req.json().catch(() => ({})) as Record<string, any>;
        const id = body.id;
        const action = body.action;

        if (!id || !action) {
            return NextResponse.json({ message: "id و action الزامی است", status: false }, { status: 400 });
        }

        const newStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : null;
        if (!newStatus) {
            return NextResponse.json({ message: "action باید approve یا reject باشد", status: false }, { status: 400 });
        }

        const comment = await prisma.userComment.update({
            where: { id },
            data: { status: newStatus },
        });

        return NextResponse.json({
            message: action === "approve" ? "نظر تایید شد" : "نظر رد شد",
            status: true,
            comment,
        });
    }

    return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
}
