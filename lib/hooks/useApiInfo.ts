'use client';

import {useEffect, useRef, useState} from "react";


let _EVENTs: Record<string, Record<string, Function>> = {};

type ApiInfo = Partial<{
    errors: string[],
    code: number
}>

function useApiInfo(key: string) {
    const id = useRef(key+"_"+Math.random().toString(16));
    const [state, setState] = useState<ApiInfo>({})

    useEffect(()=>{
        _EVENTs[key] ||= {};
        _EVENTs[key][id.current] = setState;
        return ()=>{
            delete _EVENTs[key][id.current];
        }
    }, [key]);

    return [state, ()=>{
        setState({});
    }] as const;
}

export function setApiInfo(msg: {message: string,code: number, errors: Record<string, string[]>}) {
    for (let [key, errors] of Object.entries(msg.errors || {})) {
        const events = Object.values(_EVENTs[key] || {}) || [];
        for (let event of events) {
            event({
                errors,
                code: msg.code
            });
        }
    }
}

export default useApiInfo;