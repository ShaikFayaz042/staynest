import { useEffect, useRef, useContext, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ThemeContext } from "../../context/ThemeContext";

const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = token;

export default function MapboxMap({
  latitude = 20.5937,
  longitude = 78.9629,
  draggable = false,
  onDragEnd,
  zoom = 12,
  className = "w-full h-[360px] rounded-2xl",
  mapStyle,
  disableMapClickMove = false,
}) {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext?.theme || "light";
  const [mapThemeMode, setMapThemeMode] = useState("auto");
  const effectiveTheme = mapThemeMode === "auto" ? theme : mapThemeMode;
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const style = mapStyle || (effectiveTheme === "dark" ? "mapbox://styles/mapbox/dark-v10" : "mapbox://styles/mapbox/streets-v12");

  useEffect(() => {
    if (!mapContainer.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style,
      center: [longitude, latitude],
      zoom,
    });

    markerRef.current = new mapboxgl.Marker({ draggable, color: "#ff385c" })
      .setLngLat([longitude, latitude])
      .addTo(mapRef.current);

    const handleMapClick = (event) => {
      if (disableMapClickMove) {
        const currentPos = markerRef.current?.getLngLat();
        if (currentPos && mapRef.current) {
          mapRef.current.flyTo({ center: [currentPos.lng, currentPos.lat], essential: true });
        }
        return;
      }
      if (!draggable) return;
      const { lng, lat } = event.lngLat;
      markerRef.current?.setLngLat([lng, lat]);
      if (typeof onDragEnd === "function") {
        onDragEnd({ longitude: lng, latitude: lat });
      }
    };

    if (draggable && typeof onDragEnd === "function") {
      markerRef.current.on("dragend", () => {
        const lngLat = markerRef.current.getLngLat();
        onDragEnd({ longitude: lngLat.lng, latitude: lngLat.lat });
      });
    }

    mapRef.current.on("click", handleMapClick);
    mapRef.current.on("load", () => {
      mapRef.current.resize();
    });

    return () => {
      if (markerRef.current) markerRef.current.remove();
      if (mapRef.current) mapRef.current.remove();
    };
  }, [disableMapClickMove, draggable, onDragEnd, style, zoom, latitude, longitude]);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    markerRef.current.setLngLat([longitude, latitude]);
    mapRef.current.setCenter([longitude, latitude]);
  }, [latitude, longitude]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(style);
  }, [style]);

  const nextTheme = effectiveTheme === "dark" ? "light" : "dark";
  const currentLabel = effectiveTheme === "dark" ? "Dark" : "Light";

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-2xl" />
      <button
        type="button"
        onClick={() => setMapThemeMode(nextTheme)}
        className="absolute top-3 right-3 z-20 inline-flex items-center rounded-full border border-gray-200 bg-white/90 px-3 py-1 text-[11px] font-semibold text-gray-900 shadow-sm backdrop-blur-sm transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/85 dark:text-white dark:hover:bg-gray-800"
      >
        {currentLabel}
      </button>
    </div>
  );
}
