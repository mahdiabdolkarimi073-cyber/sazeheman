'use client';

import { useEffect, useState } from 'react';
import ChartSvg from './_components/ChartSvg';
import CustomBadge from '@/components/ui/base/CustomBadge';
import { IconStore } from '@/components/ui/SVGs';
import { IconlyArrowLeft2 } from '@/components/assets/iconpack';
import Link from 'next/link';
import { api } from '@/lib/api/base';
import CustomButton from '@/components/ui/base/CustomButton';

const BusinessChartData = {
    profile_views: {
        title: 'بازدید کسب‌وکار',
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

const BusinessActions = [
    {
        href: "/dashboard/my-businesses",
        title: "شغل‌های من",
        description: "مشاهده و مدیریت کسب‌وکارهای ثبت‌شده توسط شما",
        cta: "مدیریت کسب‌وکارها",
    },
    {
        href: "/dashboard/account",
        title: "اطلاعات حساب من",
        description: "مدیریت پروفایل و اطلاعات حساب کاربری خود",
        cta: "مشاهده",
    },
    {
        href: "/dashboard/ads",
        title: "تبلیغات",
        description: "تبلیغ کسب‌وکار خود را در صفحه اصلی قرار دهید",
        cta: "مدیریت تبلیغات",
    },
    {
        href: "/dashboard/auctions",
        title: "مزایده‌ها",
        description: "مزایده راه بیندازید و کمترین قیمت را انتخاب کنید",
        cta: "مشاهده مزایده‌ها",
    },
    {
        href: "/dashboard/products",
        title: "محصولات",
        description: "محصولات فروشگاه خود را مدیریت کنید",
        cta: "مدیریت محصولات",
    },
    {
        href: "/dashboard/subscription",
        title: "اشتراک",
        description: "اشتراک خود را تمدید یا فعال کنید",
        cta: "مشاهده اشتراک",
    },
] as const;

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
        <div className="flex flex-col gap-5">
            {/* Welcome section */}
            <div className="bg-white rounded-2xl border border-[#E7F5EE] shadow-[0_2px_12px_rgba(23,61,53,0.06)] p-5 lg:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#36B98A]/15 flex items-center justify-center shrink-0">
                            <IconStore width={24} height={24} />
                        </div>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-[#173D35]">
                                داشبورد شغل من
                            </h1>
                            <p className="text-sm text-[#6B7771] mt-0.5">
                                مدیریت کسب‌وکار و ارتباط با پروژه‌های ساختمانی
                            </p>
                        </div>
                    </div>
                    <Link href="/auth/business/form" className="w-full sm:w-auto">
                        <CustomButton shadow className="w-full sm:w-auto min-h-11! px-5! text-sm! whitespace-nowrap!">
                            تکمیل پروفایل کسب‌وکار
                        </CustomButton>
                    </Link>
                </div>
            </div>

            {/* Statistics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {Object.entries(BusinessChartData).map(([key, design], i) => {
                    const stat = statistics?.[key as keyof typeof statistics] || {
                        changes: 0,
                        current: 0,
                        last: 0,
                        values: [],
                    };
                    const c = stat.changes === 0 ? '#6B7771' : stat.changes < 0 ? '#f87171' : '#36B98A';

                    return (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-[#E7F5EE] shadow-[0_2px_12px_rgba(23,61,53,0.06)] p-4 lg:p-5 relative overflow-hidden"
                        >
                            <div className="flex flex-col gap-2 relative z-2">
                                <p className="text-xs lg:text-sm text-[#6B7771] font-medium">{design.title}</p>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <h3 className="text-lg lg:text-xl font-bold text-[#173D35]">
                                        {stat.current.toLocaleString('fa')}
                                    </h3>
                                    <span className="text-xs text-[#6B7771]">{design.unit}</span>
                                    {!!stat.changes && (
                                        <CustomBadge color={c}>
                                            %{stat.changes.toLocaleString('fa')}
                                        </CustomBadge>
                                    )}
                                </div>
                            </div>
                            <div className="absolute max-w-[120px] left-1 lg:left-2 bottom-1 top-0 my-auto h-full w-full flex items-center justify-end pointer-events-none opacity-60">
                                <ChartSvg data={stat.values || []} color={c} width={100} height={36} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {loading && (
                <p className="text-sm text-[#6B7771] text-center py-2">در حال بارگذاری آمار...</p>
            )}

            {/* Quick action cards */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-[#173D35]">دسترسی سریع</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                    {BusinessActions.map((action, i) => (
                        <Link
                            key={i}
                            href={action.href}
                            className="group bg-white rounded-2xl border border-[#E7F5EE] shadow-[0_2px_12px_rgba(23,61,53,0.06)] p-5 hover:border-[#36B98A]/40 transition-all flex flex-col gap-2"
                        >
                            <p className="font-bold text-[#173D35]">{action.title}</p>
                            <p className="text-sm text-[#6B7771] leading-relaxed">{action.description}</p>
                            <div className="flex items-center gap-1 text-[#36B98A] mt-1">
                                <span className="text-sm font-medium">{action.cta}</span>
                                <IconlyArrowLeft2 />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BusinessDashboardHome;
