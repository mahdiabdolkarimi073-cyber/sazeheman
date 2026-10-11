'use client';

import PngIcon from "@/components/ui/base/PngIcon";
import GlassBox from "../_components/GlassBox";
import {Button, Divider} from "@mantine/core";
import {IconCheck, IconErrorSingle, IconX} from "@/components/ui/SVGs";
import CustomBadge from "@/components/ui/base/CustomBadge";
import {FullPlanType, PlanFeatureEnum, PlanNameEnum} from "@/app/(landing)/dashboard/subscription/PlanEnums";
import {showPlanBuyModal} from "./PlanBuy";
import {ComponentProps, useState} from "react";
import useUser from "@/lib/hooks/useUser";

export function PlanHeader({plan = {} as FullPlanType}) {
    return (
        <div className={'flex flex-col gap-3'}>
            <PngIcon name={"plan-" + plan.icon} size={60}/>
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <h3 className="text-xl">
                {plan.key !== 'partner' ? (
                    <>
                        {plan.price.toLocaleString("fa")} تومان
                        <span className="text-base opacity-70">
                                    {" "}
                            / درماه
                                </span>
                    </>
                ) : (
                    "با ما تماس بگیرید"
                )}
            </h3>
        </div>
    )
}

export function PlanBuyButton({plan = {} as FullPlanType, active = ""}) {
    const user = useUser();
    const names = Object.keys(PlanNameEnum);
    const currentPlanIndex = names.findIndex(o => o === plan.key);
    const currentUserPlanIndex = names.findIndex(o => o === user?.plan);
    const disabled = (plan.price <= 0 && plan.key !== 'partner') || currentPlanIndex < currentUserPlanIndex || (user?.plan === "partner" && plan.key === 'partner');
    const [loading, setLoading] = useState(false);

    return (
        <div className="relative">
            {active && (
                <div
                    className="absolute text-center text-sm border-2 rounded-2xl p-2 h-[150%] left-0 right-0 mx-auto w-4/6 -top-full"
                    style={{
                        borderColor: "var(--primary)",
                        background: "rgb(var(--primary-rgb), 0.07)"
                    }}
                >
                    اشتراک فعلی: {active} روز
                </div>
            )}
            <Button
                disabled={disabled}
                radius={"xl"}
                loading={loading}
                fullWidth
                onClick={() => {
                    if (plan.key === 'partner') {
                        window.routerPush("/contact")
                        return;
                    }
                    if (!window.user) {
                        window.location.href="/auth?redirect="+location.pathname;
                        return;
                    }
                    setLoading(true);
                    showPlanBuyModal(plan)
                        .finally(()=>{
                            setLoading(false);
                        })
                }}
            >
                {plan.key === "partner" ? "با ما تماس بگیرید":(currentUserPlanIndex === currentPlanIndex && !disabled) ? "تمدید":"خرید"}
            </Button>
        </div>
    )
}

export function PlanFeature({feature: _f = ['',{}] as [string, FullPlanType['features'][keyof FullPlanType['features']]], renderName = true}) {
    const [key, _feature] = _f;
    const feature = {
        name: typeof _feature === 'boolean' ? PlanFeatureEnum[key as keyof typeof PlanFeatureEnum]:_feature?.text,
        status: typeof _feature === 'boolean' ? _feature ? "available":'unavailable':_feature.status,
        text: typeof _feature === 'boolean' ? _feature ? "دارد":'ندارد':_feature.text,
    }

    const Icon =
        feature.status === "available"
            ? IconCheck
            : feature.status === "warning"
                ? IconErrorSingle
                : IconX;
    return (
        <div
            className="flex items-center justify-start gap-2"
        >
            <CustomBadge
                className="w-6 h-6"
                circle
                color={
                    feature.status === "available"
                        ? "var(--primary)"
                        : feature.status === "warning"
                            ? "orange"
                            : "red"
                }
            >
                <Icon
                    transparent
                    fill="currentColor"
                    width={undefined}
                    height={undefined}
                    style={{
                        width: "22px",
                        height: "22px",
                    }}
                />
            </CustomBadge>
            <p className="opacity-70 text-xs">
                {renderName ? feature.name:feature.text}
            </p>
        </div>
    );
}

export function PlanBox({plan = {} as FullPlanType,bg = undefined as string | undefined, children = [] as any, boxProps = {} as ComponentProps<typeof GlassBox>}) {
    return (
        <GlassBox
            color={plan.color}
            deg="180deg"
            radius="20px"
            toPercent="15%"
            fromPercent="-30%"
            bg="#00000003"
            innerBg={bg}
            fadeGradient
            fadeOpacity={"0.4"}
            withoutBorder
            innerOpacity="1"
            className="h-full border border-b1"
            {...boxProps}
        >
            <div className={'p-4 h-full'}>
                {children}
            </div>
        </GlassBox>
    )
}

function PlanItem({plan = {} as FullPlanType,active = ""  }) {

    return (
        <PlanBox plan={plan}>
            <div className={"flex-col flex justify-between gap-10 2xl:gap-5 h-full"}>
                <div className="flex-col flex gap-3">
                    <PlanHeader plan={plan}/>
                    <Divider/>
                    <div className={`flex flex-col gap-3 `}>
                        {Object.entries(plan.features).map((f, i) => (
                            <PlanFeature feature={f} key={i}/>
                        ))}
                    </div>
                </div>
                <PlanBuyButton active={active} plan={plan}/>
            </div>
        </PlanBox>
    );
}


export default PlanItem;