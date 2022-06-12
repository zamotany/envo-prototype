import { Static, Type as T } from '@sinclair/typebox';

export const createProjectSchema = T.Object({
  data: T.Object({
    name: T.String({ minLength: 3, maxLength: 256 }),
    description: T.Optional(T.String()),
  }),
});

export type CreateProjectSchema = Static<typeof createProjectSchema>;

export const projectParamsSchema = T.Object({
  id: T.Number(),
});

export type ProjectParamsSchema = Static<typeof projectParamsSchema>;
