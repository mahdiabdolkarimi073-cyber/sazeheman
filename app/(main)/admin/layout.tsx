import { redirect } from "next/navigation";
import { getSession } from "@/lib/cache/session";
import { Metadata } from "next";
import AdminShell from "./_components/AdminShell";

export const metadata: Metadata = {
    title: {
        template: "سازه‌همان — مدیریت — %s",
        absolute: "سازه‌همان — پنل مدیریت"
    }
};

async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = await getSession();

    if (!user) redirect("/auth");
    if (user.role !== "admin") redirect("/");

    return <AdminShell user={user}>{children}</AdminShell>;
}

export default AdminLayout;
