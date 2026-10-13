'use server';

export async function getStates() {
    try {
        const res = await fetch("https://iran-locations-api.ir/api/v1/fa/states", {
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data as {
            name: string
            center: string
            latitude: string
            longitude: string
            landlinePrefix: string
            carLicencePlates: Array<string>
            id: number
        }[];
    } catch (e) {
        console.error("[getStates] Failed to fetch states:", e instanceof Error ? e.message : e);
        return [];
    }
}

export async function getCities(id: string) {
    try {
        const res = await fetch("https://iran-locations-api.ir/api/v1/fa/cities?state_id=" + id, {
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data as {
            name: string
            latitude: string
            longitude: string,
            id: number
        }[];
    } catch (e) {
        console.error("[getCities] Failed to fetch cities:", e instanceof Error ? e.message : e);
        return [];
    }
}
