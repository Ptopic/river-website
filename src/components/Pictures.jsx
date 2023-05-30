import React, { useState, useEffect, useRef } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { IoIosClose } from 'react-icons/io';
// Images
import img1 from '../assets/images/food2.jpeg';
import img2 from '../assets/images/food3.jpeg';
import img3 from '../assets/images/food8.jpeg';
import img4 from '../assets/images/food5.jpeg';
import img5 from '../assets/images/food9.jpeg';
import img6 from '../assets/images/pizza.jpeg';

const listOfImages = [img1, img2, img3, img4, img5, img6];
import './Pictures.css';
function Pictures({ forwardedRef }) {
	const modalRef = useRef(null);
	const [modalOpen, setModalOpen] = useState('');
	const [curImage, setCurImage] = useState('');

	const imageClick = (imgId) => {
		setCurImage(imgId);
		setModalOpen(true);
	};

	const exitModal = () => {
		setCurImage('');
		setModalOpen(false);
	};
	return (
		<>
			{modalOpen ? (
				<div className="image-modal-overlay" ref={modalRef}>
					<div className="button-container-overlay">
						<button onClick={() => exitModal()}>
							<IoIosClose size={36} />
						</button>
					</div>
					<div className="image-modal">
						<img src={listOfImages[curImage]} alt="" />
					</div>
				</div>
			) : null}
			<div className="pictures-container" id="galery" ref={forwardedRef}>
				<div className="img1 img" onClick={() => imageClick(0)}>
					<img src={img1} alt="img1" />
					<div className="overlay">
						<div className="border">
							<BiSearchAlt size={80} />
						</div>
					</div>
				</div>

				<div className="img2 img" onClick={() => imageClick(1)}>
					<img src={img2} alt="img2" />
					<div className="overlay">
						<div className="border">
							<BiSearchAlt size={80} />
						</div>
					</div>
				</div>

				<div className="img3 img" onClick={() => imageClick(2)}>
					<img src={img3} alt="img3" />
					<div className="overlay">
						<div className="border">
							<BiSearchAlt size={80} />
						</div>
					</div>
				</div>

				<div className="img4 img" onClick={() => imageClick(3)}>
					<img src={img4} alt="img4" />
					<div className="overlay">
						<div className="border">
							<BiSearchAlt size={80} />
						</div>
					</div>
				</div>

				<div className="img5 img" onClick={() => imageClick(4)}>
					<img src={img5} alt="img5" />
					<div className="overlay">
						<div className="border">
							<BiSearchAlt size={80} />
						</div>
					</div>
				</div>

				<div className="img6 img" onClick={() => imageClick(5)}>
					<img src={img6} alt="img6" />
					<div className="overlay">
						<div className="border">
							<BiSearchAlt size={80} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Pictures;
