import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { Prisma } from '@prisma/client';
import httpErrors from 'http-errors';

async function errorHandlersPlugin(app: FastifyInstance) {
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
    } else if (
      error.validation ||
      /4\d{2}/.test(error.statusCode?.toString() ?? '')
    ) {
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

  app.addHook('onRequest', async (request, reply) => {
    if (
      request.method !== 'GET' &&
      request.method !== 'DELETE' &&
      !/^application\/json(; charset=.+)?$/.test(
        request.headers['content-type'] ?? ''
      )
    ) {
      reply.badRequest("Content-type header must be set to 'application/json'");
      return;
    }
  });
}

export default fastifyPlugin(errorHandlersPlugin, {
  name: 'error-handlers-plugin',
  dependencies: ['@fastify/sensible'],
});
