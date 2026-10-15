'use client';

import React, {useState, useEffect} from 'react';
import {Badge, Loader, Center, Alert, TextInput, Textarea, NumberInput, Select} from '@mantine/core';
import {IconInfoCircle, IconCheckCircle, IconXCircle, IconClock, IconArrowRight} from '@tabler/icons-react';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {api} from '@/lib/api/base';
import {echoTimeDiff} from '@/lib/utils/global';
import CustomButton from '@/components/ui/base/CustomButton';

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
    created_at: string;
    needs: ProjectNeed[];
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'در انتظار تأیید', color: 'orange', icon: <IconClock size={18} /> },
    approved: { label: 'تأییدشده', color: 'green', icon: <IconCheckCircle size={18} /> },
    rejected: { label: 'ردشده', color: 'red', icon: <IconXCircle size={18} /> },
};

const managerRoles = [
    {value: 'پیمانکار', label: 'پیمانکار'},
    {value: 'کارفرما', label: 'کارفرما'},
    {value: 'مسئول خرید', label: 'مسئول خرید'},
    {value: 'صاحب ملک', label: 'صاحب ملک'},
];

function Page() {
    const params = useParams();
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<Record<string, any>>({});

    useEffect(() => {
        api(`/construction/${projectId}`, {}, 'GET')
            .then((res) => {
                const p = res.data?.project;
                if (!p) { setError('پروژه یافت نشد'); return; }
                setProject(p);
                setForm({
                    project_name: p.project_name,
                    builder_name: p.builder_name,
                    area: p.area || '',
                    floors_count: p.floors_count || '',
                    manager_role: p.manager_role || '',
                    phone2: p.phone2 || '',
                    phone3: p.phone3 || '',
                    email: p.email || '',
                    other_contacts: p.other_contacts || '',
                    description: p.description || '',
                    address: p.address || '',
                    city: p.city || '',
                });
            })
            .catch(() => setError('خطا در دریافت پروژه'))
            .finally(() => setLoading(false));
    }, [projectId]);

    const handleSave = () => {
        setSaving(true);
        api(`/construction/${projectId}`, form, 'POST')
            .then((res) => {
                setProject(res.data?.project || project);
                setEditing(false);
            })
            .catch(() => {})
            .finally(() => setSaving(false));
    };

    if (loading) return <Center className="min-h-40"><Loader /></Center>;
    if (error) return (
        <div className="flex flex-col gap-4 max-w-2xl w-full">
            <Alert color="red" variant="light" icon={<IconInfoCircle size={18} />}>{error}</Alert>
            <Link href="/dashboard/my-projects"><CustomButton variant="outline" className="small">بازگشت به فهرست</CustomButton></Link>
        </div>
    );
    if (!project) return null;

    const cfg = statusConfig[project.status] || statusConfig.pending;
    const canEdit = project.status !== 'approved';

    return (
        <div className="flex flex-col gap-4 max-w-2xl w-full">
            <Link href="/dashboard/my-projects" className="flex items-center gap-1 text-sm text-[#36B98A] hover:opacity-80">
                <IconArrowRight size={16} />
                بازگشت به سازه‌های من
            </Link>

            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                    <h3 className="text-2xl lg:text-3xl font-semibold text-[#252C2A]">{project.project_name}</h3>
                    <p className="opacity-60 text-sm text-[#6B7771]">{project.builder_name}</p>
                </div>
                <Badge color={cfg.color} size="lg" leftSection={cfg.icon} variant="light">{cfg.label}</Badge>
            </div>

            <div className="bg-white rounded-xl border border-[#E7F5EE] p-4 text-sm text-[#252C2A]">
                <div><span className="opacity-50">شناسه پروژه:</span> <span dir="ltr" className="text-xs">{project.id}</span></div>
            </div>

            {!editing ? (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-[#252C2A] bg-white rounded-xl border border-[#E7F5EE] p-4">
                        {project.area != null && <div><span className="opacity-50">مساحت:</span> {Number(project.area).toLocaleString('fa')} م²</div>}
                        {project.floors_count != null && <div><span className="opacity-50">طبقه:</span> {project.floors_count.toLocaleString('fa')}</div>}
                        {project.manager_role && <div><span className="opacity-50">مسئول:</span> {project.manager_role}</div>}
                        <div><span className="opacity-50">تاریخ ثبت:</span> {echoTimeDiff(project.created_at)}</div>
                    </div>

                    <div className="flex flex-col gap-1 text-sm text-[#252C2A] bg-white rounded-xl border border-[#E7F5EE] p-4">
                        <div><span className="opacity-50">تلفن ۱:</span> <span dir="ltr">{project.phone1}</span></div>
                        {project.phone2 && <div><span className="opacity-50">تلفن ۲:</span> <span dir="ltr">{project.phone2}</span></div>}
                        {project.phone3 && <div><span className="opacity-50">تلفن ۳:</span> <span dir="ltr">{project.phone3}</span></div>}
                        {project.email && <div><span className="opacity-50">ایمیل:</span> <span dir="ltr">{project.email}</span></div>}
                        {project.other_contacts && <div><span className="opacity-50">سایر ارتباط‌ها:</span> {project.other_contacts}</div>}
                        {project.address && <div><span className="opacity-50">آدرس:</span> {project.address}</div>}
                        {project.city && <div><span className="opacity-50">شهر:</span> {project.city}</div>}
                        {project.description && <div><span className="opacity-50">توضیحات:</span> {project.description}</div>}
                    </div>

                    {project.photo_url && (
                        <div className="rounded-xl overflow-hidden max-w-xs border border-[#E7F5EE]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={project.photo_url} alt={project.project_name} className="w-full" />
                        </div>
                    )}

                    {project.needs && project.needs.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#173D35]">مشاغل مورد نیاز:</p>
                            <div className="flex flex-wrap gap-2">
                                {project.needs.map((n) => (
                                    <Badge key={n.id} variant="light" color="teal" size="md">{n.job.name}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.phone_verified ? (
                        <Badge color="green" variant="light" size="sm" leftSection={<IconCheckCircle size={14} />}>شماره تأیید شده</Badge>
                    ) : (
                        <Badge color="orange" variant="light" size="sm" leftSection={<IconClock size={14} />}>شماره تأیید نشده</Badge>
                    )}

                    {project.status === 'rejected' && project.rejection_reason && (
                        <Alert color="red" variant="light" icon={<IconXCircle size={18} />}>
                            <span className="font-medium">دلیل رد:</span> {project.rejection_reason}
                        </Alert>
                    )}
                    {project.status === 'pending' && (
                        <Alert color="orange" variant="light" icon={<IconInfoCircle size={18} />}>
                            پروژه شما در انتظار بررسی مدیر است. پس از تأیید، روی نقشه عمومی نمایش داده می‌شود.
                        </Alert>
                    )}
                    {project.status === 'approved' && (
                        <Alert color="green" variant="light" icon={<IconCheckCircle size={18} />}>
                            پروژه شما تأیید شده و روی نقشه عمومی نمایش داده می‌شود.
                        </Alert>
                    )}

                    {canEdit && (
                        <CustomButton onClick={() => setEditing(true)} className="w-full sm:w-auto">
                            ویرایش اطلاعات
                        </CustomButton>
                    )}
                    {project.status === 'approved' && (
                        <p className="text-xs opacity-50">پروژه‌های تأییدشده قابل ویرایش نیستند.</p>
                    )}
                </>
            ) : (
                <div className="flex flex-col gap-4 bg-white rounded-xl border border-[#E7F5EE] p-5">
                    <TextInput label="نام پروژه" value={form.project_name || ''} onChange={(e) => setForm({...form, project_name: e.currentTarget.value})} />
                    <TextInput label="نام سازنده" value={form.builder_name || ''} onChange={(e) => setForm({...form, builder_name: e.currentTarget.value})} />
                    <div className="flex flex-col sm:flex-row gap-4">
                        <NumberInput label="مساحت (متر مربع)" value={form.area || ''} onChange={(v) => setForm({...form, area: v})} className="grow" />
                        <NumberInput label="تعداد طبقه" value={form.floors_count || ''} onChange={(v) => setForm({...form, floors_count: v})} className="grow" />
                    </div>
                    <Select label="مسئول پروژه" data={managerRoles} value={form.manager_role || null} onChange={(v) => setForm({...form, manager_role: v})} clearable />
                    <TextInput label="تلفن ۲" value={form.phone2 || ''} onChange={(e) => setForm({...form, phone2: e.currentTarget.value})} dir="ltr" />
                    <TextInput label="تلفن ۳" value={form.phone3 || ''} onChange={(e) => setForm({...form, phone3: e.currentTarget.value})} dir="ltr" />
                    <TextInput label="ایمیل" value={form.email || ''} onChange={(e) => setForm({...form, email: e.currentTarget.value})} dir="ltr" />
                    <TextInput label="راه‌های ارتباطی دیگر" value={form.other_contacts || ''} onChange={(e) => setForm({...form, other_contacts: e.currentTarget.value})} />
                    <Textarea label="آدرس" value={form.address || ''} onChange={(e) => setForm({...form, address: e.currentTarget.value})} autosize minRows={2} />
                    <Textarea label="توضیحات" value={form.description || ''} onChange={(e) => setForm({...form, description: e.currentTarget.value})} autosize minRows={2} />
                    <TextInput label="شهر" value={form.city || ''} onChange={(e) => setForm({...form, city: e.currentTarget.value})} />

                    <div className="flex gap-2">
                        <CustomButton loading={saving} onClick={handleSave}>ذخیره تغییرات</CustomButton>
                        <CustomButton variant="outline" onClick={() => setEditing(false)}>انصراف</CustomButton>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Page;
