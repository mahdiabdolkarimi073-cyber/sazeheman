'use client';

import React, {useState, useEffect} from 'react';
import {Badge, Loader, Center, Alert, TextInput, Textarea, Select, Button} from '@mantine/core';
import {IconInfoCircle, IconCheckCircle, IconXCircle, IconClock, IconArrowRight} from '@tabler/icons-react';
import Link from 'next/link';
import {useParams, useRouter} from 'next/navigation';
import {api} from '@/lib/api/base';
import {echoTimeDiff} from '@/lib/utils/global';
import CustomButton from '@/components/ui/base/CustomButton';

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

type Job = { id: string; name: string; slug: string };

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'در انتظار تأیید', color: 'orange', icon: <IconClock size={18} /> },
    approved: { label: 'تأییدشده', color: 'green', icon: <IconCheckCircle size={18} /> },
    rejected: { label: 'ردشده', color: 'red', icon: <IconXCircle size={18} /> },
};

function Page() {
    const params = useParams();
    const router = useRouter();
    const businessId = params.id as string;

    const [business, setBusiness] = useState<Business | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<Record<string, any>>({});

    useEffect(() => {
        api(`/business/detail?id=${businessId}`, {}, 'GET')
            .then((res) => {
                const b = res.data?.business;
                if (!b) { setError('کسب‌وکار یافت نشد'); return; }
                setBusiness(b);
                setForm({
                    business_name: b.business_name,
                    full_name: b.full_name,
                    job_id: b.job_id || '',
                    work_experience: b.work_experience || '',
                    email: b.email || '',
                    other_contacts: b.other_contacts || '',
                    description: b.description || '',
                    address: b.address || '',
                    city: b.city || '',
                });
            })
            .catch(() => setError('خطا در دریافت اطلاعات'))
            .finally(() => setLoading(false));

        api('/construction/jobs', {}, 'GET')
            .then((res) => setJobs(res.data?.jobs || []))
            .catch(() => {});
    }, [businessId]);

    const handleSave = () => {
        setSaving(true);
        api('/business/detail?id=' + businessId, form, 'POST')
            .then((res) => {
                setBusiness(res.data?.business || business);
                setEditing(false);
            })
            .catch(() => {})
            .finally(() => setSaving(false));
    };

    if (loading) return <Center className="min-h-40"><Loader /></Center>;
    if (error) return (
        <div className="flex flex-col gap-4 max-w-2xl w-full">
            <Alert color="red" variant="light" icon={<IconInfoCircle size={18} />}>{error}</Alert>
            <Link href="/dashboard/my-businesses"><CustomButton variant="outline" className="small">بازگشت به فهرست</CustomButton></Link>
        </div>
    );
    if (!business) return null;

    const cfg = statusConfig[business.status] || statusConfig.pending;

    return (
        <div className="flex flex-col gap-4 max-w-2xl w-full">
            <Link href="/dashboard/my-businesses" className="flex items-center gap-1 text-sm text-[#36B98A] hover:opacity-80">
                <IconArrowRight size={16} />
                بازگشت به شغل‌های من
            </Link>

            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                    <h3 className="text-2xl lg:text-3xl font-semibold text-[#252C2A]">{business.business_name}</h3>
                    <p className="opacity-60 text-sm text-[#6B7771]">{business.full_name}</p>
                </div>
                <Badge color={cfg.color} size="lg" leftSection={cfg.icon} variant="light">{cfg.label}</Badge>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-[#252C2A] bg-white rounded-xl border border-[#E7F5EE] p-4">
                <div><span className="opacity-50">شماره تماس:</span> <span dir="ltr">{business.phone}</span></div>
                <div><span className="opacity-50">شغل:</span> {business.job?.name || '-'}</div>
                <div><span className="opacity-50">سابقه:</span> {business.work_experience || '-'}</div>
                <div><span className="opacity-50">شهر:</span> {business.city || '-'}</div>
                <div><span className="opacity-50">پلن:</span> {business.plan}</div>
                <div><span className="opacity-50">تاریخ ثبت:</span> {echoTimeDiff(business.created_at)}</div>
            </div>

            {!editing ? (
                <>
                    <div className="flex flex-col gap-1 text-sm text-[#252C2A] bg-white rounded-xl border border-[#E7F5EE] p-4">
                        {business.email && <div><span className="opacity-50">ایمیل:</span> <span dir="ltr">{business.email}</span></div>}
                        {business.other_contacts && <div><span className="opacity-50">سایر ارتباط‌ها:</span> {business.other_contacts}</div>}
                        {business.address && <div><span className="opacity-50">آدرس:</span> {business.address}</div>}
                        {business.description && <div><span className="opacity-50">توضیحات:</span> {business.description}</div>}
                    </div>

                    {business.photos.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-[#173D35]">نمونه کارها:</p>
                            <div className="flex flex-wrap gap-3">
                                {business.photos.map((p) => (
                                    <div key={p.id} className="w-24 h-24 rounded-xl overflow-hidden border border-[#E7F5EE]">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={p.photo_url} alt="نمونه کار" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {business.phone_verified ? (
                        <Badge color="green" variant="light" size="sm" leftSection={<IconCheckCircle size={14} />}>شماره تأیید شده</Badge>
                    ) : (
                        <Badge color="orange" variant="light" size="sm" leftSection={<IconClock size={14} />}>شماره تأیید نشده</Badge>
                    )}

                    {business.status === 'pending' && (
                        <Alert color="orange" variant="light" icon={<IconInfoCircle size={18} />}>
                            کسب‌وکار شما در انتظار بررسی مدیر است.
                        </Alert>
                    )}
                    {business.status === 'approved' && (
                        <Alert color="green" variant="light" icon={<IconCheckCircle size={18} />}>
                            کسب‌وکار شما تأیید شده و در فهرست عمومی قرار گرفته است.
                        </Alert>
                    )}

                    <CustomButton onClick={() => setEditing(true)} className="w-full sm:w-auto">
                        ویرایش اطلاعات
                    </CustomButton>
                </>
            ) : (
                <div className="flex flex-col gap-4 bg-white rounded-xl border border-[#E7F5EE] p-5">
                    <TextInput label="نام کسب‌وکار" value={form.business_name || ''} onChange={(e) => setForm({...form, business_name: e.currentTarget.value})} />
                    <TextInput label="نام و نام خانوادگی" value={form.full_name || ''} onChange={(e) => setForm({...form, full_name: e.currentTarget.value})} />
                    <Select label="نوع خدمت" data={jobs.map((j) => ({value: j.id, label: j.name}))} value={form.job_id || null} onChange={(v) => setForm({...form, job_id: v})} searchable clearable />
                    <TextInput label="سابقه کار" value={form.work_experience || ''} onChange={(e) => setForm({...form, work_experience: e.currentTarget.value})} />
                    <TextInput label="ایمیل" value={form.email || ''} onChange={(e) => setForm({...form, email: e.currentTarget.value})} dir="ltr" />
                    <TextInput label="راه‌های ارتباطی دیگر" value={form.other_contacts || ''} onChange={(e) => setForm({...form, other_contacts: e.currentTarget.value})} />
                    <Textarea label="توضیحات" value={form.description || ''} onChange={(e) => setForm({...form, description: e.currentTarget.value})} autosize minRows={2} />
                    <Textarea label="آدرس" value={form.address || ''} onChange={(e) => setForm({...form, address: e.currentTarget.value})} autosize minRows={2} />
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
