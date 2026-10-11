import {useEffect, useMemo} from "react";
import ReadOnlyInput from "@/components/helper/ReadOnlyInput";
import {hexHash} from "next/dist/shared/lib/hash";

declare global {
    interface Window {
        formJson: Record<string, any>
    }
}

function FormJson({name = '', value = {} as Record<string, any>}) {
    const len = useMemo(()=>hexHash(JSON.stringify(value)), [value])
    useEffect(()=>{
        window.formJson ||= {};
        window.formJson[name] = value;
    }, [value,name])

    return (
        <ReadOnlyInput
            name={`${name}!json`}
            value={`(form/json/${len})`}
        />
    )
}


export default FormJson;