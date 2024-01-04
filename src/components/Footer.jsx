import React from 'react';
import logoImg from '../assets/images/novilogowhite.png';

// Fb, ig, tripadvisor and email icon
import { FaInstagram, FaTripadvisor } from 'react-icons/fa';
import { GrFacebookOption } from 'react-icons/gr';
import { TbMail } from 'react-icons/tb';

// Images
import esif from '../assets/images/esif.jpg';
import eu from '../assets/images/eu.jpg';
import hamag from '../assets/images/hamag.jpg';

// Contacts icons
import { RiMapPinLine } from 'react-icons/ri';
import { HiOutlinePhone } from 'react-icons/hi';
import { MdOutlineAlternateEmail } from 'react-icons/md';

import '../components/Footer.css';

function Footer() {
	return (
		<>
			<div className="footer-container" id="footer">
				<div className="left">
					<h1>Contacts</h1>
					<div className="contacts-info">
						<div className="footer-center location">
							<RiMapPinLine color="#e4c590" size={26} />
							Ul. kralja Zvonimira 46, 21210, Solin
						</div>

						<div className="footer-center phone">
							<HiOutlinePhone color="#e4c590" size={26} />
							+385 021 260 081
						</div>

						<div className="footer-center email">
							<MdOutlineAlternateEmail color="#e4c590" size={26} />
							antetopic355@gmail.com
						</div>
					</div>
				</div>
				<div className="center">
					<img src={logoImg} alt="" />
					<div className="logos">
						<a href="https://www.facebook.com/p/Konoba-Pizzeria-River-100054423162174/">
							<GrFacebookOption color="white" size={42} />
						</a>

						<a href="https://www.instagram.com/river_pizzeria_restoran/">
							<FaInstagram color="white" size={42} />
						</a>

						<a href="https://www.tripadvisor.com/Restaurant_Review-g1203167-d3410911-Reviews-Konoba_Pizzeria_River-Solin_Split_Dalmatia_County_Dalmatia.html">
							<FaTripadvisor color="white" size={42} />
						</a>

						<a href="mailto:antetopic355@gmail.com">
							<TbMail color="white" size={42} />
						</a>
					</div>
					<div className="images">
						<img src={esif} alt="" />
						<img src={eu} alt="" />
						<img src={hamag} alt="" />
					</div>
				</div>
				<div className="right">
					<h1>Working Hours</h1>
					<div className="hours">
						<li>
							<span className="day">Mon - Fri</span> 10:00 - 24:00
						</li>
						<li>
							<span className="day">Sat</span> 10:00 - 24:00
						</li>
						<li>
							<span className="day">Sun</span> 10:00 - 24:00
						</li>
					</div>
				</div>
			</div>
			<div className="copyright-bar">Copyright @ 2023 River</div>
		</>
	);
}

export default Footer;
