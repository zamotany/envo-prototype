import { createServer } from './createServer';

async function main() {
  try {
    // TODO: configure pino to emit std{out,err}.log
    const server = await createServer({ logger: true });
    await server.listen({ port: 3000 });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();

export {};
