import { Button } from "@mantine/core";
import { IconFolder } from "../SVGs";
import CustomButton from "../base/CustomButton";
import Link from "next/link";
import { convertToIRUrl } from "@/lib/api/base";

function NoFiles({
    local = false,
    text = "موردی یافت نشد"
}) {

    return (
        <div className="h-40 flex items-center flex-col justify-center gap-2">
            <IconFolder color='currentColor' />
            <p>
                {text}
            </p>
            {local && (
                <>
                    <p className="opacity-70 text-sm mb-3">
                        اگر برنامه سازه من رو نصب ندارید. آنرا نصب کنید
                    </p>
                    <Link href={convertToIRUrl("https://cdn.donofa.com/dist/donofa-filesharing-v1.zip")}>
                        <CustomButton
                            className={'bg-container! text-black/80! text-sm! border border-b1'}>
                            دانلود آخرین نسخه از برنامه
                        </CustomButton>
                    </Link>
                </>
            )}
        </div>
    )
}

export default NoFiles;