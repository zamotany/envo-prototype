import { createServer } from './createServer';

async function main() {
  try {
    // TODO: configure pino to emit std{out,err}.log
    const server = await createServer({ logger: true });
    await server.listen({ port: 3000, host: '0.0.0.0' });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

export {};
