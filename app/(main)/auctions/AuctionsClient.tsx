'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api/base';
import CustomButton from '@/components/ui/base/CustomButton';
import { TextInput, Select } from '@mantine/core';

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
};

type Filters = {
    q: string;
    category: string;
    city: string;
    status: string;
    min_price: string;
    max_price: string;
    has_bids: string;
    sort: string;
    page: number;
};

export default function AuctionsClient({
    initialCategories,
    initialCities,
    initialFilters,
}: {
    initialCategories: string[];
    initialCities: string[];
    initialFilters: Filters;
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const fetchAuctions = useCallback(async (f: Filters) => {
        setLoading(true);
        setError('');
        try {
            const params: Record<string, any> = {
                q: f.q || undefined,
                category: f.category || undefined,
                city: f.city || undefined,
                status: f.status || undefined,
                min_price: f.min_price || undefined,
                max_price: f.max_price || undefined,
                has_bids: f.has_bids || undefined,
                sort: f.sort || undefined,
                page: f.page,
                limit: 12,
            };
            const res = await api("/auctions", params);
            setAuctions(res.data?.auctions || []);
            setTotal(res.data?.total || 0);
            setTotalPages(res.data?.totalPages || 1);
        } catch (e: any) {
            setError(e?.message || "خطا در بارگذاری مزایده‌ها");
            setAuctions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAuctions(filters);
    }, [filters, fetchAuctions]);

    const updateURL = (f: Filters) => {
        const params = new URLSearchParams();
        if (f.q) params.set("q", f.q);
        if (f.category) params.set("category", f.category);
        if (f.city) params.set("city", f.city);
        if (f.status && f.status !== "open") params.set("status", f.status);
        if (f.min_price) params.set("min_price", f.min_price);
        if (f.max_price) params.set("max_price", f.max_price);
        if (f.has_bids) params.set("has_bids", f.has_bids);
        if (f.sort && f.sort !== "newest") params.set("sort", f.sort);
        if (f.page > 1) params.set("page", String(f.page));
        const qs = params.toString();
        router.replace(qs ? `/auctions?${qs}` : "/auctions");
    };

    const applyFilters = (partial: Partial<Filters>) => {
        const next = { ...filters, ...partial, page: 1 };
        setFilters(next);
        updateURL(next);
    };

    const clearFilters = () => {
        const cleared: Filters = {
            q: "", category: "", city: "", status: "open",
            min_price: "", max_price: "", has_bids: "", sort: "newest", page: 1,
        };
        setFilters(cleared);
        updateURL(cleared);
    };

    const goToPage = (p: number) => {
        const next = { ...filters, page: p };
        setFilters(next);
        updateURL(next);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const statusLabel = (s: string) => {
        if (s === "open") return "باز";
        if (s === "closed") return "بسته شده";
        if (s === "awarded") return "برنده انتخاب شده";
        return s;
    };

    const deadlineLabel = (d: string | null) => {
        if (!d) return "بدون مهلت";
        const date = new Date(d);
        const now = new Date();
        const diff = date.getTime() - now.getTime();
        if (diff <= 0) return "پایان یافته";
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days <= 1) return "چند ساعت باقی‌مانده";
        return `${days.toLocaleString('fa')} روز باقی‌مانده`;
    };

    const hasActiveFilters = filters.q || filters.category || filters.city ||
        filters.min_price || filters.max_price || filters.has_bids ||
        (filters.status && filters.status !== "open") ||
        (filters.sort && filters.sort !== "newest");

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-8 rounded-full bg-primary" />
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#252C2A]">مزایده‌های ساختمانی</h1>
                    <p className="text-sm text-[#6B7771] mt-1">
                        {total > 0 ? `${total.toLocaleString('fa')} مزایده` : "مزایده‌های فعال صنعت ساختمان"}
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Mobile filter toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-b2 text-sm font-medium"
                >
                    {showFilters ? "بستن فیلترها" : "نمایش فیلترها"}
                </button>

                {/* Filters sidebar */}
                <aside className={`${showFilters ? "block" : "hidden"} lg:block w-full lg:w-72 flex-shrink-0`}>
                    <div className="bg-white rounded-2xl border border-b2 p-5 sticky top-4 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-sm">فیلترها</h2>
                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="text-xs text-primary hover:underline">
                                    پاک کردن همه
                                </button>
                            )}
                        </div>

                        <TextInput
                            label="جستجو"
                            placeholder="عنوان، توضیحات..."
                            value={filters.q}
                            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                            onKeyDown={(e) => { if (e.key === "Enter") applyFilters({ q: filters.q }); }}
                        />

                        <Select
                            label="دسته‌بندی"
                            placeholder="همه دسته‌ها"
                            data={initialCategories.map((c) => ({ value: c, label: c }))}
                            value={filters.category || null}
                            onChange={(val) => applyFilters({ category: val || "" })}
                            searchable
                            clearable
                        />

                        <Select
                            label="شهر"
                            placeholder="همه شهرها"
                            data={initialCities.map((c) => ({ value: c, label: c }))}
                            value={filters.city || null}
                            onChange={(val) => applyFilters({ city: val || "" })}
                            searchable
                            clearable
                        />

                        <Select
                            label="وضعیت"
                            data={[
                                { value: "open", label: "باز" },
                                { value: "ending_soon", label: "در حال پایان" },
                                { value: "awarded", label: "برنده انتخاب شده" },
                                { value: "closed", label: "بسته شده" },
                                { value: "all", label: "همه" },
                            ]}
                            value={filters.status}
                            onChange={(val) => applyFilters({ status: val || "open" })}
                        />

                        <div className="flex gap-2">
                            <TextInput
                                label="حداقل قیمت"
                                placeholder="تومان"
                                type="number"
                                value={filters.min_price}
                                onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                                onBlur={() => applyFilters({ min_price: filters.min_price })}
                                className="flex-1"
                            />
                            <TextInput
                                label="حداکثر قیمت"
                                placeholder="تومان"
                                type="number"
                                value={filters.max_price}
                                onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                                onBlur={() => applyFilters({ max_price: filters.max_price })}
                                className="flex-1"
                            />
                        </div>

                        <Select
                            label="پیشنهادها"
                            data={[
                                { value: "", label: "همه" },
                                { value: "yes", label: "دارای پیشنهاد" },
                                { value: "no", label: "بدون پیشنهاد" },
                            ]}
                            value={filters.has_bids}
                            onChange={(val) => applyFilters({ has_bids: val || "" })}
                        />

                        <Select
                            label="مرتب‌سازی"
                            data={[
                                { value: "newest", label: "جدیدترین" },
                                { value: "oldest", label: "قدیمی‌ترین" },
                                { value: "price_asc", label: "قیمت صعودی" },
                                { value: "price_desc", label: "قیمت نزولی" },
                                { value: "ending_soon", label: "نزدیک به پایان" },
                            ]}
                            value={filters.sort}
                            onChange={(val) => applyFilters({ sort: val || "newest" })}
                        />
                    </div>
                </aside>

                {/* Results */}
                <div className="flex-1 min-w-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <p className="text-sm text-[#6B7771]">در حال بارگذاری...</p>
                        </div>
                    ) : error ? (
                        <div className="rounded-xl bg-white border border-red-200 p-8 text-center">
                            <p className="text-sm text-red-600">{error}</p>
                            <CustomButton variant="soft" className="mt-4" onClick={() => fetchAuctions(filters)}>
                                تلاش مجدد
                            </CustomButton>
                        </div>
                    ) : auctions.length === 0 ? (
                        <div className="rounded-xl bg-white border border-b2 p-10 text-center">
                            <p className="text-sm text-[#6B7771]">مزایده‌ای با این فیلترها یافت نشد.</p>
                            {hasActiveFilters && (
                                <CustomButton variant="soft" className="mt-4" onClick={clearFilters}>
                                    پاک کردن فیلترها
                                </CustomButton>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {auctions.map((a) => (
                                    <Link
                                        key={a.id}
                                        href={`/auctions/${a.id}`}
                                        className="rounded-xl bg-white border border-b2 p-5 flex flex-col gap-3 hover:border-primary/30 transition-all hover-lift"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-bold text-sm leading-tight text-[#252c2a] line-clamp-2">{a.title}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium flex-shrink-0 ${
                                                a.status === 'open' ? 'bg-[#36B98A]/10 text-[#36B98A]' :
                                                a.status === 'awarded' ? 'bg-blue-50 text-blue-600' :
                                                'bg-gray-100 text-gray-500'
                                            }`}>
                                                {statusLabel(a.status)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-[#6b7771] flex-wrap">
                                            <span className="px-2 py-0.5 rounded bg-[#36B98A]/8 text-[#36B98A] font-medium">{a.category}</span>
                                            {a.city && <span>• {a.city}</span>}
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-[#6B7771] border-t border-b2 pt-3 mt-auto">
                                            <span>{deadlineLabel(a.deadline)}</span>
                                            <span>{a.bidsCount.toLocaleString('fa')} پیشنهاد</span>
                                        </div>
                                        <div className="text-sm font-medium text-[#252c2a]">
                                            {a.currentBid
                                                ? `${Number(a.currentBid).toLocaleString('fa')} تومان`
                                                : a.budget
                                                ? `شروع از ${Number(a.budget).toLocaleString('fa')} تومان`
                                                : "قیمت پایه ندارد"}
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => goToPage(Math.max(1, filters.page - 1))}
                                        disabled={filters.page <= 1}
                                        className="px-3 py-2 rounded-lg text-sm border border-b2 bg-white disabled:opacity-40"
                                    >
                                        قبلی
                                    </button>
                                    <span className="text-sm text-[#6B7771]">
                                        صفحه {filters.page.toLocaleString('fa')} از {totalPages.toLocaleString('fa')}
                                    </span>
                                    <button
                                        onClick={() => goToPage(Math.min(totalPages, filters.page + 1))}
                                        disabled={filters.page >= totalPages}
                                        className="px-3 py-2 rounded-lg text-sm border border-b2 bg-white disabled:opacity-40"
                                    >
                                        بعدی
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
