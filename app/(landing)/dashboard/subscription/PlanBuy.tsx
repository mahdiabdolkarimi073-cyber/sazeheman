import React, {useState} from 'react';
import {FullPlanType} from "@/app/(landing)/dashboard/subscription/PlanEnums";
import {Radio} from "@mantine/core";
import CustomBadge from "@/components/ui/base/CustomBadge";
import formModal, {FormModalBase} from "@/components/ui/modals/FormModal";
import ReadOnlyInput from "@/components/helper/ReadOnlyInput";
import {api} from "@/lib/api/base";
import { handlePaymentResponse } from '@/lib/utils/payment';

function PlanBuy({plan = {} as FullPlanType}) {
    const modifiers = plan.price_modifiers || {
        "1": 0,
        "2": 0,
        "3": 5,
        "4": 7,
        "6": 15,
        "12": 20
    };
    const [modifier, setModifier] = useState(Object.keys(modifiers)[0]);


    return (
        <div>
            <ReadOnlyInput name={"quantity"} value={modifier} />
            <div className={'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 my-3'}>
                {Object.entries(modifiers).map(([time, discountPercent]) => {
                    const selected = time === modifier;
                    const actualPrice = +time * plan.price;
                    const discount = actualPrice - ((actualPrice / 100) * discountPercent);
                    return (
                        <div
                            onClick={()=>{
                                setModifier(time);
                            }}
                            className={`cursor-pointer border ${!selected ? "border-b1" : "border-primary"} rounded-xl p-3 flex flex-col gap-3`}
                        >
                            <div className={'flex justify-between gap-3 items-center '}>
                                <div className={'flex items-center gap-2'}>
                                    <p>{time} ماه</p>
                                    {!!discountPercent && (
                                        <CustomBadge color={'var(--primary)'}>
                                            {discountPercent}% تخفیف
                                        </CustomBadge>
                                    )}
                                </div>
                                <Radio readOnly checked={selected} />
                            </div>
                            <p className={`${actualPrice === discount ? "":"line-through"} text-sm`}>
                                {actualPrice.toLocaleString('fa')} {" "}
                                تومان
                            </p>
                            {actualPrice !== discount && (
                                <p className={`text-sm font-medium text-primary`}>
                                    {discount.toLocaleString('fa')} {" "}
                                    تومان
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}


export async function showPlanBuyModal(plan: FullPlanType) {
    const {quantity} = await formModal<false>(`خرید ${plan.name}`, (
        <FormModalBase btnName={'خرید'} description={""}>
            <PlanBuy plan={plan} />
        </FormModalBase>
    ), false, 'xl');
    // await api("/profile/plans/subscribe", {
    //     plan: plan.key,
    //     quantity
    // }, "POST").then(e=>{
    //     handlePaymentResponse(e?.data?.redirect || window.throw("خطا در دریافت لینک پرداخت"))
    // })
}

export default PlanBuy;