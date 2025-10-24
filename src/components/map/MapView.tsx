'use client';

import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  center?: LatLngExpression;
  zoom?: number;
  onMoveEnd?: (bounds: {
    neLat: number;
    neLng: number;
    swLat: number;
    swLng: number;
  }) => void;
  children?: React.ReactNode;
}

function MapEventHandler({ onMoveEnd }: { onMoveEnd?: MapViewProps['onMoveEnd'] }) {
  const map = useMapEvents({
    moveend: () => {
      if (onMoveEnd) {
        const bounds = map.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        onMoveEnd({
          neLat: ne.lat,
          neLng: ne.lng,
          swLat: sw.lat,
          swLng: sw.lng,
        });
      }
    },
  });

  return null;
}

export function MapView({ center, zoom = 15, onMoveEnd, children }: MapViewProps) {
  const defaultCenter: LatLngExpression = center || [35.6812, 139.7671]; // 東京駅

  return (
    <MapContainer
      center={defaultCenter}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEventHandler onMoveEnd={onMoveEnd} />
      {children}
    </MapContainer>
  );
}
