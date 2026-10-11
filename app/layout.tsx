import "./global.css";
import {mantineHtmlProps} from "@mantine/core";
import LayoutProvider from "@/app/LayoutProvider";
import CacheUpdate from "@/lib/utils/cache-ssr";
import {getSession} from "@/lib/cache/session";
import {ReactNode} from "react";
import "@/components/helper/built-in-override";
import {Metadata} from "next";


export default async function RootLayout({children}: Readonly<{
    children: ReactNode;
}>) {
    const {userToken, os, user, theme} = await getSession();
    return (
        <html 
        lang="fa" 
        dir="rtl" 
         {...mantineHtmlProps}
          data-mantine-color-scheme={theme} 
          data-logged={userToken ? "true" : 'false'}
          className={theme}
          >
        <head>
            <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96"/>
            <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
            <link rel="shortcut icon" href="/favicon.ico"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <meta name="apple-mobile-web-app-title" content="Sazeheman"/>
            <link rel="manifest" href="/site.webmanifest"/>
            <meta name="theme-color" content="#00BC7D" />
            <meta name="robots" content="index, follow" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="سازه من - ساختساز از نوع بهترش !" />
            <meta property="og:description" content="سازه من یک پلتفرم جامع برای دریافت حمایت مالی و مدیریت ارتباط با هواداران است. با سازه من می‌تونی به راحتی صفحه ساختساز بسازی،کسب درآمد کنی و همه درآمدها و حمایت ها رو به صورت لحظه‌ای مدیریت کنی. امنیت بالا، امکانات شخصی‌سازی و پشتیبانی حرفه‌ای باعث شده سازه من انتخاب اول محتواسازها و هنرمندان باشه." />
            <meta property="og:site_name" content="Sazeheman" />
            <meta property="og:image" content="/logo.png" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="سازه من - ساختساز از نوع بهترش !" />
            <meta name="twitter:description" content="سازه من یک پلتفرم جامع برای دریافت حمایت مالی و مدیریت ارتباط با هواداران است. با سازه من می‌تونی به راحتی صفحه ساختساز بسازی،کسب درآمد کنی و همه درآمدها و حمایت ها رو به صورت لحظه‌ای مدیریت کنی. امنیت بالا، امکانات شخصی‌سازی و پشتیبانی حرفه‌ای باعث شده سازه من انتخاب اول محتواسازها و هنرمندان باشه." />
            <meta name="twitter:image" content="/logo.png" />
            <meta name="twitter:site" content="@donofaIr" />
        </head>
        <body className={`antialiased mx-auto`}>
        <LayoutProvider windowProps={{
            userToken,
            os,
            user,
            theme
        }}>
            <CacheUpdate>
                {children}
            </CacheUpdate>
        </LayoutProvider>
        </body>
        </html>
    );
}

export const metadata: Metadata = {
    title: {
        template: "Sazeheman - %s",
        absolute: "Sazeheman"
    },
    description: "سازه من یک پلتفرم جامع برای دریافت حمایت مالی و مدیریت ارتباط با هواداران است. با سازه من می‌تونی به راحتی صفحه ساختساز بسازی،کسب درآمد کنی و همه درآمدها و حمایت ها رو به صورت لحظه‌ای مدیریت کنی. امنیت بالا، امکانات شخصی‌سازی و پشتیبانی حرفه‌ای باعث شده سازه من انتخاب اول محتواسازها و هنرمندان باشه.",
    alternates: {
        canonical: "https://donofa.com/",
    },
}