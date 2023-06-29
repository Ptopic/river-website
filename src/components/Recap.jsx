import React, { useState, useEffect, useRef } from 'react';

// Icons

import appetizersIcon from '../assets/icons/appetizers.png';
import mainMealsIcon from '../assets/icons/burger.png';
import mainMealsIconSvg from '../assets/icons/burgersvg.svg';
import desertsIcon from '../assets/icons/deserts.png';
import drinksIcon from '../assets/icons/drinks.png';
import '../components/Recap.css';

import { animateRecap, animateRecapIcons } from '../utils/Animations';
function Recap({ forwardedRef }) {
	useEffect(() => {
		const element = forwardedRef.current;
		animateRecap(element);
		animateRecapIcons();
	}, []);
	return (
		<div className="recap-container" ref={forwardedRef}>
			<div className="recap-content">
				<div className="recap-card">
					<img src={appetizersIcon} alt="" />
					<p>APPETIZERS</p>
				</div>

				<div className="recap-card">
					<img src={mainMealsIconSvg} alt="" />
					<p>MAIN MEALS</p>
				</div>

				<div className="recap-card">
					<img src={desertsIcon} alt="" />
					<p>DESERTS</p>
				</div>

				<div className="recap-card">
					<img src={drinksIcon} alt="" />
					<p>DRINKS</p>
				</div>

				<div className="menu-container">
					<a href="/menu" className="btn">
						MENU
					</a>
				</div>
			</div>
		</div>
	);
}

export default Recap;
