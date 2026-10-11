import {useContext, useState} from "react";
import GlobalContext from "@/context/GlobalContext";
import {useViewportSize} from "@mantine/hooks";
import {useDelayedEffect} from "@/lib/hooks/useEffect";

export type OSType = "mobile" | "desktop";

function useDevice() {
    const context = useContext(GlobalContext);
    const [device, setDevice] = useState<OSType>(context.os as OSType || "mobile");
    const { width } = useViewportSize();

    useDelayedEffect(() => {
        if (!width) return; // INIT VALUE ALWAYS IS ZERO
        if (width < 768) setDevice("mobile");
        else setDevice("desktop");
    }, [width], 100);

    return device;
}

export default useDevice;