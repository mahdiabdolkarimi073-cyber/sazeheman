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

function AuctionsPage() {
    const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
    const [auctions, setAuctions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedAuction, setSelectedAuction] = useState<any>(null);
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

    // bid form
    const [bidName, setBidName] = useState('');
    const [bidPhone, setBidPhone] = useState('');
    const [bidPrice, setBidPrice] = useState<number | ''>('');
    const [bidDesc, setBidDesc] = useState('');
    const [submittingBid, setSubmittingBid] = useState(false);

    const loadAuctions = (type?: string) => {
        setLoading(true);
        const dt = type || dashboardType;
        api("/auctions", { dashboard_type: dt })
            .then(e => setAuctions(e.data?.auctions || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const saved = localStorage.getItem('dashboard_type');
        if (saved && saved !== dashboardType) {
            setDashboardType(saved);
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
    };

    const submitAuction = async () => {
        if (!title || !category || !phone) {
            window.alert?.("عنوان، دسته‌بندی و شماره تماس الزامی است");
            return;
        }
        setSubmitting(true);
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
            });
            setView('list');
            setTitle(''); setCategory(null); setDesc(''); setPhone(''); setCity(''); setBudget(''); setDeadline('');
            loadAuctions();
        } catch {}
        setSubmitting(false);
    };

    const openDetail = (auction: any) => {
        setSelectedAuction(auction);
        setView('detail');
        api("/auctions/" + auction.id)
            .then(e => setSelectedAuction(e.data?.auction))
            .catch(() => {});
    };

    const submitBid = async () => {
        if (!bidName || !bidPhone || !bidPrice) {
            window.alert?.("نام، شماره تماس و قیمت الزامی است");
            return;
        }
        setSubmittingBid(true);
        try {
            await api("/auctions/" + selectedAuction.id, {
                bidder_name: bidName,
                phone: bidPhone,
                price: bidPrice,
                description: bidDesc,
            });
            const updated = await api("/auctions/" + selectedAuction.id);
            setSelectedAuction(updated.data?.auction);
            setBidName(''); setBidPhone(''); setBidPrice(''); setBidDesc('');
        } catch {}
        setSubmittingBid(false);
    };

    const closeAuction = async () => {
        try {
            await api("/auctions/" + selectedAuction.id, { action: "close" }, "PUT");
            const updated = await api("/auctions/" + selectedAuction.id);
            setSelectedAuction(updated.data?.auction);
            loadAuctions();
        } catch {}
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
                        <h1 className="text-xl sm:text-2xl font-semibold">مزایده‌ها</h1>
                        <p className="text-sm opacity-70 mt-1">مزایده راه بیندازید و کمترین قیمت را انتخاب کنید</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <TypeSwitcher />
                        <CustomButton shadow onClick={() => setView('create')}>
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
                                        <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${a.status === 'open' ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-600'}`}>
                                            {a.status === 'open' ? 'باز' : 'بسته شده'}
                                        </span>
                                    </div>
                                    <p className="text-xs opacity-60 mb-2">{a.category}</p>
                                    {a.city && <p className="text-xs opacity-50">شهر: {a.city}</p>}
                                    {a.budget && <p className="text-xs opacity-50">بودجه: {Number(a.budget).toLocaleString('fa')} تومان</p>}
                                    <p className="text-xs opacity-50 mt-2">
                                        {(a.bids?.length || 0)} پیشنهاد قیمت
                                    </p>
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
        const bids = selectedAuction.bids || [];
        const lowestBid = bids.length > 0 ? bids.reduce((min: any, b: any) => b.price < min.price ? b : min) : null;

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
                        <span className={`text-xs px-3 py-1 rounded-full ${selectedAuction.status === 'open' ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-600'}`}>
                            {selectedAuction.status === 'open' ? 'باز' : 'بسته شده'}
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
                        <div><span className="opacity-50">تلفن:</span> {selectedAuction.phone}</div>
                    </div>

                    {selectedAuction.status === 'open' && (
                        <div className="mb-6">
                            <CustomButton variant="soft" onClick={closeAuction} className="text-sm!">
                                بستن مزایده
                            </CustomButton>
                        </div>
                    )}

                    <div className="border-t border-b2 pt-5">
                        <h3 className="font-medium mb-3">پیشنهادهای قیمت ({bids.length})</h3>
                        {bids.length === 0 ? (
                            <p className="text-sm opacity-50 text-center py-6">هنوز پیشنهادی ثبت نشده است</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {bids.map((bid: any, i: number) => (
                                    <div
                                        key={bid.id}
                                        className={`flex items-center justify-between p-3 rounded-xl border ${lowestBid?.id === bid.id ? 'border-primary bg-primary/5' : 'border-b2 bg-background'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-7 h-7 rounded-full bg-b1 flex items-center justify-center text-xs font-bold">
                                                {(i + 1).toLocaleString('fa')}
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium">{bid.bidder_name}</p>
                                                {bid.description && <p className="text-xs opacity-50">{bid.description}</p>}
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <p className={`font-bold text-sm ${lowestBid?.id === bid.id ? 'text-primary' : ''}`}>
                                                {Number(bid.price).toLocaleString('fa')} تومان
                                            </p>
                                            {lowestBid?.id === bid.id && (
                                                <span className="text-xs text-primary">کمترین قیمت</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedAuction.status === 'open' && (
                        <div className="border-t border-b2 pt-5 mt-5">
                            <h3 className="font-medium mb-3">ثبت پیشنهاد قیمت</h3>
                            <div className="flex flex-col gap-3 max-w-lg">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <TextInput
                                        label="نام شما"
                                        placeholder="نام و نام خانوادگی"
                                        value={bidName}
                                        onChange={(e) => setBidName(e.target.value)}
                                    />
                                    <TextInput
                                        label="شماره تماس"
                                        placeholder="09xxxxxxxxx"
                                        value={bidPhone}
                                        onChange={(e) => setBidPhone(e.target.value)}
                                        dir="ltr"
                                    />
                                </div>
                                <NumberInput
                                    label="قیمت پیشنهادی (تومان)"
                                    placeholder="مثلاً: 5000000"
                                    value={bidPrice}
                                    onChange={(val) => setBidPrice(val as number | '')}
                                    thousandSeparator
                                />
                                <Textarea
                                    label="توضیحات (اختیاری)"
                                    placeholder="توضیحات پیشنهاد..."
                                    value={bidDesc}
                                    onChange={(e) => setBidDesc(e.target.value)}
                                    autosize
                                    minRows={2}
                                />
                                <CustomButton
                                    shadow
                                    loading={submittingBid}
                                    onClick={submitBid}
                                    className="w-full sm:w-auto"
                                >
                                    ثبت پیشنهاد
                                </CustomButton>
                            </div>
                        </div>
                    )}
                </div>
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
