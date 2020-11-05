import React from 'react';
import { User } from '../../utils';
import './Admin.scss';
import RickRoll from 'assets/video/admin.mp4';

interface Props {
	user: User | null;
}

const Admin: React.FC<Props> = ({ user }) => {
	if (!user?.admin) return <video src={RickRoll} controls={false} autoPlay />;

	return <h1>Admin</h1>;
};

export default Admin;
