import React from 'react';
import { Link } from 'react-router-dom';
import { IoChevronBackCircleOutline } from 'react-icons/io5';

import './Menu.css';
import '../index.css';
function Menu() {
	return (
		<div className="menu-container">
			<div className="top-bar">
				<Link to={'/'}>
					<IoChevronBackCircleOutline size={46} />
				</Link>
			</div>
		</div>
	);
}

export default Menu;
