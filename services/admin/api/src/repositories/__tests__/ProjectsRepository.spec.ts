import { describe, it, expect, vi, SpyInstanceFn } from 'vitest';
import { ProjectsRepository } from '../ProjectsRepository';

async function createProjectsRepository(
  project: Record<string, SpyInstanceFn>
) {
  const { pino } = await vi.importMock('pino');
  const { PrismaClient } = await vi.importMock('@prisma/client');

  const prisma = new PrismaClient();
  prisma.$transaction = vi.fn(async (fn) => {
    return await fn();
  });
  prisma.project = project;

  const logger = pino();
  const repository = new ProjectsRepository(prisma, logger);

  return {
    repository,
    prisma,
  };
}

describe.concurrent('ProjectsRepository', () => {
  it('should list all projects', async () => {
    const { repository, prisma } = await createProjectsRepository({
      findMany: vi.fn().mockReturnValue([]),
    });
    prisma.project.findMany;

    await expect(repository.getAll()).resolves.toEqual([]);
  });

  it('should insert new project', async () => {
    const { repository } = await createProjectsRepository({
      create: vi.fn(({ data }) => ({ id: 1, ...data })),
    });
    const data = { name: 'Test project' };

    await expect(repository.insert({ data })).resolves.toEqual({
      id: 1,
      ...data,
    });
  });

  it('should delete project', async () => {
    const { repository } = await createProjectsRepository({
      findFirst: vi.fn().mockReturnValue({ id: 1 }),
      delete: vi.fn(),
    });

    await expect(repository.remove(1)).resolves.toBeUndefined();
  });

  it('should throw exception when deleting non-existent project', async () => {
    const { repository } = await createProjectsRepository({
      findFirst: vi.fn().mockReturnValue(null),
      delete: vi.fn(),
    });

    await expect(repository.remove(1)).rejects.toThrowError(
      'Project not found'
    );
  });
});
