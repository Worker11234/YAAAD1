import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Application } from 'express';
import { getAllQueues } from '../services/queueService';
import { logger } from './logger';

export const setupBullBoard = (app: Application): void => {
  try {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    const queues = getAllQueues();
    const queueAdapters = Object.values(queues).map(queue => new BullAdapter(queue));

    createBullBoard({
      queues: queueAdapters,
      serverAdapter
    });

    app.use('/admin/queues', serverAdapter.getRouter());
    logger.info('Bull Board set up at /admin/queues');
  } catch (error) {
    logger.error('Failed to set up Bull Board:', error);
  }
};