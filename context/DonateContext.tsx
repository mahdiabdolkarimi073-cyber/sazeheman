'use client'

import type {StreamerType} from "@/lib/api/base.type";
import React, {createContext} from "react";


const DonateContext = createContext<StreamerType>({
    "id": 0,
    "nickname": "",
    "slug": "",
    "avatar": "",
    "banner": "",
    "bio": "",
    "social": {},
    "plan": "free",
    "options": {} as any,
    username: "",
    pages: {} as any,
    donates: [],
    rates: {
        data: {},
        min: {},
        max: {}
    },
    is_active: 1,
    is_subdomain: false
});

export const DonateContextProvider = (props: {
    context: StreamerType,
    children: React.ReactNode
}) => {
    return (
        <DonateContext.Provider value={props.context}>
            {props.children}
        </DonateContext.Provider>
    )
}

export default DonateContext;