import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';
import { ProjectsRepository } from '../repositories/ProjectsRepository';
import { EnvironmentsRepository } from '../repositories/EnvironmentsRepository';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    projectsRepository: ProjectsRepository;
    environmentsRepository: EnvironmentsRepository;
  }
}

async function repositoriesPlugin(app: FastifyInstance) {
  let isConnecting = false;
  let isConnected = false;
  const MAX_RETRIES = 5;
  let retries = MAX_RETRIES;

  app.decorate('prisma', new PrismaClient());
  app.decorate(
    'projectsRepository',
    new ProjectsRepository(app.prisma, app.log)
  );
  app.decorate(
    'environmentsRepository',
    new EnvironmentsRepository(app.prisma, app.log)
  );

  app.addHook('onRequest', async (request, reply) => {
    if (isConnecting || !isConnected) {
      app.log.warn('Prisma/Still connecting...');
      return reply.serviceUnavailable('Not ready to accept connections');
    }
  });

  async function connect() {
    try {
      app.log.info(
        `Prisma/Connecting to database... (${
          MAX_RETRIES - retries + 1
        }/${MAX_RETRIES})`
      );
      isConnecting = true;
      await app.prisma.$connect();
      isConnecting = false;
      isConnected = true;
      app.log.info('Prisma/Connection established');
    } catch (error) {
      retries--;
      if (retries > 0) {
        setTimeout(connect, 2000);
      } else {
        app.log.fatal(error);
        await app.close();
        process.exit(1);
      }
    }
  }

  app.addHook('onReady', async () => {
    connect();
  });

  app.addHook('onClose', async () => {
    if (isConnected) {
      app.log.info('Prisma/Disconnecting from database...');
      await app.prisma.$disconnect();
      app.log.info('Prisma/Disconnected');
    }
  });
}

export default fastifyPlugin(repositoriesPlugin, {
  name: 'repositories-plugin',
  dependencies: ['@fastify/sensible'],
});
