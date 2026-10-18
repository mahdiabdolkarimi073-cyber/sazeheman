import Link from 'next/link';
import CustomButton from '@/components/ui/base/CustomButton';

type TenderCard = {
    id: string;
    title: string;
    category: string;
    city: string | null;
    budget: number | null;
    deadline: string | null;
    bidsCount: number;
    status: string;
};

function formatJalalDeadline(deadline: string | null): string {
    if (!deadline) return 'بدون مهلت';
    try {
        const d = new Date(deadline);
        if (isNaN(d.getTime())) return 'بدون مهلت';
        const now = new Date();
        const diffMs = d.getTime() - now.getTime();
        if (diffMs <= 0) return 'پایان یافته';
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) return 'چند ساعت باقی‌مانده';
        return `${diffDays.toLocaleString('fa')} روز باقی‌مانده`;
    } catch {
        return 'بدون مهلت';
    }
}

function lowestBid(bidsCount: number, budget: number | null): string {
    if (budget) return `${Number(budget).toLocaleString('fa')} تومان`;
    return 'قیمت پایه ندارد';
}

export default function TendersSection({ auctions }: { auctions: TenderCard[] }) {
    const list = auctions.slice(0, 6);

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 bg-[#F7F8F6]" aria-labelledby="tenders-title">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full bg-primary" />
                    <div>
                        <h2 id="tenders-title" className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#252C2A]">مزایده‌های فعال ساختمانی</h2>
                        <p className="text-sm sm:text-base text-[#6B7771] mt-1">پیشنهادهای رقابتی برای پروژه‌های ساختمانی</p>
                    </div>
                </div>
                <Link href="/auctions">
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors cursor-pointer">
                        مشاهده همه مزایده‌ها
                    </span>
                </Link>
            </div>

            {list.length === 0 ? (
                <div className="rounded-xl bg-white border border-[#e5ebe6] p-10 text-center">
                    <p className="text-sm text-[#6B7771]">در حال حاضر مزایده فعال موجود نیست.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {list.map((tender) => (
                        <Link key={tender.id} href={`/auctions/${tender.id}`} className="rounded-xl bg-white border border-[#e5ebe6] p-6 hover-lift flex flex-col gap-4 shadow-[0_4px_14px_rgba(23,61,53,0.04)] transition-all hover:border-primary/30">
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="font-bold text-base leading-tight text-[#252c2a] line-clamp-2">{tender.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${tender.status === 'open' ? 'bg-[#36B98A]/10 text-[#36B98A]' : 'bg-gray-100 text-gray-500'}`}>
                                    {tender.status === 'open' ? 'باز' : 'بسته شده'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#6b7771] flex-wrap">
                                <span className="px-2 py-0.5 rounded bg-[#36B98A]/8 text-[#36B98A] font-medium">{tender.category}</span>
                                {tender.city && (
                                    <>
                                        <span>•</span>
                                        <span>{tender.city}</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center justify-between text-sm text-[#6B7771] border-t border-[#e5ebe6] pt-4">
                                <span>{formatJalalDeadline(tender.deadline)}</span>
                                <span>{tender.bidsCount.toLocaleString('fa')} پیشنهاد</span>
                            </div>
                            <div className="text-sm font-medium text-[#252c2a]">
                                {lowestBid(tender.bidsCount, tender.budget)}
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <div className="mt-8 text-center">
                <Link href="/auctions">
                    <CustomButton variant="soft" className="text-sm!">
                        مشاهده همه مزایده‌ها
                    </CustomButton>
                </Link>
            </div>
        </section>
    );
}
