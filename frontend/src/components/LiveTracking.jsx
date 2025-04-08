import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState({
    lat: 0,
    lng: 0,
  });

  // Update the map's center dynamically
  const MapUpdater = ({ position }) => {
    const map = useMap();
    useEffect(() => {
      if (position.lat !== 0 && position.lng !== 0) {
        map.setView(position, map.getZoom());
      }
    }, [position, map]);
    return null;
  };

  useEffect(() => {
    // Get the user's current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );

    // Watch for position updates
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error watching location:", error);
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <MapContainer
  center={currentPosition}
  zoom={15}
  style={{ height: "100%", width: "100%", zIndex: 0, position: "relative" }}
>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {currentPosition.lat !== 0 && currentPosition.lng !== 0 && (
        <Marker position={currentPosition} />
      )}
      <MapUpdater position={currentPosition} />
    </MapContainer>
  );
};

export default LiveTracking;