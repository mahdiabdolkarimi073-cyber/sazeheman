'use client';

import React, {useState, useEffect} from 'react';
import {Badge, Loader, Center, Modal, Textarea, Alert} from '@mantine/core';
import {IconInfoCircle, IconCheckCircle, IconXCircle, IconClock} from '@tabler/icons-react';
import CustomButton from '@/components/ui/base/CustomButton';
import {api} from '@/lib/api/base';
import {echoTimeDiff} from '@/lib/utils/global';

type ProjectNeed = {
    id: string;
    job_id: string;
    description: string | null;
    job: { id: string; name: string; slug: string; icon: string | null };
};

type Project = {
    id: string;
    project_name: string;
    builder_name: string;
    area: number | null;
    start_date: string | null;
    floors_count: number | null;
    manager_role: string | null;
    phone1: string;
    phone2: string | null;
    phone3: string | null;
    email: string | null;
    other_contacts: string | null;
    description: string | null;
    address: string | null;
    city: string | null;
    location_lat: number | null;
    location_lng: number | null;
    photo_url: string | null;
    phone_verified: boolean;
    status: string;
    rejection_reason: string | null;
    user_id: string | null;
    created_at: string;
    needs?: ProjectNeed[];
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'در انتظار تأیید', color: 'orange', icon: <IconClock size={18} /> },
    approved: { label: 'تأییدشده', color: 'green', icon: <IconCheckCircle size={18} /> },
    rejected: { label: 'ردشده', color: 'red', icon: <IconXCircle size={18} /> },
};

