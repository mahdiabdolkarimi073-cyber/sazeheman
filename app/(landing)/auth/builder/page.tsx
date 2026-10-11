'use client';

import React, {useState} from 'react';
import {TextInput, Textarea, NumberInput, Select, FileInput} from '@mantine/core';
import Image from 'next/image';
import CustomButton from '@/components/ui/base/CustomButton';
import FormComponent from '@/components/ui/base/FormComponent';
import {optimizeForm} from '@/lib/utils/global';
import {api} from '@/lib/api/base';
import LeafletMap from '@/components/map/leaflet';
import {useRouter} from 'next/navigation';

const managerRoles = [
    {value: 'پیمانکار', label: 'پیمانکار'},
    {value: 'کارفرما', label: 'کارفرما'},
    {value: 'مسئول خرید', label: 'مسئول خرید'},
    {value: 'صاحب ملک', label: 'صاحب ملک'},
];

function Page() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<[number, number] | undefined>();
    const [photoPreview, setPhotoPreview] = useState<string | undefined>();

    const handlePhotoChange = (file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPhotoPreview(undefined);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = optimizeForm(e).toJson();

        if (!location) {
            window.alert('لطفاً موقعیت پروژه را روی نقشه انتخاب کنید');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...form,
                location_lat: location[0],
                location_lng: location[1],
                photo_url: photoPreview || null,
            };

            const res = await api('/construction/register', payload, 'POST');
            const projectId = res.data?.project?.id;
            if (!projectId) throw new Error('پروژه ثبت نشد');

            // Send SMS code
            await api('/construction/sms-send', {phone: form.phone1}, 'POST');
            router.push(`/auth/builder/verify?project_id=${projectId}&phone=${form.phone1}`);
        } catch {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2 max-w-2xl w-full">
            <h3 className="text-3xl font-semibold">ثبت پروژه ساختمانی</h3>
            <p className="opacity-60">اطلاعات پروژه خود را وارد کنید. پس از ثبت، شماره شما تایید شده و پس از بررسی ادمین روی نقشه نمایش داده می‌شود.</p>
            <br/>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col lg:flex-row gap-4">
                    <FormComponent
                        component={TextInput}
                        label="نام پروژه"
                        placeholder="نام پروژه را وارد کنید"
                        name="project_name"
                        required
                        className="grow"
                    />
                    <FormComponent
                        component={TextInput}
                        label="نام سازنده"
                        placeholder="نام سازنده"
                        name="builder_name"
                        required
                        className="grow"
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    <FormComponent
                        component={NumberInput}
                        label="مساحت در حال ساخت (متر مربع)"
                        placeholder="مثلاً ۵۰۰"
                        name="area"
                        className="grow"
                    />
                    <FormComponent
                        component={NumberInput}
                        label="تعداد طبقه"
                        placeholder="مثلاً ۶"
                        name="floors_count"
                        className="grow"
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    <FormComponent
                        component={TextInput}
                        label="شروع پروژه"
                        placeholder="YYYY-MM-DD"
                        name="start_date"
                        type="date"
                        className="grow"
                    />
                    <FormComponent
                        component={Select}
                        label="مسئول پروژه"
                        placeholder="انتخاب کنید"
                        name="manager_role"
                        data={managerRoles}
                        className="grow"
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    <FormComponent
                        component={TextInput}
                        label="شماره تماس ۱"
                        placeholder="09xxxxxxxxx"
                        name="phone1"
                        required
                        dir="ltr"
                        className="grow"
                    />
                    <FormComponent
                        component={TextInput}
                        label="شماره تماس ۲"
                        placeholder="09xxxxxxxxx"
                        name="phone2"
                        dir="ltr"
                        className="grow"
                    />
                    <FormComponent
                        component={TextInput}
                        label="شماره تماس ۳"
                        placeholder="09xxxxxxxxx"
                        name="phone3"
                        dir="ltr"
                        className="grow"
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
                    label="آدرس"
                    placeholder="آدرس کامل پروژه"
                    name="address"
                    autosize
                    minRows={2}
                />

                <FormComponent
                    component={Textarea}
                    label="توضیحات"
                    placeholder="توضیحات بیشتر درباره پروژه"
                    name="description"
                    autosize
                    minRows={3}
                />

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">عکس پروژه</label>
                    <FileInput
                        label=""
                        placeholder="عکس پروژه را آپلود کنید"
                        accept="image/*"
                        onChange={handlePhotoChange}
                    />
                    {photoPreview && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-white/10 max-w-xs relative h-40">
                            <Image src={photoPreview} alt="پیش‌نمایش" fill style={{objectFit: 'cover'}} unoptimized />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">موقعیت روی نقشه</label>
                    <p className="text-xs opacity-60">روی نقشه کلیک کنید تا موقعیت پروژه مشخص شود</p>
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

                <CustomButton loading={loading} type="submit" className="w-full">
                    ثبت و ادامه
                </CustomButton>
            </form>
        </div>
    );
}

export default Page;
