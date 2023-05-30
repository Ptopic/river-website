import React, { useState, useEffect, useRef } from 'react';

import { animateInfo } from '../utils/Animations';
import '../components/Info.css';
import '../index.css';

function Info({ forwardedRef }) {
	const timeline = useRef(null);
	useEffect(() => {
		animateInfo(forwardedRef, timeline);
	}, []);
	return (
		<div className="info-container">
			<div className="info-left">
				<div className="blured-content">
					<h1>Working Hours</h1>
					<p>Mon - Sun: 10:00 - 24:00</p>
					<a href="#footer">CONTACT US</a>
				</div>
			</div>
			<div className="info-right">
				<div className="blured-content">
					<h1>Need a table?</h1>
					<p>+385 091 792 1657</p>
					<a href="#reservations" className="btn info">
						BOOK A TABLE
					</a>
				</div>
			</div>
		</div>
	);
}

export default Info;
