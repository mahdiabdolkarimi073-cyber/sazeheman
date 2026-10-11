// components/LeafletMap.tsx
"use client";

import {useEffect, useRef, useState} from "react";
import L, {MapOptions, TileLayerOptions} from "leaflet";
import "leaflet/dist/leaflet.css";
import ReadOnlyInput from "@/components/helper/ReadOnlyInput";

interface Spot {
    x: number;
    y: number;
    onClick: (lat: number, lng: number) => void;
    icon?: string; // optional custom icon URL
}

interface LeafletMapProps extends MapOptions {
    tileUrl?: string;
    tileOptions?: TileLayerOptions;
    style?: React.CSSProperties;
    spots?: Spot[]; // multiple spots
    onMapClick?: (lat: number, lng: number) => void;
    onViewportChange?: (centerLat: number, centerLng: number, zoom: number) => void;
    name?: string
    showSpot?: boolean
}

function LeafletMapInner({
                             center,
                             zoom = 13,
                             minZoom,
                             maxZoom,
                             zoomControl = true,
                             scrollWheelZoom = true,
                             tileUrl = "https://a.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6e5478c8a4f54c779f85573c0e399391",
                             tileOptions,
                             style = {width: "100%", minHeight: "100%"},
                             spots,
                             onMapClick,
                             onViewportChange,
                             name
                         }: LeafletMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [clicked, setClicked] = useState<number[]>()
    useEffect(() => {
        if (!mapRef.current) return;

        const map = L.map(mapRef.current, {
            center: center || (!!spots?.length ? [spots?.[0].x, spots?.[0].y]:[30,57]),
            zoom,
            minZoom,
            maxZoom,
            zoomControl,
            scrollWheelZoom,
        });

        L.tileLayer(tileUrl, {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> & Thunderforest',
            ...tileOptions,
        }).addTo(map);

        // Add multiple spots
        if (spots && spots.length > 0) {
            spots.forEach((spot) => {
                const markerOptions: L.MarkerOptions = {};
                spot.icon ||= "/icons/marker.svg"
                if (spot.icon) {
                    markerOptions.icon = L.icon({
                        iconUrl: spot.icon,
                        iconSize: [41, 41],
                        iconAnchor: [21, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                    });
                }
                const marker = L.marker([spot.x, spot.y], markerOptions).addTo(map);
                marker.on("click", () => spot.onClick(spot.x, spot.y));
            });
        }

        // Map click handler
        if (onMapClick) {
            map.on("click", (e: L.LeafletMouseEvent) => {
                onMapClick(e.latlng.lat, e.latlng.lng);
                setClicked([e.latlng.lat, e.latlng.lng]);
            });
        }

        // Viewport change handler
        if (onViewportChange) {
            map.on("moveend zoomend", () => {
                const c = map.getCenter();
                onViewportChange(c.lat, c.lng, map.getZoom());
            });
        }

        return () => {
            map.remove();
        };
    }, [
        center,
        zoom,
        minZoom,
        maxZoom,
        zoomControl,
        scrollWheelZoom,
        tileUrl,
        tileOptions,
        spots,
        onMapClick,
        onViewportChange,
    ]);

    return (
        <>
            <div ref={mapRef} style={style}/>
            {name && (
                <ReadOnlyInput name={name} value={(clicked)?.join(",")}/>
            )}
        </>
    );
}

// Wrap for direct import
export default function LeafletMap(props: LeafletMapProps) {
    return <LeafletMapInner {...props} />;
}
