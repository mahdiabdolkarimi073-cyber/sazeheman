'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api/base';
import CustomButton from '@/components/ui/base/CustomButton';
import { TextInput, Textarea, Select, NumberInput } from '@mantine/core';

const CATEGORIES = [
    'آسانسور',
    'در و پنجره',
    'سقف کاذب',
    'تاسیسات و لوله کشی',
    'برق و snoor',
    'کف‌سازی و سرامیک',
    'نقاشی و رنگ‌آمیزی',
    'سیستم اعلام حریق',
    'دوربین مداربسته',
    'سایر',
];

type Auction = {
    id: string;
    title: string;
    category: string;
    description: string | null;
    city: string | null;
    budget: number | null;
    deadline: string | null;
    status: string;
    created_at: string;
    bidsCount: number;
    currentBid: number | null;
    phone?: string;
};

type Bid = {
    id: string;
    bidder_name: string;
    price: number;
    description: string | null;
    created_at: string;
    is_own?: boolean;
};

function statusLabel(s: string) {
    if (s === 'open') return 'باز';
    if (s === 'closed') return 'بسته شده';
    if (s === 'awarded') return 'برنده انتخاب شده';
    return s;
}

function statusColor(s: string) {
    if (s === 'open') return 'bg-primary/10 text-primary';
    if (s === 'awarded') return 'bg-blue-50 text-blue-600';
    return 'bg-gray-200 text-gray-600';
}

