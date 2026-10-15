'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader, Center } from '@mantine/core';
import {
    IconUsers, IconHardHat, IconBuilding, IconClock,
    IconArrowRight,
} from '@/components/assets/tabler-icons';
import { api } from '@/lib/api/base';
import { toPersianNumber } from '@/lib/utils/global';

type Stats = {
    users: number;
    projects: number;
    businesses: number;
    pending: {
        projects: number;
        businesses: number;
    };
};

type StatCard = {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    href?: string;
    sub?: string;
};

function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api('/admin', { section: 'stats' }, 'GET')
            .then((res) => setStats(res.data?.stats))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Center className="min-h-[60vh]">
                <Loader size="lg" />
            </Center>
        );
    }

    if (!stats) {
        return (
            <Center className="min-h-[60vh]">
                <p className="text-gray-400">خطا در دریافت آمار</p>
            </Center>
        );
    }

    const cards: StatCard[] = [
        {
            label: 'کل کاربران',
            value: stats.users,
            icon: <IconUsers size={28} />,
            color: 'text-blue-400 bg-blue-500/10',
            href: '/admin/users',
        },
        {
            label: 'کل پروژه‌ها',
            value: stats.projects,
            icon: <IconHardHat size={28} />,
            color: 'text-amber-400 bg-amber-500/10',
            href: '/admin/projects',
        },
        {
            label: 'کل کسب‌وکارها',
            value: stats.businesses,
            icon: <IconBuilding size={28} />,
            color: 'text-green-400 bg-green-500/10',
            href: '/admin/businesses',
        },
        {
            label: 'پروژه‌های در انتظار',
            value: stats.pending.projects,
            icon: <IconClock size={28} />,
            color: 'text-orange-400 bg-orange-500/10',
            href: '/admin/projects',
            sub: 'نیاز به بررسی',
        },
        {
            label: 'کسب‌وکارهای در انتظار',
            value: stats.pending.businesses,
            icon: <IconClock size={28} />,
            color: 'text-orange-400 bg-orange-500/10',
            href: '/admin/businesses',
            sub: 'نیاز به بررسی',
        },
    ];

    return (
        <div className="flex flex-col gap-6 max-w-5xl w-full">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold">داشبورد مدیریت</h1>
                <p className="text-gray-400 text-sm mt-1">
                    نمای کلی آمار سایت و موارد نیازمند بررسی
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => {
                    const content = (
                        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#161A21] p-5 hover:border-white/20 transition-all">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                                {card.icon}
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="text-2xl font-bold">{toPersianNumber(card.value)}</span>
                                <span className="text-sm text-gray-400">{card.label}</span>
                                {card.sub && <span className="text-xs text-orange-400">{card.sub}</span>}
                            </div>
                        </div>
                    );
                    return card.href ? (
                        <Link key={card.label} href={card.href}>{content}</Link>
                    ) : (
                        <div key={card.label}>{content}</div>
                    );
                })}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#161A21] p-5 flex flex-col gap-3">
                <h2 className="text-lg font-semibold">اقدامات سریع</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/admin/projects"
                        className="flex items-center justify-between gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5 transition-all flex-1 min-h-11"
                    >
                        <span>بررسی پروژه‌های در انتظار</span>
                        <IconArrowRight size={18} className="rotate-180" />
                    </Link>
                    <Link
                        href="/admin/businesses"
                        className="flex items-center justify-between gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5 transition-all flex-1 min-h-11"
                    >
                        <span>بررسی کسب‌وکارهای در انتظار</span>
                        <IconArrowRight size={18} className="rotate-180" />
                    </Link>
                    <Link
                        href="/admin/users"
                        className="flex items-center justify-between gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm hover:bg-white/5 transition-all flex-1 min-h-11"
                    >
                        <span>مدیریت کاربران</span>
                        <IconArrowRight size={18} className="rotate-180" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
