import fastify from 'fastify';
import httpErrors from 'http-errors';
import { describe, it, expect, vi, SpyInstanceFn } from 'vitest';
import { projectsModule } from '../projects';

async function createApp(repository: Record<string, SpyInstanceFn>) {
  const app = fastify({
    ajv: {
      customOptions: {
        strict: 'log',
        keywords: ['kind', 'modifier'],
      },
    },
  });
  await app.register(projectsModule, {
    repository,
  });

  return app;
}

describe.concurrent('projectsModule', () => {
  it('should respond to GET /projects request', async () => {
    const app = await createApp({
      getAll: vi.fn().mockReturnValue([]),
    });
    const response = await app.inject({
      method: 'GET',
      path: '/projects',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      data: [],
    });
  });

  describe('should respond to POST /projects request', () => {
    it('with success', async () => {
      const data = {
        id: 1,
        name: 'Test project',
        description: 'Test description',
      };
      const app = await createApp({
        insert: vi.fn().mockReturnValue(data),
      });
      const response = await app.inject({
        method: 'POST',
        path: '/projects',
        payload: {
          data: {
            name: data.name,
            description: data.description,
          },
        },
      });

      expect(response.statusCode).toBe(201);
      expect(JSON.parse(response.body)).toEqual({
        data,
      });
    });

    it('with failure', async () => {
      const app = await createApp({
        insert: vi.fn(),
      });
      const response = await app.inject({
        method: 'POST',
        path: '/projects',
        payload: {
          data: {},
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('should respond to DELETE /projects/:id request', () => {
    it('with success', async () => {
      const app = await createApp({
        remove: vi.fn((id) => {
          expect(id).toBe(1);
        }),
      });
      const response = await app.inject({
        method: 'DELETE',
        path: '/projects/1',
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({
        data: null,
      });
    });

    it('with failure', async () => {
      const app = await createApp({
        remove: vi.fn().mockRejectedValue(new httpErrors.NotFound()),
      });
      const response = await app.inject({
        method: 'DELETE',
        path: '/projects/2',
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
