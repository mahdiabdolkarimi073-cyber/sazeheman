'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { IconDots, IconHallowStar, IconLogout, IconMoon, IconSetting } from "@/components/ui/SVGs";
import Logo from "@/components/assets/Logo";
import Image from "next/image";
import { ActionIcon, Loader, NavLink, Popover, PopoverDropdown, PopoverTarget } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashIcon } from "@/app/(landing)/dashboard/_components/DashIcons";
import useUser, { refetchUser } from '@/lib/hooks/useUser';
import { logout } from '../../auth/action';
import { askConfirm } from '@/components/ui/modals/confirm';
import useTheme from "@/lib/hooks/useTheme";
import { useRouter } from 'next/navigation';
import { IconlyArrowLeft2 } from '@/components/assets/iconpack';
import { IconCharity, IconStore } from '@/components/ui/SVGs';

export const sazehemanItems = [
    {
        label: "منوی اصلی",
        items: [
            {
                label: "داشبورد",
                link: "",
                icon: <DashIcon name="dashboard" />
            },
            {
                label: "سازه‌های من",
                link: "my-projects",
                icon: <DashIcon name="tools" />
            },
            {
                label: "پنل کارکنان",
                link: "workers",
                icon: <DashIcon name="donations" />
            },
            {
                label: "پنل کارفرما",
                link: "creators",
                icon: <DashIcon name="tools" />
            },
            {
                label: "تبلیغات",
                link: "ads",
                icon: <DashIcon name="giftcards" />
            },
            {
                label: "مزایده",
                link: "auctions",
                icon: <DashIcon name="auctions" />
            },
            {
                label: "مدیریت محصولات",
                link: "products",
                icon: <DashIcon name="products" />
            },
        ]
    },
    {
        label: "حساب کاربری",
        items: [
            {
                label: "اطلاعات حساب من",
                link: "account",
                icon: <DashIcon name="dashboard" />
            },
            {
                label: "شغل‌های من",
                link: "my-businesses",
                icon: <DashIcon name="giftcards" />
            },
            {
                label: "اشتراک",
                link: "subscription",
                icon: <DashIcon name="subscription" />
            },
        ]
    },
] as const;

export const shoghlmanItems = [
    {
        label: "منوی اصلی",
        items: [
            {
                label: "داشبورد",
                link: "",
                icon: <DashIcon name="dashboard" />
            },
            {
                label: "شغل‌های من",
                link: "my-businesses",
                icon: <DashIcon name="giftcards" />
            },
            {
                label: "تبلیغات",
                link: "ads",
                icon: <DashIcon name="giftcards" />
            },
            {
                label: "مزایده",
                link: "auctions",
                icon: <DashIcon name="auctions" />
            },
            {
                label: "مدیریت محصولات",
                link: "products",
                icon: <DashIcon name="products" />
            },
        ]
    },
    {
        label: "حساب کاربری",
        items: [
            {
                label: "اطلاعات حساب من",
                link: "account",
                icon: <DashIcon name="dashboard" />
            },
            {
                label: "سازه‌های من",
                link: "my-projects",
                icon: <DashIcon name="tools" />
            },
            {
                label: "اشتراک",
                link: "subscription",
                icon: <DashIcon name="subscription" />
            },
        ]
    },
] as const;

