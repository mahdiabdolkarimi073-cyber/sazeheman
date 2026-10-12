import React from "react";
import Image from "next/image";
import Logo from "@/components/assets/Logo";
import { getSession } from "@/lib/cache/session";
import { Metadata } from "next";
import Link from "next/link";

async function Layout(props: any) {
    const { user } = await getSession();

    return (
        <div dir="rtl" className="min-h-screen overflow-x-hidden bg-[#F7F8F6] lg:flex lg:flex-row-reverse">
            <section className="relative min-h-[320px] overflow-hidden bg-[#173D35] sm:min-h-[400px] lg:min-h-screen lg:w-[60%]">
                <Image
                    src="/images/hero/Construction_Plans_at_Sunset.png"
                    alt="کلاه ایمنی و نقشه‌های ساختمانی در زمان غروب"
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 60vw"
                    className="object-cover object-[40%_center]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

                <div className="relative z-10 flex min-h-[320px] flex-col p-6 sm:min-h-[400px] sm:p-8 lg:min-h-screen lg:p-10">
                    <div className="flex items-center justify-between">
                        <Logo className="[&>p]:!text-white" />
                        <Link
                            href="/"
                            className="flex min-h-11 items-center gap-1.5 rounded-full border border-white/30 bg-black/10 px-3 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/15"
                        >
                            بازگشت به خانه
                        </Link>
                    </div>

                    <div className="mt-auto max-w-xl pb-2 sm:pb-4 lg:pb-8">
                        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm sm:text-sm">
                            <span className="h-2 w-2 rounded-full bg-[#36B98A]" />
                            پلتفرم جامع صنعت ساختمان
                        </span>
                        <h2 className="mb-3 text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-5xl">
                            ساخت سریع و دقیق
                            <br />
                            با هزینه کم را تجربه کن
                        </h2>
                        <p className="max-w-lg text-sm leading-7 text-white/85 sm:text-base">
                            سازه من پلتفرمی جامع برای ارتباط مستقیم سازندگان با پیمانکاران، مهندسین و فروشندگان مصالح ساختمانی است.
                        </p>
                    </div>
                </div>
            </section>

            <section className="flex min-h-[calc(100vh-320px)] flex-1 flex-col bg-[#F7F8F6] lg:min-h-screen lg:w-[40%]">
                <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-16">
                    {props.children}
                </div>
            </section>
        </div>
    );
}

export const metadata: Metadata = {
    title: "ورود"
};

export default Layout;
