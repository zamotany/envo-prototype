const glob = require('glob');
const path = require('path');
const fs = require('fs');

async function main() {
  const [, , pattern] = process.argv;

  await Promise.all(
    glob.sync(pattern, { cwd: process.cwd() }).map(async (file) => {
      const filename = path.join(process.cwd(), file);
      const source = await fs.promises.readFile(filename, 'utf-8');
      await fs.promises.writeFile(
        filename,
        source.replace(/import .+ from ['"]((\.+\/)+(?!.+\.js).+)['"];?/gm, (match, importSpecifier) => {
          console.log(`Replacing: ${importSpecifier} in: ${match}`);
          return match.replace(importSpecifier, `${importSpecifier}.js`);
        }),
        'utf-8'
      );
    })
  );
}

main().catch(error => {
  console.error(error);
  process.exit(1)
});
