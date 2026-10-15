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
    pending: { label: 'در انتظار', color: 'orange', icon: <IconClock size={16} /> },
    approved: { label: 'تأییدشده', color: 'green', icon: <IconCheckCircle size={16} /> },
    rejected: { label: 'ردشده', color: 'red', icon: <IconXCircle size={16} /> },
};

function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [acting, setActing] = useState<string | null>(null);
    const [rejectModal, setRejectModal] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectError, setRejectError] = useState(false);
    const [detailProject, setDetailProject] = useState<Project | null>(null);

    const fetchProjects = (status: string, searchQuery: string) => {
        setLoading(true);
        const params: Record<string, any> = { with_needs: 'true' };
        if (status !== 'all') params.status = status;
        if (searchQuery) params.search = searchQuery;
        api('/construction/projects', params, 'GET')
            .then((res) => setProjects(res.data?.projects || []))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const t = setTimeout(() => fetchProjects(filter, search), 300);
        return () => clearTimeout(t);
    }, [filter, search]);

    const handleApprove = (projectId: string) => {
        setActing(projectId);
        api('/construction/approve', { project_id: projectId, action: 'approve' }, 'POST')
            .then(() => {
                fetchProjects(filter, search);
                setDetailProject(null);
            })
            .finally(() => setActing(null));
    };

    const handleReject = () => {
        if (!rejectReason.trim()) {
            setRejectError(true);
            return;
        }
        setActing(rejectModal);
        api('/construction/approve', { project_id: rejectModal, action: 'reject', rejection_reason: rejectReason.trim() }, 'POST')
            .then(() => {
                setRejectModal(null);
                setRejectReason('');
                setRejectError(false);
                fetchProjects(filter, search);
                setDetailProject(null);
            })
            .finally(() => setActing(null));
    };

    const closeRejectModal = () => {
        setRejectModal(null);
        setRejectReason('');
        setRejectError(false);
    };

    const filtered = search
        ? projects.filter((p) =>
            p.project_name.includes(search) || p.builder_name.includes(search) || (p.city || '').includes(search)
        )
        : projects;

    return (
        <div className="flex flex-col gap-5 max-w-5xl w-full">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold">مدیریت پروژه‌ها</h1>
                <p className="text-gray-400 text-sm mt-1">
                    بررسی، تأیید یا رد پروژه‌های ثبت‌شده توسط کاربران
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <TextInput
                    placeholder="جستجو بر اساس نام، سازنده، شهر..."
                    value={search}
                    onChange={(e) => setSearch(e.currentTarget.value)}
                    className="flex-1"
                    leftSection={<IconSearch size={18} />}
                    rightSectionWidth={0}
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
                <p className="text-gray-500 text-center py-10">پروژه‌ای یافت نشد</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map((p) => {
                        const cfg = statusConfig[p.status] || statusConfig.pending;
                        return (
                            <div
                                key={p.id}
                                className="rounded-2xl border border-white/10 bg-[#161A21] p-4 flex flex-col gap-3"
                            >
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-semibold truncate">{p.project_name}</h3>
                                        <p className="text-gray-400 text-sm">{p.builder_name}</p>
                                    </div>
                                    <Badge color={cfg.color} size="md" variant="light" leftSection={cfg.icon}>
                                        {cfg.label}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                                    {p.area != null && (
                                        <div className="text-gray-400">
                                            <span className="opacity-60">مساحت:</span> {Number(p.area).toLocaleString('fa')} م²
                                        </div>
                                    )}
                                    {p.floors_count != null && (
                                        <div className="text-gray-400">
                                            <span className="opacity-60">طبقه:</span> {p.floors_count.toLocaleString('fa')}
                                        </div>
                                    )}
                                    {p.city && (
                                        <div className="text-gray-400">
                                            <span className="opacity-60">شهر:</span> {p.city}
                                        </div>
                                    )}
                                    <div className="text-gray-400">
                                        <span className="opacity-60">ثبت:</span> {echoTimeDiff(p.created_at)}
                                    </div>
                                </div>

                                {p.status === 'rejected' && p.rejection_reason && (
                                    <Alert color="red" variant="light" icon={<IconXCircle size={18} />} className="text-sm">
                                        <span className="font-medium">دلیل رد:</span> {p.rejection_reason}
                                    </Alert>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    <CustomButton
                                        variant="soft"
                                        className="small"
                                        onClick={() => setDetailProject(p)}
                                    >
                                        <span className="flex items-center gap-1"><IconEye size={16} /> جزئیات</span>
                                    </CustomButton>
                                    {p.status === 'pending' && (
                                        <>
                                            <CustomButton
                                                loading={acting === p.id}
                                                onClick={() => handleApprove(p.id)}
                                                className="small"
                                            >
                                                تأیید
                                            </CustomButton>
                                            <CustomButton
                                                loading={acting === p.id}
                                                variant="soft"
                                                className="small"
                                                onClick={() => { setRejectModal(p.id); setRejectReason(''); setRejectError(false); }}
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
                opened={!!detailProject}
                onClose={() => setDetailProject(null)}
                title="جزئیات پروژه"
                centered
                size="lg"
                scrollAreaComponent="div"
            >
                {detailProject && <ProjectDetail project={detailProject} />}
            </Modal>

            {/* Reject Modal */}
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

function ProjectDetail({ project }: { project: Project }) {
    const cfg = statusConfig[project.status] || statusConfig.pending;
    return (
        <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl font-semibold">{project.project_name}</h3>
                <Badge color={cfg.color} size="lg" variant="light" leftSection={cfg.icon}>
                    {cfg.label}
                </Badge>
            </div>

            {project.photo_url && (
                <div className="rounded-xl overflow-hidden max-w-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={project.photo_url} alt={project.project_name} className="w-full" />
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DetailRow label="سازنده" value={project.builder_name} />
                <DetailRow label="شهر" value={project.city} />
                {project.area != null && <DetailRow label="مساحت" value={`${Number(project.area).toLocaleString('fa')} متر مربع`} />}
                {project.floors_count != null && <DetailRow label="تعداد طبقه" value={project.floors_count.toLocaleString('fa')} />}
                {project.manager_role && <DetailRow label="نقش مسئول" value={project.manager_role} />}
                {project.start_date && <DetailRow label="تاریخ شروع" value={project.start_date} />}
                <DetailRow label="تلفن ۱" value={project.phone1} ltr />
                {project.phone2 && <DetailRow label="تلفن ۲" value={project.phone2} ltr />}
                {project.phone3 && <DetailRow label="تلفن ۳" value={project.phone3} ltr />}
                {project.email && <DetailRow label="ایمیل" value={project.email} ltr />}
                {project.other_contacts && <DetailRow label="سایر تماس‌ها" value={project.other_contacts} />}
                {project.address && <DetailRow label="آدرس" value={project.address} />}
            </div>

            {project.description && (
                <div>
                    <span className="text-gray-500 block mb-1">توضیحات</span>
                    <p className="text-gray-300">{project.description}</p>
                </div>
            )}

            {project.location_lat != null && project.location_lng != null && (
                <p className="text-xs text-gray-500" dir="ltr">
                    موقعیت: {project.location_lat.toFixed(4)}, {project.location_lng.toFixed(4)}
                </p>
            )}

            {project.needs && project.needs.length > 0 && (
                <div className="flex flex-col gap-2">
                    <span className="text-gray-500">مشاغل مورد نیاز</span>
                    <div className="flex flex-wrap gap-2">
                        {project.needs.map((n) => (
                            <div key={n.id} className="flex flex-col gap-0.5 rounded-lg bg-white/5 px-3 py-2">
                                <span className="text-sm font-medium">{n.job.name}</span>
                                {n.description && <span className="text-xs text-gray-500">{n.description}</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {project.phone_verified && (
                <Badge color="green" variant="light" size="sm" leftSection={<IconCheckCircle size={14} />}>
                    شماره تأیید شده
                </Badge>
            )}

            {project.status === 'rejected' && project.rejection_reason && (
                <Alert color="red" variant="light" icon={<IconXCircle size={18} />}>
                    <span className="font-medium">دلیل رد:</span> {project.rejection_reason}
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
            <span className={ltr ? '' : ''} dir={ltr ? 'ltr' : 'rtl'}>{value}</span>
        </div>
    );
}

export default AdminProjects;
