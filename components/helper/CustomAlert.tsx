import { twMerge } from "tailwind-merge";
import { IconInfo } from "../ui/SVGs";
import { ComponentProps } from "react";

export default function CustomAlert({children, ...props}: ComponentProps<'div'> & {title?: string, color?: string}) {
    const color = props.color || "var(--primary)"
    const c = (op: number)=>`rgb(from ${color} r g b / ${op})`
    return (
        <div {...props} className={twMerge("rounded-lg p-4 border", props.className)} style={{
            background: c(0.05),
            borderColor: c(0.2)
        }}>
            <div className="flex items-start gap-3">
                <div className="mt-0.5" style={{color: color}}>
                    <IconInfo fill='currentColor' width={25} height="100%" />
                </div>
                <div>
                    <h4 className="font-semibold text-sm mb-1" style={{
                        color
                    }}>
                        {props.title ?? " نکته مهم"}
                    </h4>
                    <p className="text-xs leading-relaxed font-medium" style={{
                        color: c(0.8)
                    }}>
                        {children}
                    </p>
                </div>
            </div>
        </div>
    )
}