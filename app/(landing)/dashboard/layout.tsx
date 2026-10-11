import StreamerDashboardSidebar from "@/app/(landing)/dashboard/_components/StreamerDashboardSidebar";
import StreamerDashboardHeader from "@/app/(landing)/dashboard/_components/StreamerDashboardHeader";
import { IconPattern2 } from "@/components/ui/SVGs";
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
        <div className={'flex gap-5 min-h-screen relative w-full'}>
            <PageDeviceRefresher />
            {!user?.phone && <DashboardPhoneSetter />}
            <div className={'lg:p-5 flex gap-5 w-full relative items-stretch '}>
                {!isMobile && <StreamerDashboardSidebar />}
                <div className={'grow flex flex-col gap-0 lg:gap-5 h-full relative '}>
                    <div className='relative'>
                        <div className='absolute -top-10 left-0 right-0 mx-auto w-full h-full -z-10 opacity-50'>
                            <IconPattern2 fill="#333" width={undefined} height={undefined} style={{
                                width: '100%',
                                height: '500%'
                            }} />
                        </div>
                        <StreamerDashboardHeader />
                    </div>
                    {props.children}
                </div>
            </div>
        </div>
    );
}


export const metadata: Metadata = {
    title: {
        template: "Sazeheman - داشبورد - %s",
        absolute: "Sazeheman - داشبورد "
    }
}

export default Layout;