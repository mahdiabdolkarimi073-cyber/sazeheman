import {NextRequest, NextResponse} from "next/server";

export default async function (req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({
            message: "Method Not Allowed",
            status: false,
        }, {status: 405});
    }

    const body = await req.json().catch(() => ({})) as Record<string, any>;

    if (!body.name || !body.message) {
        return NextResponse.json({
            message: "نام و متن پیام الزامی است",
            status: false,
            errors: {
                name: !body.name ? ["این فیلد الزامی است"] : [],
                message: !body.message ? ["این فیلد الزامی است"] : [],
            },
        }, {status: 400});
    }

    const entry = {
        id: Math.random().toString(36),
        name: body.name,
        last_name: body.last_name || "",
        email: body.email || "",
        phone: body.phone || "",
        message: body.message,
        created_at: new Date().toISOString(),
    };
    global._CONTACTS ||= [];
    global._CONTACTS.push(entry);

    return NextResponse.json({
        message: "درخواست شما با موفقیت ثبت شد",
        status: true,
    });
}
