import React, { useState, useEffect } from 'react';
import './Featured.css';
import { AiOutlineLeft, AiOutlineRight, AiOutlinePause } from 'react-icons/ai';
import { VscDebugStart } from 'react-icons/vsc';

import { useSwipeable } from 'react-swipeable';

import { Link } from 'react-router-dom';

function Slider() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [paused, setPaused] = useState(false);

	const handleNext = () => {
		setActiveIndex((prevIndex) => (prevIndex + 1) % 2);
	};

	const handlePrev = () => {
		setActiveIndex((prevIndex) => (prevIndex - 1 + 2) % 2);
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
		<div {...handlers} className="featured-wrapper">
			<div
				className="featured-collection"
				style={{ transform: `translateX(${currentTransform}%)` }}
			>
				<div className="featured-item">
					<div className="featured-item-left">
						<img
							src="https://res.cloudinary.com/dcxwnj5jj/image/upload/v1707348307/bypjjq6zrv0zwcd2cgoh.jpg"
							alt=""
						/>
					</div>
				</div>
				<div className="featured-item">
					<div className="featured-item-left">
						<img
							src="https://res.cloudinary.com/dcxwnj5jj/image/upload/v1707348308/ootttr5tslqsmryhlrgr.jpg"
							alt=""
						/>
					</div>
				</div>
			</div>

			<div className="featured-indicators">
				<AiOutlineLeft size={26} onClick={() => handlePrev()} />
				<div className="dots-container">
					{activeIndex == 0 ? (
						<div>
							<div className="dot fill" onClick={() => setActiveIndex(0)}></div>
							<div className="dot" onClick={() => setActiveIndex(1)}></div>
						</div>
					) : (
						<div>
							<div className="dot" onClick={() => setActiveIndex(0)}></div>
							<div className="dot fill" onClick={() => setActiveIndex(1)}></div>
						</div>
					)}
				</div>
				<AiOutlineRight
					size={26}
					onClick={() => handleNext()}
					style={{ marginRight: '2rem' }}
				/>
				{paused ? (
					<VscDebugStart size={26} onClick={() => setPaused(false)} />
				) : (
					<AiOutlinePause size={26} onClick={() => setPaused(true)} />
				)}
			</div>
		</div>
	);
}

export default Slider;
