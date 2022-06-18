import { FastifyInstance } from 'fastify';
import {
  ConfigParamsSchema,
  configParamsSchema,
  ConfigsParamsSchema,
  configsParamsSchema,
  createConfigSchema,
  CreateConfigSchema,
} from '../schemas/configsSchemas';

export async function configsModule(app: FastifyInstance) {
  const repository = app.configsRepository;

  app.get<{ Params: ConfigsParamsSchema }>(
    '/projects/:projectId/environments/:environmentId/configs',
    { schema: { params: configsParamsSchema } },
    async (request, reply) => {
      const configs = await repository.getAll({
        projectId: request.params.projectId,
        environmentId: request.params.environmentId,
        userId: request.auth.getUserId(),
      });
      reply.send({ data: configs });
    }
  );

  app.post<{
    Params: ConfigsParamsSchema;
    Body: CreateConfigSchema;
  }>(
    '/projects/:projectId/environments/:environmentId/configs',
    {
      schema: {
        params: configsParamsSchema,
        body: createConfigSchema,
      },
    },
    async (request, reply) => {
      const config = await repository.insert(
        {
          projectId: request.params.projectId,
          environmentId: request.params.environmentId,
          userId: request.auth.getUserId(),
        },
        request.body
      );
      reply.code(201).send({ data: config });
    }
  );

  app.delete<{
    Params: ConfigParamsSchema;
  }>(
    '/projects/:projectId/environments/:environmentId/configs/:id',
    { schema: { params: configParamsSchema } },
    async (request, reply) => {
      await repository.remove({
        projectId: request.params.projectId,
        environmentId: request.params.environmentId,
        userId: request.auth.getUserId(),
        id: request.params.id,
      });
      reply.code(200).send({ data: null });
    }
  );
}
