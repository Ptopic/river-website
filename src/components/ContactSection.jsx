import React, { useState, useEffect, useRef } from 'react';

import { animateContactSection } from '../utils/Animations';
import locationPinIcon from '../assets/icons/pin.svg';
import dishIcon from '../assets/icons/dish.svg';

import '../components/ContactSection.css';
function ContactSection({ forwardedRef }) {
	const timeline = useRef(null);
	useEffect(() => {
		animateContactSection(forwardedRef, timeline);
	}, []);
	return (
		<div className="contact-section-container">
			<div className="contact-section-content">
				<div className="address">
					<img src={locationPinIcon} alt="" width={'64px'} />
					<h1>OUR LOCATION</h1>
					<p>Ul. kralja Zvonimira 46</p>
					<p>21210, Solin</p>
					<a
						href={
							'https://www.google.com/maps/place/River+Pizzeria+Konoba/@43.5357525,16.4867657,17z/data=!3m1!4b1!4m6!3m5!1s0x13355f00736d972f:0x289bc0cd2af01b9b!8m2!3d43.5357525!4d16.489346!16s%2Fg%2F11b7q555_6?entry=ttu'
						}
						className="btn"
					>
						GOOGLE MAPS
					</a>
				</div>
				<div className="menu">
					<img src={dishIcon} alt="" width={'64px'} />
					<h1>OUR MENU</h1>
					<a href={'/menu'} className="btn">
						MENU
					</a>
				</div>
			</div>
		</div>
	);
}

export default ContactSection;
