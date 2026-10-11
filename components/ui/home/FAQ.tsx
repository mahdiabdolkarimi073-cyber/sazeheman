'use client';

import React, {useState} from 'react';
import CustomButton from "@/components/ui/base/CustomButton";
import {IconShop, IconX} from "@/components/ui/SVGs";
import Link from "next/link";

export const MAIN_FAQ = [
    {
        title: "سازه‌همان چه خدماتی ارائه می‌دهد؟",
        content: "سازه‌همان پلتفرمی برای ارتباط سازندگان و صاحبان پروژه‌های ساختمانی با پیمانکاران، متخصصان و فروشندگان مصالح تأییدشده است. ثبت پروژه، جستجوی مشاغل روی نقشه، مزایده و مدیریت ارتباطات همه در یک پلتفرم."
    },
    {
        title: "چطور پروژه ساختمانی ثبت کنم؟",
        content: "با کلیک روی «ثبت سازه من»، اطلاعات پروژه، نیازمندی‌های ساختمانی و موقعیت روی نقشه را وارد می‌کنید. پس از بررسی و تأیید مدیر، پروژه شما برای متخصصان مرتبط قابل مشاهده می‌شود."
    },
    {
        title: "چطور شغل خودم را ثبت کنم؟",
        content: "با کلیک روی «ثبت شغل من»، ابتدا شماره تلفن خود را تأیید می‌کنید، سپس اطلاعات کسب‌وکار و تخصص‌های خود را وارد می‌کنید و پلن اشتراک مناسب را انتخاب می‌کنید. پس از تأیید مدیر، پروفایل شما فعال می‌شود."
    },
    {
        title: "چگونه متخصصان تأییدشده را پیدا کنم؟",
        content: "از طریق نقشه تعاملی سایت می‌توانید متخصصان و کسب‌وکارهای تأتیشده را در شهر خود پیدا کنید. فقط اطلاعات تأییدشده و پروفایل‌های بررسی‌شده در بخش کشف نمایش داده می‌شوند."
    },
    {
        title: "پلن‌های اشتراک چگونه کار می‌کنند؟",
        content: "ارائه‌دهندگان خدمات می‌توانند یکی از پلن‌های اشتراک را انتخاب کنند. پلن‌های بالاتر امکان نمایش ویژه، اولویت در نتایج جستجو و دسترسی به درخواست‌های بیشتر را فراهم می‌کنند."
    },
    {
        title: "چطور در مزایده‌های ساختمانی شرکت کنم؟",
        content: "در بخش مزایده‌ها، پروژه‌های فعال که نیاز به خدمات دارند نمایش داده می‌شوند. می‌توانید پیشنهاد قیمت خود را ثبت کنید و سازنده کمترین پیشنهاد مناسب را انتخاب می‌کند."
    }
];

function Faq() {
    return (
        <div className="relative py-20 bg-background overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }} />

            <div className={'relative z-10 grid grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'}>
                <div className={'flex flex-col gap-5 items-center lg:items-start p-4'}>
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-dark text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            سازه من رو بهتر بشناس
                        </div>
                    </div>
                    <h2 className={'text-3xl lg:text-4xl font-extrabold'}>سوالات متداول</h2>
                    <p className={'text-sm max-w-md opacity-60 leading-relaxed'}>
                        پاسخ سوالات پرتکرار درباره نحوه دریافت حمایت، امنیت پرداخت و امکانات سازه من را اینجا بخوانید.
                    </p>
                    <Link href={'/contact'}>
                        <CustomButton shadow className={"w-full lg:w-auto text-sm!"}>
                            <IconShop/>
                            <span className={'mt-1'}>تماس با ما</span>
                        </CustomButton>
                    </Link>
                </div>
                <div className={"p-4"}>
                    <div
                        className={'glass-card rounded-3xl flex flex-col gap-3'}
                    >
                        {MAIN_FAQ.map((item, i) => (
                            <Question
                                key={i}
                                title={item.title}
                                content={item.content}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


function Question(props: { title: string, content: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={'p-4 bg-container rounded-2xl border border-b2 hover:border-primary/20 transition-all duration-300'} style={{
            transition: "all .3s"
        }}>
            <div className="flex items-center justify-between cursor-pointer gap-3" onClick={() => setOpen(e => !e)}>
                <p className={'font-medium text-sm sm:text-base'}>{props.title}</p>
                <div style={{
                    transform: `rotate(${open ? "0deg" : "45deg"})`,
                    color: open ? "var(--primary)" : "inherit"
                }} className={'transition-all shrink-0'}>
                    <IconX/>
                </div>
            </div>
            {open && (
                <div
                    className={`py-2 transition-all overflow-hidden`}
                    style={{
                        animation: open ? "fade-in-down 0.3s ease-in-out" : ""
                    }}
                >
                    <p className={'opacity-70 font-light text-sm leading-relaxed'}>{props.content}</p>
                </div>
            )}
        </div>
    )
}

export default Faq;
