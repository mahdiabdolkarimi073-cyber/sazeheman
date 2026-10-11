import {PlanType} from "@/lib/api/base.type";
import {api} from "@/lib/api/base";

export const PlanNameEnum = {
    free: "پلن رایگان",
    basic: "پلن پایه",
    advanced: "پلن حرفه‌ای",
    partner: "پارتنر"
}

export const PlanFeatureEnum = {
    "support_irt": "دریافت حمایت مستقیم تومانی (درگاه دونوفا)",
    "irt_cooldown": "زمان تسویه حمایت تومانی",
    "irt_max": "سقف هر حمایت تومانی",
    "support_dollar": "دریافت حمایت دلاری",
    "support_crypto": "دریافت حمایت کریپتو",
    "convert_crypto_income": "نقد کردن درآمد کریپتو",
    "kick": "دریافت ساب کیک",
    // "gift_cart": "دریافت گیفت کارت",
    // "amazon": "ویش لیست آمازون",
    // "payment": "قابلیت اتصال پرداخت یار",
    "special_request": "درخواست ابزار اختصاصی",
    "contact_personal_support": "ارتباط مستقیم با تیم دونوفا",
}


export const PlanDesignEnum = [
    {
        key: "free",
        name: "پلن رایگان",
        color: "#0009",
        icon: "free",
        features: {
            support_irt: { status: "warning", text: "سقف 5 میلیون تومان هفتگی" },
            irt_max: { status: "warning", text: "سقف حمایت 5 میلیون تومان" },
            irt_cooldown: { status: "available", text: "تسویه 14 روز کاری" },
            support_dollar: false,
            support_crypto: false,
            convert_crypto_income: false,
            kick: false,
            // gift_cart: false,
            special_request: false,
            contact_personal_support: false
        }
    },
    {
        key: "basic",
        active: true,
        name: "پلن پایه",
        color: "var(--primary)",
        icon: "basic",
        features: {
            support_irt: { status: "warning", text: "سقف 20 میلیون تومان هفتگی" },
            irt_max: { status: "warning", text: "سقف حمایت 20 میلیون تومان" },
            irt_cooldown: { status: "available", text: "تسویه 14 روز کاری" },
            support_dollar: false,
            support_crypto: true,
            convert_crypto_income: false,
            kick: true,
            // gift_cart: true,
            special_request: false,
            contact_personal_support: false
        }
    },

    {
        key: "advanced",
        name: "پلن حرفه‌ای",
        color: "#5a38a4",
        icon: "advanced",
        features: {
            support_irt: { status: "warning", text: "سقف 50 میلیون تومان هفتگی" },
            irt_max: { status: "available", text: "سقف حمایت 200 میلیون تومان" },
            irt_cooldown: { status: "available", text: "تسویه 10 روز کاری" },
            support_dollar: true,
            support_crypto: true,
            convert_crypto_income: { status: "warning", text: "سقف ۵۰۰ دلار در هفته" },
            kick: true,
            // gift_cart: true,
            special_request: false,
            contact_personal_support: true
        }
    },

    {
        key: "partner",
        name: "پارتنر",
        color: "#E17100",
        icon: "partner",
        features: {
            support_irt: { status: "available", text: "بدون هیچگونه محدودیت" },
            irt_max: { status: "available", text: "سقف حمایت 200 میلیون تومان" },
            irt_cooldown: { status: "available", text: "تسویه 5 روز کاری" },
            support_dollar: true,
            support_crypto: true,
            convert_crypto_income: { status: "available", text: "بدون هیچگونه محدودیت" },
            kick: true,
            // gift_cart: true,
            special_request: true,
            contact_personal_support: true
        }
    }
] as const;

export type FullPlanType = typeof PlanDesignEnum[number] & PlanType;


export async function getAllPlans() {
    const plans = JSON.parse(`{"status":true,"plans":{"free":{"price":0,"discount":0,"uploads":{"sounds":{"max_size":1024,"max":20},"media":{"max_size":10240,"max":20}},"cooldowns":{"irt":1209600,"crypto":259200,"international":1209600}},"basic":{"price":149000,"discount":0,"uploads":{"sounds":{"max_size":1024,"max":20},"media":{"max_size":10240,"max":20}},"cooldowns":{"irt":1209600,"crypto":172800,"international":1036800}},"advanced":{"price":300000,"discount":0,"uploads":{"sounds":{"max_size":1024,"max":20},"media":{"max_size":10240,"max":20}},"cooldowns":{"irt":864000,"crypto":172800,"international":604800}},"partner":{"price":0,"discount":0,"uploads":{"sounds":{"max_size":1024,"max":20},"media":{"max_size":10240,"max":20}},"cooldowns":{"irt":432000,"crypto":86400,"international":604800}},"priority":{"free":1,"basic":2,"advanced":3,"partner":4},"price_modifiers":{"1":0,"2":0,"3":5,"4":7,"6":15,"12":20}}}`).plans as any[];

    return Object.entries(plans).map(([key, _plan]) => {
        if (!PlanNameEnum[key as keyof typeof PlanNameEnum]) return undefined;

        return {
            ..._plan,
            ...PlanDesignEnum.find(o => o.key === key) ?? {
                ...PlanDesignEnum[0],
                name: "ناشناخته",
                key
            }
        }
    }).filter(o => !!o) as FullPlanType[]
}