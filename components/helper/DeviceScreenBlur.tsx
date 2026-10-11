'use client';

import useDevice, {OSType} from "@/lib/hooks/useDevice";
import CustomButton from "@/components/ui/base/CustomButton";
import {useRouter} from "next/navigation";

function DeviceScreenBlur(props: {
    deniedDevice: OSType[]
}) {
    const device = useDevice();
    const router = useRouter();
    if (!props.deniedDevice.includes(device)) return null;

    return (
        <div
            className={'absolute min-h-35 left-0 top-0 w-full h-full bg-container backdrop-blur-xl flex items-center justify-start py-10 flex-col gap-5'}
            style={{
                zIndex: "9999999"
            }}
        >
            <p className={'font-semibold text-black text-xl'}>
                این بخش مناسب دستگاه شما نمیباشد!
            </p>
            <CustomButton bg={'black'} onClick={()=>{
                router.back();
            }}>
                بازگشت
            </CustomButton>
        </div>
    )
}

export default DeviceScreenBlur;