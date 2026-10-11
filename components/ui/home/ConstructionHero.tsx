'use client';

import { useState } from 'react';
import CustomButton from '@/components/ui/base/CustomButton';
import Link from 'next/link';

const CITIES = ['تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'کرج', 'اهواز', 'کرمان', 'یزد', 'رشت'];

export default function ConstructionHero() {
    const [city, setCity] = useState('تهران');
    const [search, setSearch] = useState('');

    return (
        <section
            className="construction-hero relative w-full min-h-[620px] lg:min-h-[680px] flex items-center overflow-hidden"
            style={{ backgroundImage: "url('/images/hero/Blueprints_Over_a_Golden_Construction_Skyline%20copy.png')" }}
        >
            <div className="absolute inset-0 bg-cover bg-no-repeat bg-center-right" aria-hidden="true" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,61,53,0.08)_0%,rgba(23,61,53,0.28)_48%,rgba(23,61,53,0.68)_100%)]" aria-hidden="true" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-24 lg:py-28">
                <div className="max-w-2xl mr-0 lg:mr-auto text-right">
                    <div className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full bg-white/12 border border-white/25 text-white text-sm font-medium backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-300" />
                        پلتفرم حرفه‌ای صنعت ساختمان ایران
                    </div>

                    <h1 className="text-[2.15rem] sm:text-5xl lg:text-[4.25rem] text-white font-bold mb-6 leading-[1.25] tracking-tight">
                        برای ساخت‌وسازت،<br />
                        <span className="text-emerald-300">متخصص مناسب</span> رو پیدا کن
                    </h1>
                    <p className="text-white/85 mb-9 max-w-xl text-base sm:text-lg lg:text-xl leading-[1.9]">
                        مشاغل ساختمانی، متخصصان تأییدشده و فرصت‌های همکاری را در شهر خودت پیدا کن.
                    </p>

                    <div className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-stretch shadow-[0_20px_60px_rgba(0,0,0,0.25)] text-right">
                        <label className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:pl-4 min-h-12">
                            <svg className="w-5 h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <span className="sr-only">انتخاب شهر</span>
                            <select value={city} onChange={(event) => setCity(event.target.value)} className="text-sm font-bold text-gray-700 bg-transparent outline-none cursor-pointer py-2 min-h-10">
                                {CITIES.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                        </label>
                        <label className="flex-1 flex items-center min-h-12">
                            <span className="sr-only">جست‌وجوی خدمت ساختمانی</span>
                            <input type="text" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="چه خدمت ساختمانی نیاز داری؟" className="w-full text-base text-gray-800 placeholder:text-gray-500 outline-none bg-transparent py-2" />
                        </label>
                        <Link href="/#map" className="sm:w-auto">
                            <CustomButton shadow className="w-full sm:w-auto min-h-12 px-7! text-base! whitespace-nowrap!">جست‌وجوی مشاغل</CustomButton>
                        </Link>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-start mt-5">
                        <Link href="/auth/builder"><CustomButton shadow className="w-full sm:w-auto min-h-12 px-7! text-base!">ثبت سازه من</CustomButton></Link>
                        <Link href="/auth/business/form"><CustomButton variant="soft" className="w-full sm:w-auto min-h-12 px-7! text-base! bg-white/12! text-white! border border-white/35! hover:bg-white/22!">ثبت شغل من</CustomButton></Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
