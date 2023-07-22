import React from 'react';
import GoogleMapReact from 'google-map-react';
import LocationPin from './LocationPin';
import { motion as m } from 'framer-motion';

import '../components/MapContainer.css';
function MapContainer({ location, zoomLevel }) {
	// 43.535730841818115, 16.489338663433166
	const url = import.meta.env.VITE_API;
	console.log(url);
	const leftAnimation = {
		visible: { x: 0, opacity: 1 },
		hidden: { x: -250, opacity: 0 },
	};
	return (
		<m.div
			className="map-container"
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true }}
			variants={leftAnimation}
			transition={{
				type: 'spring',
				stiffness: 660,
				damping: 100,
				delay: 0.2,
			}}
		>
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
		</m.div>
	);
}

export default MapContainer;
