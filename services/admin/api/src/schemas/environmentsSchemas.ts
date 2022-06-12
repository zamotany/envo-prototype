import { Static, Type as T } from '@sinclair/typebox';

export const createEnvironmentSchema = T.Object({
  data: T.Object({
    name: T.String({ minLength: 3, maxLength: 256 }),
    description: T.Optional(T.String()),
  }),
});

export type CreateEnvironmentSchema = Static<typeof createEnvironmentSchema>;

export const environmentParamsSchema = T.Object({
  projectId: T.Number(),
  id: T.Number(),
});

export type EnvironmentParamsSchema = Static<typeof environmentParamsSchema>;

export const environmentsParamsSchema = T.Object({
  projectId: T.Number(),
});

export type EnvironmentsParamsSchema = Static<typeof environmentsParamsSchema>;