function Page() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [acting, setActing] = useState<string | null>(null);
    const [rejectModal, setRejectModal] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectError, setRejectError] = useState(false);

    const fetchProjects = (status: string) => {
        setLoading(true);
        api('/construction/projects', {status, with_needs: 'true'}, 'GET')
            .then((res) => setProjects(res.data?.projects || []))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProjects(filter);
    }, [filter]);

    const handleApprove = (projectId: string) => {
        setActing(projectId);
        api('/construction/approve', {project_id: projectId, action: 'approve'}, 'POST')
            .then(() => fetchProjects(filter))
            .finally(() => setActing(null));
    };

    const handleReject = () => {
        if (!rejectReason.trim()) {
            setRejectError(true);
            return;
        }
        setActing(rejectModal);
        api('/construction/approve', {project_id: rejectModal, action: 'reject', rejection_reason: rejectReason.trim()}, 'POST')
            .then(() => {
                setRejectModal(null);
                setRejectReason('');
                setRejectError(false);
                fetchProjects(filter);
            })
            .finally(() => setActing(null));
    };

    const closeRejectModal = () => {
        setRejectModal(null);
        setRejectReason('');
        setRejectError(false);
    };

    if (loading) {
        return (
            <Center className="min-h-40">
                <Loader />
            </Center>
        );
    }

    return (
        <div className="flex flex-col gap-4 max-w-4xl w-full">
            <h3 className="text-2xl lg:text-3xl font-semibold">مدیریت پروژه‌های ساختمانی</h3>
            <p className="opacity-60 text-sm">
                پروژه‌های ثبت‌شده توسط کاربران را بررسی کرده و تأیید یا رد کنید. پروژه‌های ردشده با دلیل به اطلاع صاحب پروژه می‌رسد.
            </p>

            <div className="flex gap-2 flex-wrap">
                {['pending', 'approved', 'rejected'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-2 rounded-xl text-sm transition-all min-h-11 ${
                            filter === s
                                ? 'bg-primary text-white'
                                : 'bg-white/5 hover:bg-white/10'
                        }`}
                    >
                        {statusConfig[s]?.label}
                    </button>
                ))}
            </div>

            {projects.length === 0 ? (
                <p className="opacity-60 text-center py-10">پروژه‌ای یافت نشد</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {projects.map((p) => {
                        const cfg = statusConfig[p.status] || statusConfig.pending;
                        return (
                            <div
                                key={p.id}
                                className="rounded-2xl border border-white/10 p-5 flex flex-col gap-3"
                            >
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div>
                                        <h4 className="text-lg lg:text-xl font-semibold">{p.project_name}</h4>
                                        <p className="opacity-60 text-sm">{p.builder_name}</p>
                                    </div>
                                    <Badge color={cfg.color} size="lg" leftSection={cfg.icon} variant="light">
                                        {cfg.label}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                    {p.area != null && (
                                        <div>
                                            <span className="opacity-50">مساحت:</span> {Number(p.area).toLocaleString('fa')} م²
                                        </div>
                                    )}
                                    {p.floors_count != null && (
                                        <div>
                                            <span className="opacity-50">طبقه:</span> {p.floors_count.toLocaleString('fa')}
                                        </div>
                                    )}
                                    {p.manager_role && (
                                        <div>
                                            <span className="opacity-50">مسئول:</span> {p.manager_role}
                                        </div>
                                    )}
                                    <div>
                                        <span className="opacity-50">تاریخ ثبت:</span> {echoTimeDiff(p.created_at)}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 text-sm">
                                    <div><span className="opacity-50">تلفن ۱:</span> <span dir="ltr">{p.phone1}</span></div>
                                    {p.phone2 && <div><span className="opacity-50">تلفن ۲:</span> <span dir="ltr">{p.phone2}</span></div>}
                                    {p.phone3 && <div><span className="opacity-50">تلفن ۳:</span> <span dir="ltr">{p.phone3}</span></div>}
                                    {p.email && <div><span className="opacity-50">ایمیل:</span> <span dir="ltr">{p.email}</span></div>}
                                    {p.other_contacts && <div><span className="opacity-50">سایر:</span> {p.other_contacts}</div>}
                                    {p.address && <div><span className="opacity-50">آدرس:</span> {p.address}</div>}
                                    {p.city && <div><span className="opacity-50">شهر:</span> {p.city}</div>}
                                    {p.description && <div><span className="opacity-50">توضیحات:</span> {p.description}</div>}
                                </div>

                                {p.phone_verified && (
                                    <Badge color="green" variant="light" size="sm" leftSection={<IconCheckCircle size={14} />}>
                                        شماره تأیید شده
                                    </Badge>
                                )}

                                {p.photo_url && (
                                    <div className="rounded-xl overflow-hidden max-w-xs">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={p.photo_url} alt={p.project_name} className="w-full" />
                                    </div>
                                )}

                                {p.location_lat != null && p.location_lng != null && (
                                    <p className="text-xs opacity-50" dir="ltr">
                                        موقعیت: {p.location_lat.toFixed(4)}, {p.location_lng.toFixed(4)}
                                    </p>
                                )}

                                {p.needs && p.needs.length > 0 && (
                                    <div className="flex flex-col gap-2 mt-1">
                                        <p className="text-sm font-medium">مشاغل مورد نیاز:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {p.needs.map((n) => (
                                                <div key={n.id} className="flex flex-col gap-0.5 rounded-lg bg-white/5 px-3 py-2">
                                                    <span className="text-sm font-medium">{n.job.name}</span>
                                                    {n.description && <span className="text-xs opacity-50">{n.description}</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {p.status === 'rejected' && p.rejection_reason && (
                                    <Alert color="red" variant="light" icon={<IconXCircle size={18} />}>
                                        <span className="font-medium">دلیل رد:</span> {p.rejection_reason}
                                    </Alert>
                                )}

                                {p.status === 'pending' && (
                                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                                        <CustomButton
                                            loading={acting === p.id}
                                            onClick={() => handleApprove(p.id)}
                                            className="small"
                                        >
                                            تأیید
                                        </CustomButton>
                                        <CustomButton
                                            loading={acting === p.id}
                                            onClick={() => { setRejectModal(p.id); setRejectReason(''); setRejectError(false); }}
                                            variant="soft"
                                            className="small"
                                        >
                                            رد
                                        </CustomButton>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal
                opened={!!rejectModal}
                onClose={closeRejectModal}
                title="رد پروژه"
                centered
                size="md"
            >
                <div className="flex flex-col gap-4">
                    <p className="text-sm opacity-70">لطفاً دلیل رد این پروژه را بنویسید. این دلیل به صاحب پروژه نمایش داده می‌شود.</p>
                    <Textarea
                        placeholder="دلیل رد پروژه..."
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

export default Page;
