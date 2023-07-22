import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/images/novilogowhite.png';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { motion as m, useScroll, useTransform } from 'framer-motion';
// Gsap
import {
	NavbarAnimationOnScroll,
	NavbarMobileAnimationOnScroll,
} from '../utils/Animations';

import '../index.css';
import './Navbar.css';
function Navbar({ forwardedRef }) {
	const [opened, setOpened] = useState(false);
	useEffect(() => {
		const element = forwardedRef.current;

		NavbarAnimationOnScroll(element);
		NavbarMobileAnimationOnScroll(element);
	}, []);

	const onPress = () => {
		if (opened) {
			setOpened(false);
		} else {
			setOpened(true);
		}
	};
	return (
		<>
			<nav className="navbar">
				<div className="left-navbar">
					<img src={logoImg} alt="" />
				</div>

				<div className="center-navbar">
					<div className="nav-link">
						<a href="#home">HOME</a>
					</div>

					<div className="nav-link">
						<a href="#reservations">RESERVATIONS</a>
					</div>
					<div className="nav-link">
						<Link to={'/menu'}>MENU</Link>
					</div>
					<div className="nav-link">
						<a href="#galery">GALLERY</a>
					</div>
					<div className="nav-link">
						<a href="#footer">CONTACT</a>
					</div>

					<a href="#reservations" className="btn">
						BOOK A TABLE
					</a>
				</div>
			</nav>

			{/* <nav className="navbar-mobile-bar"> */}
			<div className="navbar-mobile">
				<div className="navbar-button" onClick={onPress}>
					{opened === true ? (
						<IoClose size={32} />
					) : (
						<GiHamburgerMenu size={32} />
					)}
				</div>
			</div>
			{/* </nav> */}

			<div
				className="navbar-mobile-container"
				style={{ transform: opened ? `translateX(0%)` : `translateX(100%)` }}
			>
				<div className="navbar-mobile-content">
					<div className="nav-link">
						<a href="#home">HOME</a>
					</div>

					<div className="nav-link">
						<a href="#reservations">RESERVATIONS</a>
					</div>
					<div className="nav-link">
						<Link to={'/menu'}>MENU</Link>
					</div>
					<div className="nav-link">
						<a href="#galery">GALLERY</a>
					</div>
					<div className="nav-link">
						<a href="#footer">CONTACT</a>
					</div>

					<a href="#reservations" className="btn">
						BOOK A TABLE
					</a>
				</div>
			</div>
		</>
	);
}

export default Navbar;
