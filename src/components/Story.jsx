import React, { useState, useLayoutEffect, useRef } from 'react';

import { animateStory } from '../utils/Animations';

import '../components/Story.css';

// Images

import img1 from '../assets/images/oven.jpeg';
import img2 from '../assets/images/oven2.jpeg';

function Story({ forwardedRef }) {
	return (
		<div ref={forwardedRef}>
			<div className="story-container">
				<div className="left-story">
					<h1>Discover</h1>
					<h2>OUR STORY</h2>

					<span>...</span>

					<div className="left-story-text">
						<p>
							Nestled in the picturesque small town of Solin, near the vibrant
							city of Split, a hidden gem awaits along the serene banks of River
							Jadro. This charming restaurant, simply known as "River" holds the
							key to an unforgettable culinary experience. With a dedication to
							Mediterranean cuisine, every dish is carefully prepared using the
							freshest ingredients sourced from local farmers and markets
							ensuring an authentic taste of the region.
						</p>
					</div>
				</div>

				<div className="right-story">
					<div className="right-story-img-container img1">
						<img src={img1} alt="" />
					</div>

					<div className="right-story-img-container img2">
						<img src={img2} alt="" />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Story;
