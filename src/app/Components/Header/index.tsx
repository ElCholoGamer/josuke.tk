import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { User } from '../../utils';
import './Header.scss';
import NavButton from './NavButton';

interface Props {
	user: User | null;
}

const Header: React.FC<Props> = ({ user }) => {
	const location = useLocation();

	const handleClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
		e.preventDefault();
		e.currentTarget.disabled = true;
		document.title = 'Redirecting...';

		const cookies = new Cookies();
		switch (e.currentTarget.name) {
			case 'login':
				window.localStorage.setItem('redirect', location.pathname);
				window.location.href = '/oauth/login';
				break;
			case 'logout':
				const token = cookies.get('access_token');

				// Remove all cookies
				cookies.remove('access_token');
				cookies.remove('refresh_token');

				// Revoke access token
				fetch(`/oauth/revoke/${token}`, {
					method: 'POST',
				})
					.then(() => window.location.reload())
					.catch(console.error);
				break;
			default:
		}
	};

	return (
		<header>
			<Link to="/" className="title">
				Josuke
			</Link>

			<div className="header-right">
				<nav>
					<NavButton label="Home" to="/" />
					{user && <NavButton label="My Servers" to="/dashboard" />}
					<NavButton label="Webhooks" to="/webhook" />
					{user?.admin && <NavButton label="Admin" to="/admin" />}
				</nav>
				{!user ? (
					// User is not logged in
					<input
						className="log-in"
						name="login"
						type="button"
						onClick={handleClick}
						value="Log In"
					/>
				) : (
					// User is logged in
					<>
						<h3>{user.tag}</h3>
						<img
							className="user-avatar"
							src={user.getAvatarURL({ size: 512 })}
							alt="User avatar"
						/>
						<input
							className="log-out"
							name="logout"
							type="button"
							onClick={handleClick}
							value="Log Out"
						/>
					</>
				)}
			</div>
		</header>
	);
};

export default Header;
