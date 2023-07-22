import React, { useState, useEffect, useRef } from 'react';
import { motion as m } from 'framer-motion';
// Icons

import appetizersIcon from '../assets/icons/appetizers.png';
import mainMealsIcon from '../assets/icons/burger.png';
import mainMealsIconSvg from '../assets/icons/burgersvg.svg';
import desertsIcon from '../assets/icons/deserts.png';
import drinksIcon from '../assets/icons/drinks.png';
import '../components/Recap.css';
function Recap() {
	return (
		<div className="recap-container">
			<m.div
				className="recap-content"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
				variants={{
					visible: { opacity: 1 },
					hidden: { opacity: 0 },
				}}
				transition={{
					type: 'spring',
					stiffness: 660,
					damping: 150,
					delay: 0.2,
				}}
			>
				<m.div
					className="recap-card"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						visible: { y: 0, opacity: 1 },
						hidden: { y: -100, opacity: 0 },
					}}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 150,
						delay: 0.4,
					}}
				>
					<img src={appetizersIcon} alt="" />
					<p>APPETIZERS</p>
				</m.div>

				<m.div
					className="recap-card"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						visible: { y: 0, opacity: 1 },
						hidden: { y: -100, opacity: 0 },
					}}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 150,
						delay: 0.8,
					}}
				>
					<img src={mainMealsIconSvg} alt="" />
					<p>MAIN MEALS</p>
				</m.div>
				<m.div
					className="recap-card"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						visible: { y: 0, opacity: 1 },
						hidden: { y: -100, opacity: 0 },
					}}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 150,
						delay: 1.2,
					}}
				>
					<img src={desertsIcon} alt="" />
					<p>DESERTS</p>
				</m.div>

				<m.div
					className="recap-card"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						visible: { y: 0, opacity: 1 },
						hidden: { y: -100, opacity: 0 },
					}}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 150,
						delay: 1.6,
					}}
				>
					<img src={drinksIcon} alt="" />
					<p>DRINKS</p>
				</m.div>

				<m.div
					className="menu-container"
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						visible: { y: 0, opacity: 1 },
						hidden: { y: -100, opacity: 0 },
					}}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 150,
						delay: 2,
					}}
				>
					<a href="/menu" className="btn">
						MENU
					</a>
				</m.div>
			</m.div>
		</div>
	);
}

export default Recap;
