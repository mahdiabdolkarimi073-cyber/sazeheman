'use client';

import {useDelayedEffect} from "@/lib/hooks/useEffect";
import {setUserToken} from "../action";
import {refetchUser} from "@/lib/hooks/useUser";
import {use} from "react";
import {useRouter} from "next/navigation";
import {Progress} from "@mantine/core";
import {api} from "@/lib/api/base";


function Page(props: any) {
    const { token } = use(props.searchParams) as any;
    const router = useRouter();

    const setUser = async () => {
        window.userToken = token;
        const res = await api("/profile/me")
            .then(e => e.data)
            .catch(() => undefined);
        if (!res || !res.user) {
            window.alert("خطا در دریافت اطلاعات");
            router.push("/auth");
            return;
        }
        const user = res.user;
        setUserToken(token)
            .then(async () => {
                await refetchUser()
                const firstTime = !user?.nickname || !user?.slug;
                if (firstTime) {
                    router.push("/auth/info");
                } else {
                    router.push("/dashboard");
                    alert(`خوش آمدید ${user?.nickname || [user?.first_name, user?.last_name].join(" ")}`);
                }
            });
    }

    useDelayedEffect(() => {
        setUser()
            .catch(console.error)
    }, []);

    return (
        <div className="w-full max-w-lg" dir="rtl">
            <div className="text-right mb-6">
                <h3 className="text-xl font-medium text-[#173D35] mb-4">درحال بارگذاری...</h3>
            </div>
            <Progress value={100} animated color="#36B98A" size="lg" radius="xl" />
        </div>
    )
}

export default Page;
