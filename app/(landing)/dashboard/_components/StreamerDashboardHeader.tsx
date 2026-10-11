'use client';

import React from 'react';
import Image from "next/image";
import { ActionIcon, Burger, Button, Drawer } from "@mantine/core";
import CustomButton from "@/components/ui/base/CustomButton";
import { IconLink, IconMoneyDrop, IconMoon } from "@/components/ui/SVGs";
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
    const [theme,setTheme] = useTheme();

    useDelayedEffect(() => {
        close();
    }, [pathname], 100);

    return device === "mobile" ? (
        <div className='relative'>
            {/*<div
                className='absolute left-0 top-0 w-full h-100 -z-1'
                style={{
                    background: "linear-gradient(var(--deg, 180deg), var(--from, var(--primary)) -150%, var(--to, transparent) 80%)"
                }}
            />*/}
            <div className='bg-white/30 backdrop-blur p-2 relative z-2'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Logo id="logo-mobile" width={100} />
                        {/* <p className="bg-primary px-3 text-light rounded-full py-0.5">بتا</p> */}
                    </div>
                    <div className='flex items-center gap-2'>
                        <DashboardNotifications />
                        <Burger onClick={open} opened={opened} color={"rgb(from var(--text-color) r g b / 0.5)"} size={'sm'} />
                    </div>
                </div>
            </div>
            <Drawer opened={opened} onClose={close} title="منو" position='right' padding="md" size={'90vw'}
                classNames={{ content: "pl-2 flex items-stretch justify-stretch", body: "p-0!" }}>
                <StreamerDashboardSidebar mobile />
            </Drawer>
        </div>
    ) : (
        <div className={'flex items-center justify-between'}>
            <div className={'flex justify-between items-center w-50'}>
                <Link href={'/dashboard'}>
                    <div className={'flex items-center gap-3'}>
                        <Image
                            src={'/pics/design/default-avatar.png'}
                            alt={user?.nickname ?? "user"}
                            width={50}
                            height={50}
                            style={{
                                width: "40px",
                                height: '40px'
                            }}
                            className={'rounded-full'}
                        />
                        <div>
                            <p className={'font-semibold text-sm'}>{user?.phone}</p>
                        </div>
                    </div>
                </Link>
                {/* <Popover closeOnClickOutside closeOnEscape>
                    <PopoverTarget>
                        <CustomButton bg={'transparent'} className={'border border-b1 rounded-xl!'} x={6} y={5}>
                            <IconArrowUpDown />
                        </CustomButton>
                    </PopoverTarget>
                    <PopoverDropdown>
                        <div className={'flex flex-col gap-3 w-30'}>
                            {["Nichoqu", "Kourosh Qafari"].map((o, i) => (
                                <div key={i} className={'flex items-center gap-3 hover:opacity-70 cursor-pointer'}>
                                    <Image
                                        src={user?.avatar || '/pics/design/default-avatar.png'}
                                        alt={'nichoqu'}
                                        width={50}
                                        height={50}
                                        style={{
                                            width: "25px",
                                            height: '25px'
                                        }}
                                        className={'rounded-full'}
                                    />
                                    <p className={'truncate text-xs opacity-70'}>{o}</p>
                                </div>
                            ))}
                        </div>
                    </PopoverDropdown>
                </Popover> */}
            </div>
            <div className={'flex items-center gap-4'}>
                <DashboardNotifications />
                <ActionIcon
                    variant='light'
                    classNames={{
                        root: "bg-container! rounded-full!"
                    }}
                    size='lg'
                    color='var(--text-color)'
                    onClick={() => {
                        setTheme(theme === "dark" ? "light" : "dark")
                    }}
                >
                    <IconMoon fill='var(--text-color)' width={'20px'} />
                </ActionIcon>
                <Link href={"/dashboard/income"}>
                    <CustomButton shadow>
                        <IconMoneyDrop />
                        <p className={'text-sm'}>موجودی: {(user?.balance || 0).toLocaleString('fa')} تومان</p>
                    </CustomButton>
                </Link>
            </div>
        </div>
    );
}

export default StreamerDashboardHeader;