import { headers } from "next/headers";
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
    const h = await headers();
    const pathname = h.get('x-pathname') || '';

    const isAdminLogin = pathname === '/admin/login' || pathname.startsWith('/admin/login');

    if (isAdminLogin) {
        return <>{children}</>;
    }

    const { user } = await getSession();

    if (!user) redirect("/admin/login");
    if (user.role !== "admin") redirect("/admin/login");

    return <AdminShell user={user}>{children}</AdminShell>;
}

export default AdminLayout;
