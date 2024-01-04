import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';

import './Menu.css';
import './Vine.css';
import '../index.css';
import { IoChevronBackCircleOutline } from 'react-icons/io5';
import { FcCheckmark } from 'react-icons/fc';
import { IoIosClose } from 'react-icons/io';

import croFlag from '../assets/images/hr.png';
import engFlag from '../assets/images/eng.jpg';

function Vine() {
	const TECAJ_KONVERZIJE = 7.5345;

	const [language, setLanguage] = useState('hrv');
	const [modalOpen, setModalOpen] = useState('');

	return (
		<>
			{modalOpen ? (
				<div className="language-modal-container">
					<div className="language-modal-content">
						<button onClick={() => setModalOpen(false)}>
							<IoIosClose size={46} />
						</button>
						<h1>Change language:</h1>
						<div className="language">
							<div className="hrv" onClick={() => setLanguage('hrv')}>
								<img src={croFlag} alt="" className="hrv" />
								<p>HR</p>

								{language === 'hrv' ? (
									<FcCheckmark size={26} className="checkmark" />
								) : null}
							</div>
							<div className="eng" onClick={() => setLanguage('eng')}>
								<img src={engFlag} alt="" />
								<p>EN</p>

								{language === 'eng' ? (
									<FcCheckmark size={26} className="checkmark" />
								) : null}
							</div>
						</div>
					</div>
				</div>
			) : null}
			<div className="menu-container">
				<div className="top-bar">
					<Link to={'/'}>
						<IoChevronBackCircleOutline size={46} />
					</Link>

					{language === 'hrv' ? (
						<button className="hrv" onClick={() => setModalOpen(true)}>
							<img src={croFlag} alt="" />
						</button>
					) : (
						<button className="eng" onClick={() => setModalOpen(true)}>
							<img src={engFlag} alt="" />
						</button>
					)}
				</div>

				<div className="center-nav">
					<div className="center-nav-container">
						<Link to="/menu">Food</Link>

						<Link to="/vine">Vine</Link>

						<Link to="/drinks">Drinks</Link>
						<Link to="/pizza">Pizza</Link>
					</div>
				</div>
				<div className="vine-container-content">
					{/* Vine list hrv */}
					<>
						{/* <h1>Croatian wine regions</h1>
						<img src="" alt="" /> */}
						<h2>Vinska karta</h2>
						<div className="vine-categories-container">
							<div className="vine-categories">
								<h3>Sparkling</h3>
								<div className="vine-category">
									<div className="vine-content">
										<h4>Perla Rose</h4>
										<p>Brut - Istra</p>
									</div>

									<div className="vine-price">
										<div>
											{35}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Millenium Tomac</h4>
									</div>

									<div className="vine-price">
										<div>
											{45}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Selection</h4>
									</div>

									<div className="vine-price">
										<div>
											{40}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<h3>White wine</h3>
								<div className="vine-category">
									<div className="vine-content">
										<h4>Pošip Čara</h4>
										<p>0,75 l</p>
									</div>

									<div className="vine-price">
										<div>
											{40}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Pošip Intrada</h4>
										<p>0,75 l</p>
									</div>

									<div className="vine-price">
										<div>
											{45}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Krauhaker Pinot Sivi</h4>
										<p>0,75 l</p>
									</div>

									<div className="vine-price">
										<div>
											{35}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Žlahtina Katunar</h4>
										<p>0,75 l</p>
									</div>

									<div className="vine-price">
										<div>
											{35}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Malvazija Kabola</h4>
										<p>0,75 l</p>
									</div>

									<div className="vine-price">
										<div>
											{40}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Galić G-Točka</h4>
										<p>0,75 l</p>
									</div>

									<div className="vine-price">
										<div>
											{30}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<h3>Rose</h3>
								<div className="vine-category">
									<div className="vine-content">
										<h4>Rose Benkovac</h4>
										<p>1,00 l</p>
									</div>

									<div className="vine-price">
										<div>
											{27}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>
								<div className="vine-category">
									<div className="vine-content">
										<h4>Rose Galić</h4>
										<p>0,75 l</p>
										<p>Dry - Slavonia</p>
									</div>

									<div className="vine-price">
										<div>
											{38}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<h3>Red wine</h3>
								<div className="vine-category">
									<div className="vine-content">
										<h4>Bogondon Cuvee Stina</h4>
										<p>0,75 l</p>
										<p>Plavac, Merlot, Cabarnet, Syrah</p>
										<p>Dry - Dalmatia</p>
									</div>

									<div className="vine-price">
										<div>
											<div>
												{35}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
											</div>
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Zlatan Plavac</h4>
										<p>0,75 l</p>
									</div>

									<div className="vine-price">
										<div>
											{40}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Dingač</h4>
										<p>0,75 l</p>
									</div>

									<div className="vine-price">
										<div>
											{50}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Cabarnet Sauvignon Korlat</h4>
										<p>0,75 l</p>
										<p>Dry - Dalmatia</p>
									</div>

									<div className="vine-price">
										<div>
											{50}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Plavac Tomić</h4>
										<p>0,75 l</p>
										<p>Dry - Dalmatia</p>
									</div>

									<div className="vine-price">
										<div>
											{40}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<h3>Desert Wine</h3>
								<div className="vine-category">
									<div className="vine-content">
										<h4>Prošek</h4>
										<p>0,10 l</p>
										<p>Sweet - Dalmatia</p>
									</div>

									<div className="vine-price">
										<div>
											{4}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Martini</h4>
										<p>0,10 l</p>
										<p>Sweet - Dalmatia</p>
									</div>

									<div className="vine-price">
										<div>
											{4}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Vermouth</h4>
										<p>0,10 l</p>
										<p>Sweet - Dalmatia</p>
									</div>

									<div className="vine-price">
										<div>
											{4}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<h3>House Wine</h3>
								<div className="header">White Wine</div>
								<div className="vine-category">
									<div className="vine-content">
										<h4>Pošip</h4>
										<p>1,00 l</p>
									</div>

									<div className="vine-price">
										<div>
											{16}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Graševina</h4>
										<p>1,00 l</p>
									</div>

									<div className="vine-price">
										<div>
											{18}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Malvazija</h4>
										<p>1,00 l</p>
									</div>

									<div className="vine-price">
										<div>
											{16}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="header">Red Wine</div>
								<div className="vine-category">
									<div className="vine-content">
										<h4>Merlot</h4>
										<p>1,00 l</p>
									</div>

									<div className="vine-price">
										<div>
											{16}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Plavac</h4>
										<p>1,00 l</p>
									</div>

									<div className="vine-price">
										<div>
											{18}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>
							</div>
						</div>

						<h2 className="foreign">Foreign wine with golden medal</h2>

						<div className="vine-categories-container">
							<div className="vine-categories">
								<h3>White Wine</h3>
								<div className="vine-category">
									<div className="vine-content">
										<h4>Fuzion Alta Pinot Grigio</h4>
										<p>0,75 l</p>
									</div>

									<div className="vine-price">
										<div>
											{30}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Zuccardi A Chardonnay</h4>
										<p>0,75 l</p>
									</div>

									<div className="vine-price">
										<div>
											{35}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Zuccardi Q Chardonnay</h4>
										<p>0,75 l</p>
									</div>

									<div className="vine-price">
										<div>
											{65}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<h3>Red Wine</h3>
								<div className="vine-category">
									<div className="vine-content">
										<h4>Fuzion Alta Malbec</h4>
										<p>0,75 l</p>
									</div>

									<div className="vine-price">
										<div>
											{30}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Zuccardi A Syrah</h4>
										<p>0,75 l</p>
									</div>

									<div className="vine-price">
										<div>
											{35}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Zuccardi A Caber.Sauv</h4>
										<p>0,75 l</p>
									</div>

									<div className="vine-price">
										<div>
											{35}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>

								<div className="vine-category">
									<div className="vine-content">
										<h4>Zuccardi Q Tempranillo</h4>
										<p>0,75 l</p>
									</div>

									<div className="vine-price">
										<div>
											{65}€ ({(35 * TECAJ_KONVERZIJE).toFixed(2)}kn)
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				</div>
			</div>
		</>
	);
}

export default Vine;
