import React, { useState, useLayoutEffect, useRef } from 'react';
import { motion as m } from 'framer-motion';

import '../components/Story.css';

// Images

import img1 from '../assets/images/oven.jpeg';
import img2 from '../assets/images/oven2.jpeg';

function Story() {
	const leftAnimation = {
		visible: { x: 0, opacity: 1 },
		hidden: { x: -50, opacity: 0 },
	};

	const rightAnimation = {
		visible: { x: 0, opacity: 1 },
		hidden: { x: 50, opacity: 0 },
	};
	return (
		<div>
			<div className="story-container">
				<div className="left-story">
					<m.h1
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						variants={leftAnimation}
						transition={{
							type: 'spring',
							stiffness: 660,
							damping: 150,
							delay: 1,
						}}
					>
						Discover
					</m.h1>
					<m.h2
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						variants={rightAnimation}
						transition={{
							type: 'spring',
							stiffness: 660,
							damping: 150,
							delay: 1.4,
						}}
					>
						OUR STORY
					</m.h2>

					<m.span
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						variants={leftAnimation}
						transition={{
							type: 'spring',
							stiffness: 660,
							damping: 150,
							delay: 1.8,
						}}
					>
						...
					</m.span>

					<m.div
						className="left-story-text"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						variants={rightAnimation}
						transition={{
							type: 'spring',
							stiffness: 660,
							damping: 150,
							delay: 2.2,
						}}
					>
						<p>
							Nestled in the picturesque small town of Solin, near the vibrant
							city of Split, a hidden gem awaits along the serene banks of River
							Jadro. This charming restaurant, simply known as "River" holds the
							key to an unforgettable culinary experience. With a dedication to
							Mediterranean cuisine, every dish is carefully prepared using the
							freshest ingredients sourced from local farmers and markets
							ensuring an authentic taste of the region.
						</p>
					</m.div>
				</div>

				<div className="right-story">
					<m.div
						className="right-story-img-container img1"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						variants={leftAnimation}
						transition={{
							type: 'spring',
							stiffness: 660,
							damping: 150,
							delay: 0.2,
						}}
					>
						<img src={img1} alt="" />
					</m.div>

					<m.div
						className="right-story-img-container img2"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						variants={rightAnimation}
						transition={{
							type: 'spring',
							stiffness: 660,
							damping: 150,
							delay: 0.6,
						}}
					>
						<img src={img2} alt="" />
					</m.div>
				</div>
			</div>
		</div>
	);
}

export default Story;
