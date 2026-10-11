'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api/base';
import CustomButton from '@/components/ui/base/CustomButton';
import { TextInput, Textarea, Select } from '@mantine/core';

type AdStatus = 'idle' | 'form' | 'payment' | 'success';

function AdsPage() {
    const [step, setStep] = useState<AdStatus>('idle');
    const [existingAds, setExistingAds] = useState<any[]>([]);
    const [loadingAds, setLoadingAds] = useState(false);

    // form state
    const [bizName, setBizName] = useState('');
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [mediaType, setMediaType] = useState<string | null>('image');
    const [mediaUrl, setMediaUrl] = useState('');
    const [linkUrl, setLinkUrl] = useState('');
    const [phone, setPhone] = useState('');
    const [duration, setDuration] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);

    const loadAds = () => {
        setLoadingAds(true);
        api("/ads")
            .then(e => setExistingAds(e.data?.ads || []))
            .catch(() => {})
            .finally(() => setLoadingAds(false));
    };

    const handleFileChange = (file: File | null) => {
        if (!file) return;
        if (file.type.startsWith('video/')) {
            setMediaType('video');
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                setDuration(Math.round(video.duration));
                if (video.duration > 30) {
                    window.alert?.("حداکثر مدت ویدیو ۳۰ ثانیه است");
                }
            };
            URL.createObjectURL(file);
        } else {
            setMediaType('image');
        }
        setMediaUrl(URL.createObjectURL(file));
    };

    const submitAd = async () => {
        if (!bizName || !title || !mediaUrl) {
            window.alert?.("نام کسب و کار، عنوان و فایل رسانه الزامی است");
            return;
        }
        if (mediaType === 'video' && duration > 30) {
            window.alert?.("مدت ویدیو بیش از ۳۰ ثانیه است");
            return;
        }
        setSubmitting(true);
        try {
            await api("/ads", {
                business_name: bizName,
                title,
                description: desc,
                media_url: mediaUrl,
                media_type: mediaType,
                link_url: linkUrl,
                phone,
                amount_paid: 100000,
            });
            setStep('success');
            setBizName(''); setTitle(''); setDesc(''); setMediaUrl(''); setLinkUrl(''); setPhone('');
        } catch {}
        setSubmitting(false);
    };

    if (step === 'idle') {
        return (
            <div className="flex flex-col gap-5 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold">تبلیغات شما</h1>
                        <p className="text-sm opacity-70 mt-1">تبلیغ کسب و کار خود را در صفحه اصلی سایت قرار دهید</p>
                    </div>
                    <CustomButton shadow onClick={() => { setStep('form'); loadAds(); }}>
                        + ثبت تبلیغ جدید
                    </CustomButton>
                </div>

                <div className="bg-container rounded-2xl p-5 border border-b2">
                    {loadingAds ? (
                        <p className="text-sm opacity-50 text-center py-8">در حال بارگذاری...</p>
                    ) : existingAds.length === 0 ? (
                        <div className="text-center py-12 flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-b1 flex items-center justify-center">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="5" width="18" height="14" rx="2" />
                                    <path d="M3 17l5-5 4 4 3-3 6 6" />
                                </svg>
                            </div>
                            <p className="opacity-60 text-sm">هنوز تبلیفی ثبت نکرده‌اید</p>
                            <CustomButton shadow onClick={() => setStep('form')}>
                                شروع ثبت تبلیغ
                            </CustomButton>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {existingAds.map((ad) => (
                                <div key={ad.id} className="bg-background rounded-xl border border-b2 overflow-hidden">
                                    <div className="h-32 bg-container relative">
                                        {ad.media_type === 'video' ? (
                                            <video src={ad.media_url} className="w-full h-full object-cover" muted />
                                        ) : (
                                            <img src={ad.media_url} alt={ad.title} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-medium text-sm">{ad.title}</h3>
                                        <p className="text-xs opacity-60 mt-1">{ad.business_name}</p>
                                        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                            {ad.status === 'active' ? 'فعال' : 'در انتظار'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 gap-4">
                <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold">تبلیغ شما ثبت شد!</h2>
                <p className="text-sm opacity-70 text-center max-w-md">
                    تبلیغ شما پس از تایید در صفحه اصلی سایت نمایش داده می‌شود.
                </p>
                <CustomButton shadow onClick={() => setStep('idle')}>
                    بازگشت به تبلیغات
                </CustomButton>
            </div>
        );
    }

    // form step
    return (
        <div className="flex flex-col gap-5 p-4 sm:p-6">
            <div className="flex items-center gap-3">
                <button onClick={() => setStep('idle')} className="text-sm opacity-70 hover:opacity-100">
                    بازگشت
                </button>
                <h1 className="text-xl sm:text-2xl font-semibold">ثبت تبلیغ جدید</h1>
            </div>

            <div className="max-w-2xl bg-container rounded-2xl p-5 sm:p-7 border border-b2">
                <div className="flex flex-col gap-4">
                    <TextInput
                        label="نام کسب و کار"
                        placeholder="مثلاً: شرکت ساختمانی پارس"
                        value={bizName}
                        onChange={(e) => setBizName(e.target.value)}
                    />
                    <TextInput
                        label="عنوان تبلیغ"
                        placeholder="عنوان جذاب برای تبلیغ شما"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Textarea
                        label="توضیحات (اختیاری)"
                        placeholder="توضیحات تبلیغ..."
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        autosize
                        minRows={2}
                    />
                    <TextInput
                        label="لینک (اختیاری)"
                        placeholder="https://..."
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        dir="ltr"
                    />
                    <TextInput
                        label="شماره تماس (اختیاری)"
                        placeholder="09xxxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        dir="ltr"
                    />

                    <div>
                        <label className="text-sm font-medium mb-2 block">فایل رسانه (عکس یا ویدیوی حداکثر ۳۰ ثانیه)</label>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-black/70 file:mr-0 file:ml-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer file:font-medium"
                        />
                        {mediaUrl && (
                            <div className="mt-3 rounded-xl overflow-hidden border border-b2 bg-background">
                                {mediaType === 'video' ? (
                                    <video src={mediaUrl} className="w-full max-h-48 object-contain" controls muted />
                                ) : (
                                    <img src={mediaUrl} alt="preview" className="w-full max-h-48 object-contain" />
                                )}
                                {mediaType === 'video' && duration > 0 && (
                                    <p className={`text-xs p-2 ${duration > 30 ? 'text-red-500' : 'text-primary'}`}>
                                        مدت ویدیو: {duration} ثانیه {duration > 30 && "(بیش از حد مجاز!)"}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">هزینه تبلیغ</span>
                            <span className="text-primary font-bold">۱۰۰,۰۰۰ تومان</span>
                        </div>
                        <p className="text-xs opacity-60">
                            پرداخت فعلا غیرفعال است و فقط برای نمایش قرار داده شده است
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <CustomButton
                            shadow
                            loading={submitting}
                            onClick={submitAd}
                            className="w-full sm:w-auto"
                        >
                            ثبت و پرداخت (نمایشی)
                        </CustomButton>
                        <CustomButton variant="soft" onClick={() => setStep('idle')} className="w-full sm:w-auto">
                            انصراف
                        </CustomButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdsPage;
