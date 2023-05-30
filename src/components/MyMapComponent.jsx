import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
export default function MyMapComponent({ center, zoom }) {
	const ref = useRef();

	useEffect(() => {
		new window.google.maps.Map(ref.current, {
			center,
			zoom,
		});
	});

	return <div ref={ref} id="map" />;
}
