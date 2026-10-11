'use client';

import useUser, {refetchUser} from "@/lib/hooks/useUser";
import React, {useEffect, useRef} from "react";
import {modals} from "@mantine/modals";
import FormModal, {FormModalBase} from "@/components/ui/modals/FormModal";
import PhoneInput from "@/components/ui/base/PhoneInput";
import AuthCodeValidator from "@/app/(landing)/auth/code/page";
import {useRouter} from "next/navigation";

async function doIt() {
    const {phone} = await FormModal("شماره تلفن", (
        <FormModalBase  description={'شماره تلفن شما جهت ادامه فعالیت نیاز میباشد'}>
            <PhoneInput
                required
            />
        </FormModalBase>
    ),undefined,undefined, {
        closeOnClickOutside: false,
        withCloseButton: false
    })

    return new Promise(r => {
        FormModal("کد تایید", (
            <FormModalBase noBtn>
                <AuthCodeValidator
                    sendRoute="/profile/verification/phone"
                    verifyRoute={'/profile/verification/phone/verify'}
                    edit={() => {
                        modals.closeAll();
                        doIt();
                    }}
                    onVerify={async ()=>{
                        await refetchUser();
                        modals.closeAll();
                        r(true);
                    }}
                    tiny
                    phone={phone}
                />
            </FormModalBase>
        ),undefined,undefined, {
            closeOnClickOutside: false,
            withCloseButton: false
        });
    })
}

function DashboardPhoneSetter(props: any) {
    const user = useUser();
    const router = useRouter();
    const modal = useRef<boolean>(false);

    useEffect(() => {
        if (!user || !!user.phone || modal.current) return;
        modal.current = true;

        doIt()
            .then(()=>{
                router.refresh();
            })
            .catch(()=>undefined)
    }, [user]);

    return null;
}

export default DashboardPhoneSetter;