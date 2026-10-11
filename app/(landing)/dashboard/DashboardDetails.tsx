import DonateTargetHeart from "@/app/(landing)/[username]/(donation)/payment/_readonly/DonateTargetHeart";
import GlassBox from "./_components/GlassBox";
import {IconBgDashboardPlan, IconHallowStar, IconPattern2, IconReceiptBill, IconTarget,} from "@/components/ui/SVGs";
import Link from "next/link";
import {IconlyArrowRight2} from "@/components/assets/iconpack";
import {getSession} from "@/lib/cache/session";
import {PlanNameEnum} from "@/app/(landing)/dashboard/subscription/PlanEnums";
import {getUserPlanDays} from "@/lib/utils/global";


async function DashboardDetail() {
    const {user} = await getSession();
    if (!user) return null;
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
                <GlassBox color="#8881" borderFrom={'#0002'} borderTo={'#00000005'} bg={'#fff3'}>
                    <div className="relative">
                        <div className="absolute z-1 -left-40 top-0 opacity-40 w-[80%] h-full">
                            <IconPattern2
                                width={undefined}
                                height={undefined}
                            />
                        </div>
                        <div className="p-5 pb-0 relative z-2">
                            <div className="flex  items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <IconTarget />
                                    <p className="font-semibold">هدف</p>
                                </div>
                                <Link
                                    href="/dashboard/tools/group"
                                    className="text-primary flex items-center gap-1"
                                >
                                    <span className="text-sm">تغییر هدف</span>
                                    <div className="rotate-180 mb-0.5">
                                        <IconlyArrowRight2 size={18} />
                                    </div>
                                </Link>
                            </div>
                            <div className="flex lg:flex-row flex-col-reverse items-center gap-3 justify-between">
                                <div className={"relative -top-5 lg:top-0"}>
                                    <h4 className="text-xl font-bold">
                                        {user?.goal?.title}
                                    </h4>
                                    <p className="opacity-70">

                                        {user?.goal?.filled?.toLocaleString('fa')}{" "}
                                        از
                                        {" "}
                                        {user?.goal?.amount?.toLocaleString('fa')}
                                        {" "}
                                        تومان
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="z-99 relative">
                                        <DonateTargetHeart
                                            percent={Math.floor(+(user?.goal?.filled||0) / +(user?.goal?.amount||1) * 100)}
                                            size={180}
                                        />
                                    </div>
                                    <div
                                        className="absolute flex items-center justify-center -z-2"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            left: "0",
                                            top: "0",
                                            scale: "1.1",
                                        }}
                                    >
                                        <div
                                            style={{
                                                backgroundImage:
                                                    "url('/pics/design/heart.png')",
                                                backgroundSize: "contain",
                                            }}
                                            className="w-full h-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassBox>
            </div>
            <div>
                <GlassBox color="#8881" borderFrom={'#0002'} borderTo={'#00000005'} bg={'#fff3'} innerBg={'transparent'} fadeOpacity={'0'} className="h-full overflow-hidden">
                    <div className="p-5 pb-0 relative flex flex-col z-2  h-full min-h-[220px]">
                        <div className="absolute top-5 h-full z-1 justify-center left-0 items-center flex">
                            <IconBgDashboardPlan
                                width={undefined}
                                height={undefined}
                                style={{height: "100%", width: "100%"}}
                            />
                        </div>
                        <div className="flex items-center  justify-between relative z-2">
                            <div className="flex items-center gap-2">
                                <IconReceiptBill/>
                                <p className="font-semibold">اشتراک</p>
                            </div>
                            <Link
                                href="/dashboard/subscription"
                                className="text-primary flex items-center gap-1"
                            >
                                <span className="text-sm">تمدید اشتراک</span>
                                <div className="rotate-180 mb-0.5">
                                    <IconlyArrowRight2 size={18}/>
                                </div>
                            </Link>
                        </div>
                        <div className="flex items-center gap-3 justify-start grow h-full relative z-2">
                            <div
                                style={{
                                    width: "50px",
                                }}
                            >
                                <IconHallowStar
                                    width={undefined}
                                    height={undefined}
                                    fill={"var(--primary)"}
                                />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold">
                                    {user.plan ? PlanNameEnum[user.plan] : "بی پلن"} سازه من
                                </h4>
                                <p className="opacity-70">{getUserPlanDays(user)} روز اشتراک</p>
                            </div>
                        </div>
                    </div>
                </GlassBox>
            </div>
        </div>
    );
}


export default DashboardDetail;
