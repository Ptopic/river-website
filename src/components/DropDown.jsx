import React, { useEffect, useState, useRef } from 'react';
import { motion as m } from 'framer-motion';
// Gsap
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Animations
import { animateMenuItems } from '../utils/Animations';

function DropDown({ id, name, data, open, setOpen, jumbo, language }) {
	const timeline = useRef(null);
	const dropdownRef = useRef(null);
	const TECAJ_KONVERZIJE = 7.5345;
	useEffect(() => {
		console.log(data[0]);
	}, []);

	const openMenu = () => {
		if (open != null) {
			setOpen(null);
		} else {
			setOpen(id);
			// Fire animation of menu items
			const elements = gsap.utils.toArray('.item-container');
			elements.forEach((el) => {
				animateMenuItems(el);
			});
		}
	};
	return (
		<m.div
			className={'dropdown'}
			// onClick={() => openMenu()}
			ref={dropdownRef}
			initial="hidden"
			animate="visible"
			viewport={{ once: true }}
			variants={{
				visible: { opacity: 1, y: 0 },
				hidden: { opacity: 0, y: -150 },
			}}
			transition={{
				type: 'spring',
				stiffness: 660,
				damping: 150,
				delay: 0.4,
			}}
		>
			<div className="click-layer" onClick={() => openMenu()}></div>
			<div className="dropdown-div" style={{ display: jumbo ? 'grid' : '' }}>
				<h1>{name}</h1>
				<>
					{jumbo && (
						<>
							<h2 style={{ textAlign: 'end' }}>
								{language === 'hrv' ? 'Velika' : 'Large'}
							</h2>
							<h2 style={{ textAlign: 'end' }}>
								{language === 'hrv' ? 'Jumbo' : 'Jumbo'}
							</h2>
						</>
					)}
				</>
			</div>
			<div className="dropdown-content">
				{data.map((el, index) => {
					const calcPrice = (el.price * TECAJ_KONVERZIJE).toFixed(2);
					const knPrice = calcPrice.replace('.', ',');
					return (
						<m.div
							key={index}
							className={`item-container`}
							style={{
								opacity: open === id ? 1 : 0,
								display: jumbo
									? open === id
										? 'grid'
										: 'none'
									: open === id
									? 'flex'
									: 'none',
								padding: jumbo ? '3rem 0.5rem' : '3rem 0.5rem',
								gridTemplateColumns: '1fr 1fr',
							}}
						>
							<div className={'item-info'}>
								<h2>{el.name}</h2> <p>{el.kol}</p>
							</div>
							<div className="item-prices">
								<div
									className={jumbo ? 'item-price-pizza' : 'item-price'}
									style={{ marginRight: jumbo ? '2rem' : '' }}
								>
									<p>{el.price.replace('.', ',')}€</p>
									<p2>
										{String(knPrice).replace('.', ',')}
										kn
									</p2>
								</div>
								{jumbo ? (
									el.jumbo ? (
										<div className={jumbo ? 'item-price-pizza' : 'item-price'}>
											<p>{el.jumbo.replace('.', ',')}€</p>
											<p2>
												{(el.jumbo * TECAJ_KONVERZIJE)
													.toFixed(2)
													.replace('.', ',')}
												kn
											</p2>
										</div>
									) : (
										<div
											className={jumbo ? 'item-price-pizza' : 'item-price'}
											style={{ visibility: 'hidden' }}
										>
											<p>0€</p>
											<p2>0 kn</p2>
										</div>
									)
								) : null}
							</div>
						</m.div>
					);
				})}
			</div>
		</m.div>
	);
}

export default DropDown;
