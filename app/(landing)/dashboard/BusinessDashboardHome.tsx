'use client';

import { useEffect, useState } from 'react';
import GlassBox from './_components/GlassBox';
import ChartSvg from './_components/ChartSvg';
import CustomBadge from '@/components/ui/base/CustomBadge';
import { IconStore } from '@/components/ui/SVGs';
import { IconlyArrowLeft2 } from '@/components/assets/iconpack';
import Link from 'next/link';
import { api } from '@/lib/api/base';

const BusinessChartData = {
    profile_views: {
        title: 'بازدید کسب و کار',
        unit: 'بازدید',
    },
    product_sales: {
        title: 'فروش محصولات',
        unit: 'فروش',
    },
    active_ads: {
        title: 'تبلیغات فعال',
        unit: 'تبلیغ',
    },
    open_auctions: {
        title: 'مزایده‌های باز',
        unit: 'مزایده',
    },
} as const;

type BusinessStat = {
    current: number;
    last: number;
    changes: number;
    values: number[];
};

type BusinessStatistics = Partial<Record<keyof typeof BusinessChartData, BusinessStat>>;

function BusinessDashboardHome() {
    const [statistics, setStatistics] = useState<BusinessStatistics | undefined>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api('/profile/statistics')
            .then((e) => setStatistics(e.data?.statistics as BusinessStatistics))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-col gap-5 justify-stretch h-full">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
                <IconStore width={28} height={28} />
                داشبورد شغل من
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {Object.entries(BusinessChartData).map(([key, design], i) => {
                    const stat = statistics?.[key as keyof typeof statistics] || {
                        changes: 0,
                        current: 0,
                        last: 0,
                        values: [],
                    };
                    const c = stat.changes === 0 ? '#8888' : stat.changes < 0 ? 'red' : 'var(--primary)';

                    return (
                        <GlassBox key={i} color={c}>
                            <div className="flex gap-2 justify-between items-center p-5 h-full relative">
                                <div>
                                    <p className="text-sm mb-2">{design.title}</p>
                                    <div className="flex items-center justify-start gap-1">
                                        <h3 className="text-xl font-semibold truncate">
                                            {stat.current.toLocaleString('fa')} {design.unit}
                                        </h3>
                                        {!!stat.changes && (
                                            <CustomBadge color={c}>
                                                %{stat.changes.toLocaleString('fa')}
                                            </CustomBadge>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute max-w-[170px] left-2 top-0 bottom-0 my-auto h-full w-full flex items-center justify-end">
                                    <ChartSvg data={stat.values || []} color={c} />
                                </div>
                            </div>
                        </GlassBox>
                    );
                })}
            </div>

            {loading && (
                <p className="text-sm opacity-50 text-center py-4">در حال بارگذاری آمار...</p>
            )}

            <div className="items-center flex justify-between">
                <div className="items-center flex gap-1">
                    <IconStore width={20} height={20} />
                    <p className="font-medium">فعالیت‌های اخیر</p>
                </div>
                <Link href="/dashboard/products" className="text-primary flex items-center gap-1">
                    <p>مشاهده محصولات</p>
                    <IconlyArrowLeft2 />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Link
                    href="/dashboard/ads"
                    className="rounded-2xl border border-b2 bg-container p-5 hover:border-primary/40 transition-all flex flex-col gap-2"
                >
                    <p className="font-semibold">تبلیغات</p>
                    <p className="text-sm opacity-60">تبلیغ کسب و کار خود را در صفحه اصلی قرار دهید</p>
                </Link>
                <Link
                    href="/dashboard/auctions"
                    className="rounded-2xl border border-b2 bg-container p-5 hover:border-primary/40 transition-all flex flex-col gap-2"
                >
                    <p className="font-semibold">مزایده‌ها</p>
                    <p className="text-sm opacity-60">مزایده راه بیندازید و کمترین قیمت را انتخاب کنید</p>
                </Link>
                <Link
                    href="/dashboard/products"
                    className="rounded-2xl border border-b2 bg-container p-5 hover:border-primary/40 transition-all flex flex-col gap-2"
                >
                    <p className="font-semibold">محصولات</p>
                    <p className="text-sm opacity-60">محصولات فروشگاه خود را مدیریت کنید</p>
                </Link>
                <Link
                    href="/dashboard/subscription"
                    className="rounded-2xl border border-b2 bg-container p-5 hover:border-primary/40 transition-all flex flex-col gap-2"
                >
                    <p className="font-semibold">اشتراک</p>
                    <p className="text-sm opacity-60">اشتراک خود را تمدید یا فعال کنید</p>
                </Link>
            </div>
        </div>
    );
}

export default BusinessDashboardHome;
