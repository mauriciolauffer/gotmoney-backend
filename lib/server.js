'use strict';

import { serve } from '@hono/node-server'
import app from './app.js'
import logger from './utils/logger.js'

const port = process.env.PORT || 3000

logger.info('Starting app: ' + new Date().toJSON());

serve({
  fetch: app.fetch,
  port: port
})

logger.info('Listening port: ' + port);
