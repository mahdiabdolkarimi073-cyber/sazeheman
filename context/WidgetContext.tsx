'use client'

import {WidgetTypes} from "@/app/(landing)/dashboard/tools/[id]/types";
import type {Widget} from "@/lib/api/base.type";
import React, {createContext} from "react";


type T = {
    types: WidgetTypes,
    widget: Widget | null
};
const WidgetContext = createContext<T>({types: {}, widget: null});

export const WidgetContextProvider = (props: {
    context: T,
    children: React.ReactNode
}) => {
    return (
        <WidgetContext.Provider value={props.context}>
            {props.children}
        </WidgetContext.Provider>
    )
}

export default WidgetContext;