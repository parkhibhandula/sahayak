import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// fix default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface Location {
  id: number | string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  tags: string[];
}

interface Props {
  locations: Location[];
  center: [number, number];
}

// 🎨 color system
const getColor = (tags: string[]) => {
  const t = tags.join(" ");
  if (t.includes("yes")) return "green";
  if (t.includes("limited")) return "orange";
  return "red";
};

const createIcon = (color: string) =>
  new L.Icon({
    iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
    iconSize: [32, 32],
  });

// 📍 recenter
const Recenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [center]);

  return null;
};

// 📍 marker cluster
const ClusterLayer = ({ locations }: { locations: Location[] }) => {
  const map = useMap();

  useEffect(() => {
    const group = L.markerClusterGroup();

    locations.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lng], {
        icon: createIcon(getColor(loc.tags)),
      });

      marker.bindPopup(`
        <b>${loc.name}</b><br/>
        ${loc.type}<br/>
        ${loc.tags.join(", ")}
      `);

      group.addLayer(marker);
    });

    map.addLayer(group);

    return () => {
      map.removeLayer(group);
    };
  }, [locations]);

  return null;
};

export const MapView = ({ locations, center }: Props) => {
  return (
    <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Recenter center={center} />
      <ClusterLayer locations={locations} />
    </MapContainer>
  );
};