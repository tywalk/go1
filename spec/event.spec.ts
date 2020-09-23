import fetch from 'node-fetch'
import logger from '@shared/Logger';
import app from '@server';
import { Server } from 'http';
import ILocation from '@models/event/location';
import { IApiEvent } from '@models/event/event';

describe('Event test suite', () => {
    let server: Server;
    beforeAll(async (done) => {
        server = app.listen(3000, () => {
            logger.info(`Server listening on port ${process.env.PORT || 3000}`)
        });
        done();
    })
    afterAll(async () => {
        server.close();
    })
    let baseFetch = globalThis.fetch;
    beforeEach(() => {
        (globalThis as any).fetch = fetch;
    })
    afterEach(() => {
        globalThis.fetch = baseFetch;
        logger.info('******************');
    })
    it('Retrieve events', async () => {
        try {
            const req = await fetch("http://localhost:3000/api/events/");
            logger.info(`Events status: ${req.status}`);
            expect(req.status).toEqual(200);
            const events = await req.json();
            logger.info(`Retrieve events length: ${events.length}`);
            expect(events.length).toBeGreaterThan(0);
        }
        catch (e) {
            logger.error(JSON.stringify(e.body));
            fail(e.body);
        }
    })
    it('Search events', async () => {
        try {
            logger.info('Searching location: 2...');
            const req = await fetch("http://localhost:3000/api/events/search", {
                method: 'POST',
                dataType: 'json',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ location: '2' })
            } as any);
            logger.info(`Search status: ${req.status}`);
            expect(req.status).toEqual(200);
            const events = await req.json();
            logger.info(`Search events length: ${events.length}`);
            expect(events.length).toBeGreaterThan(0);
            expect(events.length).toBeLessThan(5);
        }
        catch (e) {
            logger.error(JSON.stringify(e.body));
            fail(e.body);
        }
    })
    it('Retrieve locations', async () => {
        try {
            logger.info('Retrieving locations...');
            const req = await fetch("http://localhost:3000/api/events/locations");
            logger.info(`Locations status: ${req.status}`);
            expect(req.status).toEqual(200);
            const locations = await req.json() as ILocation[];
            logger.info(`Locations length: ${locations.length}`);
            expect(locations.length).toBeGreaterThan(0);
            expect(locations.some(l => l.id == '2')).toBeTrue();
        }
        catch (e) {
            logger.error(JSON.stringify(e.body));
            fail(e.body);
        }
    })
    it('Retrieve event', async () => {
        try {
            logger.info('Retrieving event 50...');
            const req = await fetch("http://localhost:3000/api/events/event/50");
            logger.info(`Locations status: ${req.status}`);
            expect(req.status).toEqual(200);
            const event = await req.json() as IApiEvent;
            expect(event?.id).toEqual('50');
            logger.info(`Event name: ${event.title}`);
        }
        catch (e) {
            logger.error(JSON.stringify(e.body));
            fail(e.body);
        }
    })
})