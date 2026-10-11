'use client';

import {useMemo, useState} from 'react';
import {
    TextInput,
    NumberInput,
    Select,
    MultiSelect,
    Textarea,
    Button,
    FileInput,
    Stack,
    Group,
} from '@mantine/core';
import DatePicker from "@/components/ui/date/DatePicker";
import {IconPlus, IconTrash, IconUpload} from "@/components/ui/SVGs";
import LeafletMap from "@/components/map/leaflet";

const formConfig = {
    contractorRegistrationForm: {
        projectName: {
            type: "text",
            label: "نام پروژه",
            placeholder: "نام پروژه را وارد کنید",
            required: true,
        },
        builderName: {
            type: "text",
            label: "نام سازنده",
            placeholder: "نام سازنده را وارد کنید",
            required: true,
        },
        constructionArea: {
            type: "number",
            label: "مساحت در حال ساخت",
            placeholder: "مساحت به متر مربع",
            required: true,
            unit: "متر مربع",
        },
        projectStartDate: {
            type: "date",
            label: "تاریخ آغاز پروژه",
            placeholder: "تاریخ را انتخاب کنید",
            required: true,
        },
        numberOfFloors: {
            type: "number",
            label: "تعداد طبقه",
            placeholder: "تعداد طبقات",
            required: true,
        },
        projectManager: {
            type: "text",
            label: "مسئول پروژه",
            placeholder: "نام مسئول پروژه",
            required: true
        },
        phoneNumbers: {
            type: "array",
            label: "شماره تماس",
            required: true,
            maxItems: 3,
            items: {
                type: "tel",
                placeholder: "09123456789",
            },
        },
        email: {
            type: "email",
            label: "ایمیل",
            placeholder: "example@email.com",
            required: false,
        },
        otherContacts: {
            type: "textarea",
            label: "راه‌های ارتباطی دیگر",
            placeholder: "تلگرام، واتساپ، اینستاگرام و...",
            required: false,
        },
        description: {
            type: "textarea",
            label: "توضیحات",
            placeholder: "توضیحات تکمیلی در مورد پروژه",
            required: false,
        },
        address: {
            type: "textarea",
            label: "آدرس",
            placeholder: "آدرس کامل پروژه",
            required: true,
        },
        location: {
            type: "map",
            label: "موقعیت"
        },
        projectImages: {
            type: "file",
            label: "عکس پروژه",
            required: false,
            multiple: true,
            accept: "image/*",
        },
    },
    serviceProviderRegistrationForm: {
        businessName: {
            type: "text",
            label: "نام کسب و کار",
            placeholder: "نام کسب و کار خود را وارد کنید",
            required: true,
        },
        fullName: {
            type: "text",
            label: "نام و نام خانوادگی",
            placeholder: "نام و نام خانوادگی",
            required: true,
        },
        serviceTypes: {
            type: "multiselect",
            label: "نوع خدمات ارائه دهنده",
            placeholder: "خدمات خود را انتخاب کنید",
            required: true,
            options: [
                {value: "masonry", label: "بنایی"},
                {value: "plumbing", label: "لوله کشی"},
                {value: "electrical", label: "برق کشی"},
                {value: "hvac", label: "تاسیسات مکانیکی"},
                {value: "painting", label: "نقاشی ساختمان"},
                {value: "tiling", label: "کاشی کاری"},
                {value: "flooring", label: "کف سازی"},
                {value: "carpentry", label: "نجاری"},
                {value: "welding", label: "جوشکاری"},
                {value: "concrete", label: "بتن ریزی"},
                {value: "ironwork", label: "آهنگری"},
                {value: "plastering", label: "گچ کاری"},
                {value: "insulation", label: "عایق کاری"},
                {value: "roofing", label: "پوشش سقف"},
                {value: "landscaping", label: "فضای سبز"},
                {value: "demolition", label: "تخریب"},
                {value: "architecture", label: "معماری"},
                {value: "interiorDesign", label: "طراحی داخلی"},
                {value: "other", label: "سایر"},
            ],
        },
        workExperience: {
            type: "number",
            label: "سابقه کار",
            placeholder: "سابقه کار به سال",
            required: true,
            unit: "سال",
        },
        phoneNumber: {
            type: "tel",
            label: "شماره تماس",
            placeholder: "09123456789",
            required: true,
        },
        email: {
            type: "email",
            label: "ایمیل",
            placeholder: "example@email.com",
            required: false,
        },
        otherContacts: {
            type: "textarea",
            label: "راه‌های ارتباطی دیگر",
            placeholder: "تلگرام، واتساپ، اینستاگرام و...",
            required: false,
        },
        description: {
            type: "textarea",
            label: "توضیحات",
            placeholder: "توضیحات تکمیلی در مورد خدمات و تجربیات",
            required: false,
        },
        address: {
            type: "textarea",
            label: "آدرس",
            placeholder: "آدرس کامل محل کسب و کار",
            required: true,
        },
        location: {
            type: "map",
            label: "موقعیت"
        },
        portfolioImages: {
            type: "file",
            label: "عکس از نمونه کارها",
            required: false,
            multiple: true,
            accept: "image/*",
        },
    },
};

