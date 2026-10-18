'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { adminLogout } from '../login/action';
import {
    IconDashboard, IconHardHat, IconBuilding, IconUsers,
    IconShoppingBag, IconGavel, IconMegaphone, IconTicket,
    IconCreditCard, IconLogout, IconMenu, IconX, IconArrowRight,
} from '@/components/assets/tabler-icons';

type NavItem = {
    href: string;
    label: string;
    icon: React.ReactNode;
    available: boolean;
};

const navItems: NavItem[] = [
    { href: '/admin', label: 'داشبورد', icon: <IconDashboard size={22} />, available: true },
    { href: '/admin/projects', label: 'مدیریت پروژه‌ها', icon: <IconHardHat size={22} />, available: true },
    { href: '/admin/businesses', label: 'مدیریت کسب‌وکارها', icon: <IconBuilding size={22} />, available: true },
    { href: '/admin/users', label: 'مدیریت کاربران', icon: <IconUsers size={22} />, available: true },
    { href: '/admin/shop', label: 'فروشگاه', icon: <IconShoppingBag size={22} />, available: false },
    { href: '/admin/auctions', label: 'مناقصات', icon: <IconGavel size={22} />, available: false },
    { href: '/admin/ads', label: 'تبلیغات', icon: <IconMegaphone size={22} />, available: false },
    { href: '/admin/tickets', label: 'تیکت‌ها', icon: <IconTicket size={22} />, available: false },
    { href: '/admin/payments', label: 'پرداخت‌ها', icon: <IconCreditCard size={22} />, available: false },
];

function AdminShell({ user, children }: { user: any; children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    const sidebar = (
        <div className="flex flex-col h-full w-full">
            <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10 shrink-0">
                <Link href="/admin" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                    <span className="text-lg font-bold">پنل مدیریت</span>
                </Link>
            </div>

            <nav className="flex flex-col gap-1 px-3 py-4 overflow-y-auto grow">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.available ? item.href : '#'}
                            onClick={(e) => {
                                if (!item.available) e.preventDefault();
                                setMobileOpen(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all min-h-11 ${
                                active
                                    ? 'bg-primary text-white font-medium'
                                    : item.available
                                        ? 'text-gray-300 hover:bg-white/5'
                                        : 'text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            <span className="flex-1">{item.label}</span>
                            {!item.available && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-400 shrink-0">
                                    به‌زودی
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-3 py-4 border-t border-white/10 shrink-0">
                <button
                    onClick={async () => {
                        setLoggingOut(true);
                        await adminLogout();
                        router.push('/admin/login');
                    }}
                    disabled={loggingOut}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all min-h-11 w-full"
                >
                    <IconLogout size={22} />
                    <span>{loggingOut ? 'در حال خروج...' : 'خروج از حساب'}</span>
                </button>
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-white/5 transition-all min-h-11"
                >
                    <IconArrowRight size={22} className="rotate-180" />
                    <span>بازگشت به سایت</span>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#0E1116] text-white" dir="rtl">
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-72 shrink-0 border-l border-white/10 sticky top-0 h-screen">
                {sidebar}
            </aside>

            {/* Mobile drawer */}
            {mobileOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="fixed right-0 top-0 z-50 h-screen w-72 bg-[#161A21] lg:hidden">
                        {sidebar}
                    </aside>
                </>
            )}

            {/* Main area */}
            <div className="flex flex-col grow min-w-0">
                {/* Header */}
                <header className="flex items-center justify-between gap-3 px-4 lg:px-6 py-4 border-b border-white/10 bg-[#161A21] sticky top-0 z-30">
                    <button
                        className="lg:hidden p-2 rounded-lg hover:bg-white/5 min-h-11 min-w-11 flex items-center justify-center"
                        onClick={() => setMobileOpen(true)}
                        aria-label="منو"
                    >
                        <IconMenu size={24} />
                    </button>

                    <div className="hidden lg:block text-sm text-gray-400">
                        پنل مدیریت سازه‌همان
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-sm text-left">
                            <div className="font-medium">{user.nickname || user.first_name || 'مدیر'}</div>
                            <div className="text-xs text-gray-500" dir="ltr">{user.phone}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                            {(user.nickname || user.first_name || 'م')[0]}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="grow px-4 lg:px-6 py-5 lg:py-6 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AdminShell;
