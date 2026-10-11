import type { User } from "@/lib/api/api.type";
import type { UserType } from "../hooks/useUser";
import type { DonateStatusEnum, DonateTypeEnum, GlobalNumberStatus } from "./enum";
import type { WidgetTypes } from "@/app/(landing)/dashboard/tools/[id]/types";
import { PlanNameEnum } from "@/app/(landing)/dashboard/subscription/PlanEnums";
import { ApiType } from "./base";

export type BaseApiType = {
    POST: {
        "/auth/login/verify": {
            token: string,
            user: User
        };
    }
    GET: {
        "/profile/me": {
            user: UserType,
        },
        "/profile/cards": {
            cards: Array<BankCard>
        },
        "/tickets": {
            tickets: Ticket[]
        },
        "/withdraws": {
            withdraws: Withdraw[]
        },
        "/assets": {
            assets: Asset[]
        },
        "/profile/connections": {
            connections: PlatformConnection[]
        },
        "/profile/donates": {
            donates: Array<Donate>
            pages: number
        },
        "/profile/widgets": WidgetList,
        "/profile/widgets/types": {
            types: WidgetTypes
        },
        "/profile/notifications": {
            unread: Array<BackendNotification>
            read: Array<BackendNotification>
        },
        "/profile/statistics": {
            statistics: {
                views: {
                    current: number
                    last: number
                    changes: number
                    values: number[]
                }
                donates: {
                    current: number
                    last: number
                    changes: number
                    values: number[]
                }
            }
        },
        "/profile/files/sounds": {
            sounds: MediaItem[]
        },
        "/profile/files/media": {
            media: MediaItem[]
        },
        "/profile/plans": {
            plans: Record<keyof typeof PlanNameEnum, PlanType>
        },
        "/rates": {
            data: Record<string, number>
            min: Record<string, number>
            max: Record<string, number>,
            usdt: string | number
        },
        "/blog": {
            posts: Array<BlogPost>
            pages: number
        },
        "/tickets/departments": {
            departments: any[]
        },
        "/profile/verification/advance/status": {
            verification: {
                id: number
                approved: number
                rejected: number
                rejection_reason: string | null
                id_document_url: string
                contract_document_url: string
            }
        },
        "/profile/statistics/income": {
            data: IncomeStat[]
        }
    }
}

export type PlatformConnection = {
    id: number;
    user_id: number;
    name: string;
    token: string;
    data: Record<string, any> | null;
    created_at: Date;
    updated_at: Date;
};

export type IncomeStat = {
    type: "IRT" | "international" | "crypto",
    total: number
    percentage: number
};

export type BankCard = {
    id: number
    iban: string
    owner: string
    is_default: number
    bank: {
        name: string
        color: string
    }
}

export type Ticket = {
    id: number
    user_id: number
    subject: string
    category: any
    priority: string
    status: string
    created_at: string
    updated_at: string
}

export type TicketAttachment = {
    id: number
    name: string
    file_name: string
    mime_type: string
    size: number
    url: string
    created_at: string
};
export type SingleTicket = Ticket & {
    id: number
    user: {
        id: number
        nickname: string
        avatar: string
    }
    subject: string
    status: string
    priority: string
    messages: Array<{
        id: number
        user: {
            id: number
            nickname: string
            avatar: string
        }
        message: string
        attachment: TicketAttachment,
        created_at: string
    }>
    attachments: TicketAttachment[]
}

export type Asset = {
    name: string;
    balance: number;
    waiting: number;
    blocked: number;
    rate: number;
};
export type Withdraw = {
    id: number;
    asset: string;
    recipient: string;
    amount: number;
    status: keyof typeof GlobalNumberStatus;
    paid_at: string | null;
    created_at: string;
}

export type Donate = {
    id: number
    user_id: number
    name: string
    email?: string
    phone: string
    description: string
    type: keyof typeof DonateTypeEnum
    amount: number
    currency: string
    meta: any
    is_visible: number
    is_blocked: number
    created_at: string
    updated_at: string,
    status: keyof typeof DonateStatusEnum
}

export type StreamerType = {
    id: number
    nickname: string
    slug: string
    avatar: string
    banner: string
    bio: string
    social: Partial<{
        x: string
        youtube: string
        telegram: string
        instagram: string
    }>
    plan: string
    pages: Record<string, boolean> & { kick: boolean } & {}
    options: {
        "accept:irt": boolean
        "accept:crypto": boolean
        "accept:international": boolean
        "irt:min": number
        "irt:max": number
        "international:min": number
        "international:max": number
        "visual:with_banner": boolean
        "input:name:required": boolean
        "input:phone:required": boolean
        "input:description:required": boolean,
        "visual:primary_color": string,
        "visual:secondary_color": string,
    },
    username?: string,
    goal?: {
        title: string
        amount: number
        filled: number
    },
    donates: {
        name: string
        description: string
        type: string
        currency: string
        amount: number
        created_at: string
    }[],
    rates: ApiType<"GET", "/rates">
    is_active: 1 | 0
    is_subdomain: boolean
};

export type StreamerKick = {
    badges: Array<{
        id: number
        months: number
        url: string
    }>
    emotes: {
        [k: string]: {
            id: number
            name: string
            subscribers_only: boolean
            url: string
        }
    }
    prices: Record<string, number>
}

export type WidgetList = {
    groups: Array<Widget>
    orphans: Array<Widget>
}

export type Widget = {
    id: number
    group_id: any
    identifier: string
    name: string
    type: string
    settings: Record<string, any> | null
    is_group: number
    is_active: number
    created_at: string
    updated_at: string,
    children?: Array<Widget>,
    children_count?: number,
    platforms: string[],
    condition: Record<string, string>
}

export type BackendNotification = {
    id: string
    type: ("ticket"
        | "shop"
        | "donate"
        | "withdraw"
        | "others") | (string & {})
    notifiable_type: string
    notifiable_id: number
    data: {
        type: string
        message: string
        link: string | null
    }
    read_at: null | string
    created_at: string
    updated_at: string
}

export type MediaItem = {
    id: number | string
    name: string
    file_name: string
    mime_type: string
    size: number
    url: string
    created_at: string
}

export type LocalMedia = {
    name: string;
    path: string;
    mime: string;
};
export type LocalMediaResponse = {
    success: boolean;
    count: number;
    files: LocalMedia[]
}
export type PlanType = {
    price: number
    discount: number,
    price_modifiers?: Record<string, number>
}

export type Invoice = {
    id: number
    uuid: string
    amount: number
    currency: string
    gateway: string
    status: any
    created_at: string
}

export type FullInvoice = {
    id: number
    uuid: string
    amount: number
    currency: string
    gateway: string
    crypto: {
        chain: string
        address: string
        amount: number
        is_received: number
        comment: string
        need_comment: boolean
        expires_in: (string & {}) | "expired",
        user?: {
            slug: string
        }
    }
    status: number
    created_at: string
}

export type BlogPost = {
    id: number
    title: string
    slug: string
    description: string
    thumbnail: string
    content: Array<{
        data: {
            level?: string
            content?: string
            alt?: string
            url?: string
        }
        type: "heading" | "paragraph" | "image"
    }>
    category: string
    tags: Array<string>
    meta: {
        title: string
        description: string
    }
    is_active: boolean
    is_guide: boolean
    created_at: string
}