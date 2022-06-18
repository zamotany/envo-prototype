import { PrismaClient } from '@prisma/client';
import { FastifyLoggerInstance } from 'fastify';
import httpErrors from 'http-errors';
import { CreateProjectSchema } from '../schemas/projectsSchemas';

export interface ProjectCommonParams {
  userId: number;
}

export class ProjectsRepository {
  constructor(
    private prisma: PrismaClient,
    private log: FastifyLoggerInstance
  ) {}

  async getAll() {
    return this.prisma.project.findMany();
  }

  async insert(params: ProjectCommonParams, payload: CreateProjectSchema) {
    return this.prisma.project.create({
      data: {
        name: payload.data.name,
        description: payload.data.description,
        ownerId: params.userId,
      },
    });
  }

  async remove(params: ProjectCommonParams & { id: number }) {
    return await this.prisma.$transaction(async () => {
      if (
        !(await this.prisma.project.findFirst({
          where: { id: params.id, ownerId: params.userId },
        }))
      ) {
        throw new httpErrors.NotFound('Project not found');
      }

      return await this.prisma.project.delete({
        where: {
          id: params.id,
        },
      });
    });
  }
}
