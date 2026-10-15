'use client';

import React, {useState, useEffect} from 'react';
import {Badge, Loader, Center, Alert, Image} from '@mantine/core';
import {IconInfoCircle, IconCheckCircle, IconXCircle, IconClock, IconPlus} from '@/components/assets/tabler-icons';
import Link from 'next/link';
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
    created_at: string;
    needs: ProjectNeed[];
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'در انتظار تأیید', color: 'orange', icon: <IconClock size={18} /> },
    approved: { label: 'تأییدشده', color: 'green', icon: <IconCheckCircle size={18} /> },
    rejected: { label: 'ردشده', color: 'red', icon: <IconXCircle size={18} /> },
};

function Page() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = () => {
        setLoading(true);
        setError(null);
        api('/construction/my-projects', {}, 'GET')
            .then((res) => setProjects(res.data?.projects || []))
            .catch(() => setError('خطا در دریافت پروژه‌ها'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <Center className="min-h-40">
                <Loader />
            </Center>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col gap-4 max-w-2xl w-full">
                <Alert color="red" variant="light" icon={<IconInfoCircle size={18} />}>
                    {error}
                </Alert>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 max-w-3xl w-full">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-2xl lg:text-3xl font-semibold">سازه‌های من</h3>
                <Link href="/auth/builder" className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-white px-4 py-2.5 text-sm font-medium min-h-11 transition-colors hover:opacity-90">
                        <IconPlus size={18} />
                        ثبت پروژه جدید
                    </span>
                </Link>
            </div>
            <p className="opacity-60 text-sm">
                در این بخش می‌توانید پروژه‌های ثبت‌شده خود را ببینید، جزئیات آن‌ها را مشاهده و در صورت نیاز ویرایش کنید. پروژه‌های شما پس از بررسی و تأیید مدیر روی نقشه عمومی نمایش داده می‌شوند.
            </p>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16">
                    <p className="opacity-50 text-center">شما هنوز پروژه‌ای ثبت نکرده‌اید.</p>
                    <Link href="/auth/builder" className="text-primary text-sm font-medium hover:underline">
                        ثبت پروژه جدید
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {projects.map((p) => {
                        const cfg = statusConfig[p.status] || statusConfig.pending;
                        return (
                            <Link
                                key={p.id}
                                href={`/dashboard/my-projects/${p.id}`}
                                className="rounded-2xl border border-[#E7F5EE] bg-white p-5 flex flex-col gap-3 shadow-[0_2px_8px_rgba(23,61,53,0.04)] hover:border-[#36B98A]/40 transition-all"
                            >
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div>
                                        <h4 className="text-lg lg:text-xl font-semibold text-[#252C2A]">{p.project_name}</h4>
                                        <p className="opacity-60 text-sm text-[#6B7771]">{p.builder_name}</p>
                                    </div>
                                    <Badge
                                        color={cfg.color}
                                        size="lg"
                                        leftSection={cfg.icon}
                                        variant="light"
                                    >
                                        {cfg.label}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-[#252C2A]">
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

                                <div className="flex flex-col gap-1 text-sm text-[#252C2A]">
                                    <div><span className="opacity-50">شناسه پروژه:</span> <span dir="ltr" className="text-xs">{p.id}</span></div>
                                    <div><span className="opacity-50">تلفن ۱:</span> <span dir="ltr">{p.phone1}</span></div>
                                    {p.phone2 && <div><span className="opacity-50">تلفن ۲:</span> <span dir="ltr">{p.phone2}</span></div>}
                                    {p.address && <div><span className="opacity-50">آدرس:</span> {p.address}</div>}
                                    {p.description && <div><span className="opacity-50">توضیحات:</span> {p.description}</div>}
                                </div>

                                {p.phone_verified ? (
                                    <Badge color="green" variant="light" size="sm" leftSection={<IconCheckCircle size={14} />}>
                                        شماره تأیید شده
                                    </Badge>
                                ) : (
                                    <Badge color="orange" variant="light" size="sm" leftSection={<IconClock size={14} />}>
                                        شماره تأیید نشده
                                    </Badge>
                                )}

                                {p.photo_url && (
                                    <div className="rounded-xl overflow-hidden max-w-xs">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={p.photo_url} alt={p.project_name} className="w-full" />
                                    </div>
                                )}

                                {p.needs && p.needs.length > 0 && (
                                    <div className="flex flex-col gap-2 mt-1">
                                        <p className="text-sm font-medium text-[#173D35]">مشاغل مورد نیاز:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {p.needs.map((n) => (
                                                <Badge key={n.id} variant="light" color="teal" size="md">
                                                    {n.job.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {p.status === 'rejected' && p.rejection_reason && (
                                    <Alert color="red" variant="light" icon={<IconXCircle size={18} />} className="mt-1">
                                        <span className="font-medium">دلیل رد:</span> {p.rejection_reason}
                                    </Alert>
                                )}

                                {p.status === 'pending' && (
                                    <Alert color="orange" variant="light" icon={<IconInfoCircle size={18} />} className="mt-1">
                                        پروژه شما در انتظار بررسی مدیر است. ثبت پروژه به معنی تأیید یا انتشار عمومی آن نیست. پس از تأیید مدیر، پروژه روی نقشه عمومی نمایش داده خواهد شد.
                                    </Alert>
                                )}

                                {p.status === 'approved' && (
                                    <Alert color="green" variant="light" icon={<IconCheckCircle size={18} />} className="mt-1">
                                        پروژه شما تأیید شده و روی نقشه عمومی نمایش داده می‌شود.
                                    </Alert>
                                )}
                                <div className="flex items-center gap-1 text-[#36B98A] mt-1">
                                    <span className="text-sm font-medium">مشاهده جزئیات و ویرایش</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Page;
