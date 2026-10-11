export const TicketStatusList = {
    "in_progress": {
        label: "در انتظار پشتیبان",
        color: "orange"
    },
    "resolved": {
        label: "پاسخ داده شده",
        color: "var(--primary)"
    },
    "closed": {
        label: "بسته شده",
        color: "#333"
    }
} as const;

export const SettingEnum = {
    // irt:auto_withdraw_period
    daily: "روزانه",
    odd: "روزهای فرد",
    even: "روزهای زوج",
    weekly: "هفتگی",
    monthly: "ماهانه",

    // input:filtering
    hide: "پنهان‌سازی",
    sensor: "سانسور",
    none: "هیچ‌کدام",

    // accept:giftcard:types
    playstation: "پلی‌استیشن",

    // irt:gateway
    zarinpal: "زرین‌پال",
    zibal: "زیبال",
    idpay: "آیدی‌پی",

    // crypto:exchange
    nobitex: "نوبیتکس",
    bitpin: "بیت‌پین",
} as Record<string, string>

export const DonateTypeEnum = {
    "international": {
        label: "بین المللی",
        color: "#0073ff"
    },
    "crypto": {
        label: "ارز دیجیتال",
        color: "#BB4D00"
    },
    "IRT": {
        label: "تومانی",
        color: "var(--primary)"
    },
    "subscribe": {
        label: "سابسکرایپ",
        color: "#7008e7"
    },
    "giftcard": {
        label: "گیفت کارت",
        color: "#ff009d"
    }
} as const;

export const DonateStatusEnum = {
    0: {
        label: "نامشخص",
        key: "unknown",
        color: "#999"
    },
    1: {
        label: "تسویه شده",
        key: "paid",
        color: "var(--primary)"
    },
    2: {
        label: "در انتظار تسویه",
        key: "pending",
        color: "#999"
    },
    3: {
        label: "مرجوع شده",
        key: "refunded",
        color: "red"
    }
}

export const GlobalNumberStatus = {
    [-1]: {
        label: "درحال بررسی",
        color: "#999"
    },
    0: {
        label: "لغو شده",
        color: "red"
    },
    1: {
        label: "پرداخت شده",
        color: "var(--primary)"
    },
    2: {
        label: "در حال انجام",
        color: "orange"
    }
} as const

export const NotificationTypeEnum = {
    "ticket": "تیکت",
    "shop": "فروشگاه",
    "donate": "ساختساز",
    "withdraw": "برداشت",
    "others": "سایر"
} as Record<string, string | undefined>;