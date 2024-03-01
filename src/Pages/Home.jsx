import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion as m } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../index.css';

// Components

import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import Featured from '../components/Featured/Featured';
import Recap from '../components/Recap';
import Info from '../components/Info';
import ContactSection from '../components/ContactSection';
import Story from '../components/Story';
import Reviews from '../components/Reviews';
import MapContainer from '../components/MapContainer';
import Reservation from '../components/Reservation';
import Pictures from '../components/Pictures';

function Home() {
	const location = {
		address: 'Ul. kralja Zvonimira 46, 21210, Solin',
		lat: 43.535730841818115,
		lng: 16.489338663433166,
	};
	const ref = useRef(null);

	const storyRef = useRef(null);
	const ourDishesRef = useRef(null);
	const galleryRef = useRef(null);
	const mapRef = useRef(null);
	const reservationRef = useRef(null);

	const leftAnimation = {
		visible: { x: 0, opacity: 1 },
		hidden: { x: 0, opacity: 0 },
	};

	return (
		<div ref={ref}>
			<Navbar forwardedRef={ref} />
			<Carousel />
			<div className="recap-info-container">
				<Featured />
			</div>
			<div className="recap-info-container">
				<Recap />

				<Info />
			</div>
			<ContactSection />
			<Story />
			<m.section
				className="pictures"
				ref={ourDishesRef}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
				variants={leftAnimation}
				transition={{
					type: 'spring',
					stiffness: 460,
					damping: 150,
					delay: 0.2,
				}}
			>
				<h2>Our</h2>
				<h1>Dishes</h1>
			</m.section>
			<Pictures forwardedRef={galleryRef} />
			{/* <Reviews /> */}
			<MapContainer location={location} zoomLevel={18} />
			{/* <Reservation forwardedRef={reservationRef} /> */}
			<Footer />
		</div>
	);
}

export default Home;
