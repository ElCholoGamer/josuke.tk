import React from 'react';
import { useParams } from 'react-router-dom';
import SaveFooter from './SaveFooter';
import Setting from 'components/Setting';
import { compareObjects, Config, debug, User } from '../../utils';
import './GuildDashboard.scss';

interface Props {
	user: User | null;
}

const GuildDashboard: React.FC<Props> = ({ user }) => {
	const [config, setConfig] = React.useState<Config | null>(null);
	const [prevConfig, setPrevConfig] = React.useState<Config | null>(null);
	const [saveButtons, setSaveButtons] = React.useState(true);

	const { guildId } = useParams<{ guildId: string }>();

	React.useEffect(() => {
		let timeout: number | null = null;

		const fetchConfig = async (accessToken: string) => {
			try {
				const res = await fetch(`/api/config?guild_id=${guildId}`, {
					headers: { Authorization: `Bearer ${accessToken}` },
				});

				const data = await res.json();
				if (res.status === 200) {
					setConfig(data);
					setPrevConfig(data);
				}
			} catch (err) {
				debug(err);
			} finally {
				timeout = setTimeout(fetchConfig, 4000, accessToken);
			}
		};

		if (!config && user && !timeout) fetchConfig(user.accessToken).catch(debug);

		return () => {
			if (timeout) clearTimeout(timeout);
		};
	}, [user, config, guildId]);

	if (!user)
		return <h1 className="med-text">Log in to access your servers!</h1>;

	if (!config) return <h1 className="med-text">Loading dashboard...</h1>;

	document.title = `Dashboard | ${config.guildName}`;

	const prefixLimiter = (str: string) =>
		str.trimStart().replace(/\s+$/, ' ').toLowerCase().substr(0, 15);

	const handleClick = () => {
		// Check if string fields are valid
		const { prefix, level_message, levels, send_level } = config;
		if (!prefix.length) {
			alert('Cannot have an empty prefix!');
			return;
		} else if (!level_message.length && levels && send_level) {
			alert('Cannot have an empty level-up message!');
			return;
		}

		// Disable buttons
		setSaveButtons(false);

		// Update config
		fetch(`/api/config?guild_id=${guildId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.accessToken}`,
			},
			body: JSON.stringify(config),
		})
			.then(res => {
				if (res.status === 200) setPrevConfig(config);
				else debug('Failed to save config:', res);
			})
			.catch(debug)
			.finally(() => setSaveButtons(true));
	};

	return (
		<main className="dashboard-main">
			<h1>
				Dashboard for{' '}
				<span style={{ fontWeight: 700 }}>{config.guildName}</span>
			</h1>
			<Setting
				name="prefix"
				config={config}
				setConfig={setConfig}
				type="text"
				stringFormat={prefixLimiter}>
				Bot prefix:
			</Setting>
			<Setting name="snipe" config={config} setConfig={setConfig} type="toggle">
				Message sniping:
			</Setting>

			<h2 className="config-subtitle">Leveling:</h2>
			<Setting
				name="levels"
				config={config}
				setConfig={setConfig}
				type="toggle">
				Enabled:
			</Setting>
			<Setting
				name="send_level"
				config={config}
				setConfig={setConfig}
				type="toggle">
				Send level-up message:
			</Setting>
			<Setting
				name="level_message"
				config={config}
				setConfig={setConfig}
				maxLength={200}
				type="textarea">
				Level-up message:
			</Setting>
			<SaveFooter
				enabled={!compareObjects(config || {}, prevConfig || {})}
				buttonsEnabled={saveButtons}
				onSave={handleClick}
				onReset={() => setConfig(prevConfig)}
			/>
		</main>
	);
};

export default GuildDashboard;
