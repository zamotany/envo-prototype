import crypto from 'crypto';
import paseto from 'paseto';
import { nanoid } from 'nanoid';
import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { Static, Type as T } from '@sinclair/typebox';

declare module 'fastify' {
  interface FastifyContextConfig {
    auth?: boolean;
  }

  interface FastifyRequest {
    auth: {
      getUserId: () => number;
    };
  }
}

const loginBodySchema = T.Object({
  username: T.String(),
  password: T.String(),
});

const ALLOWED_ENCODED_URI = /^[a-zA-Z0-9!%*()-_'.~]+$/;
const ALLOWED_USERNAME_CHARS = /^[a-zA-Z0-9-_. ]{3,128}$/;
const ALLOWED_PASSWORD_CHARS =
  /^[a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,128}$/;
const ALLOWED_TOKEN = /^v4\.public\.[a-zA-Z0-9-_]+$/;

async function authPlugin(app: FastifyInstance) {
  const key = await paseto.V4.generateKey('public');
  const subjects: Record<number, string> = {};

  app.addHook('onRequest', async (request, reply) => {
    if (request.context.config.auth === false) {
      request.auth = {
        getUserId: () => {
          throw new Error('Cannot get userId id auth is disabled');
        },
      };
      return;
    }

    const authorization = request.headers.authorization;
    if (!authorization) {
      reply.unauthorized();
      return;
    }

    const [, token] = /^Bearer (.+)$/.exec(authorization) ?? [];
    if (!token) {
      reply.unauthorized();
      return;
    }

    if (!ALLOWED_TOKEN.test(token)) {
      reply.unauthorized();
      return;
    }

    let payload: { sub: string };
    try {
      payload = (await paseto.V4.verify(token, key, {
        clockTolerance: '10s',
      })) as { sub: string };
    } catch {
      reply.unauthorized();
      return;
    }

    const userId = Object.entries(subjects).find(
      ([, sub]) => sub === payload.sub
    )?.[0];
    if (!userId) {
      reply.unauthorized();
      return;
    }

    request.auth = { getUserId: () => parseInt(userId, 10) };
  });

  app.post<{
    Body: Static<typeof loginBodySchema>;
  }>(
    '/user/token',
    { schema: { body: loginBodySchema }, config: { auth: false } },
    async (request, reply) => {
      if (!ALLOWED_ENCODED_URI.test(request.body.username)) {
        reply.badRequest('Username must be URI encoded');
        return;
      }

      if (!ALLOWED_ENCODED_URI.test(request.body.password)) {
        reply.badRequest('Password must be URI encoded');
        return;
      }

      const username = decodeURIComponent(request.body.username);
      const password = decodeURIComponent(request.body.password);

      if (!ALLOWED_USERNAME_CHARS.test(username)) {
        reply.badRequest('Username is not valid');
        return;
      }

      if (!ALLOWED_PASSWORD_CHARS.test(password)) {
        reply.badRequest('Password is not valid');
        return;
      }

      const { salt } =
        (await app.prisma.user.findFirst({
          select: {
            salt: true,
          },
          where: {
            username,
          },
        })) ?? {};

      if (!salt) {
        reply.unauthorized();
        return;
      }

      const saltBuffer = Buffer.from(salt, 'hex');
      const hashBuffer = await new Promise<Buffer>((resolve, reject) =>
        crypto.scrypt(password, saltBuffer, 256, (error, key) => {
          if (error) {
            reject(error);
          } else {
            resolve(key);
          }
        })
      );
      const hash = hashBuffer.toString('hex');

      const user = await app.prisma.user.findFirst({
        select: {
          id: true,
        },
        where: {
          username,
          salt,
          hash,
        },
      });

      if (user) {
        const sub = nanoid();
        subjects[user.id] = sub;
        const token = await paseto.V4.sign({ sub }, key);
        reply.send({
          data: { token },
        });
      } else {
        reply.unauthorized();
      }
    }
  );
}

export default fastifyPlugin(authPlugin, {
  name: 'auth-plugin',
  dependencies: ['@fastify/sensible'],
});
