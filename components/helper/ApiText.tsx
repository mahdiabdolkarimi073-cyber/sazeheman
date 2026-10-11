import useApiInfo from "@/lib/hooks/useApiInfo";
import {ComponentProps, useEffect, useRef} from "react";

function Page({children, ...props}: ComponentProps<'p'> & {
    apiKey: string
}) {
    const [info,clear] = useApiInfo(props.apiKey);
    const th = useRef<any>(null);

    useEffect(() => {
        if (!info.errors?.length) return;
        if (th.current) clearTimeout(th.current);
        th.current = setTimeout(()=>{
            clear();
        }, 5000);
    }, [info]);

    return (
        <div className={'flex flex-col gap-1'}>
            {info.errors?.map((o,i) => (
                <p className={'text-red-400 text-sm'} {...props} key={i}>{o}</p>
            ))}
        </div>
    )
}

export default Page;