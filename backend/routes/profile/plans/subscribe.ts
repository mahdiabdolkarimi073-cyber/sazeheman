import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUser, AuthError, authErrorResponse, isDevMode} from "@/lib/api/auth";

export default async function (req: NextRequest) {
    let user;
    try {
        user = await requireUser();
    } catch (e) {
        if (e instanceof AuthError) return authErrorResponse(e);
        throw e;
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;
    const action = body.action;

    if (action === "trial") {
        const existingTrial = await prisma.subscription.findFirst({
            where: {
                user_id: user.id,
                status: "trial",
            },
        });

        if (existingTrial) {
            return NextResponse.json({
                message: "شما قبلا از دوره آزمایشی استفاده کرده‌اید",
                status: false,
            }, { status: 400 });
        }

        if (user.trial_used) {
            return NextResponse.json({
                message: "دوره آزمایشی فقط یک بار قابل استفاده است",
                status: false,
            }, { status: 400 });
        }

        const now = new Date();
        const expiresAt = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

        const sub = await prisma.subscription.create({
            data: {
                user_id: user.id,
                plan: "basic",
                status: "trial",
                starts_at: now,
                expires_at: expiresAt,
                trial_used: true,
            },
        });

        await prisma.user.update({
            where: { id: user.id },
            data: {
                trial_used: true,
                plan: "basic",
            },
        });

        return NextResponse.json({
            message: "دوره آزمایشی ۲ روزه فعال شد",
            status: true,
            subscription: sub,
        });
    }

    if (action === "redeem") {
        const redeem = body.redeem;
        if (!redeem) {
            return NextResponse.json({
                message: "کد فعالسازی وارد نشده است",
                status: false,
            }, { status: 400 });
        }

        const validCodes: Record<string, string> = {
            "SAZEH-BASIC": "basic",
            "SAZEH-ADVANCED": "advanced",
            "SAZEH-PARTNER": "partner",
        };

        const plan = validCodes[redeem];
        if (!plan) {
            return NextResponse.json({
                message: "کد فعالسازی نامعتبر است",
                status: false,
            }, { status: 400 });
        }

        const now = new Date();
        const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        const sub = await prisma.subscription.create({
            data: {
                user_id: user.id,
                plan,
                status: "active",
                starts_at: now,
                expires_at: expiresAt,
            },
        });

        await prisma.user.update({
            where: { id: user.id },
            data: { plan },
        });

        return NextResponse.json({
            message: "اشتراک با موفقیت فعال شد",
            status: true,
            plan,
            subscription: sub,
        });
    }

    if (action === "pay") {
        const plan = body.plan;
        if (!plan) {
            return NextResponse.json({
                message: "پلن انتخاب نشده است",
                status: false,
            }, { status: 400 });
        }

        const plans: Record<string, number> = {
            basic: 99000,
            advanced: 199000,
            partner: 499000,
        };

        const price = plans[plan];
        if (price === undefined) {
            return NextResponse.json({
                message: "پلن نامعتبر است",
                status: false,
            }, { status: 400 });
        }

        const dev = isDevMode();
        const payment = await prisma.payment.create({
            data: {
                user_id: user.id,
                amount: price,
                plan,
                status: dev ? "test" : "pending",
                gateway: dev ? "test" : (process.env.PAYMENT_GATEWAY || "test"),
                description: `فعالسازی پلن ${plan}`,
            },
        });

        if (dev) {
            const now = new Date();
            const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

            await prisma.subscription.create({
                data: {
                    user_id: user.id,
                    plan,
                    status: "active",
                    starts_at: now,
                    expires_at: expiresAt,
                },
            });

            await prisma.user.update({
                where: { id: user.id },
                data: { plan },
            });

            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: "test" },
            });

            return NextResponse.json({
                message: "پرداخت آزمایشی انجام شد و اشتراک فعال شد",
                status: true,
                payment_id: payment.id,
                test: true,
            });
        }

        return NextResponse.json({
            message: "درگاه پرداخت هنوز پیکربندی نشده است",
            status: false,
            payment_id: payment.id,
        }, { status: 503 });
    }

    return NextResponse.json({
        message: "action الزامی است (trial | redeem | pay)",
        status: false,
    }, { status: 400 });
}
