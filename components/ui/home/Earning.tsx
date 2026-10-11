'use client';

import React, {useEffect, useState} from 'react';
import Image from "next/image"
import CustomButton from "@/components/ui/base/CustomButton";

export default function Earning() {
    const [active, setActive] = useState(0);

    const floats = [
        <div className={'flex flex-col gap-1 box'} key={'1'}>
            <div className="flex justify-between items-center text-sm">
                <p className={'text-primary font-semibold'}>پروژه جدید</p>
                <p className={''}>درخواست خدمات</p>
            </div>
            <div className="flex justify-between items-center">
                <strong>کسری</strong>
                <p className={'text-sm'}>نصب آسانسور</p>
            </div>
            <p className={'text-justify text-sm leading-relaxed'}>
                تجربه خیلی خوبی بود! پروژه‌ام را ثبت کردم و پیمانکاران سریع تماس گرفتند.
                قیمت‌ها و زمان‌بندی واضح بود و همه چیز طبق برنامه پیش رفت.
            </p>
        </div>,
        <div className={'flex flex-col gap-1 box min-w-70'} key={'2'}>
            <div className="flex justify-between items-center text-sm">
                <p className={'text-primary font-semibold'}>پروژه جدید</p>
                <p className={''}>درخواست مصالح</p>
            </div>
            <div className="flex justify-between items-center">
                <strong>علی</strong>
                <p className={'text-sm'}>آجر و سیمان</p>
            </div>
        </div>,
        <div className={'box flex items-center min-w-64 justify-between'} key={"3"}>
            <p className="font-bold">{(2_300_000).toLocaleString('fa')} <span className="text-sm font-normal opacity-60">تومان</span></p>
            <CustomButton shadow className="text-sm!">
                تایید دریافت
            </CustomButton>
        </div>,
        <div className={'flex flex-col gap-1 box'} key={'4'}>
            <div className="flex justify-between items-center text-sm">
                <p className={'text-primary font-semibold'}>پروژه جدید</p>
                <p className={''}>درگاه آنلاین</p>
            </div>
            <div className="flex justify-between items-center">
                <strong>حسین</strong>
                <p className={'text-sm'}>{(750_000).toLocaleString('fa')} تومان</p>
            </div>
            <p className={'text-justify text-sm leading-relaxed'}>
                ثبت سفارش و درخواست خدمات خیلی ساده بود. همه چیز شفاف و سریع انجام شد،
                حتی گزارش پیشرفت پروژه را لحظه‌ای می‌دیدم.
            </p>
        </div>,
        <div className={'flex flex-col gap-1 box min-w-70'} key={'5'}>
            <div className="flex justify-between items-center text-sm">
                <p className={'text-primary font-semibold'}>پروژه جدید</p>
                <p className={''}>خدمات ویژه</p>
            </div>
            <div className="flex justify-between items-center">
                <strong>پارسا</strong>
                <p className={'text-sm'}>نقشه و طراحی داخلی</p>
            </div>
        </div>,
        <div className={'box flex items-center min-w-64 justify-start gap-3'} key={"6"}>
            <strong className="text-primary">{(32_000).toLocaleString('fa')}</strong>
            <p className="text-sm">بازدید صفحه پروژه</p>
        </div>,
    ];

    const gap = 250;
    const positions = [
        (active === 2 || active === 5) ? `-${gap * 0.5}px,-${gap * 0.8}px` : `-${gap * 0.5}px,-${gap}px`,
        `-${gap * 1.2}px,-10px`,
        (active === 4 || active === 1) ? `-${gap * 0.5}px,${gap * 0.8}px` : `-${gap * 0.5}px,${gap * 0.7}px`,
        `${gap * 0.75}px,${gap * 0.9}px`,
        `${gap * 1.2}px,${gap * 0.05}px`,
        `${gap * 0.7}px,-${gap * 0.8}px`,
    ];

    useEffect(() => {
        const thread = setInterval(() => {
            setActive((prev) => (prev + 1) % positions.length);
        }, 2500);
        return () => clearInterval(thread);
    }, []);

    const getIndex = (i: number) => (i + active) % positions.length;

    return (
        <div className="relative py-20 overflow-hidden bg-background">
            {/* Decorative gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, var(--primary-light) 0%, transparent 70%)" }} />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }} />

            <div className="min-h-[70vh] relative flex flex-col items-center justify-center max-w-7xl mx-auto px-4">
                <div className={'flex flex-col justify-center items-center gap-5 mb-10'}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-dark text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        مدیریت پروژه‌ها
                    </div>
                    <h2 className="text-gradient text-4xl lg:text-5xl font-extrabold text-center max-w-146"
                        style={{ lineHeight: "1.3" }}>
                        درآمد در
                        دنیای ساخت‌وساز
                    </h2>
                    <p className="text-center w-full max-w-150 opacity-70 leading-relaxed">
                        با یک لینک ساده، طرفدارها مستقیماً از شما حمایت می‌کنند؛ هر کمک‌هزینه همراه پیام و نام حامی ذخیره می‌شود تا قدردانی کنید.
                    </p>
                    <CustomButton color={'black'} bg={'white'} className={'font-medium! px-6! py-2.5! mt-2'}>
                        راهنمای استفاده
                    </CustomButton>
                </div>

                <div className="relative w-full max-w-4xl">
                    <div className="ball" />
                    <div className="content relative">
                        <div className={'float w-full h-full'}>
                            <div className="absolute inset-0 rounded-full opacity-5"
                                style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }} />
                        </div>
                        {floats.map((o, i) => (
                            <div
                                key={i}
                                className="float absolute transition-all duration-700"
                                style={{
                                    transform: `translate(${positions[getIndex(i)]})`,
                                }}
                            >
                                {o}
                            </div>
                        ))}
                        <div className="center">
                            <div className="glass-card rounded-full p-2 flex gap-2 items-center glow-primary">
                                <Image className="rounded-full" width={50} height={50} src={'/pics/design/default-avatar.png'} alt={'streamer'} />
                                <p className="text-base font-semibold pl-5">
                                    کارفرما جدید
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
