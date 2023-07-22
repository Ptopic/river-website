import React, { useState, useEffect, useRef } from 'react';
import { motion as m } from 'framer-motion';
import { Formik } from 'formik';
import * as Yup from 'yup';
import './Reservation.css';

function Reservation({ forwardedRef }) {
	const opacityAnimation = {
		visible: { opacity: 1 },
		hidden: { opacity: 0 },
	};

	const downAnimation = {
		visible: { y: 0, opacity: 1 },
		hidden: { y: -50, opacity: 0 },
	};
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
		<m.div
			className="reservation-container"
			id="reservations"
			ref={forwardedRef}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true }}
			variants={opacityAnimation}
			transition={{
				type: 'spring',
				stiffness: 660,
				damping: 100,
				delay: 0.2,
			}}
		>
			<div className="top-box"></div>
			<div className="buttom-box"></div>
			<div className="reservation-box">
				<m.h1
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={downAnimation}
					transition={{
						type: 'spring',
						stiffness: 660,
						damping: 100,
						delay: 0.6,
					}}
				>
					Make a reservation
				</m.h1>
				<Formik
					initialValues={initialValuse}
					enableReinitialize={true}
					validationSchema={validationSchema}
					onSubmit={onSubmitHandler}
				>
					{(formik) => (
						<form className="reservation-form" onSubmit={formik.handleSubmit}>
							<m.input
								type="text"
								name="name"
								placeholder="Full name *"
								className="input-name"
								{...formik.getFieldProps('name')}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								variants={downAnimation}
								transition={{
									type: 'spring',
									stiffness: 660,
									damping: 100,
									delay: 1,
								}}
							/>
							<m.input
								type="phone"
								name="phone"
								placeholder="Phone number *"
								className="input-phone"
								{...formik.getFieldProps('phone')}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								variants={downAnimation}
								transition={{
									type: 'spring',
									stiffness: 660,
									damping: 100,
									delay: 1.4,
								}}
							/>
							<m.input
								type="text"
								name="persons"
								placeholder="Number of persons *"
								className="input-persons"
								{...formik.getFieldProps('persons')}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								variants={downAnimation}
								transition={{
									type: 'spring',
									stiffness: 660,
									damping: 100,
									delay: 1.8,
								}}
							/>
							<m.input
								type="date"
								name="date"
								placeholder="Date"
								className="input-date"
								{...formik.getFieldProps('date')}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								variants={downAnimation}
								transition={{
									type: 'spring',
									stiffness: 660,
									damping: 100,
									delay: 2.2,
								}}
							/>
							<m.input
								type="time"
								name="time"
								placeholder="Time"
								className="input-time"
								{...formik.getFieldProps('time')}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								variants={downAnimation}
								transition={{
									type: 'spring',
									stiffness: 660,
									damping: 100,
									delay: 2.6,
								}}
							/>

							<m.div
								className="submit-button-container"
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true }}
								variants={downAnimation}
								transition={{
									type: 'spring',
									stiffness: 660,
									damping: 100,
									delay: 3,
								}}
							>
								<input
									// onClick={() =>
									// 	onSubmitHandler(formik.values, formik.formikActions)
									// }
									type="submit"
									className="submit-btn"
									value={'BOOK A TABLE'}
								/>
							</m.div>

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
		</m.div>
	);
}

export default Reservation;
