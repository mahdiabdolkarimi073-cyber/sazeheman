import React, {ComponentProps} from 'react';
import CustomButton from "@/components/ui/base/CustomButton";
import {IconDiscord, IconInstragram, IconTelegram, IconTwitterX, IconYoutube} from "@/components/ui/SVGs";
import Logo from "@/components/assets/Logo";
import Image from "next/image";
import {Accordion, AccordionControl, AccordionItem, AccordionPanel} from "@mantine/core";
import {twMerge} from "tailwind-merge";
import Link from 'next/link';

const links = [
    {
        "title": "دسته‌بندی مشاغل",
        "links": [
            {"label": "برق‌کاری", "href": "/#categories"},
            {"label": "نماکاری", "href": "/#categories"},
            {"label": "بتن‌ریزی", "href": "/#categories"},
            {"label": "کاشی و سرامیک", "href": "/#categories"},
            {"label": "تأسیسات ساختمان", "href": "/#categories"},
        ]
    },
    {
        "title": "ثبت‌نام",
        "links": [
            {"label": "ثبت سازه من", "href": "/auth/builder"},
            {"label": "ثبت شغل من", "href": "/auth/business/form"},
            {"label": "مزایده‌ها", "href": "/#tenders"},
            {"label": "تعرفه‌ها", "href": "/#plans"},
        ]
    },
    {
        "title": "پشتیبانی",
        "links": [
            {"label": "تماس با ما", "href": "/contact"},
            {"label": "قوانین و شرایط", "href": "/terms"},
            {"label": "سوالات متداول", "href": "/#faq"},
        ]
    },
];

function Footer(props: { footerBg?: string }) {
    return (
        <div className={'relative'}>
            {/* Gradient background fade */}
            <div className={'absolute bottom-0 w-full left-0 -z-2'} style={{
                background: "linear-gradient(180deg, transparent 0%, rgba(93,212,168,0.08) 100%)",
                height: `var(--footer-bg, ${props.footerBg || "130%"})`
            }}/>
            <div className={'container mx-auto mt-10'}>
                <div style={{
                    padding: '40px 48px 32px 48px',
                    borderRadius: "32px"
                }} className={'glass-card relative overflow-hidden'}>
                    {/* Top gradient bar */}
                    <div
                        className={'absolute z-0 top-0 left-0 h-1 w-full'}
                        style={{
                            background: "linear-gradient(90deg, var(--primary-light) 0%, var(--primary) 50%, var(--primary-dark) 100%)",
                        }}
                    />
                    {/* CTA section */}
                    <div className="flex relative z-10 gap-5 justify-center lg:justify-between items-center flex-wrap pt-6 pb-8">
                        <div className={'flex flex-col gap-3 items-center lg:items-start'}>
                            <h3 className={'text-xl lg:text-2xl max-w-md font-bold text-center lg:text-start'}>
                                سازه من، کاملترین پلتفرم ساخت‌ساز فارسی
                            </h3>
                            <div className={'w-full'}>
                                <Link href={'/auth'}>
                                    <CustomButton className={'w-full lg:w-fit'}>
                                        شروع استفاده
                                    </CustomButton>
                                </Link>
                            </div>
                        </div>
                        <div className={'flex flex-col items-center'}>
                            <p className={'font-semibold mb-2'}>مارو تو سوشال مدیا دنبال کن!</p>
                            <SocialList stroke={"var(--text-color)"} color={"var(--text-color)"} width={33}
                                        height={33}/>
                        </div>
                    </div>

                    <div className={'bg-b1 h-px w-full my-8'}/>

                    {/* Links section */}
                    <div className={'flex justify-between flex-wrap gap-8 lg:gap-0 flex-col lg:flex-row'}>
                        <div className={'max-w-sm'}>
                            <div className={'pt-1'}>
                                <Logo/>
                            </div>
                            <p className={'mt-3 opacity-70 text-sm leading-relaxed'}>
                                سازه من پلتفرمی برای ارتباط مستقیم سازندگان با پیمانکاران، مهندسین و فروشندگان مصالح
                                ساختمانی است. با ثبت پروژه روی نقشه و انتخاب خدمات مورد نیاز، می‌توانید سریع‌تر و با
                                هزینه کمتر پروژه خود را پیش ببرید.
                            </p>
                        </div>
                        <Accordion className={'grid grid-cols-1 block lg:hidden'}>
                            {links.map((link, index) => (
                                <AccordionItem value={link.title} key={index} className={'flex flex-col gap-2'}>
                                    <AccordionControl>
                                        <p className={'font-medium mb-1'}>{link.title}</p>
                                    </AccordionControl>
                                    <AccordionPanel>
                                        <div className={'flex flex-col gap-2'}>
                                            {link.links.map((link, index) => (
                                                <Link className={'text-black! opacity-60!'} key={index}
                                                      href={link.href}>
                                                    <p>{link.label}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>
                        <div className={'grid-cols-3 gap-3 hidden lg:grid'}>
                            {links.map((link, index) => (
                                <div key={index} className={'flex flex-col gap-2'}>
                                    <p className={'font-medium mb-1'}>{link.title}</p>
                                    {link.links.map((link, index) => (
                                        <Link className={'text-black! opacity-60! hover:text-primary-dark! transition-colors'} key={index} href={link.href}>
                                            <p>{link.label}</p>
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className={'flex gap-3 items-center justify-center lg:justify-end'}>
                            <Image
                                src={'/pics/design/enamad.png'}
                                alt={'etemad'}
                                width={100}
                                height={100}
                                style={{width: "90px", objectFit: "cover"}}
                                className='rounded-xl'
                            />
                        </div>
                    </div>
                    <br/>
                    <br/>
                    <FooterCopyRight/>
                </div>
                <div className={'h-10'}/>
            </div>
        </div>
    );
}

export const FooterCopyRight = () => (
    <div className={'flex justify-between flex-wrap gap-2'}>
        <p className={'opacity-75 font-light text-sm'}>© کپی‌رایت ۲۰۲۵، تمامی حقوق متعلق است به سازه من - Sazeheman</p>
        <a href="https://novinbin.com" target="_blank"><p className={'opacity-75 font-light text-sm'}>طراحی سایت توسط مهندسی نوآوران نوین بین</p></a>
    </div>
)

export const SocialList = ({className, ...props}: ComponentProps<'svg'>) => {
    props.width ||= 33;
    props.height ||= 33;
    props.color ||= props.stroke;
    return <div className={twMerge('flex gap-4 justify-center icon-list', className)}>
        <Link href={"https://www.instagram.com/donofa.ir"}>
            <IconInstragram {...props} />
        </Link>
        <IconTwitterX {...props} />
        <IconDiscord {...props} />
        <Link href={"https://t.me/SazehemanIr"}>
            <IconTelegram {...props} />
        </Link>
        <Link href={"https://www.youtube.com/@SazehemanIr"}>
            <IconYoutube {...props} />
        </Link>
    </div>
}

export default Footer;
