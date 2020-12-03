import React from 'react';
import './Footer.scss';

const Footer: React.FC = () => (
	<footer className="text-light">&copy; Copyright {new Date().getFullYear()}, ElCholoGamer</footer>
);

export default Footer;
