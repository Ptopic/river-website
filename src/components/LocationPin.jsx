import React from 'react';
import { FaMapPin } from 'react-icons/fa';

function LocationPin({ text }) {
	return (
		<div className="pin">
			<FaMapPin size={50} color="black" />
			<p className="pin-text">{text}</p>
		</div>
	);
}

export default LocationPin;
