import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from '@/utils/constants';
import { formatDateTime } from '@/utils';
import type { MapMarker } from '@/types';

const markerColors: Record<string, string> = {
  pipeline: '#2563EB',
  reservoir: '#22C55E',
  sensor: '#06B6D4',
  tank: '#8B5CF6',
  consumer: '#F59E0B',
  leak: '#EF4444',
};

const createIcon = (color: string) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

interface WaterMapProps {
  markers: MapMarker[];
  height?: string;
  className?: string;
}

export function WaterMap({ markers, height = '500px', className }: WaterMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" style={{ height }} />;
  }

  const pipelineCoords: [number, number][] = markers
    .filter((m) => m.type === 'sensor')
    .slice(0, 5)
    .map((m) => m.position);

  return (
    <div className={className} style={{ height }}>
      <MapContainer
        center={MAP_DEFAULT_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pipelineCoords.length > 1 && (
          <Polyline positions={pipelineCoords} color="#2563EB" weight={3} opacity={0.6} dashArray="8 4" />
        )}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={createIcon(markerColors[marker.type] ?? '#2563EB')}
          >
            <Popup>
              <div className="min-w-[180px] space-y-1 text-sm">
                <p className="font-semibold">{marker.label}</p>
                <p className="text-xs capitalize text-slate-500">{marker.type}</p>
                {marker.data && Object.entries(marker.data).map(([key, val]) => (
                  <div key={key} className="flex justify-between gap-4">
                    <span className="capitalize text-slate-500">{key}:</span>
                    <span className="font-medium">
                      {key === 'lastUpdated' ? formatDateTime(String(val)) : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </Popup>
          </Marker>
        ))}
        {markers.filter((m) => m.type === 'leak').map((marker) => (
          <CircleMarker
            key={`pulse-${marker.id}`}
            center={marker.position}
            radius={20}
            pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.1, weight: 1 }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
