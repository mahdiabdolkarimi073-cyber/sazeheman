'use client';

import React, {useMemo, useState} from 'react';
import LeafletMap from "@/components/map/leaflet";

function Page(props: any) {
    const [spot, setSpot] = useState<any[]>([])
    const [zoom, setZoom] = useState(13)
    const [center, setCenter] = useState([30.269223413076862,57.083759307861335] as const)
    const C = useMemo(()=>(
        <LeafletMap
            key={'MAP'}
            zoom={zoom}
            center={center || [30.269223413076862,57.083759307861335]}
            onMapClick={(lat,lng)=>{
                setSpot(prev => ([
                    ...prev,
                    {
                        x: lat,
                        y: lng,
                        onClick: ()=>{
                            alert(`${prev.length+1} clicked`)
                        }
                    }
                ]))
            }}
            spots={spot}
            onViewportChange={(lat,lng,z) => {
                alert(`center ${lat} ${lng}`)
                setCenter([lat, lng])
                setZoom(z)
            }}
        />
    ), [spot])
    return (
        <div>
            {C}
        </div>
    );
}

export default Page;