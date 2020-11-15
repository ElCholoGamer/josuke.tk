import React from 'react';
import './FeatureSection.scss';

interface Props {
	title: string;
	image: string;
	text?: string;
	alignText: 'right' | 'left';
}

const FeatureSection: React.FC<Props> = ({
	title,
	alignText,
	children,
	image,
	text,
}) => (
	<div className="feature-section">
		<h1 className="feature-title display-4 text-lightpurple">{title}</h1>
		<div
			className="feature-container"
			style={{
				flexDirection: alignText === 'left' ? 'row' : 'row-reverse',
			}}>
			<p className="feature-text text-light">{text || children}</p>
			<img className="feature-image" src={image} alt="" />
		</div>
	</div>
);

export default FeatureSection;
