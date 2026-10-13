'use server';

import {getRequestUser} from "@/lib/api/auth";

export async function getUser() {
    return await getRequestUser();
}
