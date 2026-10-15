'use client';

import React, {useState, useEffect} from 'react';
import {Badge, Loader, Center, Alert} from '@mantine/core';
import {IconInfoCircle, IconCheckCircle, IconXCircle, IconClock, IconPlus} from '@tabler/icons-react';
import Link from 'next/link';
import {api} from '@/lib/api/base';
import {echoTimeDiff} from '@/lib/utils/global';

type BusinessPhoto = { id: string; photo_url: string };
type BusinessJob = { id: string; name: string; slug: string };

type Business = {
    id: string;
    business_name: string;
    full_name: string;
    job_id: string | null;
    work_experience: string | null;
    phone: string;
    email: string | null;
    other_contacts: string | null;
    description: string | null;
    address: string | null;
    city: string | null;
    location_lat: number | null;
    location_lng: number | null;
    plan: string;
    phone_verified: boolean;
    status: string;
    created_at: string;
    job: BusinessJob | null;
    photos: BusinessPhoto[];
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'در انتظار تأیید', color: 'orange', icon: <IconClock size={18} /> },
    approved: { label: 'تأییدشده', color: 'green', icon: <IconCheckCircle size={18} /> },
    rejected: { label: 'ردشده', color: 'red', icon: <IconXCircle size={18} /> },
};

function Page() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBusinesses = () => {
        setLoading(true);
        setError(null);
        api('/business/my-businesses', {}, 'GET')
            .then((res) => setBusinesses(res.data?.businesses || []))
            .catch(() => setError('خطا در دریافت کسب‌وکارها'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchBusinesses(); }, []);

    if (loading) {
        return <Center className="min-h-40"><Loader /></Center>;
    }

    if (error) {
        return (
            <div className="flex flex-col gap-4 max-w-2xl w-full">
                <Alert color="red" variant="light" icon={<IconInfoCircle size={18} />}>{error}</Alert>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 max-w-3xl w-full">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-2xl lg:text-3xl font-semibold">شغل‌های من</h3>
                <Link href="/auth/business/form" className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-white px-4 py-2.5 text-sm font-medium min-h-11 transition-colors hover:opacity-90">
                        <IconPlus size={18} />
                        ثبت کسب‌وکار جدید
                    </span>
                </Link>
            </div>
            <p className="opacity-60 text-sm">
                کسب‌وکارهای ثبت‌شده توسط شما در این بخش نمایش داده می‌شوند. پس از تأیید مدیر، کسب‌وکار شما در فهرست عمومی قرار می‌گیرد.
            </p>

            {businesses.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16">
                    <p className="opacity-50 text-center">شما هنوز کسب‌وکاری ثبت نکرده‌اید.</p>
                    <Link href="/auth/business/form" className="text-primary text-sm font-medium hover:underline">
                        ثبت کسب‌وکار جدید
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {businesses.map((b) => {
                        const cfg = statusConfig[b.status] || statusConfig.pending;
                        return (
                            <Link
                                key={b.id}
                                href={`/dashboard/my-businesses/${b.id}`}
                                className="rounded-2xl border border-[#E7F5EE] bg-white p-5 flex flex-col gap-3 shadow-[0_2px_8px_rgba(23,61,53,0.04)] hover:border-[#36B98A]/40 transition-all"
                            >
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div>
                                        <h4 className="text-lg lg:text-xl font-semibold text-[#252C2A]">{b.business_name}</h4>
                                        <p className="opacity-60 text-sm text-[#6B7771]">{b.full_name}</p>
                                    </div>
                                    <Badge color={cfg.color} size="lg" leftSection={cfg.icon} variant="light">
                                        {cfg.label}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-[#252C2A]">
                                    {b.job && (
                                        <div><span className="opacity-50">شغل:</span> {b.job.name}</div>
                                    )}
                                    {b.work_experience && (
                                        <div><span className="opacity-50">سابقه:</span> {b.work_experience}</div>
                                    )}
                                    {b.city && (
                                        <div><span className="opacity-50">شهر:</span> {b.city}</div>
                                    )}
                                    <div><span className="opacity-50">تاریخ ثبت:</span> {echoTimeDiff(b.created_at)}</div>
                                </div>

                                {b.phone_verified ? (
                                    <Badge color="green" variant="light" size="sm" leftSection={<IconCheckCircle size={14} />}>
                                        شماره تأیید شده
                                    </Badge>
                                ) : (
                                    <Badge color="orange" variant="light" size="sm" leftSection={<IconClock size={14} />}>
                                        شماره تأیید نشده
                                    </Badge>
                                )}

                                {b.photos.length > 0 && (
                                    <div className="flex gap-2 mt-1">
                                        {b.photos.slice(0, 3).map((p) => (
                                            <div key={p.id} className="w-16 h-16 rounded-lg overflow-hidden border border-[#E7F5EE]">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={p.photo_url} alt="نمونه کار" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        {b.photos.length > 3 && (
                                            <div className="w-16 h-16 rounded-lg border border-[#E7F5EE] flex items-center justify-center text-xs text-[#6B7771]">
                                                +{b.photos.length - 3}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {b.status === 'pending' && (
                                    <Alert color="orange" variant="light" icon={<IconInfoCircle size={18} />} className="mt-1">
                                        کسب‌وکار شما در انتظار بررسی مدیر است.
                                    </Alert>
                                )}
                                {b.status === 'approved' && (
                                    <Alert color="green" variant="light" icon={<IconCheckCircle size={18} />} className="mt-1">
                                        کسب‌وکار شما تأیید شده و در فهرست عمومی قرار گرفته است.
                                    </Alert>
                                )}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Page;
