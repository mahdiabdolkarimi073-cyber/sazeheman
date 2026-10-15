import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {requireUser, requireAdmin, AuthError, authErrorResponse} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    const url = new URL(req.url);
    const businessId = url.searchParams.get("id");

    if (!businessId) {
        return NextResponse.json({ message: "id الزامی است", status: false }, { status: 400 });
    }

    let currentUser;
    try {
        currentUser = await requireUser();
    } catch (e) {
        if (e instanceof AuthError) return authErrorResponse(e);
        throw e;
    }

    const isAdmin = currentUser.role === "admin";

    const business = await prisma.business.findUnique({
        where: { id: businessId },
        select: {
            id: true,
            business_name: true,
            full_name: true,
            job_id: true,
            work_experience: true,
            phone: true,
            email: true,
            other_contacts: true,
            description: true,
            address: true,
            city: true,
            location_lat: true,
            location_lng: true,
            plan: true,
            phone_verified: true,
            status: true,
            rejection_reason: true,
            created_at: true,
            user_id: true,
            job: { select: { id: true, name: true, slug: true } },
            photos: { select: { id: true, photo_url: true } },
        },
    });

    if (!business) {
        return NextResponse.json({ message: "کسب‌وکار یافت نشد", status: false }, { status: 404 });
    }

    if (business.user_id !== currentUser.id && !isAdmin) {
        return NextResponse.json({ message: "دسترسی غیرمجاز", status: false }, { status: 403 });
    }

    if (req.method === "POST") {
        if (business.user_id !== currentUser.id) {
            return NextResponse.json({ message: "فقط مالک می‌تواند ویرایش کند", status: false }, { status: 403 });
        }

        const body = await req.json().catch(() => ({})) as Record<string, any>;
        const data: Record<string, any> = {};

        if (body.business_name !== undefined) data.business_name = body.business_name;
        if (body.full_name !== undefined) data.full_name = body.full_name;
        if (body.job_id !== undefined) data.job_id = body.job_id || null;
        if (body.work_experience !== undefined) data.work_experience = body.work_experience || null;
        if (body.email !== undefined) data.email = body.email || null;
        if (body.other_contacts !== undefined) data.other_contacts = body.other_contacts || null;
        if (body.description !== undefined) data.description = body.description || null;
        if (body.address !== undefined) data.address = body.address || null;
        if (body.city !== undefined) data.city = body.city || null;
        if (body.location_lat !== undefined) data.location_lat = parseFloat(body.location_lat) || null;
        if (body.location_lng !== undefined) data.location_lng = parseFloat(body.location_lng) || null;

        const updated = await prisma.business.update({
            where: { id: businessId },
            data,
            select: {
                id: true,
                business_name: true,
                full_name: true,
                job_id: true,
                work_experience: true,
                phone: true,
                email: true,
                other_contacts: true,
                description: true,
                address: true,
                city: true,
                location_lat: true,
                location_lng: true,
                plan: true,
                phone_verified: true,
                status: true,
                rejection_reason: true,
                created_at: true,
                job: { select: { id: true, name: true, slug: true } },
                photos: { select: { id: true, photo_url: true } },
            },
        });

        return NextResponse.json({
            message: "به‌روزرسانی شد",
            status: true,
            business: updated,
        });
    }

    return NextResponse.json({
        business,
        status: true,
    });
}
