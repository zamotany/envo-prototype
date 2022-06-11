import { FastifyInstance } from 'fastify';
import { ProjectsRepository } from './repository';
import { CreateProjectSchema, createProjectSchema } from './schema';

export interface ProjectsModuleOptions {
  repository?: ProjectsRepository;
}

export async function projectsModule(
  app: FastifyInstance,
  { repository = new ProjectsRepository() }: ProjectsModuleOptions = {}
) {
  app.get('/projects', async (request, reply) => {
    const projects = await repository.getAll();
    reply.send({ data: projects });
  });

  app.post<{
    Body: CreateProjectSchema;
  }>(
    '/projects',
    { schema: { body: createProjectSchema } },
    async (request, reply) => {
      const project = await repository.insert(request.body);
      reply.code(201).send({ data: project });
    }
  );

  app.delete<{ Params: { id: string } }>(
    '/projects/:id',
    async (request, reply) => {
      await repository.remove(request.params.id);
      reply.code(200).send({ data: null });
    }
  );
}
