'use server';

import {api} from "./base";

export async function serverApi(...args: Parameters<typeof api>) {
    return api(...args)
}