'use client';

import React from 'react';
import Image from "next/image";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import {Autoplay, FreeMode} from "swiper/modules";

type Comment = {
    name: string;
    avatar: string;
    text: string;
    role: string;
};
const comments: Comment[] = [
    {
        name: "محمدرضا کریمی",
        avatar: "/pics/design/default-avatar.png",
        role: "سازنده پروژه",
        text: "از طریق سازه من خیلی سریع تونستم برای پروژه‌ام پیمانکار مناسب پیدا کنم، واقعا کاربردیه."
    },
    {
        name: "سارا احمدی",
        avatar: "/pics/design/default-avatar.png",
        role: "مدیر پروژه",
        text: "نمایش پروژه‌ها روی نقشه باعث شد راحت‌تر پروژه‌های نزدیک محل کارم رو پیدا کنم."
    },
    {
        name: "علی موسوی",
        avatar: "/pics/design/default-avatar.png",
        role: "پیمانکار",
        text: "به عنوان پیمانکار، بدون هزینه تبلیغات تونستم چند پروژه جدید بگیرم."
    },
    {
        name: "مهدی رضایی",
        avatar: "/pics/design/default-avatar.png",
        role: "سازنده",
        text: "ارتباط مستقیم با سازنده باعث شد پروژه سریع‌تر و با هزینه کمتر انجام بشه."
    },
    {
        name: "زهرا مرادی",
        avatar: "/pics/design/default-avatar.png",
        role: "معمار",
        text: "اطلاعات پروژه‌ها کامل و شفاف بود، تصمیم‌گیری رو خیلی راحت‌تر کرد."
    },
    {
        name: "امیرحسین شریفی",
        avatar: "/pics/design/default-avatar.png",
        role: "مهندس",
        text: "به راحتی تونستم خدمات مهندسی خودم رو معرفی کنم و با سازندگان شهرم ارتباط بگیرم."
    },
    {
        name: "نگار محمدی",
        avatar: "/pics/design/default-avatar.png",
        role: "سازنده پروژه",
        text: "ثبت پروژه خیلی سریع انجام شد و بلافاصله پیشنهاد همکاری دریافت کردم."
    },
    {
        name: "رضا سلطانی",
        avatar: "/pics/design/default-avatar.png",
        role: "پیمانکار",
        text: "سازه من بهترین راه برای پیدا کردن پروژه‌های ساختمانی فعال در شهرم بود."
    },
    {
        name: "فاطمه حسینی",
        avatar: "/pics/design/default-avatar.png",
        role: "طراح داخلی",
        text: "همه چیز آنلاین، ساده و بدون اتلاف وقت انجام شد، تجربه بسیار خوبی داشتم."
    }
];

function Comments() {
    return (
        <div className="relative py-20 bg-background overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }} />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-dark text-sm font-medium mb-4">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        نظرات کاربران
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
                        رضایت همکاران و پیمانکاران
                    </h2>
                    <span className="inline-block text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 mb-3">
                        نمونه نمایشی
                    </span>
                    <p className="text-base opacity-60 max-w-2xl mx-auto">
                        تجربه کاربران سازه‌همان را اینجا بخوانید. نظرات نشان‌داده‌شده نمونه هستند و نظرات واقعی پس از راه‌اندازی کامل نمایش داده می‌شوند.
                    </p>
                </div>

                {/* Comment rows */}
                <div className="relative">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="py-3">
                            <Swiper
                                freeMode
                                centeredSlides={false}
                                slidesPerView={'auto'}
                                autoplay={{
                                    delay: 2000 + (100 * i),
                                    waitForTransition: true,
                                    reverseDirection: i === 1,
                                }}
                                spaceBetween={24}
                                loop
                                modules={[FreeMode, Autoplay]}
                                breakpoints={{
                                    1000: {
                                        slidesOffsetBefore: 200 * i
                                    }
                                }}
                            >
                                {comments.map((comment, idx) => (
                                    <SwiperSlide key={idx} className={'w-full max-w-[340px]'}>
                                        <div className="mx-auto flex justify-center">
                                            <Card comment={comment} />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Card({ comment }: { comment: Comment }) {
    return (
        <div className="glass-card rounded-2xl p-5 hover-lift" style={{
            width: "340px",
            minHeight: "180px"
        }}>
            <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                    <Image src={comment.avatar} alt={comment.name} height={48} width={48} className="rounded-full" />
                    <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div>
                    <p className="font-bold text-base">{comment.name}</p>
                    <p className="text-sm text-primary-dark opacity-80">{comment.role}</p>
                </div>
            </div>
            <p className="text-base text-[#4f5b56] leading-[1.9]">
                {comment.text}
            </p>
        </div>
    )
}

export default Comments;
