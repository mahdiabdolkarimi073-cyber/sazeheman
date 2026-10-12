'use client';

import { useState } from 'react';

const BUILDER_STEPS = [
    { title: 'ثبت اطلاعات پروژه', desc: 'اطلاعات پروژه ساختمانی خود را وارد کنید' },
    { title: 'انتخاب نیازمندی‌های ساختمانی', desc: 'خدمات و مصالح مورد نیاز را مشخص کنید' },
    { title: 'تعیین موقعیت روی نقشه', desc: 'محل پروژه را روی نقشه مشخص کنید' },
    { title: 'بررسی و تأیید مدیر', desc: 'اطلاعات شما پس از بررسی تأیید می‌شود' },
    { title: 'ارتباط با متخصصان مرتبط', desc: 'با متخصصان مرتبط در ارتباط باشید' },
];

const PROVIDER_STEPS = [
    { title: 'تأیید شماره تلفن', desc: 'شماره تلفن خود را تأیید کنید' },
    { title: 'ثبت اطلاعات کسب‌وکار و تخصص‌ها', desc: 'اطلاعات کسب‌وکار و حوزه تخصصی خود را وارد کنید' },
    { title: 'انتخاب پلن اشتراک', desc: 'پلن مناسب کسب‌وکار خود را انتخاب کنید' },
    { title: 'بررسی و تأیید اطلاعات', desc: 'اطلاعات شما توسط مدیر بررسی و تأیید می‌شود' },
    { title: 'دریافت درخواست‌های مرتبط با تخصص', desc: 'درخواست‌های همکاری مرتبط با تخصص خود را دریافت کنید' },
];

export default function HowItWorks() {
    const [tab, setTab] = useState<'builder' | 'provider'>('builder');
    const steps = tab === 'builder' ? BUILDER_STEPS : PROVIDER_STEPS;

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20" aria-labelledby="how-title">
            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-1.5 h-8 rounded-full bg-primary" />
                    <h2 id="how-title" className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#252C2A]">سازه‌همان چطور کار می‌کند؟</h2>
                </div>
                <p className="text-sm sm:text-base text-[#6B7771]">دو مسیر متفاوت برای سازندگان و ارائه‌دهندگان خدمات</p>
            </div>

            <div className="flex justify-center mb-8">
                <div className="flex gap-1 p-1 rounded-xl bg-container border border-b2">
                    <button
                        onClick={() => setTab('builder')}
                        className={`px-5 py-3 min-h-12 rounded-lg text-sm font-medium transition-all ${tab === 'builder' ? 'bg-[#36B98A] text-white' : 'text-[#252C2A] hover:bg-white'}`}
                    >
                        سازنده / صاحب پروژه
                    </button>
                    <button
                        onClick={() => setTab('provider')}
                        className={`px-5 py-3 min-h-12 rounded-lg text-sm font-medium transition-all ${tab === 'provider' ? 'bg-[#36B98A] text-white' : 'text-[#252C2A] hover:bg-white'}`}
                    >
                        ارائه‌دهنده خدمات
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {steps.map((step, i) => (
                    <div key={i} className="relative flex flex-col gap-2 p-5 rounded-2xl bg-container border border-b2">
                        <div className="w-10 h-10 rounded-full bg-[#36B98A]/15 text-[#36B98A] flex items-center justify-center font-bold text-sm">
                            {(i + 1).toLocaleString('fa')}
                        </div>
                        <h3 className="font-semibold text-base leading-tight text-[#252C2A]">{step.title}</h3>
                        <p className="text-sm text-[#6B7771] leading-[1.8]">{step.desc}</p>
                        {i < steps.length - 1 && (
                            <div className="hidden md:block absolute -left-2 top-10 text-[#36B98A] opacity-30 text-xl">←</div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
