/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

if (process.env.HIDE_LOGS === 'true') {
	// Disable logs on production
	console.log = function () {};
	console.warn = function () {};
	console.error = function () {};
}

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);
