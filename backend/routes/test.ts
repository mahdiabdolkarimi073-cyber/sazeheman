import {NextRequest, NextResponse} from "next/server";

export default function (req: NextRequest) {
    return NextResponse.json({oho: "oho"})
}