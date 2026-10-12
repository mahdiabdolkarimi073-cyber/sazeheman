import Link from 'next/link';

const CATEGORIES = [
    { label: 'دیوارچینی و بلوک', icon: '🧱' },
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
    { label: 'قالب‌بندی', icon: '⊞' },
    { label: 'آرماتوربندی', icon: '⚒' },
    { label: 'بتن‌ریزی', icon: '⬛' },
    { label: 'اسکلت فلزی', icon: '🏗' },
    { label: 'عایق‌کاری', icon: '🛡' },
    { label: 'نرده و حفاظ', icon: '⧈' },
    { label: 'آسانسور', icon: '🛗' },
    { label: 'مصالح ساختمانی', icon: '📦' },
    { label: 'گچ‌کاری', icon: '⬜' },
    { label: 'کابینت‌سازی', icon: '🗄' },
    { label: 'گازکشی', icon: '⛽' },
    { label: 'دوربین و امنیتی', icon: '📹' },
    { label: 'آینه و شیشه', icon: '🪟' },
    { label: 'محوطه‌سازی', icon: '🌳' },
    { label: 'متره و محاسبات', icon: '📊' },
];

export default function ConstructionCategories() {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20" aria-labelledby="categories-title">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full bg-[#36B98A]" />
                    <div>
                        <h2 id="categories-title" className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#252C2A]">دسته‌بندی مشاغل ساختمانی</h2>
                        <p className="text-sm sm:text-base text-[#6B7771] mt-1">تخصص مورد نظر خود را انتخاب کنید</p>
                    </div>
                </div>
                <Link href="/#map" className="text-[#36B98A] text-sm font-medium hover:opacity-80 transition-opacity whitespace-nowrap">
                    مشاهده همه مشاغل ←
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {CATEGORIES.map((cat, i) => (
                    <Link
                        key={i}
                        href="/#map"
                        className="bg-white rounded-xl p-3 sm:p-4 min-h-[100px] sm:min-h-[112px] flex flex-col items-center justify-center gap-2 sm:gap-3 text-center hover-lift border border-[#e5ebe6] shadow-[0_4px_14px_rgba(23,61,53,0.04)]"
                    >
                        <span className="text-xl sm:text-2xl">{cat.icon}</span>
                        <span className="text-xs sm:text-sm font-medium leading-tight text-[#252C2A]">{cat.label}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
