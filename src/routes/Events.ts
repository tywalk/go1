import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';
import db from '../db';
import { IEvent } from '@models/event';
import _ from 'lodash'
import { equalsIgnoreCase } from '@shared/Helper';
import dayjs from 'dayjs'
import ILocation from '@models/event/location';
import { IApiEvent } from '@models/event/event';
import logger from '@shared/Logger';
let MockEvent = new db.MockEvent();
let Location = new db.Location();

const router = Router();

/******************************************************************************
 *                      GET Events - "GET /api/events/"
 ******************************************************************************/

router.get('/', async (req: Request, res: Response) => {
    let apiEvents = await MockEvent.getMany<IApiEvent>();
    const locations = await Location.getMany<ILocation>();
    //Map events with location
    const events: IEvent[] = apiEvents.map(e => {
        let loc = locations.find(l => l.id === e.location);
        let ev: IEvent = { ...e } as any;
        ev.location = loc;
        return ev;
    });
    return res.json(events);
});

router.get('/event/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    let event = await MockEvent.get<IApiEvent>(id);
    const location = await Location.get<ILocation>(event.location);
    //Map event with location
    let ev: IEvent = { ...event, location } as any;
    return res.json(ev);
});

router.post('/search', async (req: Request, res: Response) => {
    const { keyword, location, date } = req.body;
    logger.info(`Location: ${location}`);
    const locations = await Location.getMany<ILocation>();
    let events = await MockEvent.getMany<IApiEvent>();
    //Map events with location
    let filteredEvents = events.map(e => {
        let loc = locations.find(l => l.id === e.location);
        let ev: IEvent = { ...e } as any;
        ev.location = loc;
        return ev;
    });
    //Check keyword match
    if (keyword)
        filteredEvents = filteredEvents.filter(e => e.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1 || e.description.toLowerCase().indexOf(keyword.toLowerCase()) > -1);
    //Check location match
    if (location)
        filteredEvents = filteredEvents.filter(e => e.location.id === location ||
            equalsIgnoreCase(e.location.city, location) ||
            equalsIgnoreCase(e.location.country, location) ||
            equalsIgnoreCase(e.location.state, location));
    //Check date match
    if (date)
        filteredEvents = filteredEvents.filter(e => dayjs(e.time).day === dayjs(date).day);

    return res.json(filteredEvents);
});

router.get('/locations', async (req: Request, res: Response) => {
    const locations = await Location.getMany<ILocation>();
    return res.json(locations);
})

export default router;