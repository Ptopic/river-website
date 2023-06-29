import React, { useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import './Reservation.css';

function Reservation({ forwardedRef }) {
	const initialValuse = {
		name: '',
		phone: '',
		persons: '',
		date: '',
		time: '',
	};

	const validationSchema = Yup.object({
		name: Yup.string().required('Required').typeError('Name must be a string'),
		phone: Yup.number()
			.nullable()
			.required('Required')
			.typeError('Phone must be a number'),
		persons: Yup.number()
			.nullable()
			.required('Required')
			.typeError('Number of persons must be a number'),
		date: Yup.string().nullable().required('Required'),
		time: Yup.string().nullable().required('Required'),
	});

	const onSubmitHandler = (values, formikActions) => {
		console.log(values);
		// formikActions.resetForm();
		// // Insert into db
		// console.log(isWide);
		// const res = await updateFont(values, activeId, isWide);
		// console.log(res);

		// // Close modal
		// if (!res.success) {
		// 	formikActions.resetForm();
		// } else {
		// 	formikActions.resetForm();
		// 	setIsEdited(false);
		// 	navigate(0);
		// }
	};
	return (
		<div className="reservation-container" id="reservations" ref={forwardedRef}>
			<div className="top-box"></div>
			<div className="buttom-box"></div>
			<div className="reservation-box">
				<h1>Make a reservation</h1>
				<Formik
					initialValues={initialValuse}
					enableReinitialize={true}
					validationSchema={validationSchema}
					onSubmit={onSubmitHandler}
				>
					{(formik) => (
						<form className="reservation-form" onSubmit={formik.handleSubmit}>
							<input
								type="text"
								name="name"
								placeholder="Full name *"
								className="input-name"
								{...formik.getFieldProps('name')}
							/>
							<input
								type="phone"
								name="phone"
								placeholder="Phone number *"
								className="input-phone"
								{...formik.getFieldProps('phone')}
							/>
							<input
								type="text"
								name="persons"
								placeholder="Number of persons *"
								className="input-persons"
								{...formik.getFieldProps('persons')}
							/>
							<input
								type="date"
								name="date"
								placeholder="Date"
								className="input-date"
								{...formik.getFieldProps('date')}
							/>
							<input
								type="time"
								name="time"
								placeholder="Time"
								className="input-time"
								{...formik.getFieldProps('time')}
							/>

							<div className="submit-button-container">
								<input
									// onClick={() =>
									// 	onSubmitHandler(formik.values, formik.formikActions)
									// }
									type="submit"
									className="submit-btn"
									value={'BOOK A TABLE'}
								/>
							</div>

							{/* {formik.errors.name ||
							formik.errors.phone ||
							formik.errors.persons ||
							formik.errors.date ||
							formik.errors.time ? (
								<div className="error-container">
									<div className="error">Fill in all form fields please.</div>
								</div>
							) : null} */}
						</form>
					)}
				</Formik>
			</div>
		</div>
	);
}

export default Reservation;
