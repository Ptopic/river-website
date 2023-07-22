import React, { useState, useEffect, useRef } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { IoIosClose } from 'react-icons/io';
import { motion as m } from 'framer-motion';
// Images
import img1 from '../assets/images/food2.jpeg';
import img2 from '../assets/images/food3.jpeg';
import img3 from '../assets/images/food8.jpeg';
import img4 from '../assets/images/food5.jpeg';
import img5 from '../assets/images/food9.jpeg';
import img6 from '../assets/images/pizza.jpeg';

const listOfImages = [img1, img2, img3, img4, img5, img6];

import { galeryImgClick, galeryImgClickClose } from '../utils/Animations';
import './Pictures.css';
function Pictures({ forwardedRef }) {
	const timeline = useRef(null);
	const modalRef = useRef(null);
	const [modalOpen, setModalOpen] = useState('');
	const [curImage, setCurImage] = useState('');

	const leftAnimation = {
		visible: { x: 0, opacity: 1 },
		hidden: { x: -50, opacity: 0 },
	};

	const rightAnimation = {
		visible: { x: 0, opacity: 1 },
		hidden: { x: 50, opacity: 0 },
	};

	const imageClick = (imgId) => {
		setCurImage(imgId);
		setModalOpen(true);
	};

	const exitModal = () => {
		setCurImage('');
		setModalOpen(false);
	};

	useEffect(() => {
		if (modalOpen) {
			galeryImgClick(modalRef, timeline);
		}
	}, [modalOpen]);
	return (
		<>
			{modalOpen ? (
				<div ref={modalRef}>
					<div className="image-modal-overlay">
						<div className="button-container-overlay">
							<button onClick={() => exitModal()}>
								<IoIosClose size={42} />
							</button>
						</div>
						<div className="image-modal">
							<img src={listOfImages[curImage]} alt="" />
						</div>
					</div>
				</div>
			) : null}
			<div className="pictures-container" id="galery" ref={forwardedRef}>
				<m.div
					className="img1 img"
					onClick={() => imageClick(0)}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={leftAnimation}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 100,
						delay: 0.2,
					}}
				>
					<img src={img1} alt="img1" />
					<div className="overlay">
						<div className="border">
							<BiSearchAlt size={80} />
						</div>
					</div>
				</m.div>

				<m.div
					className="img2 img"
					onClick={() => imageClick(1)}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={leftAnimation}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 100,
						delay: 0.6,
					}}
				>
					<img src={img2} alt="img2" />
					<div className="overlay">
						<div className="border">
							<BiSearchAlt size={80} />
						</div>
					</div>
				</m.div>

				<m.div
					className="img3 img"
					onClick={() => imageClick(2)}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={rightAnimation}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 100,
						delay: 1,
					}}
				>
					<img src={img3} alt="img3" />
					<div className="overlay">
						<div className="border">
							<BiSearchAlt size={80} />
						</div>
					</div>
				</m.div>

				<m.div
					className="img4 img"
					onClick={() => imageClick(3)}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={leftAnimation}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 100,
						delay: 1.4,
					}}
				>
					<img src={img4} alt="img4" />
					<div className="overlay">
						<div className="border">
							<BiSearchAlt size={80} />
						</div>
					</div>
				</m.div>

				<m.div
					className="img5 img"
					onClick={() => imageClick(4)}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={rightAnimation}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 100,
						delay: 1.8,
					}}
				>
					<img src={img5} alt="img5" />
					<div className="overlay">
						<div className="border">
							<BiSearchAlt size={80} />
						</div>
					</div>
				</m.div>

				<m.div
					className="img6 img"
					onClick={() => imageClick(5)}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={leftAnimation}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 100,
						delay: 2.2,
					}}
				>
					<img src={img6} alt="img6" />
					<div className="overlay">
						<div className="border">
							<BiSearchAlt size={80} />
						</div>
					</div>
				</m.div>
			</div>
		</>
	);
}

export default Pictures;
