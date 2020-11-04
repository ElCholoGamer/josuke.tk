import React from 'react';
import { User } from '../../utils';
import './Admin.scss';
import RickRoll from 'Assets/video/admin.mp4';

interface Props {
	user: User | null;
}

const Admin: React.FC<Props> = ({ user }) => {
	if (!user?.admin) {
		return <video autoPlay loop src={RickRoll} />;
	}

	return <h1>Admin</h1>;
};

export default Admin;
