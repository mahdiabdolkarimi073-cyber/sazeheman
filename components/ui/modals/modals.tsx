'use client';

import {modals} from "@mantine/modals";
import {ScrollArea} from "@mantine/core";

export let OPENED_MODAL: string | null = null;

export const showModal: typeof modals = (Object.fromEntries(Object.entries(modals).map(([key, func]) => ([key, (arg: Parameters<typeof modals.open>[0])=>{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    const id = arg.modalId || arg.modal || generateRandomString();
    arg.modalId = id;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    arg.modal = id;
    arg.scrollAreaComponent = ScrollArea.Autosize;
    arg.radius = 'lg'
    OPENED_MODAL = id;
    const params = new URLSearchParams(window.location.search);
    if (!params.has("modalRollback")){
        params.set("modalRollback", id);
        window.history.pushState({},id, "?"+params.toString())
    }

    return func(arg as any);
}])))) as unknown as typeof modals

export function closeLastModal() {
    const e = Array.from(window.document.querySelectorAll<HTMLButtonElement>(".mantine-Modal-close"))?.at?.(-1);
    if (e) e.click();
}

if (typeof window !== 'undefined') {
    window.showModal = showModal;
}

export function showModalInit(){} // JUST FOR IMPORT FILE IN STARTUP
