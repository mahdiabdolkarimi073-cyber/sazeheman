import { Metadata } from "next";
import { api } from "@/lib/api/base";
import ShopCompareClient from "./ShopCompareClient";

export const metadata: Metadata = {
    title: "مقایسه محصولات",
};

async function ShopComparePage(props: { searchParams: Promise<{ name?: string }> }) {
    const { name } = await props.searchParams;
    let products: any[] = [];

    if (name) {
        const res = await api("/shop/compare", { name }).then(e => e.data).catch(() => undefined);
        products = res?.products || [];
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-2 mb-6">
                <h1 className="text-2xl font-bold">مقایسه محصولات</h1>
                <p className="text-sm opacity-70">قیمت یک محصول را در فروشگاه‌های مختلف ببینید</p>
            </div>

            <ShopCompareClient initialName={name || ""} initialProducts={products} />
        </div>
    );
}

export default ShopComparePage;
