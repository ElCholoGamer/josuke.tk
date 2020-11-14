import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import './Loading.scss';

const size = 70;
const Loading: React.FC = () => (
	<div className="d-flex justify-content-center spinner-container">
		<Spinner
			variant="light"
			style={{ width: size, height: size }}
			animation="border"
			role="status">
			<span className="sr-only">Loading...</span>
		</Spinner>
	</div>
);

export default Loading;
