import React from 'react';
import './NotFound.scss';

const NotFound: React.FC = () => {
	document.title = 'Not found';
	return <h1 className="not-found">404 Page not found :(</h1>;
};

export default NotFound;
