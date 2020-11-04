import React from 'react';
import FeatureSection from './FeatureSection';
import LinkedButton from '../../Components/LinkedButton/index';
import PageLogo from 'Assets/img/page-logo.png';
import ImageGen from 'Assets/img/image-gen.png';
import LevelsImg from 'Assets/img/levels.png';
import DashboardImg from 'Assets/img/dashboard.png';
import './Home.scss';

const Home: React.FC = () => {
	document.title = 'Josuke';

	return (
		<main className="main-page">
			<img className="big-image" alt="Bot avatar" src={PageLogo} />
			<h1 className="subtitle">Spice up your server with a JoJo bot!</h1>
			<h3>Some features include...</h3>

			<div className="main-content">
				<FeatureSection
					alignText="left"
					image={ImageGen}
					title="Image Manipulation">
					Josuke's image commands allow for creation of JoJo-themed memes from
					many available templates. Just type a command and some text!
				</FeatureSection>
				<FeatureSection
					alignText="right"
					image={LevelsImg}
					title="Leveling System">
					Keep your guild members engaged by adding a reward system for the most
					active members, and track who talks more! Each member can see their
					level card with their current stats.
				</FeatureSection>
				<FeatureSection
					alignText="left"
					image={DashboardImg}
					title="Web Dashboard">
					Easily modify some aspects of the bot for your server in this web
					dashboard! Just click on "My Servers" and select any on the list.
				</FeatureSection>
			</div>
			<LinkedButton
				style={{ width: '200px', height: '70px', margin: '50px' }}
				to="/bot/invite"
				external
				newTab>
				Invite Josuke to Your Server!
			</LinkedButton>
		</main>
	);
};

export default Home;
