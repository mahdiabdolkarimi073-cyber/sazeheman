import {CacheProvider} from "@/context/CacheContext";
import {CacheData, getCache, setCache} from "../cache/ssr-cache";
import {ReactNode} from "react";

function CacheUpdate({cache, children}: {
    cache?: CacheData,
    children: ReactNode
}) {
    const final = cache||getCache();
    setCache(final);
    return (
        <CacheProvider data={final} children={children} />
    )
}

export default CacheUpdate;