import {NextRequest, NextResponse} from "next/server";

const posts = [
    {
        id: 1,
        title: "معرفی پلتفرم سازه من",
        slug: "sazeheman-intro",
        description: "آشنایی با پلتفرم سازه من و امکانات آن برای صنعت ساختمان",
        thumbnail: "",
        content: [
            { type: "heading", data: { level: "h2", content: "سازه من چیست؟" } },
            { type: "paragraph", data: { content: "سازه من پلتفرمی جامع برای ارتباط سازندگان، پیمانکاران و تأمین‌کنندگان مصالح ساختمانی است." } },
            { type: "heading", data: { level: "h2", content: "امکانات اصلی" } },
            { type: "paragraph", data: { content: "مدیریت پروژه، ثبت پیمانکاران، مدیریت ارتباطات و گزارش‌گیری لحظه‌ای از جمله امکانات این پلتفرم است." } },
        ],
        category: "آموزشی",
        tags: ["سازه من", "صنعت ساختمان", "مدیریت پروژه"],
        meta: { title: "معرفی پلتفرم سازه من", description: "آشنایی با پلتفرم سازه من و امکانات آن" },
        is_active: true,
        is_guide: true,
        created_at: new Date().toISOString(),
    },
    {
        id: 2,
        title: "نکات کاهش هزینه ساخت",
        slug: "reduce-construction-costs",
        description: "راهکارهای عملی برای کاهش هزینه‌های پروژه‌های عمرانی",
        thumbnail: "",
        content: [
            { type: "heading", data: { level: "h2", content: "برنامه‌ریزی دقیق" } },
            { type: "paragraph", data: { content: "اولین قدم برای کاهش هزینه، برنامه‌ریزی دقیق و زمان‌بندی مناسب مراحل اجراست." } },
        ],
        category: "اقتصادی",
        tags: ["هزینه ساخت", "مدیریت پروژه"],
        meta: { title: "نکات کاهش هزینه ساخت", description: "راهکارهای عملی برای کاهش هزینه‌های پروژه‌های عمرانی" },
        is_active: true,
        is_guide: false,
        created_at: new Date().toISOString(),
    },
];

export default async function (req: NextRequest) {
    return NextResponse.json({
        posts,
        pages: 1,
        status: true,
    });
}
