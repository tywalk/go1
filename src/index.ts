import './LoadEnv';
import app from '@server';
import logger from '@shared/Logger';

// Start the server
var port = normalizePort(process.env.PORT || '8081');
console.log('Starting app on port ' + port);
logger.info('Starting app on port ' + port);
app.set('port', port);

/**
 * Create HTTP server.
 */
startServer(app, port);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

async function startServer(app, port) {
    app.listen(port || 8081, () => {
        console.log('Server started successfully! Port: ' + (port || 8081));
        logger.info(`Server listening on port ${process.env.PORT || 8081}`)
    });
}
