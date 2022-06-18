import { PrismaClient } from '@prisma/client';
import { FastifyLoggerInstance } from 'fastify';
import httpErrors from 'http-errors';
import { CreateConfigSchema } from '../schemas/configsSchemas';

export interface ConfigCommonParams {
  projectId: number;
  environmentId: number;
  userId: number;
}

export class ConfigsRepository {
  constructor(
    private prisma: PrismaClient,
    private log: FastifyLoggerInstance
  ) {}

  async ensureProjectExists(params: ConfigCommonParams) {
    if (
      !(await this.prisma.project.findFirst({
        where: {
          id: params.projectId,
          ownerId: params.userId,
        },
      }))
    ) {
      throw new httpErrors.NotFound('Project not found');
    }
  }

  async ensureEnvironmentExists(params: ConfigCommonParams) {
    if (
      !(await this.prisma.environment.findFirst({
        where: {
          id: params.environmentId,
          projectId: params.projectId,
        },
      }))
    ) {
      throw new httpErrors.NotFound('Environment not found');
    }
  }

  async getAll(params: ConfigCommonParams) {
    return await this.prisma.$transaction(async () => {
      await this.ensureProjectExists(params);
      await this.ensureEnvironmentExists(params);
      return await this.prisma.config.findMany({
        where: {
          environmentId: params.environmentId,
        },
      });
    });
  }

  async insert(params: ConfigCommonParams, payload: CreateConfigSchema) {
    return await this.prisma.$transaction(async () => {
      await this.ensureProjectExists(params);
      await this.ensureEnvironmentExists(params);
      return await this.prisma.config.create({
        data: {
          changelog: payload.data.changelog,
          environmentId: params.environmentId,
        },
      });
    });
  }

  async remove(params: ConfigCommonParams & { id: number }) {
    return await this.prisma.$transaction(async () => {
      await this.ensureProjectExists(params);
      await this.ensureEnvironmentExists(params);

      const config = await this.prisma.config.findFirst({
        where: { id: params.id },
      });

      if (!config) {
        throw new httpErrors.NotFound('Config not found');
      }

      if (config.environmentId !== params.environmentId) {
        throw new httpErrors.BadRequest(
          'Config is not assigned to given environment'
        );
      }

      return await this.prisma.config.delete({
        where: {
          id: params.id,
        },
      });
    });
  }
}
