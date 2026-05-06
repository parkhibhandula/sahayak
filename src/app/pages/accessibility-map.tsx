import { useState, useEffect } from "react";
import { MapView } from "../components/map/AccessibilityMapView";

export interface Location {
  id: number | string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  tags: string[];
  isUserAdded?: boolean;
}

export function AccessibilityMap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customTag, setCustomTag] = useState(""); // ⭐ NEW
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    28.6139, 77.209,
  ]);

  const [locations, setLocations] = useState<Location[]>([]);
  const [userLocations, setUserLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("user_locations");
    if (saved) setUserLocations(JSON.parse(saved));
  }, []);

  // 🔍 SEARCH PLACES
  const searchPlaces = async () => {
    try {
      setLoading(true);
      setError("");

      const geo = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      );
      const geoData = await geo.json();

      if (!geoData.length) {
        setError("Location not found");
        return;
      }

      const lat = parseFloat(geoData[0].lat);
      const lon = parseFloat(geoData[0].lon);

      setMapCenter([lat, lon]);

      const query = `
        [out:json];
        (
          node["wheelchair"](around:3000,${lat},${lon});
        );
        out;
      `;

      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });

      const data = await res.json();

      const formatted: Location[] = data.elements.map((el: any, i: number) => ({
        id: el.id || i,
        name: el.tags?.name || "Unnamed Place",
        type: el.tags?.amenity || "place",
        lat: el.lat,
        lng: el.lon,
        tags: [el.tags?.wheelchair || "unknown"],
      }));

      setLocations(formatted);
    } catch (e) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ ADD CUSTOM TAG
  const addCustomTag = () => {
    if (!customTag.trim()) return;

    const newLoc: Location = {
      id: Date.now(),
      name: "Custom Tagged Place",
      type: "custom",
      lat: mapCenter[0],
      lng: mapCenter[1],
      tags: [customTag],
      isUserAdded: true,
    };

    const updated = [...userLocations, newLoc];
    setUserLocations(updated);
    localStorage.setItem("user_locations", JSON.stringify(updated));

    setCustomTag("");
  };

  const allLocations = [...locations, ...userLocations];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* SIDEBAR */}
      <div
  style={{
    width: 320,
    height: "100vh",
    padding: 20,
    background: "#ffffff",
    position: "sticky",
    top: 0,
    overflowY: "auto",
    borderRight: "1px solid #eee",
  }}
>
        <h3>Accessibility Map</h3>

        {/* SEARCH */}
        <input
          placeholder="Search place..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />

        <button
          onClick={searchPlaces}
          style={{ width: "100%", marginTop: 10, padding: 8 }}
        >
          {loading ? "Loading..." : "Search"}
        </button>

        {/* ⭐ CUSTOM TAG INPUT */}
        <input
          placeholder="Add accessibility tag (e.g. ramp, toilet)"
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          style={{
            width: "100%",
            marginTop: 15,
            padding: 8,
          }}
        />

        <button
          onClick={addCustomTag}
          style={{ width: "100%", marginTop: 8, padding: 8 }}
        >
          Add Tag
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* 📍 SEARCH RESULTS LIST */}
        <div style={{ marginTop: 20 }}>
          <h4>Places Found</h4>

          {allLocations.length === 0 && <p>No places</p>}

          {allLocations.map((loc) => (
            <div
              key={loc.id}
              style={{
                padding: 8,
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
              onClick={() => setMapCenter([loc.lat, loc.lng])}
            >
              <strong>{loc.name}</strong>
              <br />
              <small>{loc.type}</small>
            </div>
          ))}
        </div>
      </div>

      {/* MAP */}
      <div style={{ flex: 1 }}>
        <MapView locations={allLocations} center={mapCenter} />
      </div>
    </div>
  );
}