import React from "react";
import TopSlider from "@/app/(landing)/blog/TopSlider";
import {IconFolder2} from "@/components/ui/SVGs";
import PostItem from "@/app/(landing)/blog/components/PostItem";
import BlogFavorite from "@/app/(landing)/blog/components/BlogFavorite";
import BlogSearch from "@/app/(landing)/blog/components/BlogSearch";
import {api} from "@/lib/api/base";
import CacheUpdate from "@/lib/utils/cache-ssr";
import {Metadata} from "next";
import {BlogPost} from "@/lib/api/base.type";

const topItems = Array.from({length: 3}).map(o => ({}))

async function Page(props: any) {
    const res: {posts: BlogPost[] } = {
        posts: [
            {
                title: "مقاله 1",
                category: "آموزشی",
            } as any
        ]
    }
    return (
        <CacheUpdate cache={{blog: res}}>
            <div className={'flex flex-col gap-7'}>
                <TopSlider/>
                <div className="container mx-auto p-5 lg:p-0">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <IconFolder2 stroke="var(--text-color)" width={38} height={38}/>
                            <h3 className="text-2xl font-semibold">آموزش ها</h3>
                        </div>
                        <p className="opacity-70">
                            آموزش های تخصصی برای شناخت بهتر قابلیت های سازه من و استفاده بهتر از آن در کسب و کارتان. این
                            آموزش ها به صورت مرحله به مرحله و با زبانی ساده ارائه شده اند تا همه بتوانند از آن بهره مند
                            شوند.
                        </p>
                        <div className={'mt-5 grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-5'}>
                            {res?.posts?.map?.((o, i) => (
                                <PostItem post={o} key={i}/>
                            ))}
                        </div>
                    </div>
                </div>
                <BlogFavorite/>
                <div className="container mx-auto p-5 lg:p-0">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-semibold">کل مقالات</h3>
                        </div>
                        <p className="opacity-70">
                            در این بخش می‌توانید به تمامی مقالات بلاگ دسترسی داشته باشید و با استفاده از قابلیت جستجو،
                            مقاله مورد نظر خود را بیابید. همچنین می‌توانید مقالات را بر اساس محبوبیت یا تاریخ انتشار
                            مرتب کنید تا بهترین تجربه را در مطالعه داشته باشید.
                        </p>
                        <BlogSearch defaultRes={res}/>
                    </div>
                </div>
            </div>
        </CacheUpdate>
    )
}

export const metadata: Metadata = {
    title: "بلاگ",
    alternates: {
        canonical: "https://donofa.com/blog/",
    },
}

export default Page;