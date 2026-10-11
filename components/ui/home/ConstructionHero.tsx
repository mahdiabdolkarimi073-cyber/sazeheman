'use client';

import { useState } from 'react';
import CustomButton from '@/components/ui/base/CustomButton';
import Link from 'next/link';

const CITIES = [
    'تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'کرج', 'اهواز', 'کرمان', 'یزد', 'رشت',
];

export default function ConstructionHero() {
    const [city, setCity] = useState('تهران');
    const [search, setSearch] = useState('');

    return (
        <section
            className="relative w-full flex items-center justify-center overflow-hidden"
            style={{ minHeight: '600px' }}
        >
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.pexels.com/photos/30617023/pexels-photo-30617023.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    alt="ساخت‌وساز"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(23,61,53,0.75) 0%, rgba(23,61,53,0.55) 100%)' }} />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-white text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    پلتفرم جامع صنعت ساختمان ایران
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white font-bold mb-4 leading-tight">
                    برای ساخت‌وسازت، متخصص مناسب رو پیدا کن
                </h1>
                <p className="text-white/80 mb-8 mx-auto max-w-xl text-base sm:text-lg leading-relaxed">
                    مشاغل ساختمانی، متخصصان تأییدشده و فرصت‌های همکاری را در شهر خودت پیدا کن.
                </p>

                <div className="bg-white rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-stretch shadow-2xl">
                    <div className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:pl-3">
                        <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="text-sm font-medium text-gray-700 bg-transparent outline-none cursor-pointer py-2"
                        >
                            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="چه خدمت ساختمانی نیاز داری؟"
                        className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 outline-none bg-transparent py-2"
                    />
                    <Link href="/#map">
                        <CustomButton shadow className="w-full sm:w-auto px-6! py-2.5! text-sm! whitespace-nowrap!">
                            جست‌وجوی مشاغل
                        </CustomButton>
                    </Link>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                    <Link href="/auth/builder">
                        <CustomButton shadow className="w-full sm:w-auto px-6! py-2.5! text-sm!">
                            ثبت سازه من
                        </CustomButton>
                    </Link>
                    <Link href="/auth/business/form">
                        <CustomButton variant="soft" className="w-full sm:w-auto px-6! py-2.5! text-sm! bg-white/15! text-white! border border-white/30! hover:bg-white/25!">
                            ثبت شغل من
                        </CustomButton>
                    </Link>
                </div>
            </div>
        </section>
    );
}
