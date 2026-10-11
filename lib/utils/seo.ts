import {MAIN_FAQ} from "@/components/ui/home/FAQ";

export const OrganizationSchemaSnippet = () => {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://donofa.com/#organization",

        name: "سازه من",
        legalName: "راهکار دیجیتال نوین آریانا",
        alternateName: ["Sazeheman", "donofa", "dono fa", "سازه من", "دونو فا"],

        url: "https://donofa.com/",
        logo: {
            "@type": "ImageObject",
            "@id": "https://donofa.com/#logo",
            url: "https://donofa.com/logo.png",
        },

        description:
            "Sazeheman is a creator donation platform supporting crypto and fiat payments, enabling creators to receive secure contributions.",

        contactPoint: [
            {
                "@type": "ContactPoint",
                telephone: "+989359514552",
                contactType: "customer service",
                areaServed: "IR",
                availableLanguage: ["Persian", "English"],
            },
        ],

        sameAs: [
            "https://www.youtube.com/@donofaIr",
            "https://www.instagram.com/donofa.ir/",
            "https://t.me/SazehemanIr",
            "https://donofa.ir/",
        ],
    };
};

export const WebSiteSchemaSnippet = () => {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://donofa.com/#website",
        name: "Sazeheman",
        url: "https://donofa.com/",
        publisher: { "@id": "https://donofa.com/#organization" },
        inLanguage: ["fa-IR", "en"],
    };
};

export const HomePageSchemaSnippet = () => {
    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://donofa.com/#homepage",

        name: "سازه من - ساختساز از نوع بهترش !",
        url: "https://donofa.com/",
        isPartOf: { "@id": "https://donofa.com/#website" },
        about: { "@id": "https://donofa.com/#organization" },

        inLanguage: ["fa-IR", "en"],
        primaryImageOfPage: { "@id": "https://donofa.com/#logo" },
    };
};

export const SoftwareApplicationSchemaSnippet = () => {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": "https://donofa.com/#software",

        name: "Sazeheman",
        url: "https://donofa.com/",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",

        publisher: { "@id": "https://donofa.com/#organization" },
        isPartOf: { "@id": "https://donofa.com/#website" },

        description: "سازه من یک پلتفرم جامع برای دریافت حمایت مالی و مدیریت ارتباط با هواداران است. با سازه من می‌تونی به راحتی صفحه ساختساز بسازی،کسب درآمد کنی و همه درآمدها و حمایت ها رو به صورت لحظه‌ای مدیریت کنی. امنیت بالا، امکانات شخصی‌سازی و پشتیبانی حرفه‌ای باعث شده سازه من انتخاب اول محتواسازها و هنرمندان باشه.",
    };
};

export const FaqSchemaSnippet = (content: any) => {
    const entity = [];

    for (const q of content) {
        entity.push({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: q.answer,
            },
        });
    }

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: entity,
    };
};

export const BreadcrumbSchemaSnippet = (data: any) => {
    const list: any = [];
    let i = 1;

    data.forEach((p: any) => {
        list.push({
            "@type": "ListItem",
            position: i,
            name: p.name,
            item: p.link,
        });

        i++;
    });

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: list,
    };
};

export const ContactPageSchemaSnippet = () => {
    return {
        "@context": "https://schema.org",
            "@type": "ContactPage",
        "@id": "https://donofa.com/contact#webpage",

        url: "https://donofa.com/contact",
        name: "تماس با سازه من",
        description: "راه‌های ارتباط با پشتیبانی سازه من، ارسال پیام و دریافت پاسخ.",

        inLanguage: "fa-IR",
        isPartOf: { "@id": "https://donofa.com/#website" },
        about: { "@id": "https://donofa.com/#organization" },

        primaryImageOfPage: { "@id": "https://donofa.com/#logo" },
    };
};

export const OrganizationContactPointPatchSnippet = () => {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://donofa.com/#organization",
        contactPoint: [
            {
                "@type": "ContactPoint",
                telephone: "+989359514552",
                contactType: "پشتیبانی",
                areaServed: "IR",
                availableLanguage: ["Persian"],
            },
            {
                "@type": "ContactPoint",
                url: "https://donofa.com/contact",
                contactType: "customer support",
                availableLanguage: ["Persian", "English"],
            },
        ],
    };
};

export const TermsPageSchemaSnippet = () => {
    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://donofa.com/terms#webpage",

        url: "https://donofa.com/terms",
        name: "شرایط و قوانین استفاده از سازه من",
        description:
            "شرایط و قوانین استفاده از خدمات سازه من، حقوق و مسئولیت‌های کاربران، و سیاست‌های مرتبط با استفاده از پلتفرم.",

        inLanguage: "fa-IR",
        isPartOf: { "@id": "https://donofa.com/#website" },
        about: { "@id": "https://donofa.com/#organization" },

        primaryImageOfPage: { "@id": "https://donofa.com/#logo" },
    };
};

export const TermsPolicyWorkSchemaSnippet = () => {
    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": "https://donofa.com/terms#policy",

        name: "شرایط و قوانین استفاده از سازه من",
        url: "https://donofa.com/terms",
        inLanguage: "fa-IR",

        datePublished: "2026-01-03",
        dateModified: "2026-01-03",

        publisher: { "@id": "https://donofa.com/#organization" },
        about: { "@id": "https://donofa.com/#organization" },

        isPartOf: { "@id": "https://donofa.com/#website" },
    };
};


export const MainPageSchemaGraphSnippet = () => {
    return {
        "@context": "https://schema.org",
        "@graph": [
            OrganizationSchemaSnippet(),
            WebSiteSchemaSnippet(),
            HomePageSchemaSnippet(),
            SoftwareApplicationSchemaSnippet(),
        ],
    };
};

export const ContactPageSchemaGraphSnippet = () => {
    return {
        "@context": "https://schema.org",
        "@graph": [
            ContactPageSchemaSnippet(),
            BreadcrumbSchemaSnippet([
                {
                    name: "Sazeheman",
                    link: "https://donofa.com/",
                },
                {
                    name: "Contact",
                    link: "https://donofa.com/contact",
                }
            ]),
            OrganizationContactPointPatchSnippet()
        ],
    };
};

export const TermsPageSchemaGraphSnippet = () => {
    return {
        "@context": "https://schema.org",
        "@graph": [
            TermsPageSchemaSnippet(),
            TermsPolicyWorkSchemaSnippet(),
            BreadcrumbSchemaSnippet([
                {
                    name: "Sazeheman",
                    link: "https://donofa.com/",
                },
                {
                    name: "Terms",
                    link: "https://donofa.com/terms",
                }
            ]),
        ],
    };
};
