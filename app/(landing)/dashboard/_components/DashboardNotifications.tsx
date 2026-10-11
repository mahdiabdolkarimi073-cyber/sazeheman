"use client";

import {
    IconInfo,
    IconMoneyDrop,
    IconMoneyPaper,
    IconNotification,
    IconSeenMark,
    IconStore,
    IconSupportFilled,
} from "@/components/ui/SVGs";
import {api} from "@/lib/api/base";
import {BackendNotification} from "@/lib/api/base.type";
import useApi from "@/lib/hooks/useApi";
import {echoTimeDiff} from "@/lib/utils/global";
import {
    Button,
    Divider,
    Indicator,
    Loader,
    Popover,
    PopoverDropdown,
    PopoverTarget,
    Tabs,
    TabsList,
    TabsPanel,
    TabsTab,
} from "@mantine/core";
import Link from "next/link";
import {useEffect, useMemo, useState} from "react";
import {useInterval} from "@mantine/hooks";
import {playSong} from "@/components/helper/AudioPlayer";

const icons: Partial<
    Record<
        BackendNotification["type"],
        { icon: typeof IconInfo; color?: string }
    >
> = {
    donate: {
        icon: IconMoneyPaper,
    },
    shop: {
        icon: IconStore,
        color: "#7CCF00",
    },
    ticket: {
        icon: IconSupportFilled,
    },
    withdraw: {
        icon: IconMoneyDrop,
    },
};

function DashboardNotifications() {
    const {
        data: { read: _read = [], unread: _unread = [] } = {},
        loading,
        refetch,
    } = useApi("/profile/notifications");
    const [read, setRead] = useState(_read);
    const [unread, setUnread] = useState(_unread);
    const [index, setIndex] = useState(0);
    const notifs = useMemo(() => {
        return [unread, read].at(index % 2);
    }, [unread, read, index]);

    useEffect(() => {
        if (read.length !== _read.length) setRead(_read);
        if (read.length !== _read.length) setUnread(_unread);
    }, [_unread, _read]);
    useInterval(() => {
        refetch(false);
    }, 60 * 1000);

    return (
        <Popover>
            <PopoverTarget>
                <div className={"cursor-pointer"}>
                    <Indicator
                        label={
                            !unread.length ? null : (
                                <div
                                    className={
                                        "flex items-center justify-center content-center pt-1 bg-red-500 rounded-full"
                                    }
                                    style={{
                                        fontSize: "11px",
                                        width: "17px",
                                        height: "17px",
                                    }}
                                >
                                    {(unread.length || 0).toLocaleString("fa")}
                                </div>
                            )
                        }
                        color={"transparent"}
                    >
                        {loading ? (
                            <Loader size={20} color="gray" />
                        ) : (
                            <div className='bg-container p-1.5 rounded-full'>
                                <IconNotification color='rgb(from var(--text-color) r g b / 0.9)' />
                            </div>
                        )}
                    </Indicator>
                </div>
            </PopoverTarget>
            <PopoverDropdown className="p-0! overflow-hidden">
                <div className="flex items-center justify-between px-4 py-1 pb-0">
                    <h3>اعلانات</h3>
                    <Button
                        disabled={!unread.length || index == 1}
                        variant="transparent"
                        className="font-normal! p-0! bg-transparent!"
                        onClick={() => {
                            api(
                                "/profile/notifications/read/all",
                                undefined,
                                "POST"
                            ).then(() => {
                                refetch();
                            });
                        }}
                    >
                        <IconSeenMark />
                        <span className="text-xs">همه رو خوندم</span>
                    </Button>
                </div>

                <Tabs
                    value={index + ""}
                    onChange={(e) => {
                        setIndex(+(e || "0") || 0);
                    }}
                >
                    <TabsList justify="center">
                        <TabsTab
                            value="0"
                            classNames={{ tab: "grow hover:bg-transparent!" }}
                        >
                            خوانده نشده
                        </TabsTab>
                        <TabsTab
                            value="1"
                            classNames={{ tab: "grow hover:bg-transparent!" }}
                        >
                            خوانده شده
                        </TabsTab>
                    </TabsList>
                    <TabsPanel value={index + ""}>
                        <div className="w-[350px] max-h-96 overflow-auto">
                            <div className="flex flex-col">
                                {notifs?.map((o, i) => {
                                    const ic = icons[o.type] || {
                                        icon: IconInfo,
                                    };
                                    ic.color ||= "var(--primary)";
                                    return (
                                        <div key={i} className="">
                                            {i !== 0 && <Divider />}
                                            <Link
                                                href={
                                                    o.data?.link
                                                        ? "#"
                                                        : o?.data?.link || "#"
                                                }
                                                onClick={(e) => {
                                                    if (o?.data?.link) return;
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                            >
                                                <div className="px-5 py-4 flex items-center gap-2 hover:bg-container/50">
                                                    <div className="relative p-1 flex items-center justify-center">
                                                        <div
                                                            className="absolute left-0 right-0 w-full h-full opacity-10 rounded-full"
                                                            style={{
                                                                background:
                                                                    ic.color,
                                                            }}
                                                        />
                                                        <ic.icon
                                                            width={30}
                                                            height={30}
                                                            fill={ic.color}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-normal w-full text-sm">
                                                            {o.data.message}
                                                        </p>
                                                        <p className="text-xs opacity-60">
                                                            {echoTimeDiff(
                                                                o.created_at,
                                                                true
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                            {!notifs?.length && (
                                <div className="h-20 flex items-center justify-center">
                                    اعلانی یافت نشد!
                                </div>
                            )}
                        </div>
                    </TabsPanel>
                </Tabs>
            </PopoverDropdown>
        </Popover>
    );
}

export default DashboardNotifications;
