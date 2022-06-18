import { Static, Type as T } from '@sinclair/typebox';

export const createConfigSchema = T.Object({
  data: T.Object({
    changelog: T.String(),
    // TODO where's body?
  }),
});

export type CreateConfigSchema = Static<typeof createConfigSchema>;

export const configParamsSchema = T.Object({
  projectId: T.Number(),
  environmentId: T.Number(),
  id: T.Number(),
});

export type ConfigParamsSchema = Static<typeof configParamsSchema>;

export const configsParamsSchema = T.Object({
  projectId: T.Number(),
  environmentId: T.Number(),
});

export type ConfigsParamsSchema = Static<typeof configsParamsSchema>;
