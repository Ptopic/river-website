import React, { useState, useEffect, useRef } from 'react';
import { motion as m } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../components/Info.css';
import '../index.css';

function Info() {
	return (
		<div className="info-container">
			<m.div
				className="info-left"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
				variants={{
					visible: { x: 0, opacity: 1 },
					hidden: { x: -50, opacity: 0 },
				}}
				transition={{
					type: 'spring',
					stiffness: 660,
					damping: 150,
					delay: 0.2,
				}}
			>
				<div className="blured-content">
					<h1>Working Hours</h1>
					<p>Mon - Sun: 10:00 - 24:00</p>
					<a href="#footer">CONTACT US</a>
				</div>
			</m.div>
			<m.div
				className="info-right"
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
				variants={{
					visible: { x: 0, opacity: 1 },
					hidden: { x: 50, opacity: 0 },
				}}
				transition={{
					type: 'spring',
					stiffness: 660,
					damping: 150,
					delay: 0.2,
				}}
			>
				<div className="blured-content">
					<h1>Need a table?</h1>
					<p>+385 021 260 081</p>
					<a href="#reservations" className="btn info">
						BOOK A TABLE
					</a>
				</div>
			</m.div>
		</div>
	);
}

export default Info;
