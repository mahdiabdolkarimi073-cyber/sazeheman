'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Select, TextInput } from '@mantine/core';
import { usePromise } from '@/lib/hooks/usePromise';
import { getCities, getStates } from '@/components/ui/home/action';
import LeafletMap from '@/components/map/leaflet';
import { api } from '@/lib/api/base';

type ServerProject = {
    id: string;
    project_name: string;
    builder_name: string;
    description: string | null;
    address: string | null;
    city: string | null;
    location_lat: number | null;
    location_lng: number | null;
    photo_url: string | null;
    status: string;
};

type Spot = {
    id: string;
    type: 'project';
    title: string;
    category: string;
    user: string;
    location: [number, number];
    description?: string | null;
    address?: string | null;
    city?: string | null;
};

function MainMap() {
    const { loading, result: states = [] } = usePromise(() => getStates());
    const [stateId, setStateId] = useState<string | null>(null);
    const { loading: citiesLoading, result: cities = [] } = usePromise(() => getCities(stateId!), stateId ? stateId : false);
    const [cityId, setCityId] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
    const [projects, setProjects] = useState<ServerProject[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const city = useMemo(() => cities.find((item) => item.id + '' === cityId), [cityId, cities]);

    useEffect(() => {
        setProjectsLoading(true);
        api('/construction/projects', {status: 'approved'}, 'GET')
            .then((res) => setProjects(res.data?.projects || []))
            .catch(() => setProjects([]))
            .finally(() => setProjectsLoading(false));
    }, []);

    const spots: Spot[] = useMemo(() => {
        return projects
            .filter((p) => p.location_lat != null && p.location_lng != null)
            .map((p) => ({
                id: p.id,
                type: 'project' as const,
                title: p.project_name,
                category: p.city || 'ساخت‌وساز',
                user: p.builder_name,
                location: [p.location_lat!, p.location_lng!],
                description: p.description,
                address: p.address,
                city: p.city,
            }));
    }, [projects]);

    const filteredSpots = useMemo(() => {
        const query = search.trim().toLocaleLowerCase();
        if (!query) return spots;
        return spots.filter((spot) => `${spot.title} ${spot.category} ${spot.user}`.toLocaleLowerCase().includes(query));
    }, [search, spots]);

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
        <section className="w-full bg-[#f7f8f6] border-y border-[#e5ebe6] py-16 lg:py-20" aria-labelledby="map-title">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                    <div>
                        <span className="text-sm font-bold text-[#36B98A]">کشف خدمات نزدیک شما</span>
                        <h2 id="map-title" className="text-xl sm:text-2xl lg:text-3xl font-bold mt-2 text-[#252C2A]">پروژه‌های تأییدشده روی نقشه</h2>
                        <p className="text-base text-[#6b7771] mt-2 leading-relaxed">پروژه‌های ساختمانی تأییدشده توسط مدیر سامانه روی نقشه نمایش داده می‌شوند.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,390px)_1fr] gap-5 bg-white border border-[#e5ebe6] rounded-2xl p-4 sm:p-5 shadow-[0_12px_35px_rgba(23,61,53,0.08)]">
                    <div className="flex flex-col min-h-0">
                        <TextInput label="جست‌وجو در پروژه‌ها" value={search} onChange={(event) => setSearch(event.currentTarget.value)} placeholder="نام پروژه، سازنده یا شهر..." size="md" className="mb-4" />
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-2 w-2 rounded-full bg-[#36B98A]" />
                            <p className="text-sm text-[#6B7771]">{filteredSpots.length.toLocaleString('fa')} پروژه تأییدشده</p>
                        </div>
                        <div className="max-h-[520px] overflow-y-auto pl-1 flex flex-col gap-3">
                            {projectsLoading && <p className="text-sm text-[#6b7771] text-center py-10">در حال بارگذاری پروژه‌ها...</p>}
                            {!projectsLoading && filteredSpots.length === 0 && <p className="text-sm text-[#6b7771] text-center py-10">پروژه‌ای یافت نشد.</p>}
                            {filteredSpots.map((spot) => {
                                const selected = selectedSpot?.id === spot.id;
                                return <button type="button" key={spot.id} onClick={() => { setSelectedSpot(spot); setMapInit((previous) => ({ ...previous, center: spot.location, zoom: 15 })); }} className={`w-full text-right p-4 rounded-xl border transition-colors ${selected ? 'border-[#36B98A] bg-[#E7F5EE]' : 'border-[#e5ebe6] bg-white hover:border-[#36B98A]/50'}`}>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-bold text-base text-[#252c2a]">{spot.title}</h3>
                                            <p className="text-sm text-[#6b7771] mt-1">{spot.user}</p>
                                        </div>
                                        <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-[#36B98A]"><span className="w-2 h-2 rounded-full bg-[#36B98A]" /> تأییدشده</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-sm font-medium text-[#36B98A]">{spot.category}</span>
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
                        {selectedSpot && (
                            <div className="rounded-xl border border-[#e5ebe6] bg-[#f7f8f6] p-4 flex flex-col gap-1">
                                <h3 className="font-bold text-base text-[#252c2a]">{selectedSpot.title}</h3>
                                <p className="text-sm text-[#6b7771]">سازنده: {selectedSpot.user}</p>
                                {selectedSpot.city && <p className="text-sm text-[#6b7771]">شهر: {selectedSpot.city}</p>}
                                {selectedSpot.address && <p className="text-sm text-[#6b7771]">آدرس: {selectedSpot.address}</p>}
                                {selectedSpot.description && <p className="text-sm text-[#6b7771]">{selectedSpot.description}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MainMap;
