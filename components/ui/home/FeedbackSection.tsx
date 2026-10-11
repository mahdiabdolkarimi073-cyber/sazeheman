'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api/base';
import CustomButton from '@/components/ui/base/CustomButton';
import { TextInput, Textarea, Select, Rating } from '@mantine/core';

type CommentItem = {
    id: string;
    name: string;
    text: string;
    rating: number;
    created_at: string;
};

function FeedbackSection() {
    const [tab, setTab] = useState<'comments' | 'ticket'>('comments');
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);

    const [cName, setCName] = useState('');
    const [cPhone, setCPhone] = useState('');
    const [cText, setCText] = useState('');
    const [cRating, setCRating] = useState(5);
    const [cLoading, setCLoading] = useState(false);

    const [tName, setTName] = useState('');
    const [tPhone, setTPhone] = useState('');
    const [tEmail, setTEmail] = useState('');
    const [tSubject, setTSubject] = useState('');
    const [tCategory, setTCategory] = useState<string | null>('general');
    const [tMessage, setTMessage] = useState('');
    const [tLoading, setTLoading] = useState(false);

    const loadComments = () => {
        setLoadingComments(true);
        api("/comments")
            .then(e => setComments(e.data?.comments || []))
            .catch(() => {})
            .finally(() => setLoadingComments(false));
    };

    const submitComment = async () => {
        if (!cName || !cText) {
            window.alert?.("نام و متن نظر الزامی است");
            return;
        }
        setCLoading(true);
        try {
            await api("/comments", {
                name: cName,
                phone: cPhone,
                text: cText,
                rating: cRating,
            });
            setCName(''); setCPhone(''); setCText(''); setCRating(5);
        } catch {}
        setCLoading(false);
    };

    const submitTicket = async () => {
        if (!tName || !tPhone || !tSubject || !tMessage) {
            window.alert?.("تمام فیلدهای الزامی را پر کنید");
            return;
        }
        setTLoading(true);
        try {
            await api("/tickets", {
                name: tName,
                phone: tPhone,
                email: tEmail,
                subject: tSubject,
                category: tCategory || "general",
                message: tMessage,
            });
            setTName(''); setTPhone(''); setTEmail(''); setTSubject(''); setTMessage('');
        } catch {}
        setTLoading(false);
    };

    return (
        <div className="relative py-20 bg-background overflow-hidden" id="feedback">
            {/* Decorative gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }} />

            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-dark text-sm font-medium mb-4">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        ارتباط با ما
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-extrabold mb-3">
                        نظر شما و پشتیبانی
                    </h2>
                    <p className="text-base opacity-60 max-w-xl mx-auto">
                        نظر خود را درباره سایت با ما در میان بگذارید یا برای ارتباط با مدیران تیکت ثبت کنید
                    </p>
                </div>

                {/* Tab buttons */}
                <div className="flex gap-2 justify-center mb-8">
                    <button
                        onClick={() => { setTab('comments'); loadComments(); }}
                        className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                            tab === 'comments'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-container text-black/70 hover:bg-primary/10 hover:text-primary-dark border border-b2'
                        }`}
                    >
                        نظرات کاربران
                    </button>
                    <button
                        onClick={() => setTab('ticket')}
                        className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                            tab === 'ticket'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-container text-black/70 hover:bg-primary/10 hover:text-primary-dark border border-b2'
                        }`}
                    >
                        ثبت تیکت
                    </button>
                </div>

                {tab === 'comments' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="glass-card rounded-3xl p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 rounded-full bg-primary" />
                                ثبت نظر
                            </h3>
                            <div className="flex flex-col gap-4">
                                <TextInput
                                    label="نام شما"
                                    placeholder="نام خود را وارد کنید"
                                    value={cName}
                                    onChange={(e) => setCName(e.target.value)}
                                />
                                <TextInput
                                    label="شماره تماس (اختیاری)"
                                    placeholder="09xxxxxxxxx"
                                    value={cPhone}
                                    onChange={(e) => setCPhone(e.target.value)}
                                    dir="ltr"
                                />
                                <div>
                                    <label className="text-sm font-medium mb-1 block">امتیاز</label>
                                    <Rating value={cRating} onChange={setCRating} count={5} />
                                </div>
                                <Textarea
                                    label="متن نظر"
                                    placeholder="نظر خود را بنویسید..."
                                    value={cText}
                                    onChange={(e) => setCText(e.target.value)}
                                    autosize
                                    minRows={3}
                                />
                                <CustomButton loading={cLoading} onClick={submitComment} shadow>
                                    ارسال نظر
                                </CustomButton>
                            </div>
                        </div>

                        <div className="glass-card rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <span className="w-1.5 h-6 rounded-full bg-primary" />
                                    نظرات اخیر
                                </h3>
                                <button onClick={loadComments} className="text-xs text-primary-dark font-medium hover:opacity-70 transition-opacity">
                                    {loadingComments ? "در حال بارگذاری..." : "بارگذاری"}
                                </button>
                            </div>
                            <div className="flex flex-col gap-3 max-h-96 overflow-auto">
                                {comments.length === 0 && !loadingComments && (
                                    <p className="text-sm opacity-50 text-center py-8">
                                        هنوز نظری ثبت نشده است
                                    </p>
                                )}
                                {comments.map((c) => (
                                    <div key={c.id} className="bg-container rounded-xl p-3 border border-b2 hover-lift">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-sm">{c.name}</span>
                                            <Rating value={c.rating} readOnly count={5} size="xs" />
                                        </div>
                                        <p className="text-sm opacity-70">{c.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'ticket' && (
                    <div className="max-w-2xl mx-auto glass-card rounded-3xl p-6 sm:p-8">
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <TextInput
                                    label="نام و نام خانوادگی"
                                    placeholder="نام خود را وارد کنید"
                                    value={tName}
                                    onChange={(e) => setTName(e.target.value)}
                                />
                                <TextInput
                                    label="شماره تماس"
                                    placeholder="09xxxxxxxxx"
                                    value={tPhone}
                                    onChange={(e) => setTPhone(e.target.value)}
                                    dir="ltr"
                                />
                            </div>
                            <TextInput
                                label="ایمیل (اختیاری)"
                                placeholder="example@email.com"
                                value={tEmail}
                                onChange={(e) => setTEmail(e.target.value)}
                                dir="ltr"
                            />
                            <TextInput
                                label="موضوع"
                                placeholder="موضوع تیکت"
                                value={tSubject}
                                onChange={(e) => setTSubject(e.target.value)}
                            />
                            <Select
                                label="دسته‌بندی"
                                value={tCategory}
                                onChange={setTCategory}
                                data={[
                                    { value: 'general', label: 'عمومی' },
                                    { value: 'support', label: 'پشتیبانی فنی' },
                                    { value: 'complaint', label: 'شکایت' },
                                    { value: 'suggestion', label: 'پیشنهاد' },
                                ]}
                            />
                            <Textarea
                                label="پیام"
                                placeholder="پیام خود را بنویسید..."
                                value={tMessage}
                                onChange={(e) => setTMessage(e.target.value)}
                                autosize
                                minRows={4}
                            />
                            <CustomButton loading={tLoading} onClick={submitTicket} shadow className="w-full sm:w-auto">
                                ثبت تیکت
                            </CustomButton>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FeedbackSection;
