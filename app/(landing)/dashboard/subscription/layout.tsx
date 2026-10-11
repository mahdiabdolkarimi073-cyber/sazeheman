import React from 'react';
import CacheUpdate from "@/lib/utils/cache-ssr";
import {getAllPlans} from "@/app/(landing)/dashboard/subscription/PlanEnums";
import {Metadata} from "next";

async function Layout(props: any) {
    const plans = await getAllPlans();

    return (
        <CacheUpdate cache={{plans}}>
            {props.children}
        </CacheUpdate>
    );
}

export const metadata: Metadata = {
    title: "اشتراک"
}

export default Layout;