import { PrismaClient } from '@prisma/client';
import { FastifyLoggerInstance } from 'fastify';
import httpErrors from 'http-errors';
import { CreateEnvironmentSchema } from '../schemas/environmentsSchemas';

export class EnvironmentsRepository {
  constructor(
    private prisma: PrismaClient,
    private log: FastifyLoggerInstance
  ) {}

  async ensureProjectExists(projectId: number, ownerId: number) {
    if (
      !(await this.prisma.project.findFirst({
        where: {
          id: projectId,
          ownerId,
        },
      }))
    ) {
      throw new httpErrors.NotFound('Project not found');
    }
  }

  async getAll(projectId: number, ownerId: number) {
    return await this.prisma.$transaction(async () => {
      await this.ensureProjectExists(projectId, ownerId);
      return await this.prisma.environment.findMany({
        where: {
          projectId,
        },
      });
    });
  }

  async insert(
    projectId: number,
    payload: CreateEnvironmentSchema,
    ownerId: number
  ) {
    return await this.prisma.$transaction(async () => {
      await this.ensureProjectExists(projectId, ownerId);
      return await this.prisma.environment.create({
        data: {
          name: payload.data.name,
          description: payload.data.description,
          projectId: projectId,
        },
      });
    });
  }

  async remove(projectId: number, id: number, ownerId: number) {
    return await this.prisma.$transaction(async () => {
      await this.ensureProjectExists(projectId, ownerId);

      const env = await this.prisma.environment.findFirst({ where: { id } });

      if (!env) {
        throw new httpErrors.NotFound('Environment not found');
      }

      if (env.projectId !== projectId) {
        throw new httpErrors.BadRequest(
          'Environment is not assigned to given project'
        );
      }

      return await this.prisma.environment.delete({
        where: {
          id_projectId: {
            id,
            projectId,
          },
        },
      });
    });
  }
}
