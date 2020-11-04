import React from 'react';
import './Loading.scss';

const Loading: React.FC = () => {
	const [dots, setDots] = React.useState(1);

	React.useEffect(() => {
		const timeout = setTimeout(setDots, 500, dots < 3 ? dots + 1 : 1);
		return () => clearTimeout(timeout);
	}, [dots]);

	return (
		<div className="loading-screen">
			<h1>{'.'.repeat(dots)}</h1>
		</div>
	);
};

export default Loading;
