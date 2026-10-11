'use client';

import React from 'react';
import Image from "next/image";
import CustomButton from "@/components/ui/base/CustomButton";
import Link from "next/link";

function ShopIntro() {
    return (
        <div id="abilities" className="relative py-20 bg-background overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-dark text-sm font-medium mb-4">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        قابلیت‌ها
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
                        ساخت‌وساز خودتو تو
                        <span className="text-primary"> ۲ دقیقه </span>
                        سرعت بده
                    </h2>
                    <p className="text-base opacity-60 max-w-2xl mx-auto">
                        بدون نیاز به دانش فنی یا طراحی، ساخت‌وساز خودت رو قدرت بده و سازماندهی کن
                    </p>
                    <div className="flex gap-3 items-center justify-center mt-6">
                        <Link href="/dashboard">
                            <CustomButton shadow className="px-6! py-2.5!">
                                شروع کن
                            </CustomButton>
                        </Link>
                        <CustomButton variant="soft" className="px-6! py-2.5!">
                            مشاهده راهنما
                        </CustomButton>
                    </div>
                </div>

                {/* Feature cards */}
                <div className="grid max-w-6xl lg:grid-cols-3 grid-cols-1 gap-6 mx-auto">
                    {/* Card 1 - کارمزد منصفانه */}
                    <div className="glass-card rounded-3xl overflow-hidden hover-lift group">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">کارمزد منصفانه</h3>
                            <p className="opacity-70 text-sm leading-relaxed">
                                سازه من به کاربرانش تجربه‌ای امن با کارمزد معقول و منصفانه ارائه می‌دهد
                            </p>
                        </div>
                        <div className="relative h-40 flex items-center justify-center bg-gradient-to-t from-primary/5 to-transparent">
                            <Image
                                width={120}
                                height={120}
                                src="/pics/Gift.webp"
                                alt="کارمزد منصفانه"
                                className="object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    </div>

                    {/* Card 2 - سریع‌ترین تجربه */}
                    <div className="glass-card rounded-3xl overflow-hidden hover-lift group relative">
                        <div className="absolute inset-0 opacity-5"
                            style={{ background: "radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 70%)" }} />
                        <div className="p-6 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">سریع‌ترین تجربه در ایران!</h3>
                            <p className="opacity-70 text-sm leading-relaxed">
                                افزایش پیمانکار و مشاغل مربوط با سریع‌ترین روش ممکن
                            </p>
                        </div>
                        <div className="relative h-40 flex items-center justify-center bg-gradient-to-t from-primary/10 to-transparent">
                            <Image
                                width={140}
                                height={140}
                                src="/pics/verify.webp"
                                alt="سریع‌ترین تجربه"
                                className="object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    </div>

                    {/* Card 3 - جستجو و SEO */}
                    <div className="glass-card rounded-3xl overflow-hidden hover-lift group">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">جستجو و SEO</h3>
                            <p className="opacity-70 text-sm leading-relaxed">
                                صفحه ساخت‌وسازت برای نمایش بهتر در جستجوها و اشتراک‌گذاری در شبکه‌های اجتماعی بهینه است تا افراد راحت‌تر شما را پیدا کنند
                            </p>
                        </div>
                        <div className="relative h-40 flex items-center justify-center bg-gradient-to-t from-primary/5 to-transparent">
                            <Image
                                width={130}
                                height={130}
                                src="/pics/design/intro-search.png"
                                alt="جستجو و SEO"
                                className="object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShopIntro;
