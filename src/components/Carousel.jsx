import React, { useState, useEffect, useRef } from 'react';

// Images
import image1 from '../assets/images/interior.jpeg';
import image2 from '../assets/images/exterior.jpeg';
import divider from '../assets/images/divider2.png';
import { useSwipeable } from 'react-swipeable';
import { motion as m } from 'framer-motion';
import { animateOverlay } from '../utils/Animations';

import '../components/Carousel.css';

function Carousel() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const overlayRef = useRef(null);
	const timeline = useRef(null);

	useEffect(() => {
		// Play overlay animation
		// animateOverlay(overlayRef, timeline);
	}, []);

	const handleNext = () => {
		setActiveIndex((prevIndex) => (prevIndex + 1) % 2);
	};

	const handlePrev = () => {
		setActiveIndex((prevIndex) => (prevIndex - 1 + 14) % 2);
	};

	useEffect(() => {
		const timer = setInterval(() => {
			if (!paused) {
				handleNext();
			}
		}, 3000);

		return () => clearInterval(timer);
	}, [handleNext]);

	const currentTransform = -activeIndex * 100;

	const handlers = useSwipeable({
		onSwipedLeft: () => handleNext(),
		onSwipedRight: () => handlePrev(),
	});

	return (
		<div {...handlers} className="carousel-wrapper" id="home">
			<div className="overlay-text" ref={overlayRef}>
				<m.p
					className="welcome"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						visible: { scale: 1 },
						hidden: { scale: 0 },
					}}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 150,
						delay: 0.2,
					}}
				>
					Welcome to Our Restaurant
				</m.p>
				<m.h1
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						visible: { scale: 1 },
						hidden: { scale: 0 },
					}}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 150,
						delay: 0.6,
					}}
					className="overlay-name"
				>
					Konoba-pizzeria River
				</m.h1>

				<m.img
					src={divider}
					alt=""
					className="divider"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						visible: { scale: 1 },
						hidden: { scale: 0 },
					}}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 150,
						delay: 1,
					}}
				/>
				<m.p
					className="overlay-food"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						visible: { scale: 1 },
						hidden: { scale: 0 },
					}}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 150,
						delay: 1.4,
					}}
				>
					Mediterenian food
				</m.p>

				<m.a
					href="/menu"
					className="overlay-btn"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						visible: { scale: 1 },
						hidden: { scale: 0 },
					}}
					transition={{
						type: 'spring',
						stiffness: 460,
						damping: 50,
						delay: 0.4,
					}}
				>
					MENU
				</m.a>
			</div>
			<div
				className="carousel-collection"
				style={{ transform: `translateX(${currentTransform}%)` }}
			>
				<div className="carousel-item">
					<div className="overlay" />
					<img src={image1} alt="" />
				</div>

				<div className="carousel-item">
					<div className="overlay" />
					<img src={image2} alt="" />
				</div>
			</div>

			{/* Cur image indicator */}
		</div>
	);
}

export default Carousel;