function StreamerDashboardSidebar(props: any) {
    const pathname = usePathname();
    const router = useRouter();
    const activeLink = useMemo(() => pathname.split("/").slice(2).join("/") || "", [pathname]);
    const user = useUser();
    const [theme, setTheme] = useTheme();
    const accountType = user?.account_type || 'sazeheman';
    const DashSidebarItems = accountType === 'shoghlman' ? shoghlmanItems : sazehemanItems;
    const isMobile = !!props?.mobile;

    return (
        <div className={isMobile ? "grow flex flex-col h-full" : "hidden lg:block sticky top-5 self-start"}
            style={!isMobile ? { height: "calc(100vh - 40px)" } : undefined}>
            <div className={`flex flex-col h-full ${isMobile ? "" : "w-[280px]"} bg-white rounded-2xl border border-[#E7F5EE] shadow-[0_2px_12px_rgba(23,61,53,0.06)] overflow-hidden`}>
                {/* Logo / Header */}
                {!isMobile && (
                    <div className="px-5 pt-5 pb-3 border-b border-[#E7F5EE]">
                        <Logo />
                    </div>
                )}

                {/* Account type badge */}
                <div className="px-5 py-3">
                    <div className="flex items-center gap-2.5 rounded-xl bg-[#E7F5EE] px-3 py-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#36B98A]/15 flex items-center justify-center shrink-0">
                            {accountType === 'shoghlman' ? <IconStore width={18} height={18} /> : <IconCharity width={18} height={18} />}
                        </div>
                        <span className="text-sm font-semibold text-[#173D35]">
                            {accountType === 'shoghlman' ? 'حساب شغل من' : 'حساب سازه من'}
                        </span>
                    </div>
                </div>

                {/* Navigation items */}
                <div className="grow flex flex-col gap-1 px-3 overflow-y-auto">
                    {DashSidebarItems.map((section, i) => (
                        <div key={i} className="flex flex-col gap-1">
                            <p className="text-xs font-medium text-[#6B7771] px-3 pt-2 pb-1">{section.label}</p>
                            {section.items.map((item, j) => {
                                const active = !item.link ? item.link === activeLink : activeLink.startsWith(item.link);
                                const link = '/dashboard/' + item.link;
                                return (
                                    <Link
                                        href={link}
                                        key={j}
                                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors min-h-11 ${
                                            active
                                                ? 'bg-[#36B98A]/10 text-[#173D35] font-semibold'
                                                : 'text-[#252C2A] hover:bg-[#F7F8F6]'
                                        }`}
                                    >
                                        <span className={`shrink-0 ${active ? 'text-[#36B98A]' : 'text-[#6B7771]'}`}>
                                            {item.icon}
                                        </span>
                                        <span className="text-sm">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* User profile section */}
                <div className="px-3 pb-3 pt-2 border-t border-[#E7F5EE]">
                    <div className="flex items-center justify-between rounded-xl bg-[#F7F8F6] px-3 py-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <Image
                                src={"/pics/design/default-avatar.png"}
                                alt={user?.phone ?? "user"}
                                width={100}
                                height={100}
                                className="rounded-full shrink-0"
                                style={{ width: "36px", height: "36px" }}
                            />
                            <div className="min-w-0">
                                <p className="text-sm font-semibold truncate text-[#252C2A]">
                                    {user?.phone || "کاربر #" + user?.id}
                                </p>
                                {user?.plan === "partner" && (
                                    <div className="flex items-center gap-1 text-[#36B98A]">
                                        <IconHallowStar style={{ width: "14px", height: "14px" }} />
                                        <span className="text-xs">پارتنر</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Popover position="top" closeOnClickOutside closeOnEscape>
                            <PopoverTarget>
                                <ActionIcon
                                    color={'rgb(from var(--text-color) r g b / 0.7)'}
                                    radius={'md'}
                                    variant={'transparent'}
                                    size="sm"
                                >
                                    <IconDots color='currentColor' />
                                </ActionIcon>
                            </PopoverTarget>
                            <PopoverDropdown className="p-1!">
                                <div className="w-40">
                                    <Link href={'/dashboard/settings'}>
                                        <NavLink
                                            className="justify-start! w-full"
                                            label="تنظیمات"
                                            leftSection={<IconSetting color={'currentColor'} />}
                                        />
                                    </Link>
                                    <NavLink
                                        className="justify-start! w-full"
                                        label={theme === "light" ? "حالت تاریک" : "حالت روشن"}
                                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                                        leftSection={<IconMoon width={"20px"} height={"20px"} color={'currentColor'} />}
                                    />
                                    <NavLink
                                        className="justify-start! w-full text-red-600!"
                                        label="خروج"
                                        onClick={async () => {
                                            await askConfirm("آیا میخواهید خارج شوید؟")
                                            window.userToken = undefined;
                                            await logout();
                                            window.routerPush("/");
                                            await refetchUser();
                                        }}
                                        leftSection={<IconLogout stroke='currentColor' />}
                                    />
                                </div>
                            </PopoverDropdown>
                        </Popover>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default StreamerDashboardSidebar;
