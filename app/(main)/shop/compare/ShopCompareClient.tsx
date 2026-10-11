'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function ShopCompareClient({ initialName, initialProducts }: { initialName: string; initialProducts: any[] }) {
    const router = useRouter();
    const [name, setName] = useState(initialName);
    const [products] = useState(initialProducts);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            router.push(`/shop/compare?name=${encodeURIComponent(name.trim())}`);
        }
    };

    if (!initialName) {
        return (
            <div className="max-w-lg">
                <form onSubmit={submit} className="flex gap-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="نام محصول..."
                        className="grow rounded-xl border border-b2 bg-container px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                    />
                    <button
                        type="submit"
                        className="cbutton justify-center px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium"
                    >
                        مقایسه
                    </button>
                </form>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="bg-container rounded-2xl border border-b2 p-12 text-center">
                <p className="opacity-60 text-sm">محصولی با نام &laquo;{initialName}&raquo; یافت نشد</p>
            </div>
        );
    }

    const minPrice = Math.min(...products.map(p => p.price));

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={submit} className="flex gap-2 max-w-lg">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="نام محصول..."
                    className="grow rounded-xl border border-b2 bg-container px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                />
                <button
                    type="submit"
                    className="cbutton justify-center px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium"
                >
                    مقایسه
                </button>
            </form>

            <div className="overflow-x-auto bg-container rounded-2xl border border-b2">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-b2">
                            <th className="text-right p-4 font-medium">فروشگاه</th>
                            <th className="text-right p-4 font-medium">نام محصول</th>
                            <th className="text-right p-4 font-medium">قیمت</th>
                            <th className="text-right p-4 font-medium">وضعیت</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p: any) => (
                            <tr key={p.id} className="border-b border-b2 last:border-0">
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {p.shop?.logo_url && (
                                            <img src={p.shop.logo_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                                        )}
                                        <span>{p.shop?.name}</span>
                                    </div>
                                </td>
                                <td className="p-4">{p.name}</td>
                                <td className="p-4">
                                    <span className={p.price === minPrice ? "text-green-600 font-bold" : "font-medium"}>
                                        {p.price.toLocaleString("fa")} ت
                                    </span>
                                    {p.price === minPrice && (
                                        <span className="text-xs text-green-600 mr-2">ارزان‌ترین</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {p.stock > 0 ? (
                                        <span className="text-xs text-green-600">موجود</span>
                                    ) : (
                                        <span className="text-xs text-red-500">ناموجود</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ShopCompareClient;
