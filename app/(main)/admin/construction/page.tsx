'use client';

import React, {useState, useEffect} from 'react';
import {Badge, Loader, Center} from '@mantine/core';
import CustomButton from '@/components/ui/base/CustomButton';
import {api} from '@/lib/api/base';
import {echoTimeDiff} from '@/lib/utils/global';

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
    location_lat: number | null;
    location_lng: number | null;
    photo_url: string | null;
    phone_verified: boolean;
    status: string;
    created_at: string;
};

const statusColors: Record<string, string> = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
};

const statusLabels: Record<string, string> = {
    pending: 'در انتظار',
    approved: 'تایید شده',
    rejected: 'رد شده',
};

function Page() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [acting, setActing] = useState<string | null>(null);

    const fetchProjects = (status: string) => {
        setLoading(true);
        api('/construction/projects', {status}, 'GET')
            .then((res) => setProjects(res.data?.projects || []))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProjects(filter);
    }, [filter]);

    const handleAction = (projectId: string, action: 'approve' | 'reject') => {
        setActing(projectId);
        api('/construction/approve', {project_id: projectId, action}, 'POST')
            .then(() => fetchProjects(filter))
            .finally(() => setActing(null));
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
            <h3 className="text-3xl font-semibold">مدیریت پروژه‌های ساختمانی</h3>

            <div className="flex gap-2">
                {['pending', 'approved', 'rejected'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-2 rounded-xl text-sm transition-all ${
                            filter === s
                                ? 'bg-primary text-white'
                                : 'bg-white/5 hover:bg-white/10'
                        }`}
                    >
                        {statusLabels[s]}
                    </button>
                ))}
            </div>

            {projects.length === 0 ? (
                <p className="opacity-60 text-center py-10">پروژه‌ای یافت نشد</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {projects.map((p) => (
                        <div
                            key={p.id}
                            className="rounded-2xl border border-white/10 p-5 flex flex-col gap-3"
                        >
                            <div className="flex items-start justify-between gap-3 flex-wrap">
                                <div>
                                    <h4 className="text-xl font-semibold">{p.project_name}</h4>
                                    <p className="opacity-60 text-sm">{p.builder_name}</p>
                                </div>
                                <Badge color={statusColors[p.status]} size="lg">
                                    {statusLabels[p.status]}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                {p.area && (
                                    <div>
                                        <span className="opacity-50">مساحت:</span> {Number(p.area).toLocaleString('fa')} م²
                                    </div>
                                )}
                                {p.floors_count && (
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
                                {p.address && <div><span className="opacity-50">آدرس:</span> {p.address}</div>}
                                {p.description && <div><span className="opacity-50">توضیحات:</span> {p.description}</div>}
                            </div>

                            {p.phone_verified && (
                                <Badge color="green" variant="light" size="sm">
                                    شماره تایید شده
                                </Badge>
                            )}

                            {p.photo_url && (
                                <div className="rounded-xl overflow-hidden max-w-xs">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={p.photo_url} alt={p.project_name} className="w-full" />
                                </div>
                            )}

                            {p.location_lat && p.location_lng && (
                                <p className="text-xs opacity-50" dir="ltr">
                                    موقعیت: {p.location_lat.toFixed(4)}, {p.location_lng.toFixed(4)}
                                </p>
                            )}

                            {p.status === 'pending' && (
                                <div className="flex gap-2 mt-2">
                                    <CustomButton
                                        loading={acting === p.id}
                                        onClick={() => handleAction(p.id, 'approve')}
                                        className="small"
                                    >
                                        تایید
                                    </CustomButton>
                                    <CustomButton
                                        loading={acting === p.id}
                                        onClick={() => handleAction(p.id, 'reject')}
                                        variant="soft"
                                        className="small"
                                    >
                                        رد
                                    </CustomButton>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Page;
