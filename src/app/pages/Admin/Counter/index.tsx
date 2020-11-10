import React from 'react';
import './Counter.scss';

interface Props {
	label: string;
	end: number | undefined;
	start?: number;
	fallback: string;
	time: number;
}

const Counter: React.FC<Props> = ({
	label,
	end,
	fallback,
	time,
	start = 0,
}) => {
	const [counter, setCounter] = React.useState(start);

	React.useEffect(() => {
		if (!end || counter >= end) return;

		const timer = setTimeout(() => {
			setCounter(counter + 1);
		}, (time / end) * 1000);

		return () => clearTimeout(timer);
	}, [counter, end, time]);

	return (
		<div className="count-section">
			<h2>{label}</h2>
			{end ? <p className="count-up">{counter}</p> : <h3>{fallback}</h3>}
		</div>
	);
};

export default Counter;
