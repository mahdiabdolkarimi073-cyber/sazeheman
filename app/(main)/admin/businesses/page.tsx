'use client';

import React, { useState, useEffect } from 'react';
import {
    Loader, Center, Modal, Textarea, Alert, Badge, TextInput,
} from '@mantine/core';
import {
    IconCheckCircle, IconXCircle, IconClock, IconSearch, IconEye,
} from '@/components/assets/tabler-icons';
import CustomButton from '@/components/ui/base/CustomButton';
import { api } from '@/lib/api/base';
import { echoTimeDiff } from '@/lib/utils/global';

type BusinessPhoto = { id: string; photo_url: string };

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
    rejection_reason: string | null;
    user_id: string | null;
    created_at: string;
    photos: BusinessPhoto[];
    job: { id: string; name: string; slug: string } | null;
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'در انتظار', color: 'orange', icon: <IconClock size={16} /> },
    approved: { label: 'تأییدشده', color: 'green', icon: <IconCheckCircle size={16} /> },
    rejected: { label: 'ردشده', color: 'red', icon: <IconXCircle size={16} /> },
};

function AdminBusinesses() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [acting, setActing] = useState<string | null>(null);
    const [rejectModal, setRejectModal] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectError, setRejectError] = useState(false);
    const [detailBusiness, setDetailBusiness] = useState<Business | null>(null);

    const fetchBusinesses = (status: string, searchQuery: string) => {
        setLoading(true);
        const params: Record<string, any> = {};
        if (status !== 'all') params.status = status;
        if (searchQuery) params.search = searchQuery;
        api('/business', params, 'GET')
            .then((res) => setBusinesses(res.data?.businesses || []))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const t = setTimeout(() => fetchBusinesses(filter, search), 300);
        return () => clearTimeout(t);
    }, [filter, search]);

    const handleApprove = (businessId: string) => {
        setActing(businessId);
        api('/business/approve', { business_id: businessId, action: 'approve' }, 'POST')
            .then(() => {
                fetchBusinesses(filter, search);
                setDetailBusiness(null);
            })
            .finally(() => setActing(null));
    };

    const handleReject = () => {
        if (!rejectReason.trim()) {
            setRejectError(true);
            return;
        }
        setActing(rejectModal);
        api('/business/approve', { business_id: rejectModal, action: 'reject', rejection_reason: rejectReason.trim() }, 'POST')
            .then(() => {
                setRejectModal(null);
                setRejectReason('');
                setRejectError(false);
                fetchBusinesses(filter, search);
                setDetailBusiness(null);
            })
            .finally(() => setActing(null));
    };

    const closeRejectModal = () => {
        setRejectModal(null);
        setRejectReason('');
        setRejectError(false);
    };

    const filtered = search
        ? businesses.filter((b) =>
            b.business_name.includes(search) || b.full_name.includes(search) || (b.city || '').includes(search)
        )
        : businesses;

    return (
        <div className="flex flex-col gap-5 max-w-5xl w-full">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold">مدیریت کسب‌وکارها</h1>
                <p className="text-gray-400 text-sm mt-1">
                    بررسی، تأیید یا رد کسب‌وکارهای ثبت‌شده توسط کاربران
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <TextInput
                    placeholder="جستجو بر اساس نام، فرد، شهر..."
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                    className="flex-1"
                    leftSection={<IconSearch size={18} />}
                />
                <div className="flex gap-2 flex-wrap">
                    {[
                        { key: 'all', label: 'همه' },
                        { key: 'pending', label: 'در انتظار' },
                        { key: 'approved', label: 'تأییدشده' },
                        { key: 'rejected', label: 'ردشده' },
                    ].map((s) => (
                        <button
                            key={s.key}
                            onClick={() => setFilter(s.key)}
                            className={`px-4 py-2 rounded-xl text-sm transition-all min-h-11 ${
                                filter === s.key ? 'bg-primary text-white' : 'bg-white/5 hover:bg-white/10'
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <Center className="min-h-40">
                    <Loader />
                </Center>
            ) : filtered.length === 0 ? (
                <p className="text-gray-500 text-center py-10">کسب‌وکاری یافت نشد</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map((b) => {
                        const cfg = statusConfig[b.status] || statusConfig.pending;
                        return (
                            <div
                                key={b.id}
                                className="rounded-2xl border border-white/10 bg-[#161A21] p-4 flex flex-col gap-3"
                            >
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-semibold truncate">{b.business_name}</h3>
                                        <p className="text-gray-400 text-sm">{b.full_name}</p>
                                    </div>
                                    <Badge color={cfg.color} size="md" variant="light" leftSection={cfg.icon}>
                                        {cfg.label}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                                    {b.job && (
                                        <div className="text-gray-400">
                                            <span className="opacity-60">شغل:</span> {b.job.name}
                                        </div>
                                    )}
                                    {b.city && (
                                        <div className="text-gray-400">
                                            <span className="opacity-60">شهر:</span> {b.city}
                                        </div>
                                    )}
                                    <div className="text-gray-400">
                                        <span className="opacity-60">طرح:</span> {b.plan}
                                    </div>
                                    <div className="text-gray-400">
                                        <span className="opacity-60">ثبت:</span> {echoTimeDiff(b.created_at)}
                                    </div>
                                </div>

                                {b.photos && b.photos.length > 0 && (
                                    <div className="flex gap-2 flex-wrap">
                                        {b.photos.slice(0, 4).map((ph) => (
                                            <div key={ph.id} className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={ph.photo_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        {b.photos.length > 4 && (
                                            <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center text-xs text-gray-400 shrink-0">
                                                +{b.photos.length - 4}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {b.status === 'rejected' && b.rejection_reason && (
                                    <Alert color="red" variant="light" icon={<IconXCircle size={18} />} className="text-sm">
                                        <span className="font-medium">دلیل رد:</span> {b.rejection_reason}
                                    </Alert>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    <CustomButton
                                        variant="soft"
                                        className="small"
                                        onClick={() => setDetailBusiness(b)}
                                    >
                                        <span className="flex items-center gap-1"><IconEye size={16} /> جزئیات</span>
                                    </CustomButton>
                                    {b.status === 'pending' && (
                                        <>
                                            <CustomButton
                                                loading={acting === b.id}
                                                onClick={() => handleApprove(b.id)}
                                                className="small"
                                            >
                                                تأیید
                                            </CustomButton>
                                            <CustomButton
                                                loading={acting === b.id}
                                                variant="soft"
                                                className="small"
                                                onClick={() => { setRejectModal(b.id); setRejectReason(''); setRejectError(false); }}
                                            >
                                                رد
                                            </CustomButton>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Detail Modal */}
            <Modal
                opened={!!detailBusiness}
                onClose={() => setDetailBusiness(null)}
                title="جزئیات کسب‌وکار"
                centered
                size="lg"
                scrollAreaComponent="div"
            >
                {detailBusiness && <BusinessDetail business={detailBusiness} />}
            </Modal>

            {/* Reject Modal */}
            <Modal
                opened={!!rejectModal}
                onClose={closeRejectModal}
                title="رد کسب‌وکار"
                centered
                size="md"
            >
                <div className="flex flex-col gap-4">
                    <p className="text-sm opacity-70">لطفاً دلیل رد این کسب‌وکار را بنویسید. این دلیل به صاحب کسب‌وکار نمایش داده می‌شود.</p>
                    <Textarea
                        placeholder="دلیل رد کسب‌وکار..."
                        value={rejectReason}
                        onChange={(e) => { setRejectReason(e.currentTarget.value); setRejectError(false); }}
                        autosize
                        minRows={3}
                        error={rejectError ? 'ذکر دلیل رد الزامی است' : undefined}
                    />
                    <div className="flex gap-2 justify-end">
                        <CustomButton variant="outline" onClick={closeRejectModal} className="small">
                            انصراف
                        </CustomButton>
                        <CustomButton loading={!!acting} onClick={handleReject} className="small">
                            تأیید رد
                        </CustomButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

function BusinessDetail({ business }: { business: Business }) {
    const cfg = statusConfig[business.status] || statusConfig.pending;
    return (
        <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl font-semibold">{business.business_name}</h3>
                <Badge color={cfg.color} size="lg" variant="light" leftSection={cfg.icon}>
                    {cfg.label}
                </Badge>
            </div>

            {business.photos && business.photos.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {business.photos.map((ph) => (
                        <div key={ph.id} className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={ph.photo_url} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailRow label="نام کامل" value={business.full_name} />
                {business.job && <DetailRow label="شغل" value={business.job.name} />}
                {business.work_experience && <DetailRow label="سابقه کار" value={business.work_experience} />}
                <DetailRow label="شهر" value={business.city} />
                <DetailRow label="تلفن" value={business.phone} ltr />
                {business.email && <DetailRow label="ایمیل" value={business.email} ltr />}
                {business.other_contacts && <DetailRow label="سایر تماس‌ها" value={business.other_contacts} />}
                {business.address && <DetailRow label="آدرس" value={business.address} />}
                <DetailRow label="طرح اشتراک" value={business.plan} />
            </div>

            {business.description && (
                <div>
                    <span className="text-gray-500 block mb-1">توضیحات</span>
                    <p className="text-gray-300">{business.description}</p>
                </div>
            )}

            {business.location_lat != null && business.location_lng != null && (
                <p className="text-xs text-gray-500" dir="ltr">
                    موقعیت: {business.location_lat.toFixed(4)}, {business.location_lng.toFixed(4)}
                </p>
            )}

            {business.phone_verified && (
                <Badge color="green" variant="light" size="sm" leftSection={<IconCheckCircle size={14} />}>
                    شماره تأیید شده
                </Badge>
            )}

            {business.status === 'rejected' && business.rejection_reason && (
                <Alert color="red" variant="light" icon={<IconXCircle size={18} />}>
                    <span className="font-medium">دلیل رد:</span> {business.rejection_reason}
                </Alert>
            )}
        </div>
    );
}

function DetailRow({ label, value, ltr }: { label: string; value: string | null | undefined; ltr?: boolean }) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-gray-500 text-xs">{label}</span>
            <span dir={ltr ? 'ltr' : 'rtl'}>{value}</span>
        </div>
    );
}

export default AdminBusinesses;
