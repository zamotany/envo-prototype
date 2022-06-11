import 'dotenv/config';
import pino from 'pino';
import { createServer } from './createServer';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      HOST: string;
      LOGGING_LEVEL_CONSOLE: string;
      LOGGING_LEVEL_STDOUT: string;
      LOGGING_LEVEL_STDERR: string;
      LOGGING_STDOUT_FILE: string;
      LOGGING_STDERR_FILE: string;
    }
  }
}

async function main() {
  try {
    const logger = pino({
      transport: {
        targets: [
          {
            level: process.env.LOGGING_LEVEL_CONSOLE,
            target: 'pino/file',
            options: { destination: '1' },
          },
          {
            level: process.env.LOGGING_LEVEL_STDOUT,
            target: 'pino/file',
            options: { destination: process.env.LOGGING_STDOUT_FILE },
          },
          {
            level: process.env.LOGGING_LEVEL_STDERR,
            target: 'pino/file',
            options: { destination: process.env.LOGGING_STDERR_FILE },
          },
        ],
      },
    });

    const server = await createServer({ logger });
    await server.listen({
      port: parseInt(process.env.PORT, 10),
      host: process.env.HOST,
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

export {};
