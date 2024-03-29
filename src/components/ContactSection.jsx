import React, { useState, useEffect, useRef } from 'react';
import { motion as m } from 'framer-motion';
import { Link } from 'react-router-dom';

import locationPinIcon from '../assets/icons/pin.svg';
import dishIcon from '../assets/icons/dish.svg';

import '../components/ContactSection.css';
function ContactSection() {
	return (
		<div className="contact-section-container">
			<div className="contact-section-content">
				<m.div
					className="address"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						visible: { x: 0, opacity: 1 },
						hidden: { x: -50, opacity: 0 },
					}}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 150,
						delay: 0.2,
					}}
				>
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
				</m.div>
				<m.div
					className="menu"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						visible: { x: 0, opacity: 1 },
						hidden: { x: 50, opacity: 0 },
					}}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 150,
						delay: 0.2,
					}}
				>
					<img src={dishIcon} alt="" width={'64px'} />
					<h1>OUR MENU</h1>
					<Link to={'/menu'} className="btn">
						MENU
					</Link>
				</m.div>
			</div>
		</div>
	);
}

export default ContactSection;
