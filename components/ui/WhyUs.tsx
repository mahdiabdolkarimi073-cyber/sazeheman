'use client';

import React, {useState} from "react";
import Image from "next/image";
import {IconlyCoinswap, IconlyLock, Iconlyuser, IconlyWalletdoublle} from "../assets/iconpack";

export default function WhyUs() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "ثبت پروژه در ۵ دقیقه",
      description: "بدون نیاز به پیچیدگی فنی؛ فقط پروژه خودت را ثبت کن و با چند کلیک ساده اطلاعات و نیازهای ساختمان را مشخص کن.",
      icon: <IconlyCoinswap size={32} />,
      image: "/pics/Goal.png",
    },
    {
      title: "ارتباط امن با ارائه‌دهندگان",
      description: "تمامی درخواست‌ها و پیام‌ها به صورت امن ارسال می‌شوند تا با پیمانکاران و مهندسین بدون نگرانی ارتباط برقرار کنید.",
      icon: <IconlyLock size={32} />,
      image: "/pics/verify.webp",
    },
    {
      title: "نمایش ویژه روی نقشه",
      description: "هر پروژه یک لینک اختصاصی و نمایش روی نقشه دارد تا پیمانکاران و فروشندگان مصالح به راحتی پروژه شما را پیدا کنند.",
      icon: <Iconlyuser size={32} />,
      image: "/pics/Shop.png",
    },
    {
      title: "پیگیری سریع پروژه‌ها",
      description: "وضعیت پروژه‌ها و درخواست‌های ارسال‌شده را لحظه‌ای پیگیری کنید و با گزارش دقیق، تصمیمات بهتری بگیرید.",
      icon: <IconlyWalletdoublle size={32} />,
      image: "/pics/Convert.png",
    }
  ];

  return (
    <div className="relative py-20 bg-background">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }} />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-dark text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            چرا سازه من؟
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">
            چرا سازه من بهترین گزینه است؟
          </h2>
          <p className="text-base opacity-60 max-w-2xl mx-auto">
            با امکانات متنوع و تجربه کاربری ساده، سازه من بهترین پلتفرم برای مدیریت پروژه‌های ساختمانی شماست
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          {/* Left - Image Preview */}
          <div className="relative">
            <div className="glass-card rounded-3xl p-8 overflow-hidden">
              <div className="relative w-full h-96 flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl opacity-20"
                  style={{ background: "radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 70%)" }} />
                <Image
                  src={features[activeFeature].image}
                  alt="Feature preview"
                  width={500}
                  height={500}
                  className="object-contain rounded-xl relative z-10 transition-all duration-500"
                  style={{ maxWidth: "400px" }}
                />
              </div>
            </div>
          </div>

          {/* Right - Features List */}
          <div className="flex flex-col gap-3">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`cursor-pointer transition-all duration-300 rounded-2xl p-5 border ${
                  activeFeature === index
                    ? 'border-primary/30 bg-primary/5 shadow-[0_8px_30px_rgba(93,212,168,0.1)]'
                    : 'border-b2 bg-container hover:border-primary/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    activeFeature === index
                      ? 'bg-primary text-white scale-110'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                      activeFeature === index ? 'text-primary-dark' : 'opacity-80'
                    }`}>
                      {feature.title}
                    </p>
                    {activeFeature === index && (
                      <p className="opacity-70 leading-relaxed text-sm animate-fade-in-up">
                        {feature.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4" style={{ scrollbarWidth: 'none' }}>
            {features.map((feature, index) => (
              <div key={index} className="flex-shrink-0 snap-start w-[85%]">
                <div className="glass-card rounded-3xl overflow-hidden h-full hover-lift">
                  <div className="relative h-48 flex items-center justify-center bg-gradient-to-br from-primary/10 to-transparent">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={300}
                      height={300}
                      className="w-full h-full object-contain p-6"
                      unoptimized
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <p className="text-lg font-bold text-primary-dark">{feature.title}</p>
                    </div>
                    <p className="opacity-70 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
