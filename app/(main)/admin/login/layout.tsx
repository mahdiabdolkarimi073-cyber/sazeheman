import { redirect } from "next/navigation";
import { getSession } from "@/lib/cache/session";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود مدیریت",
};

async function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getSession();

  if (user && user.role === "admin") {
    redirect("/admin");
  }

  return (
    <div dir="rtl" className="min-h-screen overflow-x-hidden bg-[#0E1116] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

export default AdminLoginLayout;
