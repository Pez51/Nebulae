import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Arreglo para el ícono de Leaflet que se rompe con Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ hotspots, onHotspotClick }) => {
  return (
    <div className="map-container">
      <MapContainer center={[-16.3989, -71.5375]} zoom={13} scrollWheelZoom={true}>
        {/* Usamos un tema de mapa oscuro para que coincida con la estética */}
        <TileLayer
          attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        {hotspots.map(hotspot => (
          <Marker
            key={hotspot.id}
            position={[hotspot.lat, hotspot.lon]}
            eventHandlers={{
              click: () => {
                onHotspotClick(hotspot);
              },
            }}
          >
            <Popup>
              <div>
                <h4>{hotspot.name}</h4>
                <p>Click para ver detalles y mintear NFT.</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;