export default function DynamicForm({formType = "serviceProviderRegistrationForm"}: {
    formType: 'contractorRegistrationForm' | 'serviceProviderRegistrationForm'
}) {
    const config = formConfig[formType];
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [spot, setSpot] = useState<any>()

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    const renderField = (fieldName: string, fieldConfig: any) => {
        const value = formData[fieldName];

        switch (fieldConfig.type) {
            case 'text':
            case 'email':
            case 'tel':
                return (
                    <TextInput
                        key={fieldName}
                        label={fieldConfig.label}
                        placeholder={fieldConfig.placeholder}
                        value={value || ''}
                        onChange={(e) => updateField(fieldName, e.currentTarget.value)}
                        classNames={{input: 'text-right'}}
                    />
                );

            case 'number':
                return (
                    <NumberInput
                        key={fieldName}
                        label={fieldConfig.label}
                        placeholder={fieldConfig.placeholder}
                        value={value || ''}
                        onChange={(val) => updateField(fieldName, val)}
                        rightSection={fieldConfig.unit &&
                            <span className="text-sm text-gray-500">{fieldConfig.unit}</span>}
                        classNames={{input: 'text-right'}}
                    />
                );

            case 'date':
                return (
                    <DatePicker
                        key={fieldName}
                        label={fieldConfig.label}
                        placeholder={fieldConfig.placeholder}
                        value={new Date()}
                        onChange={(val) => updateField(fieldName, val)}
                        classNames={{input: 'text-right'}}
                    />
                );

            case 'select':
                return (
                    <Select
                        key={fieldName}
                        label={fieldConfig.label}
                        placeholder={fieldConfig.placeholder}
                        data={fieldConfig.options}
                        value={value || ''}

                        name={fieldName}
                        onChange={(val) => updateField(fieldName, val)}
                        classNames={{input: 'text-right'}}
                    />
                );

            case 'multiselect':
                return (
                    <MultiSelect
                        key={fieldName}
                        label={fieldConfig.label}
                        placeholder={fieldConfig.placeholder}
                        data={fieldConfig.options}
                        value={value || []}
                        onChange={(val) => updateField(fieldName, val)}
                        searchable
                        classNames={{input: 'text-right'}}
                    />
                );

            case 'textarea':
                return (
                    <Textarea
                        key={fieldName}
                        label={fieldConfig.label}
                        placeholder={fieldConfig.placeholder}
                        value={value || ''}
                        onChange={(e) => updateField(fieldName, e.currentTarget.value)}
                        rows={4}
                        classNames={{input: 'text-right'}}
                    />
                );

            case 'file':
                return (
                    <FileInput
                        key={fieldName}
                        label={fieldConfig.label}
                        placeholder={fieldConfig.placeholder}
                        multiple={fieldConfig.multiple}
                        accept={fieldConfig.accept}
                        value={value || []}
                        onChange={(files) => updateField(fieldName, files)}
                        leftSection={<IconUpload size={16}/>}
                        classNames={{input: 'text-right'}}
                    />
                );
            case "map":
                return (
                    <div className={'flex flex-col gap-3'}>
                        <p>{fieldConfig.label}</p>
                        <div
                            className={'w-full rounded-xl overflow-hidden min-h-80 flex items-stretch justify-stretch'}>
                            {useMemo(()=>(
                                <LeafletMap
                                    name={fieldName}
                                    key={'map'}
                                    zoom={10}
                                    spots={spot ? [spot] : undefined}
                                    onMapClick={(x, y) => {
                                        setSpot({
                                            x,
                                            y,
                                            onClick: () => setSpot(undefined),
                                            icon: "/icons/marker.svg"
                                        })
                                    }}
                                />
                            ),[fieldName,spot])}
                        </div>
                    </div>
                )
                break;
            case 'array':
                const items = value || [''];
                return (
                    <div key={fieldName}>
                        <label className="block text-sm font-medium text-gray-900 mb-2 text-right">
                            {fieldConfig.label} {fieldConfig.required && <span className="text-red-500">*</span>}
                        </label>
                        <Stack gap="sm">
                            {items.map((item: string, index: number) => (
                                <Group key={index} gap="xs">
                                    <TextInput
                                        placeholder={fieldConfig.items.placeholder}
                                        value={item}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index] = e.currentTarget.value;
                                            updateField(fieldName, newItems);
                                        }}
                                        className="flex-1"
                                        classNames={{input: 'text-right'}}
                                    />
                                    {items.length > 1 && (
                                        <Button
                                            color="red"
                                            variant="light"
                                            onClick={() => {
                                                const newItems = items.filter((_: any, i: number) => i !== index);
                                                updateField(fieldName, newItems);
                                            }}
                                            size="sm"
                                        >
                                            <IconTrash size={16}/>
                                        </Button>
                                    )}
                                </Group>
                            ))}
                        </Stack>
                        {items.length < (fieldConfig.maxItems || 999) && (
                            <Button
                                variant="light"
                                onClick={() => updateField(fieldName, [...items, ''])}
                                mt="sm"
                                leftSection={<IconPlus size={16}/>}
                                fullWidth
                            >
                                افزودن {fieldConfig.label}
                            </Button>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const json = Object.fromEntries(new FormData(e.currentTarget as any).entries());
        console.log('Form Data:', {
            ...formData,
            ...json
        });

        alert("به زودی!")
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className={'flex flex-col gap-5'} gap="lg">
                    {Object.entries(config).map(([fieldName, fieldConfig]) => renderField(fieldName, fieldConfig))}

                </div>
                <Button type="submit" size="lg" fullWidth className="mt-6">
                    ثبت فرم
                </Button>
            </div>
        </form>
    );
}