import useApi from "@/lib/hooks/useApi";
import { ScrollArea, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import GalleryMedia from "./GalleryMedia";
import ReadOnlyInput from "@/components/helper/ReadOnlyInput";
import { useMemo, useState } from "react";
import { MediaItem } from "@/lib/api/base.type";

function MediaPicker({ type = "" as "sound" | "media", defaultValue = null as string | null | { name: string }, ...others }) {
    const apikey = type === "sound" ? "sounds" : "media"
    const { data = {} as any, loading } = useApi(`/profile/files/${apikey}`);
    const items = (data?.[apikey] || []) as MediaItem[];
    const [selected, setSelected] = useState<MediaItem['id']>((defaultValue as any)?.id ?? defaultValue ?? others.value);
    const [url, setUrl] = useState((defaultValue as any)?.url || '' as string | undefined);
    const name = useMemo(() => {
        return items.find(o => (o.id + "") === selected)?.name || selected;
    }, [items, selected]);

    return (
        <div>
            <TextInput
                {...others}
                readOnly
                value={name}
                disabled={loading}
                name={undefined}
                onClick={() => {
                    const mid = modals.open({
                        title: ` گالری مدیا‌ها`,
                        size: "1000px",
                        children: (
                            <GalleryMedia
                                type={apikey}
                                selected={selected}
                                onSelect={media => {
                                    modals.close(mid);
                                    setSelected(media.id + "");
                                    setUrl(media?.url);
                                }}
                            />
                        )
                    })
                }}
            />
            <ReadOnlyInput name={others.name} value={selected?.toString?.()} />
            <ReadOnlyInput name={others.name + "_preview"} value={url || selected} />
        </div>
    )
}

export default MediaPicker;