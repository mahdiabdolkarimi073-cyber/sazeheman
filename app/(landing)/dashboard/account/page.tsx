'use client';

import React, {useState, useEffect} from 'react';
import {TextInput, Loader, Center, Alert} from '@mantine/core';
import {IconInfoCircle, IconCheckCircle} from '@/components/assets/tabler-icons';
import {api} from '@/lib/api/base';
import {refetchUser} from '@/lib/hooks/useUser';
import CustomButton from '@/components/ui/base/CustomButton';

function Page() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<Record<string, any>>({});

    useEffect(() => {
        api('/profile/me', {}, 'GET')
            .then((res) => {
                const u = res.data?.user;
                if (!u) { setError('اطلاعات کاربر یافت نشد'); return; }
                setForm({
                    nickname: u.nickname || '',
                    first_name: u.first_name || '',
                    last_name: u.last_name || '',
                    email: u.email || '',
                    slug: u.slug || '',
                });
            })
            .catch(() => setError('خطا در دریافت اطلاعات'))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = () => {
        setSaving(true);
        setSaved(false);
        api('/profile/me', form, 'POST')
            .then(() => {
                setSaved(true);
                refetchUser();
            })
            .catch(() => {})
            .finally(() => setSaving(false));
    };

    if (loading) return <Center className="min-h-40"><Loader /></Center>;
    if (error) return (
        <div className="flex flex-col gap-4 max-w-2xl w-full">
            <Alert color="red" variant="light" icon={<IconInfoCircle size={18} />}>{error}</Alert>
        </div>
    );

    return (
        <div className="flex flex-col gap-4 max-w-2xl w-full">
            <h3 className="text-2xl lg:text-3xl font-semibold">اطلاعات حساب من</h3>
            <p className="opacity-60 text-sm">
                اطلاعات پروفایل خود را مدیریت کنید. این اطلاعات برای حساب کاربری شما در تمام بخش‌های سازه من و شغل من استفاده می‌شود.
            </p>

            {saved && (
                <Alert color="green" variant="light" icon={<IconCheckCircle size={18} />} withCloseButton onClose={() => setSaved(false)}>
                    اطلاعات با موفقیت به‌روزرسانی شد.
                </Alert>
            )}

            <div className="flex flex-col gap-4 bg-white rounded-xl border border-[#E7F5EE] p-5">
                <TextInput label="نام مستعار" value={form.nickname || ''} onChange={(e) => setForm({...form, nickname: e.currentTarget.value})} placeholder="نام مستعار" />
                <div className="flex flex-col sm:flex-row gap-4">
                    <TextInput label="نام" value={form.first_name || ''} onChange={(e) => setForm({...form, first_name: e.currentTarget.value})} className="grow" />
                    <TextInput label="نام خانوادگی" value={form.last_name || ''} onChange={(e) => setForm({...form, last_name: e.currentTarget.value})} className="grow" />
                </div>
                <TextInput label="ایمیل" value={form.email || ''} onChange={(e) => setForm({...form, email: e.currentTarget.value})} dir="ltr" placeholder="email@example.com" />
                <TextInput label="شناسه اختصاصی (slug)" value={form.slug || ''} onChange={(e) => setForm({...form, slug: e.currentTarget.value})} dir="ltr" placeholder="my-name" />

                <CustomButton loading={saving} onClick={handleSave} className="w-full sm:w-auto">
                    ذخیره تغییرات
                </CustomButton>
            </div>
        </div>
    );
}

export default Page;
