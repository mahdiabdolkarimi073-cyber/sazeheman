'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api/base';
import CustomButton from '@/components/ui/base/CustomButton';
import { TextInput, Textarea, Select, Image as MantineImage } from '@mantine/core';

type Step = 'idle' | 'form' | 'edit';

function ProductsPage() {
    const [step, setStep] = useState<Step>('idle');
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [shop, setShop] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [editId, setEditId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState('');

    const loadAll = () => {
        setLoading(true);
        Promise.all([
            api("/shop/products").then(e => e.data).catch(() => ({ products: [] })),
            api("/shop/categories").then(e => e.data).catch(() => ({ categories: [] })),
            api("/shop/my-shop").then(e => e.data).catch(() => ({ shop: null })),
        ]).then(([pRes, cRes, sRes]) => {
            setProducts(pRes?.products || []);
            setCategories(cRes?.categories || []);
            setShop(sRes?.shop || null);
        }).finally(() => setLoading(false));
    };

    useEffect(() => { loadAll(); }, []);

    const resetForm = () => {
        setEditId(null);
        setName(''); setDescription(''); setPrice(''); setStock(''); setCategoryId(null); setImageUrl('');
    };

    const startEdit = (p: any) => {
        setEditId(p.id);
        setName(p.name); setDescription(p.description || ''); setPrice(String(p.price));
        setStock(String(p.stock)); setCategoryId(p.category_id); setImageUrl(p.image_url || '');
        setStep('form');
    };

    const submit = async () => {
        if (!name || !price) {
            window.alert?.("نام و قیمت محصول الزامی است");
            return;
        }
        setSubmitting(true);
        try {
            if (editId) {
                await api("/shop/products", { id: editId, name, description, price, stock, category_id: categoryId, image_url: imageUrl }, "PUT");
            } else {
                await api("/shop/products", { name, description, price, stock, category_id: categoryId, image_url: imageUrl });
            }
            resetForm();
            setStep('idle');
            loadAll();
        } catch {}
        setSubmitting(false);
    };

    const remove = async (id: string) => {
        if (!confirm("این محصول حذف شود؟")) return;
        await api(`/shop/products?id=${id}`, { _silence: true } as any, "DELETE").catch(() => {});
        loadAll();
    };

    if (step === 'form') {
        return (
            <div className="flex flex-col gap-5 p-4 sm:p-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => { setStep('idle'); resetForm(); }} className="text-sm opacity-70 hover:opacity-100">
                        بازگشت
                    </button>
                    <h1 className="text-xl sm:text-2xl font-semibold">{editId ? "ویرایش محصول" : "ثبت محصول جدید"}</h1>
                </div>

                <div className="max-w-2xl bg-container rounded-2xl p-5 sm:p-7 border border-b2">
                    <div className="flex flex-col gap-4">
                        <TextInput label="نام محصول" placeholder="مثلاً: سیمان" value={name} onChange={(e) => setName(e.target.value)} />
                        <Textarea label="توضیحات (اختیاری)" placeholder="توضیحات محصول..." value={description} onChange={(e) => setDescription(e.target.value)} autosize minRows={2} />
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput label="قیمت (تومان)" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} type="number" dir="ltr" />
                            <TextInput label="موجودی" placeholder="0" value={stock} onChange={(e) => setStock(e.target.value)} type="number" dir="ltr" />
                        </div>
                        <Select
                            label="دسته‌بندی (اختیاری)"
                            placeholder="انتخاب دسته..."
                            data={categories.map((c: any) => ({ value: c.id, label: c.name }))}
                            value={categoryId}
                            onChange={setCategoryId}
                            clearable
                        />
                        <TextInput label="آدرس عکس (اختیاری)" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} dir="ltr" />
                        {imageUrl && (
                            <div className="rounded-xl overflow-hidden border border-b2 bg-background max-h-48">
                                <img src={imageUrl} alt="preview" className="w-full max-h-48 object-contain" />
                            </div>
                        )}
                        <div className="flex gap-3">
                            <CustomButton shadow loading={submitting} onClick={submit} className="w-full sm:w-auto">
                                {editId ? "ذخیره تغییرات" : "ثبت محصول"}
                            </CustomButton>
                            <CustomButton variant="soft" onClick={() => { setStep('idle'); resetForm(); }} className="w-full sm:w-auto">
                                انصراف
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold">مدیریت محصولات</h1>
                    <p className="text-sm opacity-70 mt-1">
                        {shop ? `فروشگاه: ${shop.name}` : "محصولات فروشگاه شما"}
                    </p>
                </div>
                <CustomButton shadow onClick={() => { resetForm(); setStep('form'); }}>
                    + محصول جدید
                </CustomButton>
            </div>

            <div className="bg-container rounded-2xl p-5 border border-b2">
                {loading ? (
                    <p className="text-sm opacity-50 text-center py-8">در حال بارگذاری...</p>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-b1 flex items-center justify-center">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M3 17l5-5 4 4 3-3 6 6" />
                            </svg>
                        </div>
                        <p className="opacity-60 text-sm">هنوز محصولی ثبت نکرده‌اید</p>
                        <CustomButton shadow onClick={() => setStep('form')}>
                            ثبت اولین محصول
                        </CustomButton>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {products.map((p) => (
                            <div key={p.id} className="bg-background rounded-xl border border-b2 overflow-hidden">
                                <div className="h-32 bg-container relative">
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-30">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                                <path d="M3 17l5-5 4 4 3-3 6 6" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <h3 className="font-medium text-sm truncate">{p.name}</h3>
                                    {p.category && <p className="text-xs opacity-50 mt-0.5">{p.category.name}</p>}
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-primary font-bold text-sm">
                                            {p.price.toLocaleString("fa")} ت
                                        </span>
                                        <span className="text-xs opacity-50">موجودی: {p.stock.toLocaleString("fa")}</span>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => startEdit(p)}
                                            className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                                        >
                                            ویرایش
                                        </button>
                                        <button
                                            onClick={() => remove(p.id)}
                                            className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductsPage;
