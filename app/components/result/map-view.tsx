import { useEffect, useRef } from "react";

interface MapViewProps {
  latitude: number;
  longitude: number;
  title: string;
}

export function MapView({ latitude, longitude, title }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMap = async () => {
      if (!mapRef.current) return;

      const mod = await import("@googlemaps/js-api-loader");
      const { Loader: GoogleMapsLoader } = mod;

      const loader = new GoogleMapsLoader({
        apiKey: import.meta.env.VITE_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        version: "weekly",
      });

      loader.load().then((google) => {
        const map = new google.maps.Map(mapRef.current!, {
          center: { lat: latitude, lng: longitude },
          zoom: 15,
        });

        new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map,
          title,
        });
      });
    };
    loadMap();
  }, [latitude, longitude, title]);

  return (
    <div ref={mapRef} className="h-64 w-full rounded-lg mb-4"></div>
  );
} 