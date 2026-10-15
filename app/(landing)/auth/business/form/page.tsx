'use client';

import React, {useState, useEffect} from 'react';
import {TextInput, Textarea, Select, FileInput, Loader, Center} from '@mantine/core';
import Image from 'next/image';
import CustomButton from '@/components/ui/base/CustomButton';
import FormComponent from '@/components/ui/base/FormComponent';
import {optimizeForm} from '@/lib/utils/global';
import {api} from '@/lib/api/base';
import LeafletMap from '@/components/map/leaflet';
import {useRouter, useSearchParams} from 'next/navigation';

type Job = {
    id: string;
    name: string;
    slug: string;
};

function Page() {
    const router = useRouter();
    const params = useSearchParams();
    const phone = params.get('phone') || '';

    const [loading, setLoading] = useState(false);
    const [jobsLoading, setJobsLoading] = useState(true);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [location, setLocation] = useState<[number, number] | undefined>();
    const [photos, setPhotos] = useState<string[]>([]);

    useEffect(() => {
        api('/construction/jobs', {}, 'GET')
            .then((res) => setJobs(res.data?.jobs || []))
            .finally(() => setJobsLoading(false));
    }, []);

    const handlePhotoChange = (files: File[] | null) => {
        if (!files || files.length === 0) return;
        const readers = files.map((file) => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        });
        Promise.all(readers).then((urls) => {
            setPhotos((prev) => [...prev, ...urls]);
        });
    };

    const removePhoto = (index: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = optimizeForm(e).toJson();

        if (!location) {
            window.alert('لطفاً موقعیت خود را روی نقشه انتخاب کنید');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...form,
                phone: form.phone || phone,
                job_id: form.job_id || null,
                location_lat: location[0],
                location_lng: location[1],
                photos,
            };

            const res = await api('/business/register', payload, 'POST');
            const businessId = res.data?.business?.id;
            if (!businessId) throw new Error('ثبت نام انجام نشد');

            router.push(`/auth/business/plan?business_id=${businessId}`);
        } catch {
            setLoading(false);
        }
    };

    if (jobsLoading) {
        return (
            <Center className="min-h-40">
                <Loader />
            </Center>
        );
    }

    const jobOptions = jobs.map((j) => ({value: j.id, label: j.name}));

    return (
        <div className="flex flex-col gap-2 max-w-2xl w-full">
            <h3 className="text-3xl font-semibold">ثبت شغل من</h3>
            <p className="opacity-60">اطلاعات کسب و کار خود را وارد کنید. پس از ثبت و تایید مدیر، کسب و کار شما منتشر خواهد شد.</p>
            <br/>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col lg:flex-row gap-4">
                    <FormComponent
                        component={TextInput}
                        label="نام کسب و کار"
                        placeholder="نام کسب و کار"
                        name="business_name"
                        required
                        className="grow"
                    />
                    <FormComponent
                        component={TextInput}
                        label="نام و نام خانوادگی"
                        placeholder="نام و نام خانوادگی"
                        name="full_name"
                        required
                        className="grow"
                    />
                </div>

                <FormComponent
                    component={Select}
                    label="نوع خدمات ارائه دهنده"
                    placeholder="انتخاب کنید"
                    name="job_id"
                    data={jobOptions}
                    searchable
                    className="grow"
                />

                <div className="flex flex-col lg:flex-row gap-4">
                    <FormComponent
                        component={TextInput}
                        label="سابقه کار"
                        placeholder="مثلاً ۵ سال"
                        name="work_experience"
                        className="grow"
                    />
                    <FormComponent
                        component={TextInput}
                        label="شماره تماس"
                        placeholder="09xxxxxxxxx"
                        name="phone"
                        defaultValue={phone || ''}
                        dir="ltr"
                        className="grow"
                        required
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    <FormComponent
                        component={TextInput}
                        label="ایمیل"
                        placeholder="email@example.com"
                        name="email"
                        dir="ltr"
                        className="grow"
                    />
                    <FormComponent
                        component={TextInput}
                        label="راه‌های ارتباطی دیگر"
                        placeholder="مثلاً تلگرام، واتساپ"
                        name="other_contacts"
                        className="grow"
                    />
                </div>

                <FormComponent
                    component={Textarea}
                    label="توضیحات"
                    placeholder="توضیحات بیشتر درباره کسب و کار و خدمات شما"
                    name="description"
                    autosize
                    minRows={3}
                />

                <FormComponent
                    component={Textarea}
                    label="آدرس"
                    placeholder="آدرس کامل"
                    name="address"
                    autosize
                    minRows={2}
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">موقعیت روی نقشه</label>
                    <p className="text-xs opacity-60">روی نقشه کلیک کنید تا موقعیت شما مشخص شود</p>
                    <div className="rounded-xl overflow-hidden border border-white/10 h-80">
                        <LeafletMap
                            onMapClick={(lat, lng) => setLocation([lat, lng])}
                            style={{width: '100%', height: '100%'}}
                            showSpot={!!location}
                            spots={location ? [{
                                x: location[0],
                                y: location[1],
                                onClick: () => {},
                            }] : []}
                        />
                    </div>
                    {location && (
                        <p className="text-xs opacity-60" dir="ltr">
                            {location[0].toFixed(4)}, {location[1].toFixed(4)}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">عکس از نمونه کارها</label>
                    <FileInput
                        label=""
                        placeholder="عکس‌های نمونه کار را آپلود کنید"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoChange}
                    />
                    {photos.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-2">
                            {photos.map((photo, i) => (
                                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 group">
                                    <Image src={photo} alt={`نمونه ${i + 1}`} fill style={{objectFit: 'cover'}} unoptimized />
                                    <button
                                        type="button"
                                        onClick={() => removePhoto(i)}
                                        className="absolute top-1 right-1 bg-black/60 rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <CustomButton loading={loading} type="submit" className="w-full">
                    ثبت و ادامه
                </CustomButton>
            </form>
        </div>
    );
}

export default Page;
