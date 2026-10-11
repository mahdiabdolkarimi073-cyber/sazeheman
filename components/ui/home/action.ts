'use server';

export async function getStates() {
    return fetch("https://iran-locations-api.ir/api/v1/fa/states")
        .then(res => res.json())
        .then(res => res as {
            name: string
            center: string
            latitude: string
            longitude: string
            landlinePrefix: string
            carLicencePlates: Array<string>
            id: number
        }[])
}

export async function getCities(id: string) {
    return fetch("https://iran-locations-api.ir/api/v1/fa/cities?state_id="+id)
        .then(res => res.json())
        .then(res => res as {
            name: string
            latitude: string
            longitude: string,
            id: number
        }[])
}