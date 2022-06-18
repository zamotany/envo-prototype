import { FastifyInstance } from 'fastify';
import {
  CreateEnvironmentSchema,
  createEnvironmentSchema,
  environmentParamsSchema,
  EnvironmentParamsSchema,
  EnvironmentsParamsSchema,
  environmentsParamsSchema,
} from '../schemas/environmentsSchemas';

export async function environmentsModule(app: FastifyInstance) {
  const repository = app.environmentsRepository;

  app.get<{ Params: EnvironmentsParamsSchema }>(
    '/projects/:projectId/envs',
    { schema: { params: environmentsParamsSchema } },
    async (request, reply) => {
      const envs = await repository.getAll(
        request.params.projectId,
        request.auth.getUserId()
      );
      reply.send({ data: envs });
    }
  );

  app.post<{
    Params: EnvironmentsParamsSchema;
    Body: CreateEnvironmentSchema;
  }>(
    '/projects/:projectId/envs',
    {
      schema: {
        params: environmentsParamsSchema,
        body: createEnvironmentSchema,
      },
    },
    async (request, reply) => {
      const env = await repository.insert(
        request.params.projectId,
        request.body,
        request.auth.getUserId()
      );
      reply.code(201).send({ data: env });
    }
  );

  app.delete<{
    Params: EnvironmentParamsSchema;
    Body: CreateEnvironmentSchema;
  }>(
    '/projects/:projectId/envs/:id',
    { schema: { params: environmentParamsSchema } },
    async (request, reply) => {
      await repository.remove(
        request.params.projectId,
        request.params.id,
        request.auth.getUserId()
      );
      reply.code(200).send({ data: null });
    }
  );
}
