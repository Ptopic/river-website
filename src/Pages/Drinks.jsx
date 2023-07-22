import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion as m, AnimatePresence } from 'framer-motion';

import './Menu.css';
import '../index.css';
import { IoChevronBackCircleOutline } from 'react-icons/io5';
import { FcCheckmark } from 'react-icons/fc';
import { IoIosClose } from 'react-icons/io';

import croFlag from '../assets/images/hr.png';
import engFlag from '../assets/images/eng.jpg';

// Components

import DropDown from '../components/DropDown';

// Data
import { drinksData } from '../data/drinks';
import { drinksDataEng } from '../data/drinksEng';
function Drinks() {
	const TECAJ_KONVERZIJE = 7.5345;

	const menuRef = useRef(null);

	const [currentData, setCurrentData] = useState('');
	const [data, setData] = useState([]);
	const [dataEng, setDataEng] = useState([]);
	const [language, setLanguage] = useState('hrv');
	const [modalOpen, setModalOpen] = useState('');
	const [open, setOpen] = useState(null);

	useEffect(() => {
		setData(drinksData);
		setDataEng(drinksDataEng);
	}, []);

	// If lanugage changes errase data
	useEffect(() => {
		setCurrentData('');
		setOpen(null);
	}, [language]);
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

				<div className="menu-container-content">
					{language === 'hrv' ? (
						<div className="menu-categories-container">
							<div className="menu-categories">
								{drinksData.map((el) => {
									return (
										<button key={el['id']} onClick={() => setCurrentData(el)}>
											{el['name']}
										</button>
									);
								})}
							</div>
						</div>
					) : (
						<div className="menu-categories-container">
							<div className="menu-categories">
								{drinksDataEng.map((el) => {
									return (
										<button key={el['id']} onClick={() => setCurrentData(el)}>
											{el['name']}
										</button>
									);
								})}
							</div>
						</div>
					)}

					{currentData ? (
						<div className="menu-content">
							<h1>{currentData.name}</h1>

							{currentData.content.map((item, index) => {
								return (
									<div className="menu-content-item" key={index}>
										<div className="flex-container">
											<div className="menu-content-item-content">
												<h1>{item.name}</h1>
												<p>{item.kol}</p>
											</div>

											<div className="price-container">
												{item.price.replace('.', ',')}€ (
												{(item.price * TECAJ_KONVERZIJE)
													.toFixed(2)
													.replace('.', ',')}
												kn)
											</div>
										</div>
									</div>
								);
							})}
						</div>
					) : null}
				</div>

				{/* Mobile design */}
				<AnimatePresence>
					<div className="dropdown-list" ref={menuRef}>
						{language === 'hrv'
							? drinksData.map((data, id) => {
									return (
										<DropDown
											id={id}
											name={data.name}
											data={data.content}
											open={open}
											setOpen={setOpen}
										/>
									);
							  })
							: drinksDataEng.map((data, id) => {
									return (
										<DropDown
											id={id}
											name={data.name}
											data={data.content}
											open={open}
											setOpen={setOpen}
										/>
									);
							  })}
					</div>
				</AnimatePresence>
			</div>
		</>
	);
}

export default Drinks;
