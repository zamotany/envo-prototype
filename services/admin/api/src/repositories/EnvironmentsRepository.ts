import { PrismaClient } from '@prisma/client';
import { FastifyLoggerInstance } from 'fastify';
import httpErrors from 'http-errors';
import { CreateEnvironmentSchema } from '../schemas/environmentsSchemas';

export class EnvironmentsRepository {
  constructor(
    private prisma: PrismaClient,
    private log: FastifyLoggerInstance
  ) {}

  async ensureProjectExists(projectId: number) {
    if (
      !(await this.prisma.project.findFirst({
        where: {
          id: projectId,
        },
      }))
    ) {
      throw new httpErrors.NotFound('Project not found');
    }
  }

  async getAll(projectId: number) {
    return await this.prisma.$transaction(async () => {
      await this.ensureProjectExists(projectId);
      return await this.prisma.environment.findMany({
        where: {
          projectId,
        },
      });
    });
  }

  async insert(projectId: number, payload: CreateEnvironmentSchema) {
    return await this.prisma.$transaction(async () => {
      await this.ensureProjectExists(projectId);
      return await this.prisma.environment.create({
        data: {
          name: payload.data.name,
          description: payload.data.description,
          projectId: projectId,
        },
      });
    });
  }

  async remove(projectId: number, id: number) {
    return await this.prisma.$transaction(async () => {
      await this.ensureProjectExists(projectId);

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
