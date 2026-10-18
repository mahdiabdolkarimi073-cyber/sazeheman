'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api/base';
import CustomButton from '@/components/ui/base/CustomButton';
import { TextInput, Textarea, NumberInput } from '@mantine/core';

type AuctionData = {
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

type Bid = {
    id: string;
    bidder_name: string;
    price: number;
    description: string | null;
    created_at: string;
    is_own?: boolean;
};

type FullAuction = AuctionData & {
    minIncrement: number;
    isOwner: boolean;
    isAdmin: boolean;
    ownerNickname: string | null;
    phone?: string;
};

export default function AuctionDetailClient({
    auctionId,
    initialData,
}: {
    auctionId: string;
    initialData: AuctionData;
}) {
    const [auction, setAuction] = useState<FullAuction | null>(null);
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [bidName, setBidName] = useState('');
    const [bidPhone, setBidPhone] = useState('');
    const [bidPrice, setBidPrice] = useState<number | ''>('');
    const [bidDesc, setBidDesc] = useState('');
    const [submittingBid, setSubmittingBid] = useState(false);
    const [bidMsg, setBidMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchDetail = async () => {
        try {
            const res = await api(`/auctions/${auctionId}`);
            setAuction(res.data?.auction || null);
            setBids(res.data?.bids || []);
        } catch (e: any) {
            setError(e?.message || "خطا در بارگذاری");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auctionId]);

    const submitBid = async () => {
        if (!bidName || !bidPhone || !bidPrice) {
            setBidMsg({ type: 'error', text: "نام، شماره تماس و قیمت الزامی است" });
            return;
        }
        setSubmittingBid(true);
        setBidMsg(null);
        try {
            await api(`/auctions/${auctionId}`, {
                bidder_name: bidName,
                phone: bidPhone,
                price: bidPrice,
                description: bidDesc,
            });
            setBidMsg({ type: 'success', text: "پیشنهاد شما ثبت شد" });
            setBidName(''); setBidPhone(''); setBidPrice(''); setBidDesc('');
            await fetchDetail();
        } catch (e: any) {
            setBidMsg({ type: 'error', text: e?.message || "خطا در ثبت پیشنهاد" });
        } finally {
            setSubmittingBid(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center">
                <p className="text-sm text-[#6B7771]">در حال بارگذاری...</p>
            </div>
        );
    }

    if (error || !auction) {
        return (
            <div className="w-full max-w-3xl mx-auto px-4 py-20 text-center">
                <p className="text-sm text-red-600 mb-4">{error || "مزایده یافت نشد"}</p>
                <Link href="/auctions" className="text-primary text-sm hover:underline">بازگشت به لیست</Link>
            </div>
        );
    }

    const isOpen = auction.status === 'open';
    const isAwarded = auction.status === 'awarded';
    const deadlinePassed = auction.deadline && new Date(auction.deadline) < new Date();

    const statusLabel = isAwarded ? "برنده انتخاب شده" : isOpen ? "باز" : "بسته شده";
    const statusColor = isOpen ? "bg-[#36B98A]/10 text-[#36B98A]" : isAwarded ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500";

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
            <Link href="/auctions" className="text-sm text-[#6B7771] hover:text-primary mb-4 inline-block">
                ← بازگشت به لیست مزایده‌ها
            </Link>

            <div className="bg-white rounded-2xl border border-b2 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-[#252C2A]">{auction.title}</h1>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded bg-[#36B98A]/8 text-[#36B98A] text-xs font-medium">{auction.category}</span>
                            {auction.city && <span className="text-xs text-[#6B7771]">• {auction.city}</span>}
                        </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full whitespace-nowrap font-medium ${statusColor}`}>
                        {statusLabel}
                    </span>
                </div>

                {auction.description && (
                    <p className="text-sm text-[#4a5550] mb-6 leading-relaxed">{auction.description}</p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-6">
                    {auction.budget && (
                        <div className="bg-[#F7F8F6] rounded-xl p-3">
                            <p className="text-xs text-[#6B7771] mb-1">بودجه پایه</p>
                            <p className="font-bold text-[#252C2A]">{Number(auction.budget).toLocaleString('fa')} تومان</p>
                        </div>
                    )}
                    {auction.currentBid !== null && (
                        <div className="bg-primary/5 rounded-xl p-3">
                            <p className="text-xs text-[#6B7771] mb-1">کمترین پیشنهاد</p>
                            <p className="font-bold text-primary">{Number(auction.currentBid).toLocaleString('fa')} تومان</p>
                        </div>
                    )}
                    <div className="bg-[#F7F8F6] rounded-xl p-3">
                        <p className="text-xs text-[#6B7771] mb-1">تعداد پیشنهادها</p>
                        <p className="font-bold text-[#252C2A]">{auction.bidsCount.toLocaleString('fa')}</p>
                    </div>
                    {auction.deadline && (
                        <div className="bg-[#F7F8F6] rounded-xl p-3">
                            <p className="text-xs text-[#6B7771] mb-1">مهلت پایان</p>
                            <p className="font-bold text-[#252C2A] text-xs">
                                {new Date(auction.deadline).toLocaleDateString('fa')}
                            </p>
                        </div>
                    )}
                </div>

                {isOpen && deadlinePassed && (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 mb-6 text-sm text-amber-700">
                        مهلت این مزایده به پایان رسیده است و منتظر انتخاب برنده توسط صاحب مزایده است.
                    </div>
                )}

                {/* Bidding form */}
                {isOpen && !deadlinePassed && !auction.isOwner && (
                    <div className="border-t border-b2 pt-6 mb-6">
                        <h2 className="font-bold text-base mb-4">ثبت پیشنهاد قیمت</h2>
                        {bidMsg && (
                            <div className={`rounded-xl p-3 mb-4 text-sm ${bidMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {bidMsg.text}
                            </div>
                        )}
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
                                placeholder={auction.currentBid ? `کمتر از ${Number(auction.currentBid).toLocaleString('fa')}` : "مثلاً: 5000000"}
                                value={bidPrice}
                                onChange={(val) => setBidPrice(val as number | '')}
                                thousandSeparator
                            />
                            {auction.minIncrement > 0 && auction.currentBid !== null && (
                                <p className="text-xs text-[#6B7771]">
                                    حداقل کاهش نسبت به کمترین پیشنهاد: {auction.minIncrement.toLocaleString('fa')} تومان
                                </p>
                            )}
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

                {isOpen && auction.isOwner && (
                    <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 mb-6 text-sm text-blue-700">
                        شما صاحب این مزایده هستید و نمی‌توانید در آن پیشنهاد ثبت کنید.
                    </div>
                )}

                {auction.isOwner && auction.phone && (
                    <div className="text-xs text-[#6B7771] mb-4">
                        شماره تماس مزایده (فقط برای صاحب): <span dir="ltr">{auction.phone}</span>
                    </div>
                )}

                {/* Bid history */}
                <div className="border-t border-b2 pt-6">
                    <h2 className="font-bold text-base mb-4">تاریخچه پیشنهادها ({bids.length.toLocaleString('fa')})</h2>
                    {bids.length === 0 ? (
                        <p className="text-sm text-[#6B7771] text-center py-6">هنوز پیشنهادی ثبت نشده است</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {bids.map((bid, i) => (
                                <div
                                    key={bid.id}
                                    className={`flex items-center justify-between p-3 rounded-xl border ${
                                        i === 0 ? 'border-primary bg-primary/5' : 'border-b2 bg-[#F7F8F6]'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-7 h-7 rounded-full bg-white border border-b2 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            {(i + 1).toLocaleString('fa')}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {bid.bidder_name}
                                                {bid.is_own && <span className="text-xs text-primary mr-2">(پیشنهاد شما)</span>}
                                            </p>
                                            {bid.description && <p className="text-xs text-[#6B7771] truncate">{bid.description}</p>}
                                        </div>
                                    </div>
                                    <div className="text-left flex-shrink-0">
                                        <p className={`font-bold text-sm ${i === 0 ? 'text-primary' : ''}`}>
                                            {Number(bid.price).toLocaleString('fa')} تومان
                                        </p>
                                        {i === 0 && <span className="text-xs text-primary">کمترین قیمت</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
