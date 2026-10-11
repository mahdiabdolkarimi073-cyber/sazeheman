import Link from 'next/link';

const CATEGORIES = [
    { label: 'دیوارچینی و بلوک‌زنی', icon: '🧱' },
    { label: 'برق‌کاری', icon: '⚡' },
    { label: 'نورپردازی', icon: '💡' },
    { label: 'تأسیسات ساختمان', icon: '🔧' },
    { label: 'کاشی و سرامیک', icon: '▬' },
    { label: 'نماکاری', icon: '🏢' },
    { label: 'سقف کاذب', icon: '⬇' },
    { label: 'معماری و نقشه‌کشی', icon: '📐' },
    { label: 'کناف‌کاری', icon: '▭' },
    { label: 'رابیتس‌بندی', icon: '▦' },
    { label: 'طراحی داخلی', icon: '🎨' },
    { label: 'درب و پنجره', icon: '🚪' },
    { label: 'جوشکاری', icon: '🔥' },
    { label: 'حمل‌ونقل', icon: '🚚' },
    { label: 'قالب‌بندی', icon: '楠' },
    { label: 'آرماتوربندی', icon: '⚒' },
    { label: 'بتن‌ریزی', icon: '⬛' },
    { label: 'اسکلت فلزی', icon: '🏗' },
    { label: 'عایق‌کاری', icon: '🛡' },
    { label: 'نرده و حفاظ', icon: '栏杆' },
    { label: 'آسانسور', icon: '🛗' },
    { label: 'مصالح ساختمانی', icon: '📦' },
    { label: 'گچ‌کاری', icon: '⬜' },
    { label: 'کابینت‌سازی', icon: '🗄' },
    { label: 'گازکشی', icon: '⛽' },
    { label: 'دوربین و سیستم امنیتی', icon: '📹' },
    { label: 'آینه و شیشه', icon: '🪟' },
    { label: 'محوطه‌سازی', icon: '🌳' },
    { label: 'متره و محاسبات', icon: '📊' },
];

export default function ConstructionCategories() {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full bg-primary" />
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold">دسته‌بندی مشاغل ساختمانی</h2>
                        <p className="text-sm opacity-60 mt-1">تخصص مورد نظر خود را انتخاب کنید</p>
                    </div>
                </div>
                <Link href="/#map" className="text-primary text-sm font-medium hover:opacity-80 transition-opacity whitespace-nowrap">
                    مشاهده همه مشاغل ←
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {CATEGORIES.map((cat, i) => (
                    <Link
                        key={i}
                        href="/#map"
                        className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 text-center hover-lift border border-b2"
                    >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-xs sm:text-sm font-medium leading-tight">{cat.label}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
