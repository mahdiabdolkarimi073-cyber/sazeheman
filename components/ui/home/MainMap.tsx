'use client'

import React, {useEffect, useMemo, useState} from 'react';
import {Button, Select, TextInput} from "@mantine/core";
import useApi from "@/lib/hooks/useApi";
import {usePromise} from "@/lib/hooks/usePromise";
import {getCities, getStates} from "@/components/ui/home/action";
import LeafletMap from "@/components/map/leaflet";
import GlassBox from "@/app/(landing)/dashboard/_components/GlassBox";
import CustomButton from "@/components/ui/base/CustomButton";
import CustomBadge from "@/components/ui/base/CustomBadge";

const spots = [
    { type: "creator", title: "درب پنجره سازی", category: "ساخت ساز", location: [30.215168441926757, 57.08496093750001], user: "شرکت آیرنیک" },
    { type: "worker", title: "بتن سازی", category: "ساخت ساز", location: [30.315168441926757, 57.08496093750001], user: "شرکت ایساکو" },
    { type: "worker", title: "نقاشی ساختمان", category: "تکمیل ساختمان", location: [30.225168441926757, 57.09496093750001], user: "احمد رضایی" },
    { type: "creator", title: "کاشی کاری و سرامیک", category: "تکمیل ساختمان", location: [30.235168441926757, 57.07496093750001], user: "شرکت کاشی پارس" },
    { type: "worker", title: "لوله کشی و تاسیسات", category: "تاسیسات", location: [30.245168441926757, 57.08996093750001], user: "علی محمدی" },
    { type: "creator", title: "برق کشی ساختمان", category: "تاسیسات", location: [30.205168441926757, 57.08296093750001], user: "شرکت برق صنعت" },
    { type: "worker", title: "نجاری و کابینت سازی", category: "دکوراسیون", location: [30.255168441926757, 57.08796093750001], user: "حسین کریمی" },
    { type: "creator", title: "سنگ کاری و نما", category: "نما", location: [30.265168441926757, 57.08396093750001], user: "شرکت سنگ رخام" },
    { type: "worker", title: "گچ کاری و سقف کاذب", category: "تکمیل ساختمان", location: [30.195168441926757, 57.09096093750001], user: "مهدی احمدی" },
    { type: "creator", title: "آهنگری و حفاظ", category: "ساخت ساز", location: [30.275168441926757, 57.07896093750001], user: "شرکت فلز کار" },
    { type: "worker", title: "عایق کاری", category: "تاسیسات", location: [30.285168441926757, 57.08596093750001], user: "رضا موسوی" },
    { type: "creator", title: "سیستم گرمایش و سرمایش", category: "تاسیسات", location: [30.220168441926757, 57.09296093750001], user: "شرکت کولر سازان" },
    { type: "worker", title: "کف سازی و پارکت", category: "تکمیل ساختمان", location: [30.230168441926757, 57.07696093750001], user: "سعید حسینی" },
    { type: "creator", title: "سقف شیروانی", category: "سقف و پوشش", location: [30.240168441926757, 57.08896093750001], user: "شرکت پوشش بام" },
    { type: "worker", title: "جوشکاری صنعتی", category: "ساخت ساز", location: [30.250168441926757, 57.08196093750001], user: "جواد اکبری" },
    { type: "creator", title: "شیشه بری و آینه کاری", category: "دکوراسیون", location: [30.260168441926757, 57.09396093750001], user: "شرکت شیشه سازان" },
    { type: "worker", title: "سنگ فرش و جدول", category: "محوطه سازی", location: [30.270168441926757, 57.07996093750001], user: "محمد رحیمی" },
    { type: "creator", title: "آسانسور و بالابر", category: "تاسیسات", location: [30.280168441926757, 57.08696093750001], user: "شرکت آسانسور پارس" },
    { type: "worker", title: "باغبانی و فضای سبز", category: "محوطه سازی", location: [30.210168441926757, 57.09196093750001], user: "علیرضا نوری" },
    { type: "creator", title: "سیستم اعلام حریق", category: "ایمنی", location: [30.290168441926757, 57.07796093750001], user: "شرکت ایمن سازان" },
    { type: "worker", title: "دوربین مداربسته", category: "امنیت", location: [30.300168441926757, 57.08496093750001], user: "حمید عباسی" },
    { type: "creator", title: "استخر سازی", category: "محوطه سازی", location: [30.310168441926757, 57.09096093750001], user: "شرکت استخر سازان" },
    { type: "worker", title: "کاغذ دیواری", category: "دکوراسیون", location: [30.320168441926757, 57.08296093750001], user: "فاطمه زارعی" }
];

