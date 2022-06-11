import fastify, { FastifyServerOptions } from 'fastify';

export async function createServer(options?: FastifyServerOptions) {
  const app = fastify(options);

  app.get('/', () => ({ status: 'ok' }));

  return app;
}
