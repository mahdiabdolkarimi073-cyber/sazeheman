'use client';

import useDevice from "@/lib/hooks/useDevice";
import {useDebouncedState} from "@mantine/hooks";
import {useTrueEffect} from "@/lib/hooks/useEffect";
import {useRouter} from "next/navigation";

function DeviceDetector() {
    const device = useDevice();
    const [og, setOg] = useDebouncedState(device, 100);
    const router = useRouter();

    useTrueEffect(()=>{
        setOg(device);
    }, [device]);

    useTrueEffect(()=>{
        router.refresh();
    }, [og], 1)

    return null;
}

export default DeviceDetector;