// Serve the static export (out/) to a Playwright browser context through request
// interception, so checks need no server process.
import fs from 'node:fs';
import path from 'node:path';

export const ORIGIN = 'http://v7.test';

const TYPES = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf',
  '.txt': 'text/plain', '.ico': 'image/x-icon', '.xml': 'application/xml',
};

export async function serveOut(context, outDir = 'out') {
  const root = path.resolve(outDir);
  if (!fs.existsSync(path.join(root, 'index.html'))) {
    throw new Error(`No static export at ${root}. Run \`npm run build\` first.`);
  }
  await context.route(`${ORIGIN}/**`, (route) => {
    const pathname = decodeURIComponent(new URL(route.request().url()).pathname);
    let file = path.join(root, pathname);
    if (!file.startsWith(root)) return route.fulfill({ status: 403 });
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file) && fs.existsSync(`${file}.html`)) file = `${file}.html`;
    if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: 'not found' });
    return route.fulfill({ status: 200, contentType: TYPES[path.extname(file)] || 'application/octet-stream', body: fs.readFileSync(file) });
  });
}

export const LAUNCH_ARGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
