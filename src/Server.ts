import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';

import express, { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST, OK } from 'http-status-codes';
import 'express-async-errors';
import { errorHandler } from './routes/middleware';
import logger from '@shared/Logger';
import createError from 'http-errors'
import Api from './routes'

// Init express
const app = express();

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let views = './client/views';
let stat = './client';
let pub = './client/public';

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const webpack = require('webpack');

    // const fs = require('fs-extra');
    logger.info('DEV MODE!!');
    // fs.removeSync('./build/');

    app.use(morgan('dev'));

    views = './build/views';
    stat = './build';
    pub = './build/public';

    const config = require('../webpack.dev.config.js');

    const compiler = webpack(config);

    // compiler.outputFileSystem.readFile

    // Tell express to use the webpack-dev-middleware and use the webpack.config.js
    // configuration file as a base.
    app.use(webpackDevMiddleware(compiler, {
        publicPath: '/',
        writeToDisk: true
    }));
    app.use(webpackHotMiddleware(compiler));
}

// Security
if (process.env.NODE_ENV === 'production') {
    logger.info('PRODUCTION MODE!!');
    app.use(helmet({
        frameguard: false
    }));
}

// Add routes
app.use('/api', Api);

// app.use('/auth', AuthRouter);

// Print API errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const pubDir = path.join(__dirname, pub);
const viewsDir = path.join(__dirname, views);
app.set('views', viewsDir);
// const staticDir = path.join(__dirname, './client/public');
logger.info(__dirname);
const staticPane = path.join(__dirname, stat);
// logger.info(staticDir);
logger.info(staticPane);
// app.use(express.static(staticDir));
app.use(express.static(staticPane, {
    etag: false
}));
app.use(express.static(pubDir));

app.get('/', (req: Request, res: Response) => {
    res.sendFile('index.html', { root: viewsDir });
});

app.get('/*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.indexOf('favicon.ico') > -1) next();
    else
        throw Error("route-error");
});
app.use(errorHandler);
// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req: Request, res: Response, next: NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req['app'].get('env') === 'development' ? err : {};

    logger.error(`Bad request: ${req.originalUrl}`)

    // render the error page
    res.status(err.status || 500);
    // res.send('error.html', { root: viewsDir });
    res.send(`Bad request: ${req.originalUrl}`);
});

// Export express instance
export default app;