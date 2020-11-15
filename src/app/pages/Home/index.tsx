import DashboardImg from 'assets/img/dashboard.png';
import ImageGen from 'assets/img/image-gen.png';
import LevelsImg from 'assets/img/levels.png';
import PageLogo from 'assets/img/page-logo.png';
import LazyImage from 'components/LazyImage';
import LinkedButton from 'components/LinkedButton/index';
import React from 'react';
import FeatureSection from './FeatureSection';
import './Home.scss';

const Home: React.FC = () => {
	document.title = 'Josuke';

	return (
		<main className="main-page">
			<LazyImage
				src={PageLogo}
				alt="bot avatar"
				className="logo"
				fallback={<div className="logo-fallback" />}
			/>
			<h1 className="text-light display-4 subtitle">
				Spice up your server with a JoJo bot!
			</h1>
			<h3 className="text-light">Some of Josuke's features include...</h3>

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
				style={{ margin: '50px' }}
				to="/oauth/invite"
				external
				newTab>
				Invite Josuke to your server!
			</LinkedButton>
		</main>
	);
};

export default Home;
