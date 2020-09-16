import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, NOT_FOUND } from 'http-status-codes';

import logger from '@shared/Logger';

// Print API errors
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (req.xhr) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
    else {
        res.status(NOT_FOUND);
        res.redirect('/notfound');
    }
}