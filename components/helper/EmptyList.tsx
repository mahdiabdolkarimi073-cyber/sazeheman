import {IconHeartSun} from "@/components/ui/SVGs";

function EmptyList(props: {text?: string}) {
    return (
        <div className={'w-full flex items-center justify-center min-h-50 flex-col gap-3 h-3/4'}>
            <IconHeartSun/>
            <h3 className={'font-medium text-xl'}>{props.text || "موردی یافت نشد!"}</h3>
        </div>
    )
}

export default EmptyList;