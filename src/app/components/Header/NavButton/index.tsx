import React from 'react';
import { useHistory } from 'react-router-dom';
import './NavButton.scss';

interface Props {
	label: string;
	to: string;
}

const NavButton: React.FC<Props> = ({ label, to, children }) => {
	const history = useHistory();
	return (
		<input
			type="button"
			className="nav-button"
			value={label || children?.toString()}
			onClick={() => history.push(to)}
		/>
	);
};

export default NavButton;
