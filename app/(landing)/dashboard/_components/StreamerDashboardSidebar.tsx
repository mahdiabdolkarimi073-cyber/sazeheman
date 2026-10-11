'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { IconDots, IconHallowStar, IconLogout, IconMoon, IconSetting } from "@/components/ui/SVGs";
import Logo from "@/components/assets/Logo";
import Image from "next/image";
import { ActionIcon, Loader, NavLink, Popover, PopoverDropdown, PopoverTarget } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import StyledDiv from "@/components/helper/StyledDiv";
import { DashIcon } from "@/app/(landing)/dashboard/_components/DashIcons";
import useUser, { refetchUser } from '@/lib/hooks/useUser';
import { logout } from '../../auth/action';
import { askConfirm } from '@/components/ui/modals/confirm';
import { customStyle } from '@/components/ui/utils';
import { useLinkLoader } from "@/components/helper/LinkLoader";
import useTheme from "@/lib/hooks/useTheme";
import { useRouter } from 'next/navigation';


export const sazehemanItems = [
    {
        label: "",
        items: [
            {
                label: "داشبورد",
                link: "",
                icon: <DashIcon name="dashboard" />
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
            }
        ]
    },
] as const;

export const shoghlmanItems = [
    {
        label: "",
        items: [
            {
                label: "داشبورد",
                link: "",
                icon: <DashIcon name="dashboard" />
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
            {
                label: "اشتراک",
                link: "subscription",
                icon: <DashIcon name="subscription" />
            }
        ]
    },
] as const;

function StreamerDashboardSidebar(props: any) {
    const pathname = usePathname();
    const router = useRouter();
    const activeLink = useMemo(() => pathname.split("/").slice(2).join("/") || "", [pathname]);
    const user = useUser();
    const [theme, setTheme] = useTheme();
    const linkLoading = useLinkLoader();
    const accountType = user?.account_type || 'sazeheman';
    const DashSidebarItems = accountType === 'shoghlman' ? shoghlmanItems : sazehemanItems;

    return (
        <div className={`max-h-(--m) sticky bottom-5 top-5 ${props?.mobile ? "grow" : "hidden lg:block"}`}
            style={customStyle({
                "--m": "calc(100vh - 40px)"
            })}>
            <div
                className={`relative overflow-hidden rounded-2xl min-w-75 h-full flex-col flex justify-stretch content-stretch items-stretch bg-white/30`}>
                {!props.mobile && (
                    <div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{
                            background: `linear-gradient(0deg, var(--primary) 0%,${theme === 'dark' ? "var(--sidebar)" : "#e4e4e4"} 70%)`,
                            WebkitMask:
                                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                            WebkitMaskComposite: "xor",
                            maskComposite: "exclude",
                            padding: "1px"
                        }}
                    />
                )}

                <div
                    style={{ width: props.mobile ? "" : "300px" }}
                    className="p-5 rounded-2xl h-full flex flex-col gap-3 justify-between items-between relative"
                >
                    {!props.mobile && (
                        <div className="flex items-center gap-2">
                            <Logo  />
                            {/* <p className="bg-primary px-3 text-light rounded-full py-0.5">بتا</p> */}
                        </div>
                    )}
                    {accountType === 'sazeheman' ? 'سازه من' : 'شغل من'}
                    <div className={'grow flex flex-col gap-3'}>
                        {DashSidebarItems.map((o, i) => (
                            <div key={i}>
                                <p className={`text-black/70 text-sm mb-1`}>{o.label}</p>
                                <div className={'flex flex-col gap-1'}>
                                    {o.items.map((o, i) => {
                                        const active = !o.link ? o.link === activeLink : activeLink.startsWith(o.link);
                                        const link = '/dashboard/' + o.link;
                                        return (
                                            <Link href={link} key={i} className={'relative'}>
                                                {active && (
                                                    <div>
                                                        <div
                                                            className="absolute inset-0 rounded-xl p-0.5 pointer-events-none"
                                                            style={{
                                                                background: "linear-gradient(270deg, var(--primary) 0%,transparent 50%)",
                                                                WebkitMask:
                                                                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                                                WebkitMaskComposite: "xor",
                                                                maskComposite: "exclude",
                                                                zIndex: -1
                                                            }}
                                                        />
                                                        <div
                                                            className="absolute inset-0 rounded-xl p-0.5 pointer-events-none opacity-40"
                                                            style={{
                                                                background: "linear-gradient(270deg, var(--primary) 0%,transparent 100%)",
                                                                zIndex: -1
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div className={'cursor-pointer flex items-start gap-2 py-3 px-2 sidebar-item'}>
                                                    {linkLoading === link ? (
                                                        <Loader size={20} />
                                                    ) : (
                                                        <StyledDiv base={"." + (o.link || "main")} style={{
                                                            color: active ? "var(--primary)" : theme === "dark" ? "unset" : "#52525C"
                                                        }}>
                                                            {o.icon}
                                                        </StyledDiv>
                                                    )}
                                                    <p className={'text-sm'}>{o.label}</p>
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div
                        className="mt-5 rounded-xl px-3 py-1 flex justify-between items-center bg-white backdrop-blur-sm">
                        <div className="flex items-center">
                            <Image
                                src={"/pics/design/default-avatar.png"}
                                alt={user?.phone ?? "user"}
                                width={100}
                                height={100}
                                className="rounded-full"
                                style={{
                                    width: "36px",
                                    height: "36px",
                                }}
                            />
                            <div className="p-2 font-semibold min-h-13 flex flex-col justify-center">
                                <p className="text-sm">{user?.phone || "کاربر #" + user?.id}</p>
                                {user?.plan === "partner" && (
                                    <div className="rounded-full items-center text-[#007A55] flex justify-start gap-1">
                                        <IconHallowStar
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                            }}
                                        />
                                        <p className="text-xs">پارتنر</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Popover position="top" closeOnClickOutside closeOnEscape>
                            <PopoverTarget>
                                <div className={' rounded-xl p-0.5'}>
                                    <ActionIcon
                                        color={'rgb(from var(--text-color) r g b / 0.7)'}
                                        radius={'md'}
                                        variant={'transparent'}
                                        classNames={{
                                            root: "sidebar-userdots"
                                        }}
                                    >
                                        <IconDots color='currentColor' />
                                    </ActionIcon>
                                </div>
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
                                        label={theme === "light" ? "دارک مود" : "لایت مود"}
                                        onClick={() => {
                                            setTheme(theme === "light" ? "dark" : "light")
                                        }}
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
            {!props.mobile && (
                <div
                    className={`absolute -right-10 bottom-0 w-full opacity-50 h-full z-10`}
                    style={{
                        zIndex: -1,
                        filter: "blur(150px)",
                        background:
                            theme === "dark" ?
                                "linear-gradient(0deg, var(--primary) 35%,transparent 100%)" :
                                'linear-gradient(0deg, var(--primary) 35%, var(--secondary, #7CCF00) 40%,#ffffff 100%'
                    }}
                />
            )}
        </div>
    );
}


export default StreamerDashboardSidebar;