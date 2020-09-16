import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK, UNAUTHORIZED } from 'http-status-codes';
import db from '@models/db';
let Events = db.Events;

const router = Router();

/******************************************************************************
 *                      GET Events - "GET /api/events/"
 ******************************************************************************/

router.get('/', async (req: Request, res: Response) => {
    return res.json(Events);
});

export default router;