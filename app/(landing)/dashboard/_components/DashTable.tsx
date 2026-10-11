'use client';

import useDevice from "@/lib/hooks/useDevice";
import {Table} from "@mantine/core";
import React, {ComponentProps, ReactNode, useMemo} from "react";
import GlassBox from "./GlassBox";
import EmptyList from "@/components/helper/EmptyList";

type T = ComponentProps<typeof Table>

function DashTable(props: {
    data: T['data'],
    responsive?: boolean | {
        orders?: number[],
        data?: Partial<T['data']>,
        cards?: boolean
    }
}) {
    const { responsive: initResponsive = false, data: initData } = props;
    const device = useDevice();
    const responsive = useMemo(() => {
        if (device === 'desktop') return undefined;

        return initResponsive ? {
            data: props.data,
            cards: true,
            orders: undefined as number[] | undefined
        } : typeof initResponsive === 'object' ? initResponsive : undefined
    }, [device, initResponsive, props.data]);


    if (responsive?.cards) {

        return (
            <div className="flex flex-col gap-3 justify-stretch w-full">
                {(responsive?.data || props.data)?.body?.map((item, i) => {
                    const finalData = responsive.orders ? responsive.orders.map(o => item?.[o]) : item;
                    const datas = finalData?.slice(0, 5);
                    return <DashCard key={i} data={datas} />
                })}
            </div>
        )
    }

    return (
        <div style={{ width: 0, minWidth: '100%', overflowX: 'auto', height: "100%" }} className="pl-1 lg:pl-1.5">
            <Table
                data={device === "desktop" ? initData : {
                    ...initData,
                    head: responsive?.data?.head || initData?.head,
                    body: responsive?.data?.body || initData?.body,
                }}
                classNames={{
                    thead: "[&_th]:opacity-70 [&_tr]:border-b-0!",
                    th: "text-sm font-semibold",
                    td: "py-3!",
                }}
                style={{ width: 'max-content', minWidth: '100%' }}
            />
            {(!initData?.body?.length && !responsive?.data?.body?.length) && (
                <EmptyList />
            )}
        </div>
    )
}

export function DashCard(props: {
    data?: ReactNode[]
}) {
    const { data = [] } = props;

    const Inline = ({ start = 0 }) => (
        <div className="flex justify-between items-center gap-1 flex-wrap">
            <div className="font-medium grow h-5 relative">
                <div className="absolute left-0 w-full bottom-0 my-auto top-0 h-full truncate">
                    {data[start]}
                </div>
            </div>
            {data[start + 1]}
        </div>
    )

    return (
        <GlassBox color="#0003">
            <div className="p-3 w-full gap-3 flex flex-col">
                <Inline start={0} />
                <Inline start={2} />
                {data[4]}
            </div>
        </GlassBox>
    )
}

export default DashTable;