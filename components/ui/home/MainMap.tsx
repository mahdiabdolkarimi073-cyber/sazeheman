'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Select, TextInput } from '@mantine/core';
import { usePromise } from '@/lib/hooks/usePromise';
import { getCities, getStates } from '@/components/ui/home/action';
import LeafletMap from '@/components/map/leaflet';

const spots = [
    { type: 'creator', title: 'درب و پنجره‌سازی', category: 'ساخت‌وساز', location: [30.215, 57.084], user: 'شرکت آیرنیک' },
    { type: 'worker', title: 'بتن‌سازی', category: 'ساخت‌وساز', location: [30.315, 57.084], user: 'شرکت ایساکو' },
    { type: 'worker', title: 'نقاشی ساختمان', category: 'تکمیل ساختمان', location: [30.225, 57.094], user: 'احمد رضایی' },
    { type: 'creator', title: 'کاشی‌کاری و سرامیک', category: 'تکمیل ساختمان', location: [30.235, 57.074], user: 'شرکت کاشی پارس' },
    { type: 'worker', title: 'لوله‌کشی و تأسیسات', category: 'تأسیسات', location: [30.245, 57.089], user: 'علی محمدی' },
    { type: 'creator', title: 'برق‌کشی ساختمان', category: 'تأسیسات', location: [30.205, 57.082], user: 'شرکت برق صنعت' },
    { type: 'worker', title: 'نجاری و کابینت‌سازی', category: 'دکوراسیون', location: [30.255, 57.087], user: 'حسین کریمی' },
    { type: 'creator', title: 'سنگ‌کاری و نما', category: 'نما', location: [30.265, 57.083], user: 'شرکت سنگ رخام' },
];

type Spot = typeof spots[number];

function MainMap() {
    const { loading, result: states = [] } = usePromise(() => getStates());
    const [stateId, setStateId] = useState<string | null>(null);
    const { loading: citiesLoading, result: cities = [] } = usePromise(() => getCities(stateId!), stateId ? stateId : false);
    const [cityId, setCityId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
    const city = useMemo(() => cities.find((item) => item.id + '' === cityId), [cityId, cities]);
    const filteredSpots = useMemo(() => {
        const query = search.trim().toLocaleLowerCase();
        if (!query) return spots;
        return spots.filter((spot) => `${spot.title} ${spot.category} ${spot.user}`.toLocaleLowerCase().includes(query));
    }, [search]);
    const [mapInit, setMapInit] = useState({ zoom: 6, center: [32.126, 53.701] });

    useEffect(() => {
        if (city) setMapInit((previous) => ({ ...previous, center: [+city.latitude, +city.longitude], zoom: 10 }));
    }, [city]);

    const map = useMemo(() => (
        <LeafletMap zoom={mapInit.zoom} center={mapInit.center as [number, number]} onMapClick={() => undefined} spots={filteredSpots.map((spot) => ({
            x: spot.location[0], y: spot.location[1], icon: '/icons/marker.svg', onClick: () => setSelectedSpot(spot),
        }))} />
    ), [filteredSpots, mapInit]);

    return (
        <section className="w-full bg-[#f7f8f6] border-y border-[#e5ebe6] py-20" aria-labelledby="map-title">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                    <div>
                        <span className="text-sm font-bold text-primary">کشف خدمات نزدیک شما</span>
                        <h2 id="map-title" className="text-2xl sm:text-3xl font-bold mt-2 text-[#252c2a]">متخصصان تأییدشده روی نقشه</h2>
                        <p className="text-base text-[#6b7771] mt-2 leading-relaxed">فهرست نمایشی برای آشنایی با تجربه جست‌وجوی سازه‌همان؛ داده‌های زنده پس از اتصال backend نمایش داده می‌شوند.</p>
                    </div>
                    <span className="shrink-0 text-sm px-3 py-2 rounded-lg bg-white text-[#6b7771] border border-[#e5ebe6]">داده نمایشی</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,390px)_1fr] gap-5 bg-white border border-[#e5ebe6] rounded-2xl p-4 sm:p-5 shadow-[0_12px_35px_rgba(23,61,53,0.08)]">
                    <div className="flex flex-col min-h-0">
                        <TextInput label="جست‌وجو در متخصصان" value={search} onChange={(event) => setSearch(event.currentTarget.value)} placeholder="نام شرکت، خدمت یا تخصص..." size="md" className="mb-4" />
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <p className="text-sm text-[#6b7771]">{filteredSpots.length.toLocaleString('fa')} متخصص نمایشی</p>
                        </div>
                        <div className="max-h-[520px] overflow-y-auto pl-1 flex flex-col gap-3">
                            {filteredSpots.length === 0 && <p className="text-sm text-[#6b7771] text-center py-10">موردی با این جست‌وجو پیدا نشد.</p>}
                            {filteredSpots.map((spot) => {
                                const selected = selectedSpot?.title === spot.title;
                                return <button type="button" key={spot.title} onClick={() => { setSelectedSpot(spot); setMapInit((previous) => ({ ...previous, center: spot.location, zoom: 15 })); }} className={`w-full text-right p-4 rounded-xl border transition-colors ${selected ? 'border-primary bg-[#e7f5ee]' : 'border-[#e5ebe6] bg-white hover:border-primary/50'}`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-bold text-base text-[#252c2a]">{spot.title}</h3>
                                            <p className="text-sm text-[#6b7771] mt-1">{spot.user}</p>
                                        </div>
                                        <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-primary"><span className="w-2 h-2 rounded-full bg-primary" /> تأییدشده</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-sm font-medium text-primary">{spot.category}</span>
                                        <span className="text-xs text-[#6b7771]">نمایش روی نقشه ←</span>
                                    </div>
                                </button>;
                            })}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Select className="flex-1" label="استان" placeholder="انتخاب استان" disabled={loading} onChange={setStateId} searchable allowDeselect={false} data={states.map((item) => ({ value: item.id + '', label: item.name }))} />
                            <Select className="flex-1" label="شهر" placeholder="انتخاب شهر" disabled={!stateId || citiesLoading} onChange={setCityId} searchable allowDeselect={false} data={cities.map((item) => ({ label: item.name, value: item.id + '' }))} />
                        </div>
                        <div className="relative z-0 min-h-[430px] lg:min-h-[520px] flex items-stretch rounded-xl overflow-hidden border border-[#e5ebe6]">{map}</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MainMap;
