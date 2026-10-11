'use client';

import Link from 'next/link';

const PROFESSIONALS = [
    {
        name: 'شرکت ساختمانی پارس',
        trade: 'نماکاری و سنگ‌کاری',
        city: 'تهران',
        image: 'https://images.pexels.com/photos/37556463/pexels-photo-37556463.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        verified: true,
        featured: true,
        desc: 'اجرای نما سنگی و سرامیک با ۱۵ سال سابقه',
    },
    {
        name: 'مهراب ولی‌پور',
        trade: 'برق‌کاری و تأسیسات',
        city: 'اصفهان',
        image: 'https://images.pexels.com/photos/16552855/pexels-photo-16552855.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        verified: true,
        featured: true,
        desc: 'برق‌کاری ساختمان و سیستم اعلام حریق',
    },
    {
        name: 'شرکت آریا بتن',
        trade: 'بتن‌ریزی و قالب‌بندی',
        city: 'کرج',
        image: 'https://images.pexels.com/photos/7931/pexels-photo-7931.jpg?auto=compress&cs=tinysrgb&h=650&w=940',
        verified: true,
        featured: false,
        desc: 'بتن‌ریزی اسکلت و قالب‌بندی صنعتی',
    },
    {
        name: 'علی محمدی',
        trade: 'لوله‌کشی و تأسیسات',
        city: 'شیراز',
        image: 'https://images.pexels.com/photos/8487760/pexels-photo-8487760.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        verified: true,
        featured: false,
        desc: 'لوله‌کشی آب و گاز و سیستم گرمایش',
    },
    {
        name: 'شرکت درب پارس',
        trade: 'درب و پنجره UPVC',
        city: 'مشهد',
        image: 'https://images.pexels.com/photos/5511097/pexels-photo-5511097.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        verified: false,
        featured: false,
        desc: 'درب و پنجره UPVC و آلومینیومی',
    },
];

export default function FeaturedProfessionals() {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" aria-labelledby="featured-title">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full bg-primary" />
                    <div>
                        <h2 id="featured-title" className="text-2xl sm:text-3xl font-bold text-[#252c2a]">متخصصان ویژه</h2>
                        <p className="text-base text-[#6b7771] mt-2">حرفه‌ای‌های تأییدشده صنعت ساختمان</p>
                    </div>
                </div>
                <Link href="/#map" className="text-primary text-sm font-medium hover:opacity-80 transition-opacity">
                    مشاهده همه ←
                </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                {PROFESSIONALS.map((p, i) => (
                    <div
                        key={i}
                        className="snap-start shrink-0 w-[20rem] rounded-xl bg-white border border-[#e5ebe6] overflow-hidden hover-lift shadow-[0_5px_18px_rgba(23,61,53,0.05)]"
                    >
                        <div className="h-40 relative overflow-hidden">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            {p.featured && (
                                <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-amber-500 text-white font-bold shadow-lg">
                                    ویژه
                                </span>
                            )}
                            {p.verified && (
                                <span className="absolute bottom-3 right-3 flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/90 text-primary font-medium backdrop-blur-sm">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    تأییدشده
                                </span>
                            )}
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                            <h3 className="font-bold text-base text-[#252c2a]">{p.name}</h3>
                            <p className="text-sm text-primary font-medium">{p.trade}</p>
                            <p className="text-sm text-[#6b7771] leading-relaxed">{p.desc}</p>
                            <div className="flex items-center gap-1 text-xs opacity-50">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                {p.city}
                            </div>
                            <Link href="/#map" className="mt-2 text-xs text-primary font-medium hover:opacity-80">
                                مشاهده پروفایل ←
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
