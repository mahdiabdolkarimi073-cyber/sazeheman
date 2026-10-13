'use client';

import React from 'react';
import Image from "next/image";
import { ActionIcon, Burger, Button, Drawer } from "@mantine/core";
import CustomButton from "@/components/ui/base/CustomButton";
import { IconMoneyDrop, IconMoon } from "@/components/ui/SVGs";
import DashboardNotifications from './DashboardNotifications';
import { useDisclosure } from '@mantine/hooks';
import Logo from '@/components/assets/Logo';
import StreamerDashboardSidebar from './StreamerDashboardSidebar';
import { usePathname } from 'next/navigation';
import { useDelayedEffect } from '@/lib/hooks/useEffect';
import useDevice from "@/lib/hooks/useDevice";
import useUser from '@/lib/hooks/useUser';
import Link from 'next/link';
import useTheme from "@/lib/hooks/useTheme";

function StreamerDashboardHeader() {

    const device = useDevice();
    const [opened, { close, open }] = useDisclosure(false);
    const pathname = usePathname();
    const user = useUser();
    const [theme, setTheme] = useTheme();
    const accountType = user?.account_type || 'sazeheman';
    const pageTitle = accountType === 'shoghlman' ? 'داشبورد شغل من' : 'داشبورد سازه من';

    useDelayedEffect(() => {
        close();
    }, [pathname], 100);

    return device === "mobile" ? (
        <div className='relative bg-white border-b border-[#E7F5EE]'>
            <div className='px-4 py-3 relative z-2'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Logo id="logo-mobile" width={100} />
                    </div>
                    <div className='flex items-center gap-3'>
                        <DashboardNotifications />
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="w-10 h-10 rounded-full bg-[#F7F8F6] flex items-center justify-center"
                        >
                            <IconMoon fill='var(--text-color)' width={'18px'} />
                        </button>
                        <Burger onClick={open} opened={opened} color={"#252C2A"} size={'sm'} />
                    </div>
                </div>
                <div className='mt-3 pt-3 border-t border-[#E7F5EE]'>
                    <h2 className='text-lg font-bold text-[#173D35]'>{pageTitle}</h2>
                    <p className='text-xs text-[#6B7771] mt-0.5'>
                        خوش آمدید{user?.phone ? `، ${user.phone}` : ''}
                    </p>
                </div>
            </div>
            <Drawer
                opened={opened}
                onClose={close}
                title="منوی داشبورد"
                position='right'
                padding="md"
                size={'85vw'}
                classNames={{ content: "flex items-stretch justify-stretch", body: "p-0!" }}
            >
                <StreamerDashboardSidebar mobile />
            </Drawer>
        </div>
    ) : (
        <div className='bg-white rounded-2xl border border-[#E7F5EE] shadow-[0_2px_12px_rgba(23,61,53,0.06)] px-5 py-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <div>
                    <h2 className='text-lg font-bold text-[#173D35]'>{pageTitle}</h2>
                    <p className='text-sm text-[#6B7771] mt-0.5'>
                        خوش آمدید{user?.phone ? `، ${user.phone}` : ''}
                    </p>
                </div>
            </div>
            <div className='flex items-center gap-3'>
                <DashboardNotifications />
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-10 h-10 rounded-full bg-[#F7F8F6] flex items-center justify-center hover:bg-[#E7F5EE] transition-colors"
                >
                    <IconMoon fill='var(--text-color)' width={'18px'} />
                </button>
                <Link href={"/dashboard/income"}>
                    <CustomButton shadow className="min-h-10! px-4! text-sm! whitespace-nowrap!">
                        <IconMoneyDrop />
                        <span>{(user?.balance || 0).toLocaleString('fa')} تومان</span>
                    </CustomButton>
                </Link>
            </div>
        </div>
    );
}

export default StreamerDashboardHeader;
