import StreamerDashboardSidebar from "@/app/(landing)/dashboard/_components/StreamerDashboardSidebar";
import StreamerDashboardHeader from "@/app/(landing)/dashboard/_components/StreamerDashboardHeader";
import PageDeviceRefresher from "@/components/helper/DeviceDetector";
import { getSession } from "@/lib/cache/session";
import { redirect } from "next/navigation";
import DashboardPhoneSetter from "@/app/(landing)/dashboard/_components/DashboardPhoneSetter";
import { Metadata } from "next";
import { DebugMode } from "@/lib/VARS";

async function Layout(props: any) {
    const { isMobile, user } = await getSession();

    if (!user && !DebugMode) redirect("/auth");

    return (
        <div className="flex min-h-screen relative w-full bg-[#F7F8F6]" dir="rtl">
            <PageDeviceRefresher />
            {!user?.phone && <DashboardPhoneSetter />}
            <div className="flex gap-0 lg:gap-5 w-full relative items-stretch lg:p-5">
                {!isMobile && <StreamerDashboardSidebar />}
                <div className="grow flex flex-col gap-4 lg:gap-5 h-full relative min-w-0">
                    <StreamerDashboardHeader />
                    <div className="px-4 lg:px-0 pb-5 lg:pb-0 grow">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
}


export const metadata: Metadata = {
    title: {
        template: "سازه‌همان — داشبورد — %s",
        absolute: "سازه‌همان — داشبورد"
    }
}

export default Layout;
