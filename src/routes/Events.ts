import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';
import db from '../db';
import { IEvent } from '@models/event';
import _ from 'lodash'
import { equalsIgnoreCase } from '@shared/Helper';
import dayjs from 'dayjs'
let Events = db.events as IEvent[];
let MockEvent = new db.MockEvent();

const router = Router();

/******************************************************************************
 *                      GET Events - "GET /api/events/"
 ******************************************************************************/

router.get('/', async (req: Request, res: Response) => {
    // return res.json(Events);
    return res.json(await MockEvent.getMany());
});

router.post('/search',async (req: Request, res: Response) => {
    const { keyword, location, date } = req.body;
    // let filteredEvents = [...Events];
    let filteredEvents = await MockEvent.getMany<IEvent>();
    if(keyword)
        filteredEvents = filteredEvents.filter(e => e.title.indexOf(keyword) > -1);
    if(location)
        filteredEvents = filteredEvents.filter(e => equalsIgnoreCase(e.location.city, location) || 
        equalsIgnoreCase(e.location.country, location) || 
        equalsIgnoreCase(e.location.state, location));
    if(date)
        filteredEvents = filteredEvents.filter(e => dayjs(e.time).day === dayjs(date).day);
    
    return res.json(filteredEvents);
});

export default router;