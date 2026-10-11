"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Iconlyuser } from '@/components/assets/iconpack';
import Logo from '../../assets/Logo';
import { usePathname } from 'next/navigation';
import { useWindowScroll } from "@mantine/hooks";
import CustomButton from "@/components/ui/base/CustomButton";
import Link from "next/link";
import useUser from '@/lib/hooks/useUser';
import { Burger } from '@mantine/core';
import { ThemeChanger } from '@/components/helper/ThemeDetector';

const defaultNavigation = [
    {name: 'خانه', href: '/'},
    {name: 'دسته‌بندی مشاغل', href: '/#categories'},
    {name: 'نقشه و پروژه‌ها', href: '/#map'},
    {name: 'مزایده‌ها', href: '/#tenders'},
    {name: 'تعرفه‌ها', href: '/#plans'},
    {name: "وبلاگ", href: "/blog"},
    {name: 'تماس با ما', href: '/contact'},
];
const defaultAction = (exists = false) => exists ? (
    <Link href='/dashboard'>
        <CustomButton shadow className={'big'}>
            <Iconlyuser size={24}/>
            داشبورد
        </CustomButton>
    </Link>
) : (
    <div className='hidden md:flex gap-2 items-center'>
        <Link href={'/auth'}>
            <CustomButton variant="soft" className={'big'}>
                ورود
            </CustomButton>
        </Link>
        <Link href={'/auth'}>
            <CustomButton shadow className={'big'}>
                <Iconlyuser size={24}/>
                ثبت نام
            </CustomButton>
        </Link>
    </div>
)

const Header = (props: {
    items?: typeof defaultNavigation;
    action?: React.ReactNode;
    fixPaths?: string[],
    fixed?: boolean
}) => {
    const user = useUser();
    const {
        items: navigationItems = defaultNavigation,
        action = defaultAction(!!user),
        fixPaths = ["/"],
        fixed = false
    } = props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const [{y}] = useWindowScroll();
    const pathname = usePathname();
    const isFixed = useMemo(() => {
        return fixed || fixPaths.includes(pathname);
    }, [y, pathname, fixPaths]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 10);
        };

        window.addEventListener('scroll', handleScroll, {passive: true});
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header
            ref={headerRef}
            className={`py-3 ${isFixed ? "fixed" : "sticky"} w-full top-0 z-20 transition-all duration-500 ease-out ${
                isScrolled
                    ? 'bg-white/95 dark:bg-[#0E0F0F]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(23,61,53,0.12)] border-b border-[rgba(23,61,53,0.12)]'
                    : pathname === '/' ? 'bg-[#173D35]/80 backdrop-blur-sm text-white' : 'bg-transparent'
            } ${isMobileMenuOpen
                ? 'md:bg-transparent bg-container! open'
                : 'bg-transparent'
            }`}
        >
            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-10">
                        <div ref={logoRef} className="shrink-0 transition-transform duration-300 hover:scale-105">
                            <Logo width={60} />
                        </div>

                        <nav ref={navRef} className="hidden md:flex space-x-0 gap-1">
                            {navigationItems.map((item) => {
                                const hash = typeof window !== 'undefined' ? window.location.hash : "";
                                const isActive = pathname + hash === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`relative! px-4! py-2! rounded-full! text-sm! font-medium! transition-all! duration-300! ${
                                            isActive
                                                ? 'bg-primary/15! text-primary-dark! backdrop-blur-sm!'
                                                : 'opacity-65! hover:opacity-100! hover:bg-primary/8!'
                                        }`}
                                        style={{
                                            fontWeight: isActive ? 700 : 500,
                                        }}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4 space-x-reverse">
                        <div ref={buttonRef} className="hidden md:flex gap-3 items-center">
                            <ThemeChanger/>
                            {action}
                        </div>

                        <div className="md:hidden flex gap-3 items-center">
                             <ThemeChanger/>
                            <Burger
                                onClick={toggleMobileMenu}
                                color="var(--text-color)"
                                opened={isMobileMenuOpen}
                            />
                        </div>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden fixed top-full left-0 right-0 bg-container shadow-2xl h-screen z-50 overflow-y-auto">
                        <div className="px-4 py-6 flex flex-col">
                            <div className="flex flex-col gap-2">
                                {navigationItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => {
                                                setIsMobileMenuOpen(false)
                                            }}
                                            className={`block px-5 py-3 text-base font-medium rounded-2xl transition-all duration-300 ${
                                                isActive
                                                    ? 'bg-primary/15! text-primary-dark! font-bold!'
                                                    : 'text-black/70! hover:bg-primary/8! hover:text-primary-dark!'
                                            }`}
                                            style={{
                                                fontWeight: isActive ? 700 : 500,
                                            }}
                                        >
                                            {item.name}
                                        </a>
                                    );
                                })}
                            </div>
                            <div className="pt-4">
                                {action}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
