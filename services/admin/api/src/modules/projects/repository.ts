import { PrismaClient } from '@prisma/client';
import { FastifyLoggerInstance } from 'fastify';
import httpErrors from 'http-errors';
import { CreateProjectSchema } from './schema';

export class ProjectsRepository {
  constructor(
    private prisma: PrismaClient,
    private log: FastifyLoggerInstance
  ) {}

  async getAll() {
    return this.prisma.project.findMany();
  }

  async insert(payload: CreateProjectSchema) {
    return this.prisma.project.create({
      data: {
        name: payload.data.name,
        description: payload.data.description,
      },
    });
  }

  async remove(id: number) {
    const project = await this.prisma.project.findFirst({ where: { id } });
    if (!project) {
      throw new httpErrors.NotFound('Project not found');
    }

    return await this.prisma.project.delete({
      where: {
        id,
      },
    });
  }
}
