import { SocialList } from "@/components/ui/theme/Footer";

import { TextInput } from "@mantine/core";
import CustomTextarea from "@/components/ui/base/CustomTextarea";
import CustomButton from "@/components/ui/base/CustomButton";
import PageHeaderGrid from "@/components/ui/stuff/PageHeaderGrid";
import StyledDiv from "@/components/helper/StyledDiv";
import FormInputFilter from "@/components/ui/base/FormInputFilter";
import PhoneInput from "@/components/ui/base/PhoneInput";
import { Metadata } from "next";
import ContractForm from "./ContractForm";
import FormComponent from "@/components/ui/base/FormComponent";
import Script from "next/script";
import {ContactPageSchemaGraphSnippet, MainPageSchemaGraphSnippet} from "@/lib/utils/seo";
import React from "react";

function Page() {
    return (
        <div>
            <StyledDiv
                base={'body'}
                style={{
                    overflowX: "hidden"
                }}
            />
            <PageHeaderGrid scale={2.2} />
            <div className={'container gap-5 p-5 lg:p-0 mx-auto my-10 flex flex-wrap lg:flex-nowrap justify-center'}>
                <div className={'grow  flex flex-col items-center justify-center'}>
                    <div className={'flex flex-col gap-3 max-w-lg mx-auto lg:min-w-lg px-3 lg:px-0'}>
                        <h1 className={' text-4xl lg:text-5xl font-semibold leading-13'}>
                            با سازه من
                            <br/>
                            در تماس باش
                        </h1>
                        <div className={'mt-3'}>
                            <p>آدرس</p>
                            <p className={'opacity-70'}>
                                فارس، کرمان، شهرک مطهری - بلاک 14  طبقه : همکف
                            </p>
                        </div>
                        <br/>
                        <div className={'flex items-center justify-center gap-2 lg:justify-between flex-wrap w-full'}>
                        <p> شبکه های اجتماعی سازه من</p>
                            <SocialList stroke={"var(--primary)"}/>
                        </div>
                        <br/>
                        <div className={'flex items-center justify-between'}>
                            <p> به ما ایمیل بزن</p>
                            <a href={'mailto:Info@donofa.ir'} className={'text-primary'}>
                                Info@sazeheman.com
                            </a>
                        </div>
                        <br/>
                        <div className={'flex items-center justify-between'}>
                            <p> به ما زنگ بزن</p>
                            <a href={'tel:+987136319395'} dir={'ltr'} className={'text-primary'}>
                                +98 000 000 000
                            </a>
                        </div>

                    </div>
                </div>
                <div className={'flex items-center justify-center grow relative p-2'}>
                    <div
                        className={'absolute hidden lg:block'}
                        style={{
                            background: "linear-gradient(90deg, var(--secondary,#BBF451), var(--primary))",
                            width: "130%",
                            height: "30%",
                            borderRadius: "100%",
                            bottom: "10%",
                            left: "-50%",
                            filter: "blur(150px)",
                            opacity: 0.5
                        }}
                    />
                    <ContractForm
                        className={'border-b2 relative border bg-white/30 min-w-full lg:min-w-120 rounded-2xl flex flex-col gap-7 p-5 backdrop-blur-xs'}>
                        <p className={'font-semibold text-xl'}>فرم ارتباط با ما</p>
                        <div className={'flex-col lg:flex-row flex items-stretch justify-stretch gap-5'}>
                            <FormComponent component={TextInput} required label={'نام'} name={'name'} placeholder={'نام  خود را وارد کنید'} className={'grow'} />
                            <FormComponent component={TextInput}  required label={'نام خانوادگی'} name={'last_name'}  placeholder={'نام خانوادگی خود را وارد کنید'} className={'grow'} />
                        </div>
                        <div className={'grid grid-cols-1 lg:grid-cols-2 gap-5'}>
                            <FormInputFilter
                                component={TextInput}
                                filter={'qweasdzxcvbnfghrtyuiojklmp1234567890.@'}
                                placeholder={'آدرس ایمیل خود را وارد کنید'}
                                label={'آدرس ایمیل'}
                                required
                                className={'grow'}
                                name={'email'}
                            />
                            <PhoneInput
                                label={'شماره تماس'}
                                placeholder={'شماره تماس خود را وارد کنید'}
                                className={'grow!'}
                                required
                                size={'sm'}
                                rightSection={(<div dir={'ltr'} className={'text-sm mt-0.5'}>+98</div>)}
                                classNames={{
                                    input: "text-left! placeholder-right pl-11!",
                                    label: "text-right!"
                                }}
                            />
                        </div>
                        <FormComponent component={CustomTextarea} required name="message" maxLength={200} maxRows={5} label='متن پیام' placeholder={'متن خود را بنویسید'} />
                        <CustomButton type='submit'>
                            ارسال
                        </CustomButton>
                    </ContractForm>
                </div>
            </div>
            <Script
                id="ld-mainpage-graph"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(ContactPageSchemaGraphSnippet()) }}
            />
        </div>
    );
}
export const metadata: Metadata = {
    title: "تماس باما",
    alternates: {
        canonical: "https://donofa.com/contact/",
    },
}

export default Page;