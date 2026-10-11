import { NextRequest, NextResponse } from "next/server";

const plans = [
    {
        id: "free",
        name: "پایه",
        price: 0,
        features: [
            "ثبت کسب و کار",
            "نمایش در لیست",
            "اطلاعات تماس",
        ],
    },
    {
        id: "pro",
        name: "حرفه‌ای",
        price: 99000,
        features: [
            "تمام امکانات پلن پایه",
            "نمایش برتر در لیست",
            "گالری نمونه کارها",
            "نمایش روی نقشه",
        ],
    },
    {
        id: "premium",
        name: "ویژه",
        price: 199000,
        features: [
            "تمام امکانات پلن حرفه‌ای",
            "نمایش در صفحه اصلی",
            "بدون محدودیت گالری",
            "پشتیبانی اختصاصی",
        ],
    },
];

export default async function (req: NextRequest) {
    return NextResponse.json({
        plans,
        status: true,
    });
}
