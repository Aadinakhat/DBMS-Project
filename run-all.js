const { spawn } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log(' Starting Automatic Lab Allocation System');
console.log(' Backend: http://localhost:5000');
console.log(' Frontend: http://localhost:3000');
console.log('====================================================');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

// 1. Start Backend Server
const backend = spawn(process.execPath, [path.join(__dirname, 'backend', 'server.js')], {
    stdio: 'inherit',
    cwd: __dirname
});

// 2. Start Frontend Vite Dev Server
const frontend = spawn(npmCmd, ['--prefix', 'frontend', 'run', 'dev', '--', '--port', '3000', '--host'], {
    stdio: 'inherit',
    cwd: __dirname,
    shell: true
});

function shutdown() {
    console.log('\nShutting down services...');
    backend.kill();
    frontend.kill();
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

backend.on('exit', (code) => {
    if (code !== 0 && code !== null) {
        console.error(`Backend exited with code ${code}`);
    }
});

frontend.on('exit', (code) => {
    if (code !== 0 && code !== null) {
        console.error(`Frontend exited with code ${code}`);
    }
});
