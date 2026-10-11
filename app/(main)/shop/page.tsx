import { Metadata } from "next";
import { api } from "@/lib/api/base";

export const metadata: Metadata = {
    title: "فروشگاه",
};

async function ShopPage() {
    const [productsRes, categoriesRes, adsRes] = await Promise.all([
        api("/shop").then(e => e.data).catch(() => ({ products: [], total: 0 })),
        api("/shop/categories").then(e => e.data).catch(() => ({ categories: [] })),
        api("/shop/ads").then(e => e.data).catch(() => ({ ads: [] })),
    ]);

    const products = productsRes?.products || [];
    const categories = categoriesRes?.categories || [];
    const ads = adsRes?.ads || [];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-2 mb-6">
                <h1 className="text-2xl font-bold">فروشگاه</h1>
                <p className="text-sm opacity-70">محصولات فروشگاه‌های تایید شده</p>
            </div>

            {ads.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {ads.slice(0, 3).map((ad: any) => (
                        <a
                            key={ad.id}
                            href={ad.link_url || "#"}
                            className="relative rounded-2xl overflow-hidden h-40 group"
                        >
                            <img
                                src={ad.image_url}
                                alt={ad.title}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                <div>
                                    <p className="text-white font-medium text-lg">{ad.title}</p>
                                    <p className="text-white/70 text-xs">{ad.shop?.name}</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                <aside className="lg:w-56 shrink-0">
                    <div className="bg-container rounded-2xl border border-b2 p-4 lg:sticky lg:top-4">
                        <h3 className="font-medium text-sm mb-3">دسته‌بندی‌ها</h3>
                        <div className="flex flex-row flex-wrap gap-2 lg:flex-col">
                            <a
                                href="/shop"
                                className="text-sm px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
                            >
                                همه
                            </a>
                            {categories.map((cat: any) => (
                                <a
                                    key={cat.id}
                                    href={`/shop?category_id=${cat.id}`}
                                    className="text-sm px-3 py-2 rounded-lg hover:bg-b1 transition-colors"
                                >
                                    {cat.name}
                                    <span className="opacity-40 text-xs mr-1">({cat._count?.products || 0})</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </aside>

                <div className="grow">
                    <form action="/shop" className="mb-5">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="search"
                                placeholder="جستجوی محصول..."
                                className="grow rounded-xl border border-b2 bg-container px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                            />
                            <button
                                type="submit"
                                className="cbutton justify-center px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium"
                            >
                                جستجو
                            </button>
                        </div>
                    </form>

                    {products.length === 0 ? (
                        <div className="bg-container rounded-2xl border border-b2 p-12 text-center">
                            <p className="opacity-60 text-sm">محصولی یافت نشد</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((p: any) => (
                                <div
                                    key={p.id}
                                    className="bg-container rounded-2xl border border-b2 overflow-hidden hover:shadow-lg transition-shadow group"
                                >
                                    <div className="aspect-square bg-background relative overflow-hidden">
                                        {p.image_url ? (
                                            <img
                                                src={p.image_url}
                                                alt={p.name}
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-30">
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                                    <path d="M3 17l5-5 4 4 3-3 6 6" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-medium text-sm truncate">{p.name}</h3>
                                        <p className="text-xs opacity-50 truncate mt-0.5">{p.shop?.name}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-primary font-bold text-sm">
                                                {p.price.toLocaleString("fa")} ت
                                            </span>
                                            {p.stock > 0 ? (
                                                <span className="text-xs text-green-600">موجود</span>
                                            ) : (
                                                <span className="text-xs text-red-500">ناموجود</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-12 bg-container rounded-2xl border border-b2 p-6">
                <h2 className="text-lg font-bold mb-2">مقایسه محصولات</h2>
                <p className="text-sm opacity-70 mb-4">قیمت محصول مورد نظر را در فروشگاه‌های مختلف مقایسه کنید</p>
                <form action="/shop/compare" className="flex gap-2 max-w-lg">
                    <input
                        type="text"
                        name="name"
                        placeholder="نام محصول..."
                        className="grow rounded-xl border border-b2 bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
                    />
                    <button
                        type="submit"
                        className="cbutton justify-center px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium"
                    >
                        مقایسه
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ShopPage;
