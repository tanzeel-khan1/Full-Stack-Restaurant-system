// import React from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// const MapComponent = () => {
//   const position = [24.8607, 67.0011]; // Karachi coordinates

//   return (
//     <MapContainer center={position} zoom={12} style={{ height: "400px", width: "100%" }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution="&copy; OpenStreetMap contributors"
//       />
//       <Marker position={position}>
//         <Popup>This is Karachi!</Popup>
//       </Marker>
//     </MapContainer>
//   );
// };

// export default MapComponent;
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HomeLocationMap = () => {
  // New York coordinates (example)
  const homeLocation = [40.7128, -74.0060];

  return (
    <MapContainer
      center={homeLocation}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={homeLocation}>
        <Popup>
          My Home – New York
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default HomeLocationMap;
