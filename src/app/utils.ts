import { useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';
import config from './config.json';
import React from 'react';

/**
 * Returns the query parameters for
 * the current URL in the browser.
 * @returns The query parameters in the URL.
 */
export const useQuery = () => new URLSearchParams(useLocation().search);

/**
 * Returns a function that will force
 * a component to re-render.
 * @returns A function to force a component re-render.
 */
export const useRerender = () => {
	const [, rerender] = React.useState({});
	return () => rerender({});
};

export interface User {
	id: string;
	tag: string;
	accessToken: string;
	username: string;
	discriminator: number;
	flags: number;
	admin: boolean;
	getAvatarURL(options?: {
		format?: 'jpg' | 'jpeg' | 'png' | 'webp' | 'gif';
		size?: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
	}): string;
}

export interface Guild {
	id: string;
	name: string;
	admin: boolean;
	botAvailable: boolean;
	permissions: number;
}

export interface Config {
	guildName: string;
	prefix: string;
	levels: boolean;
	snipe: boolean;
	send_level: boolean;
	level_message: string;
}

/**
 * Fetches the user associated with the
 * access token stored in cookies if
 * possible and returns it.
 * @returns A promise for fetched user data if found.
 */
export const fetchUser = async (): Promise<User | null> => {
	const cookies = new Cookies();

	let accessToken = cookies.get('access_token');
	let refreshToken = cookies.get('refresh_token');

	if (!accessToken && refreshToken) {
		// Refresh access token
		try {
			const res = await (await fetch(`/oauth/refresh/${refreshToken}`)).json();
			if (res.access_token) {
				const { access_token, refresh_token, expires_in } = res;
				const cookies = new Cookies();

				// Remove existing cookies
				cookies.remove('access_token');
				cookies.remove('refresh_token');

				// Set access token cookie according to provided expiration
				cookies.set('access_token', access_token, {
					expires: new Date(Date.now() + expires_in * 1000),
					path: '/',
					sameSite: true,
				});

				// Set refresh token cookie
				cookies.set('refresh_token', refresh_token, {
					expires: new Date(
						Date.now() + /* One month */ 30 * 24 * 60 * 60 * 1000
					),
					path: '/',
					sameSite: true,
				});

				accessToken = access_token;
				refreshToken = refresh_token;
			}
		} catch (err) {
			console.error(err);
		}
	}

	console.log('Access token:', accessToken);
	if (accessToken) {
		// Fetch user data
		try {
			const Authorization = `Bearer ${accessToken}`,
				// Fetch user info
				res = await fetch('https://discordapp.com/api/users/@me', {
					headers: { Authorization },
				});

			// Check if request was valid
			if (res.status !== 200) {
				if (res.status === 401) {
					cookies.remove('access_token');
					cookies.remove('refresh_token');
				}
				throw new Error(
					'Request error (This could be caused by an invalid access token)'
				);
			}
			const user = await res.json();
			const { username, discriminator, id, avatar } = user;

			return {
				...user,
				admin: config.admins.includes(id),
				accessToken,
				tag: `${username}#${discriminator}`,
				getAvatarURL(options = {}) {
					const { size = 128, format = 'png' } = options;
					return avatar
						? `https://cdn.discordapp.com/avatars/${id}/${avatar}.${format}?size=${size}`
						: `https://cdn.discordapp.com/embed/avatars/${
								discriminator % 5
						  }.${format}`;
				},
			};
		} catch (err) {
			console.error(err);
		}
	}

	return null;
};
