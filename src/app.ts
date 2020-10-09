import { createApp, logger } from 'ice';

const appConfig = {
    app: {
        rootId: 'ice-container',
    },
    router: {
        type: 'browser',
    },
};

logger.setDefaultLevel("trace");

createApp(appConfig);
