import logger from './loaders/Logger';
import { Cache } from './loaders/Cache';
import { Server } from './loaders/Server';
import express from 'express';

export class Factory {
  static InitializeServer() {
    try {
      logger.info('index.InitializeServer');
      const app = express();
      const redis = new Cache();
      return Server.getInstance(
        app,
        redis
      );
    } catch (error) {
      logger.error('Error occured in factory while initializing server '+error);
    }
}
}