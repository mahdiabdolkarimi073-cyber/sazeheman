'use client';

import BgPattern from "@/components/ui/home/BgPattern";
import Image from "next/image";
import CustomButton from "@/components/ui/base/CustomButton";
import Link from "next/link";

const badges = [
    {
        src: "/pics/Exchange.webp",
        alt: "logo",
        text: "درآمد سریع",
        positionClasses: "top-24 w-34 left-[8%] lg:left-[12%]",
        delay: "0s",
    },
    {
        src: "/pics/Bag.webp",
        alt: "logo",
        text: "پیشرفت ساخت",
        positionClasses: "top-6 w-30 left-[20%] lg:left-[22%]",
        delay: "0.5s",
    },
    {
        src: "/pics/Gift.webp",
        alt: "logo",
        text: "کم هزینه",
        positionClasses: "top-20 w-34 right-[8%] lg:right-[12%]",
        delay: "1s",
    },
    {
        src: "/pics/BTC.webp",
        alt: "logo",
        text: "ارتباط مستقیم",
        positionClasses: "-top-2 w-30 right-[22%] lg:right-[22%]",
        delay: "1.5s",
    },
];
const sharedClasses =
    "hidden md:flex absolute flex-row items-center gap-2 px-4 rounded-2xl bg-white/80 dark:bg-[#18181b]/80 p-3 z-20 backdrop-blur-xl border border-[rgba(93,212,168,0.25)] shadow-[0_8px_30px_rgba(93,212,168,0.12)] transition-all duration-500 ease-out hover:scale-110 hover:shadow-[0_12px_40px_rgba(93,212,168,0.2)] hover-lift";

function HeroSectionV2() {
    return (
        <div
            className={'relative lg:h-screen h-[75dvh] flex gap-3 items-center w-full flex-nowrap justify-between green-mesh-bg overflow-hidden'}
            style={{
                minHeight: "600px",
            }}
        >
            {/* Decorative gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, var(--primary-light) 0%, transparent 70%)" }} />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }} />

            <div className={'bg-fade-top'} />
            <BgPattern />
            <div className={'min-w-[50vw] xl:min-w-[500px]'} />
            <BgPattern />
            <div className={'bg-fade-bottom'} />
            <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                zIndex: "10",

            }} className={'text-center flex flex-col relative justify-center'}>
                <div
                    className="flex flex-col mx-auto px-4 z-10 max-w-4xl animate-fade-in-up animate-fade-in-up-delay-1 h">
                    {badges.map((badge, index) => (
                        <div
                            key={index}
                            className={`${sharedClasses} ${badge.positionClasses} min-h-14`}
                            style={{ animationDelay: badge.delay }}
                        >
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-primary/15 shrink-0">
                                <Image src={badge.src} alt={badge.alt} width={20} height={20} />
                            </div>
                            <p className="text-sm font-semibold opacity-80 text-center w-full">{badge.text}</p>
                        </div>
                    ))}

                    <div className="inline-flex items-center gap-2 mx-auto mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-dark text-sm font-medium animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        پلتفرم جامع صنعت ساختمان
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl text-gradient mb-6 py-2 leading-tight"
                        style={{ fontWeight: 800 }}>
                            ساختی سریع و دقیق
                            <br/>
                            با هزینه کم را تجربه کن
                    </h1>
                    <p className="opacity-70 mb-8 mx-auto max-w-xl text-base sm:text-lg leading-relaxed">
                        در کمتر از ۲ دقیقه صفحه اختصاصی ساختساز خودتو بساز و شروع به کسب درآمد کن!
                        <br/>
                        سازه من، کامل‌ترین پلتفرم دریافت حمایت مالی
                    </p>
                </div>
                {/* Buttons - Fade in up with opacity effect */}
                <div className="flex justify-center w-full sm:w-auto px-4 z-10 animate-fade-in-up animate-fade-in-up-delay-3 gap-3">
                    <Link href={"/dashboard"}>
                        <CustomButton shadow y={10} className="px-8! py-3! text-base!">
                            شروع رایگان
                        </CustomButton>
                    </Link>
                    <Link href={"/#abilities"}>
                        <CustomButton variant="soft" className="px-8! py-3! text-base!">
                            بیشتر بدانید
                        </CustomButton>
                    </Link>
                </div>

                {/* Stats bar */}
                <div className="hidden md:flex justify-center gap-8 mt-12 z-10 animate-fade-in-up animate-fade-in-up-delay-4">
                    {[
                        { num: "+۲۵۰۰", label: "پروژه فعال" },
                        { num: "+۸۰۰", label: "پیمانکار" },
                        { num: "+۳۰", label: "شهر پوشش" },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-primary-dark">{stat.num}</span>
                            <span className="text-sm opacity-60">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


export default HeroSectionV2;
