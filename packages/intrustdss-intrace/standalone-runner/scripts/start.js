const { spawn } = require('child_process');

const env = (process.argv[2] || 'dev').toLowerCase();
process.env.APP_ENV = env;
process.env.EXPO_PUBLIC_APP_ENV = env;

console.log('----------------------------------------------------');
console.log(`[inTrace Standalone Runner] Khởi động: ${env.toUpperCase()}`);
console.log(`[Config File] ../src/config/env.${env}.ts`);
console.log('----------------------------------------------------');

const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['expo', 'start', ...process.argv.slice(3)];

const child = spawn(cmd, args, {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
