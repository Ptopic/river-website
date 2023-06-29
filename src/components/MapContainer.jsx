import React from 'react';
import GoogleMapReact from 'google-map-react';
import LocationPin from './LocationPin';

import '../components/MapContainer.css';
function MapContainer({ location, zoomLevel, forwardedRef }) {
	// 43.535730841818115, 16.489338663433166
	const url = import.meta.env.VITE_API;
	console.log(url);

	return (
		<div className="map-container" ref={forwardedRef}>
			<GoogleMapReact
				bootstrapURLKeys={{ key: url }}
				defaultCenter={location}
				defaultZoom={zoomLevel}
			>
				<LocationPin
					lat={location.lat}
					lng={location.lng}
					text={location.address}
				/>
			</GoogleMapReact>
		</div>
	);
}

export default MapContainer;
