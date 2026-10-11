'use server';


import {cookies} from "next/headers";


export async function getUser() {
    const c = await cookies();
    const token = c.get('token')?.value;
    return token ? global._USERS?.[token] || undefined:undefined;
}