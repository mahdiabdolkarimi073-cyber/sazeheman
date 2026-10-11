import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

export default async function (req: NextRequest) {
    const c = await cookies();
    const token = c.get('token')?.value;
    const user = token ? global._USERS?.[token] : undefined;

    if (!user) {
        return NextResponse.json({
            message: "احراز هویت نشده است",
            status: false,
        }, {status: 401});
    }

    const makeStat = (current: number, last: number) => ({
        current,
        last,
        changes: last === 0 ? 0 : Math.round(((current - last) / last) * 100),
        values: Array.from({length: 7}, () => Math.floor(Math.random() * current)),
    });

    if (user.account_type === 'shoghlman') {
        return NextResponse.json({
            statistics: {
                profile_views: makeStat(856, 620),
                product_sales: makeStat(43, 28),
                active_ads: makeStat(3, 1),
                open_auctions: makeStat(5, 2),
            },
            status: true,
        });
    }

    return NextResponse.json({
        statistics: {
            project_views: makeStat(1240, 980),
            contact_requests: makeStat(85, 60),
            active_projects: makeStat(12, 8),
            contractor_signups: makeStat(34, 22),
        },
        status: true,
    });
}
