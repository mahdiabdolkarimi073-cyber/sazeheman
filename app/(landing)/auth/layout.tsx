import React from "react";
import AuthShapeBg, { AuthShapeLineBg } from "@/app/(landing)/auth/AuthShapeBg";
import Logo from "@/components/assets/Logo";
import { getSession } from "@/lib/cache/session";
import { Metadata } from "next";

async function Layout(props: any) {
    const { user } = await getSession();
    // if (user) redirect("/dashboard");

    return (
        <div>
            <div className={'flex'}>
                <div className={'grow'}>

                    <div className={'flex justify-center items-center min-h-screen p-5 flex-col gap-3'}>
                        <div className={'flex xl:hidden justify-center items-center h-28'}>
                            <Logo width={120} />
                        </div>
                        {props.children}
                    </div>
                </div>
                <div
                    className="w-full max-w-[30vw] 2xl:max-w-[35vw] hidden lg:flex relative min-h-screen items-end justify-end flex-col overflow-hidden">
                    <div className={'absolute top-0 right-0 p-7 z-90'}>
                        <Logo id={'LayoutLogo'} />
                    </div>
                    <div className={'absolute left-0 top-0 h-full w-full flex justify-center items-center'}>
                        <AuthShapeBg width={undefined} height={undefined} style={{
                            width: "100%",
                            height: "100vh",
                            zIndex: 1
                        }} />

                        <div
                            className={'absolute left-0 top-0 bottom-36 my-auto h-full w-full flex justify-center items-center'}
                            style={{
                                zIndex: 0
                            }}>
                            <AuthShapeLineBg width={undefined} height={undefined} style={{
                                width: "100%",
                                height: "50vh"
                            }} />
                        </div>
                    </div>
                    <div className={'relative w-full p-7 flex justify-center flex-col items-start'} style={{
                        minHeight: "30vh",
                        zIndex: 4
                    }}>
                        <div className={'absolute top-0 flex left-0 right-0 mx-auto justify-center'} style={{
                            width: "100%",
                            height: "100%",
                            zIndex: -1
                        }}>
                            <div style={{
                                background: "linear-gradient(45deg,  var(--secondary,#BBF451) -30%,var(--primary) 100%)",
                                filter: "blur(6vw)"
                            }} className={'w-full h-full '} />
                        </div>
                        <h2 className={'text-3xl text-gradient font-extrabold p-1'}>مورد علاقه بهترینا</h2>
                        <p className={'text-sm mt-2 text-justify'}>
                            سازه من یک پلتفرم جامع برای ارتباط مستقیم سازندگان با پیمانکاران، مهندسین و فروشندگان مصالح ساختمانی است.
                            با سازه من می‌توانید پروژه ساختمانی خود را ثبت کرده و بر روی نقشه نمایش دهید،
                            خدمات مورد نیازتان را مشخص کنید و در کوتاه‌ترین زمان با متخصصان مرتبط ارتباط بگیرید.
                            سرعت، شفافیت و کاهش هزینه‌های ساخت، سازه من را به انتخابی هوشمندانه در صنعت ساختمان تبدیل کرده است.
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}

export const metadata: Metadata = {
    title: "ورود"
}

export default Layout;