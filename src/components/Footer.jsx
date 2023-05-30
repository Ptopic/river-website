import React from 'react';
import logoImg from '../assets/images/novilogowhite.png';

// Fb, ig, tripadvisor and email icon
import { FaInstagram, FaTripadvisor } from 'react-icons/fa';
import { GrFacebookOption } from 'react-icons/gr';
import { TbMail } from 'react-icons/tb';

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
							<RiMapPinLine
								color="#e4c590"
								size={26}
								style={{ marginRight: '2rem' }}
							/>
							Ul. kralja Zvonimira 46, 21210, Solin
						</div>

						<div className="footer-center phone">
							<HiOutlinePhone
								color="#e4c590"
								size={26}
								style={{ marginRight: '2rem' }}
							/>
							+385 091 792 1657
						</div>

						<div className="footer-center email">
							<MdOutlineAlternateEmail
								color="#e4c590"
								size={26}
								style={{ marginRight: '2rem' }}
							/>
							antetopic355@gmail.com
						</div>
					</div>
				</div>
				<div className="center">
					<img src={logoImg} alt="" />
					<div className="logos">
						<a href="https://www.google.com">
							<GrFacebookOption color="white" size={42} />
						</a>

						<a href="">
							<FaInstagram color="white" size={42} />
						</a>

						<a href="">
							<FaTripadvisor color="white" size={42} />
						</a>

						<a href="">
							<TbMail color="white" size={42} />
						</a>
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
