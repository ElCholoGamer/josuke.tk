import { RequestHandler } from 'express';
import { asyncHandler, isAdmin } from '../util/utils';

const configAuth: RequestHandler = asyncHandler(async (req, res, next) => {
	const {
		params: { guildId },
		headers: { authorization },
	} = req;

	if (!guildId)
		return res.status(400).json({
			status: 400,
			message: 'Guild ID not provided',
		});

	if (!authorization)
		return res.status(403).json({
			status: 403,
			message: '"Authorization" header not provided',
		});

	// Get user guilds
	const guilds: any[] = await (
		await fetch('https://discordapp.com/api/users/@me/guilds', {
			headers: { Authorization: authorization },
		})
	).json();

	// Check if user has access to guild and is administrator
	const guild = guilds.find((guild: { id: string }) => guild.id === guildId);
	if (!guild || !isAdmin(guild.permissions))
		return res.status(403).json({
			status: 403,
			message: 'Invalid "authorization" header',
		});

	req.headers.guildName = guild.name;
	next();
});

export default configAuth;
