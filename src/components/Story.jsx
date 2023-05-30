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
							Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure
							inventore molestiae culpa enim consequuntur amet tempora dicta
							laborum soluta! Vel assumenda laudantium dolorem autem distinctio!
						</p>

						<br></br>

						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi,
							neque ut eius ab laborum repellendus amet quis voluptatem nemo
							nulla.
						</p>

						<br></br>

						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam,
							beatae!
						</p>
					</div>
				</div>

				<div className="right-story">
					<div className="right-story-img-container">
						<img src={img1} alt="" />
					</div>

					<div className="right-story-img-container">
						<img src={img2} alt="" />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Story;