function MainMap(props: any) {
    const {
        loading,
        result: states = []
    } = usePromise(() => getStates());
    const [stateId, setStateId] = useState<string | null>(null);
    const {loading: l1, result: cities = []} = usePromise(() => getCities(stateId!), stateId ? stateId : false);
    const [cityId, setCityId] = useState<string | null>(null);
    const city = useMemo(() => {
        return cities.find(o => o.id + "" === cityId);
    }, [cityId, cities]);
    const [mapInit, setMapInit] = useState({
        zoom: 6,
        center: [32.126779400891536, 53.70117187500001]
    });
    const C = useMemo(() => (
        <LeafletMap
            zoom={mapInit.zoom}
            center={mapInit.center as any}
            onMapClick={(x, y) => { alert(`${x},${y}`) }}
            spots={spots.map(o => ({
                x: o.location[0],
                y: o.location[1],
                icon: "/icons/marker.svg",
                onClick: () => { alert(o.title) }
            }))}
        />
    ), [mapInit, spots]);

    useEffect(() => {
        if (!city) return;
        setMapInit(prev => ({ ...prev, center: [+city.latitude, +city.longitude], zoom: 10 }));
    }, [city]);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
            <div className="flex items-center gap-3 mb-6 px-2">
                <div className="w-1.5 h-8 rounded-full bg-primary" />
                <h2 className="text-xl sm:text-2xl font-bold">پروژه‌ها روی نقشه</h2>
            </div>
            <div className="glass-card rounded-3xl p-4 sm:p-6">
                <div className="flex flex-wrap justify-start items-stretch gap-5">
                    <div className="w-full lg:w-md flex flex-col">
                        <TextInput
                            label="جستجو"
                            className="mb-4"
                            placeholder="جستجوی دسته بندی، نام شرکت..."
                        />
                        <div className="overflow-auto grow min-h-90" style={{ height: 0 }}>
                            <div className="flex flex-col items-start gap-3">
                                {spots.map((spot, idx) => (
                                    <div key={idx} className="w-full p-4 rounded-2xl bg-container border border-b2 hover-lift cursor-pointer">
                                        <div className="flex justify-between items-start mb-3 gap-3">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg mb-1 leading-tight">{spot.title}</h3>
                                                <div className="flex items-center gap-2 text-sm opacity-70">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                                                    </svg>
                                                    <p className="font-medium">{spot.user}</p>
                                                </div>
                                            </div>
                                            <CustomBadge className="px-3 py-1 rounded-full text-xs font-semibold"
                                                color={spot.type === "creator" ? "var(--primary)" : "var(--secondary)"}>
                                                {spot.type === "creator" ? "سازنده" : "کارگر"}
                                            </CustomBadge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <CustomBadge color="rgb(from var(--primary) r g b / 0.8)">
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5 opacity-70" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
                                                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
                                                    </svg>
                                                    <p className="font-semibold text-sm" style={{ color: "var(--primary)" }}>{spot.category}</p>
                                                </div>
                                            </CustomBadge>
                                            <Button
                                                onClick={() => setMapInit(prev => ({ ...prev, center: spot.location, zoom: 15 }))}
                                                className="flex items-center gap-1 text-xs text-gray-500"
                                                rightSection={
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                                                    </svg>
                                                }
                                                size="xs"
                                            >
                                                <span className="font-medium">مشاهده</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="grow">
                        <div className="flex items-center justify-center gap-3 py-5">
                            <Select
                                disabled={loading}
                                label="انتخاب استان"
                                onChange={setStateId}
                                searchable
                                allowDeselect={false}
                                data={states.map(o => ({ value: o.id + "", label: o.name }))}
                            />
                            <Select
                                disabled={!stateId || l1}
                                label="انتخاب شهر"
                                searchable
                                allowDeselect={false}
                                onChange={setCityId}
                                data={cities?.map(o => ({ label: o.name, value: o.id + "" })) || []}
                            />
                        </div>
                        <div className="relative z-0 min-h-150 flex items-stretch justify-stretch rounded-2xl overflow-hidden border border-b2">
                            {C}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainMap;
