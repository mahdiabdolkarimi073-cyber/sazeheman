'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PinInput, Loader } from '@mantine/core';
import Link from 'next/link';
import { adminSendCode, adminVerifyCode } from './action';
import { optimizeForm } from '@/lib/utils/global';

function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState('');

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const json = optimizeForm(e).toJson();

    if (!json.phone || String(json.phone).length < 10) {
      setError('شماره تلفن معتبر نیست');
      return;
    }

    setError('');
    setLoading(true);
    setPhone(String(json.phone));

    const res = await adminSendCode(String(json.phone));

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    if (res.dev_code) setDevCode(res.dev_code);
    setStep('code');
    setLoading(false);
  };

  const handleCodeVerify = async () => {
    if (code.length !== 6) return;

    setError('');
    setLoading(true);

    const res = await adminVerifyCode(phone, code);

    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }

    router.push('/admin');
  };

  return (
    <div className="w-full">
      {/* Logo & title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#36B98A]/15 mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#36B98A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L4 6v6c0 5 3.5 9 8 10c4.5-1 8-5 8-10V6L12 2z" />
            <path d="M9 12l2 2l4-4" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          ورود به پنل مدیریت
        </h1>
        <p className="text-sm text-gray-400">
          دسترسی تنها برای حساب‌های مدیریتی مجاز است
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Step 1: Phone */}
      {step === 'phone' && (
        <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300 text-right">
              شماره تلفن مدیر
            </label>
            <input
              type="tel"
              name="phone"
              dir="ltr"
              required
              placeholder="09xxxxxxxxx"
              className="w-full rounded-xl border border-white/15 bg-[#161A21] px-4 py-3 text-left text-white placeholder-gray-500 outline-none transition-colors focus:border-[#36B98A] min-h-12"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#36B98A] py-3 text-center font-medium text-white transition-colors hover:bg-[#2da576] disabled:opacity-60 min-h-12 flex items-center justify-center gap-2"
          >
            {loading && <Loader size="sm" color="white" />}
            ارسال کد تایید
          </button>
        </form>
      )}

      {/* Step 2: Code */}
      {step === 'code' && (
        <div className="flex flex-col gap-5">
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-2">
              کد تایید برای شماره زیر ارسال شد:
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#161A21] px-3 py-1.5">
              <span className="text-sm text-[#36B98A] font-medium" dir="ltr">{phone}</span>
              <button
                onClick={() => { setStep('phone'); setCode(''); setError(''); }}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                تغییر
              </button>
            </div>
            {devCode && (
              <p className="mt-2 text-xs text-amber-400">
                حالت توسعه — کد: <span dir="ltr" className="font-bold">{devCode}</span>
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <PinInput
              length={6}
              value={code}
              onChange={setCode}
              type="number"
              autoFocus
              size="md"
              radius="md"
              placeholder=""
              classNames={{ pinInput: "w-full!" }}
            />
          </div>

          <button
            onClick={handleCodeVerify}
            disabled={loading || code.length !== 6}
            className="w-full rounded-xl bg-[#36B98A] py-3 text-center font-medium text-white transition-colors hover:bg-[#2da576] disabled:opacity-60 min-h-12 flex items-center justify-center gap-2"
          >
            {loading ? <Loader size="sm" color="white" /> : 'تایید و ورود'}
          </button>

          <button
            onClick={() => { setStep('phone'); setCode(''); setError(''); }}
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors text-center"
          >
            بازگشت
          </button>
        </div>
      )}

      {/* Footer link */}
      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}

export default AdminLoginPage;
