import { existsSync, cpSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const components = join(root, 'didroom-components');
if (!existsSync(join(components, 'package.json'))) {
	console.error(
		'Missing didroom-components checkout. Run: git submodule update --init --recursive'
	);
	process.exit(1);
}

for (const args of [
	['--dir', components, 'install', '--frozen-lockfile'],
	['--dir', components, 'build']
]) {
	const result = spawnSync('pnpm', args, {
		cwd: root,
		stdio: 'inherit',
		env: { ...process.env, PUPPETEER_SKIP_DOWNLOAD: 'true' },
		shell: process.platform === 'win32'
	});
	if (result.error || result.status !== 0) {
		console.error(result.error?.message || 'Components build failed.');
		process.exit(result.status || 1);
	}
}

const destination = join(root, 'static/components');
rmSync(destination, { recursive: true, force: true });
cpSync(join(components, 'dist'), destination, { recursive: true });
