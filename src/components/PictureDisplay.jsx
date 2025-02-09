import '../components/PictureDisplay.css';

const PictureDisplay = ({ img }) => {
	return (
		<div className="display-container">
			<img src={img} className="display-image" alt="display" />
		</div>
	);
};

export default PictureDisplay;
