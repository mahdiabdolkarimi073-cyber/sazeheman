import { LocalMedia, MediaItem } from "@/lib/api/base.type";
import useApi from "@/lib/hooks/useApi";
import { IconCheck2, IconFile, IconPlay, IconSong, IconTrash } from "../SVGs";
import Image from "next/image";
import { ActionIcon, LoadingOverlay } from "@mantine/core";
import { useMemo, useState } from "react";
import NoFiles from "./NoFiles";
import { useInterval } from "@mantine/hooks";
import { playSong } from "@/components/helper/AudioPlayer";
import { askConfirm } from "@/components/ui/modals/confirm";
import { api } from "@/lib/api/base";
import { DebugMode } from "@/lib/VARS";

const localApp = DebugMode ? "http://localhost:3000/local/files" : "http://127.0.0.1:45565";

function UploadedFiles({
    type = "sounds",
    accept = type as string,
    onChange = (() => { }) as (o: MediaItem) => void,
    defaults = [] as MediaItem[],
    selected = undefined as MediaItem['id'] | undefined
}) {
    const { data, loading, error, refetch } = useApi<any>(type === "default" ? `/profile/files/${accept}/default` : type === "local" ? localApp : "/profile/files/" + type);
    const items = (data?.media || data?.sounds || data?.files || defaults) as MediaItem[];

    const defaultMedia = useMemo(() => {
        if (type !== 'default') return [];

        return (data?.media as {url: string, name: string}[])?.map((o) => ({
            created_at: "",
            file_name: o.name+"."+(o.url.split(".").at(-1)),
            id: "default:" + o.name,
            url: o.url,
            name: o.name,
            mime_type: accept === "sounds" ? "audio/"+(o.url.split(".").at(-1)):"video/"+o.url.split(".").at(-1),
            size: 0
        } as MediaItem)) || []
    }, [items, accept, type])
    const locals = useMemo(() => {
        if (type !== 'local') return [];

        return (items as unknown as LocalMedia[]).map(o => {
            return {
                created_at: "",
                file_name: o.name,
                id: "local:" + o.name,
                url: localApp + o.path,
                name: o.name,
                mime_type: o.mime,
                size: 0
            } as MediaItem;
        })
    }, [items]);

    const list = useMemo(() => type === 'local' ? locals : type === 'default' ? defaultMedia:items, [type, items, locals]);
    const [playing, setPlaying] = useState<typeof list[number]>();

    useInterval(() => {
        refetch(false);
    }, 15 * 1000, {
        autoInvoke: true
    });

    return (
        <div className="min-h-10">
            <LoadingOverlay visible={loading} />
            {!list.length && (
                <NoFiles
                    local={type === 'local' && !!error}
                    text={!!error ? 'خطا در دریافت اطلاعات' : undefined}
                />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {list.map(o => {
                    const isSel = selected+"" === o.id+"";
                    const fileType = o.mime_type.includes("video") ? "video" : (o.mime_type.includes("audio") || o.mime_type.includes("mp3")) ? "audio" : (o.mime_type.includes("image") || o.mime_type.includes("jpg")) ? "image" : "unknown"
                    return (
                        <div
                            onClick={() => onChange(o)}
                            className={`w-55 h-55 relative rounded-xl ${isSel ? "b-dash" : "bg-b1"} flex flex-col gap-3 overflow-hidden hover:opacity-70 cursor-pointer`}
                        >
                            {isSel && (
                                <>
                                    <div className={'absolute b-dash left-0 top-0 w-full h-full'} />
                                    <div className={'absolute left-0 top-0 w-full h-full flex items-center justify-center z-10 bg-primary/10'}>
                                        <IconCheck2 fill={'var(--primary)'} width={undefined} height={undefined} className={'drop-shadow-2xl'} style={{
                                            width: "40%"
                                        }} />
                                    </div>
                                </>
                            )}
                            {type === "sounds" ? (
                                <div className="grow p-2 flex items-center justify-center">
                                    <IconSong color='currentColor' />
                                </div>
                            ) : (
                                <div className="grow">
                                    {fileType === "video" ? (
                                        <video autoPlay loop muted style={{
                                            height: "100%",
                                            width: "100%",
                                            objectFit: "cover"
                                        }}>
                                            <source src={o.url} type={o.mime_type}></source>
                                        </video>
                                    ) : fileType === 'image' ? (
                                        <Image
                                            src={o.url}
                                            width={300}

                                            style={{
                                                height: "100%",
                                                width: "100%",
                                                objectFit: "cover"
                                            }}
                                            height={300}
                                            alt={o.file_name}
                                        />
                                    ) : (
                                        <div className={'h-full flex items-center justify-center p-2 flex-col gap-3'}>
                                            <IconFile format={o.file_name.split(".").at(-1)} width={undefined} height={undefined} style={{
                                                width: "60px"
                                            }} />
                                            <p className={'font-light text-center truncate max-w-full'}>
                                                {o.file_name}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div dir={'ltr'} className={`absolute bottom-0 flex items-center justify-between flex-nowrap left-0 w-full p-2 ${!isSel && "bg-container/70"}`}>
                                <p className="truncate whitespace-nowrap" style={{
                                    minWidth: "80%",
                                    width: 0
                                }}>{o.file_name.split(".").slice(0, -1).join(".")}</p>
                                <p className="font-medium">{o.file_name.split(".").at(-1)}</p>
                            </div>
                            <div className={'absolute top-0 left-0 w-full h-full p-5 opacity-0 hover:opacity-100 z-10'}>
                                <div className={'flex items-center justify-between'}>
                                    {(type !== 'local' && type !== 'default') && (
                                        <ActionIcon
                                            classNames={{
                                                root: "bg-container!"
                                            }}
                                            variant={'light'}
                                            radius={'md'}
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await askConfirm("آیا میخواهید این فایل را حذف کنید؟");

                                                await api(`/profile/files/${type}/` + o.id, undefined, "DELETE")
                                                    .then(() => {
                                                        refetch();
                                                    })
                                            }}
                                        >
                                            <IconTrash width={undefined} height={undefined} style={{ width: "90%", marginRight: "2px" }} />
                                        </ActionIcon>
                                    )}
                                    {fileType === "audio" && (
                                        <ActionIcon
                                            classNames={{
                                                root: "bg-container!"
                                            }}
                                            color={'#0002'}
                                            variant={'light'}
                                            radius={'md'}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (playing?.id === o.id) {
                                                    playSong(null);
                                                    setPlaying(undefined);
                                                } else {
                                                    playSong(o.url);
                                                    setPlaying(o);
                                                }
                                            }}
                                        >
                                            <IconPlay color={playing?.id === o?.id ? "var(--primary)" : "var(--text-color)"} />
                                        </ActionIcon>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default UploadedFiles;