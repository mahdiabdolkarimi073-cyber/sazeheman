import {modals} from "@mantine/modals";
import React, {ReactNode} from "react";
import {IconDanger} from "@/components/ui/SVGs";
import {Divider} from "@mantine/core";
import CustomButton from "@/components/ui/base/CustomButton";

export async function askConfirm(text: ReactNode | string, config: Partial<{ labels: string[], title: string }> = {}) {
    /*typeof text === 'string' ? (
        <p className={' opacity-70'}>{text}</p>
    ) : text*/
    return await new Promise((resolve, reject) => {
        const m = modals.open({
            title: (
                <div className={'flex items-center gap-2'}>
                    <IconDanger/>
                    <p className={'text-xl font-medium'}>{config?.title || "مطمئن هستی؟"}</p>
                </div>
            ),
            children: (
                <C
                    text={text}
                    onOk={() => {
                        modals.close(m);
                        resolve(true)
                    }}
                    onCancel={() => {
                        modals.close(m);
                        reject();
                    }}
                    labels={config?.labels}
                />
            ),
            withCloseButton: true,
            onClose: reject,
            classNames: {
                body: "[button]:text-black!"
            }
        })
    })
}

function C({
               text = '' as any, onOk = (() => {
    }) as () => void, labels = [] as string[], onCancel = () => {
    }
           }) {

    return (
        <div className={'flex flex-col gap-4'}>
            <p className={'opacity-70'} dangerouslySetInnerHTML={{__html: text}}></p>
            <Divider/>
            <div className={'flex items-center gap-5'}>
                <CustomButton
                    bg={'red'}
                    className={'grow'}
                    y={10}
                    onClick={onOk}
                >
                    {labels[0] || "تایید"}
                </CustomButton>
                <CustomButton
                    bg={'#eee'}
                    color={'black'}
                    className={'grow'}
                    y={10}
                    onClick={onCancel}
                >
                    {labels[0] || "لغو"}
                </CustomButton>
            </div>
        </div>
    )
}