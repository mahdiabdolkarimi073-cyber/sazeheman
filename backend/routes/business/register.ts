import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {getRequestUser} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed", status: false }, { status: 405 });
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;

    const required = ["business_name", "full_name", "phone"];
    for (const field of required) {
        if (!body[field]) {
            return NextResponse.json({
                message: `${field} الزامی است`,
                status: false,
            }, { status: 400 });
        }
    }

    const existing = await prisma.business.findFirst({
        where: {
            phone: body.phone,
            status: { in: ["pending", "approved"] },
        },
    });

    if (existing) {
        return NextResponse.json({
            message: "کسب‌وکاری با این شماره قبلا ثبت شده است",
            status: false,
            existing_id: existing.id,
            existing_status: existing.status,
        }, { status: 409 });
    }

    const currentUser = await getRequestUser();
    const userId = currentUser?.id || null;

    const jobIds: string[] = Array.isArray(body.job_ids) ? body.job_ids : (body.job_id ? [body.job_id] : []);
    const primaryJobId = jobIds[0] || null;

    const photos: string[] = Array.isArray(body.photos) ? body.photos : [];

    const business = await prisma.business.create({
        data: {
            user_id: userId,
            business_name: body.business_name,
            full_name: body.full_name,
            job_id: primaryJobId,
            work_experience: body.work_experience || null,
            phone: body.phone,
            email: body.email || null,
            other_contacts: body.other_contacts || null,
            description: body.description || null,
            address: body.address || null,
            city: body.city || null,
            location_lat: body.location_lat ? parseFloat(body.location_lat) : null,
            location_lng: body.location_lng ? parseFloat(body.location_lng) : null,
            plan: body.plan || "free",
            status: "pending",
            phone_verified: false,
            photos: photos.length > 0 ? {
                create: photos.map((url: string) => ({ photo_url: url })),
            } : undefined,
        },
        include: { photos: true },
    });

    return NextResponse.json({
        message: "کسب و کار با موفقیت ثبت شد",
        status: true,
        business,
    });
}
