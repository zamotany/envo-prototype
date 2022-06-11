import fastify, { FastifyServerOptions } from 'fastify';
import { projectsModule } from './modules/projects/projects';

export async function createServer(options?: FastifyServerOptions) {
  const app = fastify({
    ajv: {
      customOptions: {
        strict: 'log',
        keywords: ['kind', 'modifier'],
      },
    },
    ...options,
  });

  await app.register(import('@fastify/sensible'));
  await app.register(projectsModule);

  app.get('/', () => ({ status: 'ok' }));

  return app;
}
