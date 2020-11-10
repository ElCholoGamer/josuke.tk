import request from 'supertest';
import app, { setupApp } from '../app';
import db from '../util/db';
import dotenv from 'dotenv';
dotenv.config();

beforeAll(done => {
	setupApp().then(done);
});

afterAll(done => {
	db.end();
	done();
});

describe('Route testing', () => {
	it('should /oauth/login redirect', async () => {
		const res = await request(app).get('/oauth/login');
		expect(res.status).toBe(302);
	});

	it('should /api/admin respond with status 403', async () => {
		const res = await request(app).get('/api/admin/vapidkey');
		expect(res.status).toBe(403);
	});

	it('should /dblwebhook respond with status code 403', async () => {
		const res = await request(app).post('/dblwebhook');
		expect(res.status).toBe(403);
	});

	it('should /api/config respond with status code 403', async () => {
		const res = await request(app)
			.put('/api/config')
			.query({ guild_id: '123456789123456789' });

		expect(res.status).toBe(403);
	});

	it('should /api/admin/stats respond with a valid stats object', async () => {
		const res = await request(app)
			.get('/api/admin/stats')
			.set({ Authorization: process.env.ADMIN_PASSWORD });

		expect(res.body).toHaveProperty('username');
	});
});
