import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/images/novilogowhite.png';

// Gsap
import { NavbarAnimationOnScroll } from '../utils/Animations';

import '../index.css';
import './Navbar.css';
function Navbar({ forwardedRef }) {
	useEffect(() => {
		const element = forwardedRef.current;

		NavbarAnimationOnScroll(element);
	}, []);
	return (
		<nav className="navbar">
			<div className="left-navbar">
				<img src={logoImg} alt="" />
			</div>

			<div className="center-navbar">
				<a href="#home">HOME</a>
				<a href="#reservations">RESERVATIONS</a>
				<Link to={'/menu'}>MENU</Link>
				<a href="#galery">GALLERY</a>
				<a href="#footer">CONTACT</a>
				<a href="#reservations" className="btn">
					BOOK A TABLE
				</a>
			</div>

			{/* <div className="right-navbar">
				{/* Fb, ig, tripadvisor, email */}
			{/* myb some button */}
			{/* <FaFacebookSquare
					color="white"
					size={32}
					style={{ marginRight: '2rem' }}
				/>
				<FaInstagram color="white" size={32} style={{ marginRight: '2rem' }} />
				<FaTripadvisor
					color="white"
					size={32}
					style={{ marginRight: '2rem' }}
				/>
				<TbMail color="white" size={32} style={{ marginRight: '2rem' }} /> */}
			{/*</div> */}
		</nav>
	);
}

export default Navbar;
