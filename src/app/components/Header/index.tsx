import axios from 'axios';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import { useHistory, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { debug, User } from '../../utils';
import './Header.scss';

interface Props {
	user: User | null;
}

const Header: React.FC<Props> = ({ user }) => {
	const location = useLocation();
	const history = useHistory();

	const handleClick = ({
		currentTarget,
	}: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
		currentTarget.disabled = true;

		const cookies = new Cookies();
		const accessToken = cookies.get('access_token');

		switch (currentTarget.name) {
			case 'login':
				// Store current path in local storage and redirect to auth
				window.localStorage.setItem('redirect', location.pathname);
				window.location.href = '/oauth/login';
				break;
			case 'logout':
				// Remove all cookies and revoke access token
				cookies.remove('access_token');
				cookies.remove('refresh_token');
				axios
					.post(`/oauth/revoke/${accessToken}`)
					.then(() => window.location.reload())
					.catch(debug);
		}
	};

	const redirect = (path: string) => history.push(path);

	return (
		<Navbar bg="dark" variant="dark" expand="md">
			<Navbar.Brand>Josuke</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<NavItem>
						<NavLink onClick={() => redirect('/')}>Home</NavLink>
					</NavItem>
					{user && (
						<>
							<NavItem>
								<NavLink onClick={() => redirect('/dashboard')}>
									My Servers
								</NavLink>
							</NavItem>
							{user.admin && (
								<NavItem>
									<NavLink onClick={() => redirect('/admin')}>Admin</NavLink>
								</NavItem>
							)}
						</>
					)}
				</Nav>
				<Navbar.Text>
					{user ? (
						<>
							{user.tag}
							<img src={user.getAvatarURL()} className="user-avatar" />
							<Button
								variant="outline-danger"
								name="logout"
								onClick={handleClick}>
								Log Out
							</Button>
						</>
					) : (
						<Button onClick={handleClick} name="login" variant="purple">
							Log In
						</Button>
					)}
				</Navbar.Text>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Header;
