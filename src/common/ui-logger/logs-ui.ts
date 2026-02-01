import { config } from 'config/config';

export const logger = () => {
  const logsUI = {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true }
    }
  };

  const logger = 'production' === config.NODE_ENV ? logsUI : false;
  return logger;
};
