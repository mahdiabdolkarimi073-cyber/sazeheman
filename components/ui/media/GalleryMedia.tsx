import { LoadingOverlay, Tabs, TabsList, TabsPanel, TabsTab } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { IconUpload } from "../SVGs";
import { useEffect, useState } from "react";
import { api } from "@/lib/api/base";
import { MediaItem } from "@/lib/api/base.type";
import UploadedFiles from "./UploadedFiles";
import NoFiles from "./NoFiles";
import CustomButton from "../base/CustomButton";


function GalleryMedia(
    {
        type = 'sounds',
        onSelect = (() => {
        }) as (o: MediaItem) => void,
        selected = undefined as MediaItem['id'] | undefined
    }
) {
    const mediaTypes = type === "sounds" ? {
        "mp3": "audio/mpeg",
        "wav": "audio/wav",
        "ogg": "audio/ogg",
        "m4a": "audio/mp4",
        "flac": "audio/flac",
        "aac": "audio/aac",
        "wma": "audio/x-ms-wma"
    } : {
        "mp4": "video/mp4",
        "webm": "video/webm",
        "ogg": "video/ogg",
        "mov": "video/quicktime",
        "avi": "video/x-msvideo",
        "mkv": "video/x-matroska",
        "flv": "video/x-flv",
        "wmv": "video/x-ms-wmv",
        "gif": "image/gif",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "webp": "image/webp"
    };
    const [file, setFile] = useState<File>();
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState("0");

    useEffect(() => {
        if (!file) return;

        setLoading(true);
        const form = new FormData();
        form.append('file', file);
        api(`/profile/files/${type}`, form, "POST")
            .then(() => {
                setTab("2")
            })
            .finally(() => {
                setLoading(false);
            })
    }, [file])

    const tabs = [
        {
            tab: "آپلود",
            content: (
                <div>
                    <Dropzone
                        accept={Object.values(mediaTypes)}
                        maxSize={50 * 1024 * 1024}
                        className="rounded-xl border-2 border-dashed border-b1 bg-container p-8 flex flex-col items-center"
                        onDrop={function (files: FileWithPath[]): void {
                            setFile(files[0]);
                        }}
                    >
                        <div className="flex flex-col items-center relative">
                            <LoadingOverlay visible={loading} />
                            <IconUpload stroke='currentColor' className="w-10 h-10 text-black/80 mb-2" />
                            <p className="opacity-70 mb-2 text-xs text-center">فایلی را انتخاب کنید یا آن را در اینجا
                                بکشید و رها کنید.</p>
                            <p className="text-xs text-black/80 mb-4">فرمت
                                های {Object.keys(mediaTypes).slice(0, 3).join(" ,") + "..."} تا ۵۰ مگابایت.</p>
                            <CustomButton
                                type='submit'
                                className={'bg-container! text-black/80! text-sm! border border-b1'}>
                                انتخاب فایل
                            </CustomButton>
                        </div>
                    </Dropzone>
                </div>
            )
        },
        {
            tab: "فایل های دیفالت",
            content: <UploadedFiles onChange={onSelect} key={tab} type={'default'} accept={type} selected={selected} />
        },
        {
            tab: "فایل های اپلود شده",
            content: <UploadedFiles onChange={onSelect} key={tab} type={type} selected={selected} />
        },
        {
            tab: "فایل های برنامه",
            content: <UploadedFiles type="local" key={tab} onChange={onSelect} selected={selected} />
        }
    ]

    return (
        <Tabs value={tab} onChange={e => setTab(e + "")}>
            <TabsList>
                {tabs.map((o, i) => (
                    <TabsTab classNames={{
                        tab: "hover:bg-transparent!"
                    }} value={i + ""}>
                        {o.tab}
                    </TabsTab>
                ))}
            </TabsList>
            {tabs.map((o, i) => (
                <TabsPanel value={i + ""}>
                    <div className="p-4 relative">
                        <LoadingOverlay visible={loading} />
                        {o.content}
                    </div>
                </TabsPanel>
            ))}
        </Tabs>
    )
}


export default GalleryMedia;