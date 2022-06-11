import fastify, { FastifyServerOptions } from 'fastify';
import { Prisma, PrismaClient } from '@prisma/client';
import httpErrors from 'http-errors';
import { projectsModule } from './modules/projects/projects';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

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

  // Dependencies
  const prisma = new PrismaClient();
  app.decorate('prisma', prisma);

  // Global handlers
  app.setErrorHandler(async (error, request, reply) => {
    let outgoingError: {
      statusCode: number;
      message: string;
      name: string;
    } = new httpErrors.InternalServerError();

    if (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientValidationError ||
      error instanceof Prisma.PrismaClientRustPanicError
    ) {
      app.log.error(error, 'Error/Prisma');
      outgoingError = new httpErrors.InternalServerError();
    } else if (httpErrors.isHttpError(error)) {
      outgoingError = error;
    } else if (error.validation) {
      outgoingError = new httpErrors.BadRequest(error.message);
    } else {
      app.log.error(error, 'Error/Unknown');
    }

    reply.code(outgoingError.statusCode).send({
      error: {
        statusCode: outgoingError.statusCode,
        name: outgoingError.name,
        message: outgoingError.message,
      },
    });
  });

  app.setNotFoundHandler(async (_request, reply) => {
    const { statusCode, message, name } = new httpErrors.NotFound();
    reply.code(statusCode).send({
      error: {
        statusCode,
        name,
        message,
      },
    });
  });

  // Modules
  await app.register(projectsModule);

  // Misc routes
  app.get('/', () => ({ status: 'ok' }));

  return app;
}
