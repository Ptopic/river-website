import React from 'react';

import './Reservation.css';

function Reservation() {
	return (
		<div className="reservation-container" id="reservations">
			<div className="top-box"></div>
			<div className="buttom-box"></div>
			<div className="reservation-box">
				<h1>Make a reservation</h1>

				<form action="" className="reservation-form">
					<input type="text" name="name" placeholder="Full name *" />
					<input type="phone" name="phone" placeholder="Phone number *" />
					<input type="text" name="persons" placeholder="Number of persons *" />
					<input type="date" name="date" placeholder="Date" />
					<input
						type="time"
						name="time"
						placeholder="Time"
						defaultValue={'00:00'}
					/>

					<div className="submit-button-container">
						<button type="button" className="submit-btn">
							BOOK A TABLE
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Reservation;
