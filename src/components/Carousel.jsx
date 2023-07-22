import React, { useState, useEffect, useRef } from 'react';

// Images
import image1 from '../assets/images/interior.jpeg';
import image2 from '../assets/images/exterior.jpeg';
import divider from '../assets/images/divider2.png';
import { useSwipeable } from 'react-swipeable';
import { motion as m, useScroll, useTransform } from 'framer-motion';
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

	const variants = {
		hidden: {
			y: '-5vh',
			opacity: 0,
		},
		visible: {
			y: '0',
			opacity: 1,
		},
		exit: {
			y: '100vh',
			opacity: 0,
		},
	};

	const variantsButton = {
		hidden: {
			opacity: 0,
		},
		visible: {
			opacity: 1,
		},
		exit: {
			opacity: 0,
		},
	};
	return (
		<div {...handlers} className="carousel-wrapper" id="home">
			<div className="overlay-text" ref={overlayRef}>
				<m.p
					className="welcome"
					variants={variants}
					initial="hidden"
					animate="visible"
					transition={{
						duration: 1.2,
						type: 'tween',
					}}
					exit="exit"
				>
					Welcome to Our Restaurant
				</m.p>
				<m.h1
					variants={variants}
					initial="hidden"
					animate="visible"
					exit="exit"
					transition={{
						duration: 1.2,
						type: 'tween',
						delay: 0.4,
					}}
					className="overlay-name"
				>
					Konoba-pizzeria River
				</m.h1>

				<m.img
					src={divider}
					alt=""
					className="divider"
					variants={variants}
					initial="hidden"
					animate="visible"
					exit="exit"
					transition={{
						duration: 1.2,
						type: 'tween',
						delay: 0.6,
					}}
				/>
				<m.p
					className="overlay-food"
					variants={variants}
					initial="hidden"
					animate="visible"
					exit="exit"
					transition={{
						duration: 1.2,
						type: 'tween',
						delay: 1,
					}}
				>
					Mediterenian food
				</m.p>

				<m.a
					href="/menu"
					className="overlay-btn"
					variants={variantsButton}
					initial="hidden"
					animate="visible"
					exit="exit"
					transition={{
						duration: 1.2,
						type: 'tween',
						delay: 1.5,
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