function AuctionsPage() {
    const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedAuction, setSelectedAuction] = useState<any>(null);
    const [selectedBids, setSelectedBids] = useState<Bid[]>([]);
    const [dashboardType, setDashboardType] = useState<string>('sazeheman');

    // create form
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<string | null>(null);
    const [desc, setDesc] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [budget, setBudget] = useState<number | ''>('');
    const [deadline, setDeadline] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [createMsg, setCreateMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // winner selection
    const [awardConfirm, setAwardConfirm] = useState<Bid | null>(null);
    const [awarding, setAwarding] = useState(false);

    const loadAuctions = (type?: string) => {
        setLoading(true);
        const dt = type || dashboardType;
        api("/auctions", { my: "true", dashboard_type: dt, status: "all", limit: 50 })
            .then(e => setAuctions(e.data?.auctions || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const saved = localStorage.getItem('dashboard_type');
        if (saved && saved !== dashboardType) {
            setDashboardType(saved);
            loadAuctions(saved);
        } else {
            loadAuctions();
        }

        const onTypeChange = () => {
            const t = localStorage.getItem('dashboard_type') || 'sazeheman';
            setDashboardType(t);
        };
        window.addEventListener('dashboard_type_changed', onTypeChange);
        return () => window.removeEventListener('dashboard_type_changed', onTypeChange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const switchDashboardType = (type: string) => {
        setDashboardType(type);
        localStorage.setItem('dashboard_type', type);
        window.dispatchEvent(new Event('dashboard_type_changed'));
        loadAuctions(type);
    };

    const submitAuction = async () => {
        if (!title || !category || !phone) {
            setCreateMsg({ type: 'error', text: "عنوان، دسته‌بندی و شماره تماس الزامی است" });
            return;
        }
        setSubmitting(true);
        setCreateMsg(null);
        try {
            await api("/auctions", {
                title,
                category,
                description: desc,
                phone,
                city,
                budget: budget || undefined,
                deadline: deadline || undefined,
                dashboard_type: dashboardType,
            }, "POST");
            setCreateMsg({ type: 'success', text: "مزایده با موفقیت ثبت شد" });
            setView('list');
            setTitle(''); setCategory(null); setDesc(''); setPhone(''); setCity(''); setBudget(''); setDeadline('');
            loadAuctions();
        } catch (e: any) {
            setCreateMsg({ type: 'error', text: e?.message || "خطا در ثبت مزایده" });
        }
        setSubmitting(false);
    };

    const openDetail = (auction: Auction) => {
        setView('detail');
        setSelectedAuction(auction);
        api(`/auctions/${auction.id}`)
            .then(e => {
                setSelectedAuction(e.data?.auction);
                setSelectedBids(e.data?.bids || []);
            })
            .catch(() => {});
    };

    const refreshDetail = () => {
        if (!selectedAuction) return;
        api(`/auctions/${selectedAuction.id}`)
            .then(e => {
                setSelectedAuction(e.data?.auction);
                setSelectedBids(e.data?.bids || []);
            })
            .catch(() => {});
    };

    const closeAuction = async () => {
        try {
            await api(`/auctions/${selectedAuction.id}`, { action: "close" }, "PUT");
            refreshDetail();
            loadAuctions();
        } catch {}
    };

    const confirmAward = async () => {
        if (!awardConfirm || !selectedAuction) return;
        setAwarding(true);
        try {
            await api(`/auctions/${selectedAuction.id}`, { action: "award", bid_id: awardConfirm.id }, "PUT");
            setAwardConfirm(null);
            refreshDetail();
            loadAuctions();
        } catch {}
        setAwarding(false);
    };

    // ── Dashboard type switcher ───────────────────────────────
    const TypeSwitcher = () => (
        <div className="flex gap-1 p-1 rounded-xl bg-container border border-b2 w-fit">
            <button
                onClick={() => switchDashboardType('sazeheman')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dashboardType === 'sazeheman' ? 'bg-primary text-white' : 'opacity-60 hover:opacity-90'}`}
            >
                سازه من
            </button>
            <button
                onClick={() => switchDashboardType('shoghleman')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dashboardType === 'shoghleman' ? 'bg-primary text-white' : 'opacity-60 hover:opacity-90'}`}
            >
                شغل من
            </button>
        </div>
    );

    // ── List View ─────────────────────────────────────────────
    if (view === 'list') {
        return (
            <div className="flex flex-col gap-5 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold">مزایده‌های من</h1>
                        <p className="text-sm opacity-70 mt-1">مزایده‌های خود را مدیریت کنید</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <TypeSwitcher />
                        <CustomButton shadow onClick={() => { setView('create'); setCreateMsg(null); }}>
                            + مزایده جدید
                        </CustomButton>
                    </div>
                </div>

                <div className="bg-container rounded-2xl p-5 border border-b2">
                    {loading ? (
                        <p className="text-sm opacity-50 text-center py-8">در حال بارگذاری...</p>
                    ) : auctions.length === 0 ? (
                        <div className="text-center py-12 flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-b1 flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 2v20M2 12h20" strokeLinecap="round" />
                                    <circle cx="12" cy="12" r="9" />
                                </svg>
                            </div>
                            <p className="opacity-60 text-sm">هنوز مزایده‌ای ثبت نکرده‌اید</p>
                            <CustomButton shadow onClick={() => setView('create')}>
                                شروع مزایده
                            </CustomButton>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {auctions.map((a) => (
                                <div
                                    key={a.id}
                                    onClick={() => openDetail(a)}
                                    className="bg-background rounded-xl border border-b2 p-4 cursor-pointer hover:border-primary/40 transition-all"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-medium text-sm flex-1">{a.title}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${statusColor(a.status)}`}>
                                            {statusLabel(a.status)}
                                        </span>
                                    </div>
                                    <p className="text-xs opacity-60 mb-2">{a.category}</p>
                                    {a.city && <p className="text-xs opacity-50">شهر: {a.city}</p>}
                                    {a.budget && <p className="text-xs opacity-50">بودجه: {Number(a.budget).toLocaleString('fa')} تومان</p>}
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-xs opacity-50">
                                            {(a.bidsCount || 0).toLocaleString('fa')} پیشنهاد
                                        </p>
                                        {a.currentBid !== null && (
                                            <p className="text-xs font-medium text-primary">
                                                کمترین: {Number(a.currentBid).toLocaleString('fa')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ── Detail View ───────────────────────────────────────────
    if (view === 'detail' && selectedAuction) {
        const bids = selectedBids;
        const lowestBid = bids.length > 0 ? bids[0] : null;
        const isOwner = selectedAuction.isOwner;
        const isAwarded = selectedAuction.status === 'awarded';
        const isOpen = selectedAuction.status === 'open';

        return (
            <div className="flex flex-col gap-5 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => { setView('list'); loadAuctions(); }} className="text-sm opacity-70 hover:opacity-100">
                        بازگشت
                    </button>
                    <h1 className="text-xl sm:text-2xl font-semibold">جزئیات مزایده</h1>
                </div>

                <div className="bg-container rounded-2xl p-5 sm:p-7 border border-b2">
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-4">
                        <div>
                            <h2 className="text-lg font-bold">{selectedAuction.title}</h2>
                            <p className="text-sm opacity-60 mt-1">{selectedAuction.category}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full ${statusColor(selectedAuction.status)}`}>
                            {statusLabel(selectedAuction.status)}
                        </span>
                    </div>

                    {selectedAuction.description && (
                        <p className="text-sm opacity-75 mb-4">{selectedAuction.description}</p>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-6">
                        {selectedAuction.city && (
                            <div><span className="opacity-50">شهر:</span> {selectedAuction.city}</div>
                        )}
                        {selectedAuction.budget && (
                            <div><span className="opacity-50">بودجه:</span> {Number(selectedAuction.budget).toLocaleString('fa')}</div>
                        )}
                        {selectedAuction.deadline && (
                            <div><span className="opacity-50">مهلت:</span> {new Date(selectedAuction.deadline).toLocaleDateString('fa')}</div>
                        )}
                        {isOwner && selectedAuction.phone && (
                            <div><span className="opacity-50">تلفن:</span> <span dir="ltr">{selectedAuction.phone}</span></div>
                        )}
                    </div>

                    {isOwner && isOpen && (
                        <div className="mb-6">
                            <CustomButton variant="soft" onClick={closeAuction} className="text-sm!">
                                بستن مزایده
                            </CustomButton>
                        </div>
                    )}

                    {/* Bid list with winner selection */}
                    <div className="border-t border-b2 pt-5">
                        <h3 className="font-medium mb-3">پیشنهادهای قیمت ({bids.length.toLocaleString('fa')})</h3>
                        {bids.length === 0 ? (
                            <p className="text-sm opacity-50 text-center py-6">هنوز پیشنهادی ثبت نشده است</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {bids.map((bid: Bid, i: number) => (
                                    <div
                                        key={bid.id}
                                        className={`flex items-center justify-between p-3 rounded-xl border ${
                                            i === 0 ? 'border-primary bg-primary/5' : 'border-b2 bg-background'
                                        } ${isAwarded && bid.id === selectedAuction.winningBidId ? 'ring-2 ring-blue-400' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-7 h-7 rounded-full bg-b1 flex items-center justify-center text-xs font-bold">
                                                {(i + 1).toLocaleString('fa')}
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium">{bid.bidder_name}</p>
                                                {bid.description && <p className="text-xs opacity-50">{bid.description}</p>}
                                                <p className="text-xs opacity-40 mt-0.5">
                                                    {new Date(bid.created_at).toLocaleDateString('fa')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-left">
                                                <p className={`font-bold text-sm ${i === 0 ? 'text-primary' : ''}`}>
                                                    {Number(bid.price).toLocaleString('fa')} تومان
                                                </p>
                                                {i === 0 && !isAwarded && (
                                                    <span className="text-xs text-primary">کمترین قیمت</span>
                                                )}
                                            </div>
                                            {isOwner && !isAwarded && isOpen && (
                                                <CustomButton
                                                    variant="soft"
                                                    className="text-xs! py-1.5! px-3!"
                                                    onClick={() => setAwardConfirm(bid)}
                                                >
                                                    انتخاب برنده
                                                </CustomButton>
                                            )}
                                            {isAwarded && bid.id === selectedAuction.winningBidId && (
                                                <span className="text-xs text-blue-600 font-medium">برنده</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {isAwarded && (
                        <div className="mt-4 rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
                            این مزایده نهایی شده است. برنده: {selectedAuction.winningBidName || '—'}
                        </div>
                    )}
                </div>

                {/* Award confirmation modal */}
                {awardConfirm && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setAwardConfirm(null)}>
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                            <h3 className="font-bold text-base mb-2">تأیید انتخاب برنده</h3>
                            <p className="text-sm opacity-70 mb-4">
                                آیا از انتخاب پیشنهاد <strong>{awardConfirm.bidder_name}</strong> با قیمت <strong>{Number(awardConfirm.price).toLocaleString('fa')} تومان</strong> به عنوان برنده اطمینان دارید؟
                            </p>
                            <p className="text-xs opacity-50 mb-5">پس از انتخاب برنده، امکان ثبت پیشنهاد جدید و تغییر برنده وجود نخواهد داشت.</p>
                            <div className="flex gap-3">
                                <CustomButton
                                    shadow
                                    loading={awarding}
                                    onClick={confirmAward}
                                    className="flex-1"
                                >
                                    بله، انتخاب برنده
                                </CustomButton>
                                <CustomButton variant="soft" onClick={() => setAwardConfirm(null)} className="flex-1">
                                    انصراف
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── Create View ───────────────────────────────────────────
    return (
        <div className="flex flex-col gap-5 p-4 sm:p-6">
            <div className="flex items-center gap-3">
                <button onClick={() => setView('list')} className="text-sm opacity-70 hover:opacity-100">
                    بازگشت
                </button>
                <h1 className="text-xl sm:text-2xl font-semibold">مزایده جدید</h1>
            </div>

            <div className="max-w-2xl bg-container rounded-2xl p-5 sm:p-7 border border-b2">
                {createMsg && (
                    <div className={`rounded-xl p-3 mb-4 text-sm ${createMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {createMsg.text}
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    <div className="mb-2">
                        <p className="text-sm font-medium mb-2">نوع داشبورد</p>
                        <TypeSwitcher />
                    </div>

                    <TextInput
                        label="عنوان مزایده"
                        placeholder="مثلاً: نصب آسانسور ۸ طبقه"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <Select
                        label="دسته‌بندی"
                        placeholder="نوع خدمت را انتخاب کنید"
                        data={CATEGORIES}
                        value={category}
                        onChange={setCategory}
                        searchable
                    />

                    <Textarea
                        label="توضیحات (اختیاری)"
                        placeholder="جزئیات پروژه، مشخصات فنی و..."
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        autosize
                        minRows={3}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <TextInput
                            label="شماره تماس"
                            placeholder="09xxxxxxxxx"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            dir="ltr"
                        />
                        <TextInput
                            label="شهر (اختیاری)"
                            placeholder="مثلاً: تهران"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <NumberInput
                            label="بودجه تقریبی (تومان) (اختیاری)"
                            placeholder="مثلاً: 50000000"
                            value={budget}
                            onChange={(val) => setBudget(val as number | '')}
                            thousandSeparator
                        />
                        <TextInput
                            label="مهلت پایان (اختیاری)"
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            dir="ltr"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <CustomButton
                            shadow
                            loading={submitting}
                            onClick={submitAuction}
                            className="w-full sm:w-auto"
                        >
                            ثبت مزایده
                        </CustomButton>
                        <CustomButton variant="soft" onClick={() => setView('list')} className="w-full sm:w-auto">
                            انصراف
                        </CustomButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuctionsPage;
