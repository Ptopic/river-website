import React, { useState, useEffect, useRef } from 'react';

// Images
import image1 from '../assets/images/interior.jpeg';
import image2 from '../assets/images/exterior.jpeg';
import divider from '../assets/images/divider2.png';
import { useSwipeable } from 'react-swipeable';

import { animateOverlay } from '../utils/Animations';

import '../components/Carousel.css';

function Carousel() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const overlayRef = useRef(null);
	const timeline = useRef(null);

	useEffect(() => {
		// Play overlay animation
		animateOverlay(overlayRef, timeline);
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
		<div
			{...handlers}
			className="carousel-wrapper"
			id="home"
			// onMouseEnter={() => setPaused(true)}
			// onMouseLeave={() => setPaused(false)}
		>
			<div className="overlay-text" ref={overlayRef}>
				<p className="welcome">Welcome to Our Restaurant</p>
				<h1 className="overlay-name">Konoba-pizzeria River</h1>

				<img src={divider} alt="" className="divider" />
				<p className="overlay-food">Mediterenian food</p>

				<a href="/menu" className="overlay-btn">
					MENU
				</a>
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
