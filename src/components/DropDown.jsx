import React, { useEffect, useState } from 'react';

function DropDown({ id, name, data, open, setOpen }) {
	const TECAJ_KONVERZIJE = 7.5345;
	useEffect(() => {
		console.log(data[0]);
	}, []);
	return (
		<div
			className={'dropdown'}
			onClick={() => (open != null ? setOpen(null) : setOpen(id))}
		>
			<h1>{name}</h1>
			<div className="dropdown-content">
				{open === id
					? data.map((el, id) => {
							return (
								<div key={id} className={`item-container`}>
									<div className="item-info">
										<h2>{el.name}</h2> <p>{el.kol}</p>
									</div>
									<div className="item-price">
										{el.price}€ ({(el.price * TECAJ_KONVERZIJE).toFixed(2)}kn)
									</div>
								</div>
							);
					  })
					: null}
				{/* {data.map((el, id) => {
					return (
						<div key={id} className={`item-container`}>
							<div className="item-info">
								<h2>{el.name}</h2> <p>{el.kol}</p>
							</div>
							<div className="item-price">
								{el.price}€ ({(el.price * TECAJ_KONVERZIJE).toFixed(2)}kn)
							</div>
						</div>
					);
				})} */}
			</div>
		</div>
	);
}

export default DropDown;
