'use client';

import {useContext, useId, useState} from "react";
import {useDelayedEffect} from "./useEffect";
import GlobalContext from "@/context/GlobalContext";
import {getUser} from "../api/common";

const events: Record<string, (u: UserType|undefined)=>void> = {};

export type UserType = {
    id: string;
    phone: string;
    token: string;
    nickname?: string;
    slug?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    plan?: string;
    account_type?: string;
    created_at?: string;
}

function useUser() {
    const id = useId();
    const global = useContext(GlobalContext);
    const [user, setUser] = useState<UserType | undefined>(global.user);

    useDelayedEffect(() => {
        events[id] = setUser;
        return () => {
            delete events[id];
        }
    }, [], 10)

    return user;
}

export async function refetchUser() {
    const user = await getUser();
    for (const [key, event] of Object.entries(events)) {
        try {
            event(user);
        } catch (e) {
            console.error("refetchUser", key, e)
        }
    }
}


export default useUser;
