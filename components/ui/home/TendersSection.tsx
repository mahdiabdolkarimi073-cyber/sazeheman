import Link from 'next/link';
import CustomButton from '@/components/ui/base/CustomButton';

const TENDERS = [
    {
        title: 'نصب آسانسور ۸ طبقه',
        service: 'آسانسور',
        city: 'تهران',
        deadline: '۱۴۰۳/۰۸/۳۰',
        bids: 12,
        status: 'open',
    },
    {
        title: 'برق‌کاری ساختمان ۵ واحدی',
        service: 'برق‌کاری',
        city: 'اصفهان',
        deadline: '۱۴۰۳/۰۹/۱۵',
        bids: 8,
        status: 'open',
    },
    {
        title: 'اجرای نما سنگی ساختمان ۱۰ طبقه',
        service: 'نماکاری',
        city: 'شیراز',
        deadline: '۱۴۰۳/۰۸/۲۰',
        bids: 5,
        status: 'open',
    },
    {
        title: 'بتن‌ریزی اسکلت ۳۰۰۰ متر',
        service: 'بتن‌ریزی',
        city: 'کرج',
        deadline: '۱۴۰۳/۰۹/۰۱',
        bids: 15,
        status: 'open',
    },
    {
        title: 'کاشی‌کاری全套 ۱۲ واحدی',
        service: 'کاشی و سرامیک',
        city: 'مشهد',
        deadline: '۱۴۰۳/۰۸/۲۵',
        bids: 7,
        status: 'open',
    },
    {
        title: 'اجرای سقف کاذب طبقه اداری',
        service: 'سقف کاذب',
        city: 'تبریز',
        deadline: '۱۴۰۳/۰۹/۱۰',
        bids: 4,
        status: 'open',
    },
];

export default function TendersSection() {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full bg-primary" />
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold">مزایده‌های فعال ساختمانی</h2>
                        <p className="text-sm opacity-60 mt-1">پیشنهادهای رقابتی برای پروژه‌های ساختمانی</p>
                    </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    نمونه نمایشی
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {TENDERS.map((tender, i) => (
                    <div key={i} className="rounded-2xl bg-container border border-b2 p-5 hover-lift flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-sm leading-tight">{tender.title}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap font-medium">
                                باز
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs opacity-60">
                            <span className="px-2 py-0.5 rounded bg-primary/8 text-primary font-medium">{tender.service}</span>
                            <span>•</span>
                            <span>{tender.city}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs opacity-50 border-t border-b2 pt-3">
                            <span>مهلت: {tender.deadline}</span>
                            <span>{tender.bids.toLocaleString('fa')} پیشنهاد</span>
                        </div>
                        <Link href="/dashboard/auctions" className="mt-1">
                            <CustomButton variant="soft" className="w-full text-sm! py-2!">
                                مشاهده جزئیات
                            </CustomButton>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
