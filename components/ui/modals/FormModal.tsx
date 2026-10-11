import {modals} from "@mantine/modals";
import {ReactNode} from "react";
import CustomButton from "../base/CustomButton";
import {Divider, ModalProps} from "@mantine/core";
import {twMerge} from "tailwind-merge";
import {optimizeForm} from "@/lib/utils/global";

async function FormModal<T = false>(title: string, children: ReactNode, returnForm?: T, size?: ModalProps['size'], props?: Parameters<typeof modals.open>[0]): Promise<T extends true ? FormData : Record<string, string>> {
    return new Promise((res, rej) => {
        const id = modals.open({
            title,
            children: (
                <form onSubmit={e => {
                    e.preventDefault();
                    const form = optimizeForm(e);
                    if (returnForm) {
                        res(form as any);
                    } else {
                        const obj = form.toJson();
                        res(obj as any);
                    }
                    modals.close(id);
                }}>
                    {children}
                </form>
            ),
            onClose: () => rej("modal closed"),
            closeOnEscape: true,
            closeOnClickOutside: true,
            centered: true,
            trapFocus: true,
            autoFocus: true,
            withinPortal: true,
            size,
            ...(props || {})
        })
    })
}

export const FormModalBase = (props: {
    description?: string,
    children: ReactNode,
    className?: string,
    btnName?: string,
    noBtn?: boolean
}) => (
    <div className={twMerge("flex flex-col gap-5", props?.className)}>
        {props.description && (
            <p className="text-sm opacity-70 text-justify">{props.description}</p>
        )}
        <div>
            {props.children}
        </div>
        {!props.noBtn && (
            <>
                <Divider />
                <CustomButton type='submit'>
                    {props.btnName || "تایید"}
                </CustomButton>
            </>
        )}
    </div>
)

export default FormModal;