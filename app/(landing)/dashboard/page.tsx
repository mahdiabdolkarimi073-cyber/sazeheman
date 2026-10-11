import GlassBox from './_components/GlassBox';
import ChartSvg from './_components/ChartSvg';
import {IconCharity} from '@/components/ui/SVGs';
import Link from 'next/link';
import {IconlyArrowLeft2} from '@/components/assets/iconpack';
import {getSession} from '@/lib/cache/session';
import {api} from '@/lib/api/base';
import CustomBadge from '@/components/ui/base/CustomBadge';
import BusinessDashboardHome from './BusinessDashboardHome';

const ChartData = {
    project_views: {
        title: "تعداد بازدید پروژه",
        unit: "بازدید",
    },
    contact_requests: {
        title: "تعداد درخواست‌های همکاری",
        unit: "درخواست",
    },
    active_projects: {
        title: "پروژه‌های فعال ثبت‌شده",
        unit: "پروژه",
    },
    contractor_signups: {
        title: "ثبت‌نام ارائه‌دهندگان خدمات",
        unit: "نفر",
    }
} as const;


async function Page() {
    const [{user}, donates, statistics] = await Promise.all([
        getSession(),
        api("/profile/donates", {per_page: "7"}).then(e => e.data).catch(() => undefined),
        api("/profile/statistics").then(e => e.data.statistics).catch(() => undefined)
    ]);

    if (user?.account_type === 'shoghlman') {
        return <BusinessDashboardHome />;
    }

    return (
        <div className="flex flex-col gap-5 justify-stretch h-full">
            <h1 className={'text-2xl font-semibold'}>
                خوش برگشتی 👋
            </h1>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
                {Object.entries(ChartData).map(([key, design], i) => {
                    const stat = statistics?.[key as keyof typeof statistics] || {
                        changes: 0,
                        current: 0,
                        last: 0,
                        values: []
                    }
                    const c = stat.changes === 0 ? "#8888" : stat.changes < 0 ? "red" : "var(--primary)";


                    return (
                        <GlassBox key={i} color={c}>
                            <div className='flex gap-2 justify-between items-center p-5 h-full relative'>
                                <div>
                                    <p className="text-sm mb-2">{design.title}</p>
                                    <div className="flex items-center justify-start gap-1">
                                        <h3 className="text-xl font-semibold truncate">{stat.current.toLocaleString('fa')} {design.unit}</h3>
                                        {!!stat.changes && (
                                            <CustomBadge color={c}>
                                                %{stat.changes.toLocaleString('fa')}
                                            </CustomBadge>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className="absolute max-w-[170px] left-2 top-0 bottom-0 my-auto h-full w-full flex items-center justify-end">
                                    <ChartSvg data={stat.values || []} color={c}/>
                                </div>
                            </div>
                        </GlassBox>
                    )
                })}
            </div>
            <div className='items-center flex justify-between'>
                <div className='items-center flex gap-1'>
                    <IconCharity/>
                    <p className='font-medium'>ساختساز های اخیر</p>
                </div>
                <Link href='/dashboard/donations' className='text-primary flex items-center gap-1'>
                    <p>مشاهده بیشتر</p>
                    <IconlyArrowLeft2/>
                </Link>
            </div>
        </div>
    );
}

export default Page;
