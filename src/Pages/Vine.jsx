import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

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
import { hranaData } from '../data/hrana';
import { hranaDataEng } from '../data/hranaEng';
function Vine() {
	const TECAJ_KONVERZIJE = 7.5345;

	const [currentData, setCurrentData] = useState('');
	const [data, setData] = useState([]);
	const [dataEng, setDataEng] = useState([]);
	const [title, setTitle] = useState('');
	const [language, setLanguage] = useState('hrv');
	const [modalOpen, setModalOpen] = useState('');
	const [open, setOpen] = useState('');

	useEffect(() => {
		setData(hranaData);
		setDataEng(hranaDataEng);
		console.log(hranaData);
	}, []);

	// If lanugage changes errase data

	useEffect(() => {
		setCurrentData('');
	}, [language]);
	// useEffect(() => {
	// 	console.log(currentData.content);
	// }, [currentData]);
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

					<div className="center-nav">
						<div className="center-nav-container">
							<Link to={'/menu'}>Food</Link>
							<Link to={'/vine'}>Vine</Link>
						</div>
					</div>

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

				<div className="menu-container-content">
					{language === 'hrv' ? (
						<div className="menu-categories-container">
							<div className="menu-categories">
								{hranaData.map((el) => {
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
								{hranaDataEng.map((el) => {
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
												{item.price}€ (
												{(item.price * TECAJ_KONVERZIJE).toFixed(2)}kn)
											</div>
										</div>
									</div>
								);
							})}
						</div>
					) : null}
				</div>

				{/* Mobile design */}
				<div className="dropdown-list">
					{language === 'hrv'
						? hranaData.map((data, id) => {
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
						: hranaDataEng.map((data, id) => {
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
			</div>
		</>
	);
}

export default Vine;
