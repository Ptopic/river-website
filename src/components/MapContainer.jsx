import React from 'react';
import GoogleMapReact from 'google-map-react';
import LocationPin from './LocationPin';

function MapContainer({ location, zoomLevel }) {
	// 43.535730841818115, 16.489338663433166
	const url = import.meta.env.VITE_API;
	console.log(url);

	return (
		<div style={{ height: '70dvh', width: '100%', padding: '5rem 0rem' }}>
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
