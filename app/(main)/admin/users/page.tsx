'use client';

import React, { useState, useEffect } from 'react';
import {
    Loader, Center, Modal, Badge, TextInput, Alert,
} from '@mantine/core';
import {
    IconCheckCircle, IconXCircle, IconSearch, IconEye,
    IconUsers, IconHardHat, IconBuilding,
} from '@/components/assets/tabler-icons';
import CustomButton from '@/components/ui/base/CustomButton';
import { api } from '@/lib/api/base';
import { echoTimeDiff, toPersianNumber } from '@/lib/utils/global';

type AdminUser = {
    id: string;
    phone: string;
    role: string;
    account_type: string;
    nickname: string | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    plan: string;
    status: string;
    trial_used: boolean;
    created_at: string;
    _count?: { projects: number; businesses: number };
};

const roleConfig: Record<string, { label: string; color: string }> = {
    admin: { label: 'مدیر', color: 'blue' },
    user: { label: 'کاربر', color: 'gray' },
};

const statusConfig: Record<string, { label: string; color: string }> = {
    active: { label: 'فعال', color: 'green' },
    suspended: { label: 'معلق', color: 'red' },
};

function AdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [detailUser, setDetailUser] = useState<AdminUser | null>(null);
    const [acting, setActing] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ userId: string; action: 'suspend' | 'activate' } | null>(null);

    const fetchUsers = (searchQuery: string) => {
        setLoading(true);
        const params: Record<string, any> = { section: 'users' };
        if (searchQuery) params.search = searchQuery;
        api('/admin', params, 'GET')
            .then((res) => setUsers(res.data?.users || []))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const t = setTimeout(() => fetchUsers(search), 300);
        return () => clearTimeout(t);
    }, [search]);

    const handleConfirmAction = () => {
        if (!confirmAction) return;
        setActing(confirmAction.userId);
        api('/admin', {
            action: confirmAction.action === 'suspend' ? 'suspend_user' : 'activate_user',
            user_id: confirmAction.userId,
        }, 'PUT')
            .then(() => {
                fetchUsers(search);
                setConfirmAction(null);
            })
            .finally(() => setActing(null));
    };

    return (
        <div className="flex flex-col gap-5 max-w-5xl w-full">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold">مدیریت کاربران</h1>
                <p className="text-gray-400 text-sm mt-1">
                    مشاهده کاربران سایت و اطلاعات پروفایل آن‌ها
                </p>
            </div>

            <TextInput
                placeholder="جستجو بر اساس تلفن، نام، ایمیل..."
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                className="max-w-md"
                leftSection={<IconSearch size={18} />}
            />

            {loading ? (
                <Center className="min-h-40">
                    <Loader />
                </Center>
            ) : users.length === 0 ? (
                <p className="text-gray-500 text-center py-10">کاربری یافت نشد</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {users.map((u) => {
                        const roleCfg = roleConfig[u.role] || roleConfig.user;
                        const statusCfg = statusConfig[u.status] || statusConfig.active;
                        return (
                            <div
                                key={u.id}
                                className="rounded-2xl border border-white/10 bg-[#161A21] p-4 flex flex-col gap-3"
                            >
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center font-bold shrink-0">
                                            {(u.nickname || u.first_name || u.phone.slice(-2))[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-base font-semibold truncate">
                                                {u.nickname || `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'بدون نام'}
                                            </h3>
                                            <p className="text-gray-400 text-sm" dir="ltr">{u.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <Badge color={roleCfg.color} size="sm" variant="light">
                                            {roleCfg.label}
                                        </Badge>
                                        <Badge color={statusCfg.color} size="sm" variant="light">
                                            {statusCfg.label}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <IconHardHat size={16} />
                                        <span className="opacity-60">پروژه:</span> {toPersianNumber(u._count?.projects || 0)}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <IconBuilding size={16} />
                                        <span className="opacity-60">کسب‌وکار:</span> {toPersianNumber(u._count?.businesses || 0)}
                                    </div>
                                    <div className="text-gray-400">
                                        <span className="opacity-60">ثبت:</span> {echoTimeDiff(u.created_at)}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <CustomButton
                                        variant="soft"
                                        className="small"
                                        onClick={() => setDetailUser(u)}
                                    >
                                        <span className="flex items-center gap-1"><IconEye size={16} /> جزئیات</span>
                                    </CustomButton>
                                    {u.role !== 'admin' && u.status === 'active' && (
                                        <CustomButton
                                            variant="soft"
                                            className="small"
                                            onClick={() => setConfirmAction({ userId: u.id, action: 'suspend' })}
                                        >
                                            تعلیق
                                        </CustomButton>
                                    )}
                                    {u.status === 'suspended' && (
                                        <CustomButton
                                            variant="soft"
                                            className="small"
                                            onClick={() => setConfirmAction({ userId: u.id, action: 'activate' })}
                                        >
                                            فعال‌سازی
                                        </CustomButton>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Detail Modal */}
            <Modal
                opened={!!detailUser}
                onClose={() => setDetailUser(null)}
                title="جزئیات کاربر"
                centered
                size="md"
                scrollAreaComponent="div"
            >
                {detailUser && <UserDetail user={detailUser} />}
            </Modal>

            {/* Confirm Action Modal */}
            <Modal
                opened={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                title={confirmAction?.action === 'suspend' ? 'تعلیق کاربر' : 'فعال‌سازی کاربر'}
                centered
                size="sm"
            >
                <div className="flex flex-col gap-4">
                    <p className="text-sm opacity-70">
                        {confirmAction?.action === 'suspend'
                            ? 'آیا از تعلیق این کاربر مطمئن هستید؟ کاربر تعلیق‌شده نمی‌تواند وارد سایت شود.'
                            : 'آیا از فعال‌سازی این کاربر مطمئن هستید؟'}
                    </p>
                    <div className="flex gap-2 justify-end">
                        <CustomButton variant="outline" onClick={() => setConfirmAction(null)} className="small">
                            انصراف
                        </CustomButton>
                        <CustomButton loading={!!acting} onClick={handleConfirmAction} className="small">
                            تأیید
                        </CustomButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

function UserDetail({ user }: { user: AdminUser }) {
    const roleCfg = roleConfig[user.role] || roleConfig.user;
    const statusCfg = statusConfig[user.status] || statusConfig.active;
    return (
        <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-lg font-bold shrink-0">
                    {(user.nickname || user.first_name || user.phone.slice(-2))[0]}
                </div>
                <div>
                    <h3 className="text-xl font-semibold">
                        {user.nickname || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'بدون نام'}
                    </h3>
                    <p className="text-gray-400" dir="ltr">{user.phone}</p>
                </div>
            </div>

            <div className="flex gap-2 flex-wrap">
                <Badge color={roleCfg.color} size="md" variant="light">{roleCfg.label}</Badge>
                <Badge color={statusCfg.color} size="md" variant="light">{statusCfg.label}</Badge>
                <Badge color="teal" size="md" variant="light">{user.plan}</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.first_name && <DetailRow label="نام" value={user.first_name} />}
                {user.last_name && <DetailRow label="نام خانوادگی" value={user.last_name} />}
                {user.email && <DetailRow label="ایمیل" value={user.email} ltr />}
                <DetailRow label="نوع حساب" value={user.account_type === 'sazeheman' ? 'سازه‌همان' : 'شغل‌من'} />
                <DetailRow label="طرح اشتراک" value={user.plan} />
                <DetailRow label="تاریخ ثبت" value={echoTimeDiff(user.created_at, false, true)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 p-4 flex flex-col items-center gap-1">
                    <IconHardHat size={24} className="text-amber-400" />
                    <span className="text-2xl font-bold">{toPersianNumber(user._count?.projects || 0)}</span>
                    <span className="text-xs text-gray-400">پروژه</span>
                </div>
                <div className="rounded-xl border border-white/10 p-4 flex flex-col items-center gap-1">
                    <IconBuilding size={24} className="text-green-400" />
                    <span className="text-2xl font-bold">{toPersianNumber(user._count?.businesses || 0)}</span>
                    <span className="text-xs text-gray-400">کسب‌وکار</span>
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value, ltr }: { label: string; value: string | null | undefined; ltr?: boolean }) {
    if (!value) return null;
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-gray-500 text-xs">{label}</span>
            <span dir={ltr ? 'ltr' : 'rtl'}>{value}</span>
        </div>
    );
}

export default AdminUsers;
