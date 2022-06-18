import { FastifyInstance } from 'fastify';
import {
  CreateProjectSchema,
  createProjectSchema,
  projectParamsSchema,
  ProjectParamsSchema,
} from '../schemas/projectsSchemas';

export async function projectsModule(app: FastifyInstance) {
  const repository = app.projectsRepository;

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
      const project = await repository.insert(
        { userId: request.auth.getUserId() },
        request.body
      );
      reply.code(201).send({ data: project });
    }
  );

  app.delete<{ Params: ProjectParamsSchema }>(
    '/projects/:id',
    { schema: { params: projectParamsSchema } },
    async (request, reply) => {
      await repository.remove({
        userId: request.auth.getUserId(),
        id: request.params.id,
      });
      reply.code(200).send({ data: null });
    }
  );
}
