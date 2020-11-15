import React from 'react';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
// import './LinkedButton.scss';

interface Props {
	label?: string;
	to: string;
	external?: boolean;
	newTab?: boolean;
	style?: React.CSSProperties | undefined;
}

const LinkedButton: React.FC<Props> = ({
	label,
	children = '',
	to,
	external = false,
	newTab = false,
	style,
}) => {
	const history = useHistory();
	return (
		<Button
			variant="purple"
			style={{
				fontSize: '20px',
				...style,
			}}
			onClick={() => {
				if (external) {
					if (newTab) window.open(to);
					else window.location.href = to;
				} else history.push(to);
			}}>
			{label || children}
		</Button>
	);
};

export default LinkedButton;
