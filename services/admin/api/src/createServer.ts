import fastify, { FastifyServerOptions } from 'fastify';
import { projectsModule } from './modules/projects';
import { environmentsModule } from './modules/environments';
import errorHandlers from './plugins/errorHandlers';
import authPlugin from './plugins/auth';
import repositoriesPlugin from './plugins/repositories';

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

  // Plugins
  await app.register(import('@fastify/sensible'));
  await app.register(errorHandlers);
  await app.register(repositoriesPlugin);
  await app.register(authPlugin);

  // Modules
  await app.register(projectsModule, { prefix: '/data' });
  await app.register(environmentsModule, { prefix: '/data' });

  // Misc routes
  app.get('/', () => ({ status: 'ok' }));

  return app;
}
