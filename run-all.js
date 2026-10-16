const { spawn } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log(' Starting Automatic Lab Allocation System');
console.log(' Backend: http://localhost:5000');
console.log(' Frontend: http://localhost:3000');
console.log('====================================================');

// 1. Start Backend Server (direct Node.js invocation — no shell needed)
const backend = spawn(process.execPath, [path.join(__dirname, 'backend', 'server.js')], {
    stdio: 'inherit',
    cwd: __dirname
});

// 2. Start Frontend Vite Dev Server
//    Uses process.execPath to invoke vite's CLI entry directly, avoiding
//    shell: true (DEP0190) and .cmd spawn issues (EINVAL) on Node v24 Windows.
const viteBin = path.join(__dirname, 'frontend', 'node_modules', 'vite', 'bin', 'vite.js');
const frontend = spawn(process.execPath, [viteBin, '--port', '3000', '--host'], {
    stdio: 'inherit',
    cwd: path.join(__dirname, 'frontend')
});

function shutdown() {
    console.log('\nShutting down services...');
    backend.kill();
    frontend.kill();
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

backend.on('error', (err) => {
    console.error(`Backend failed to start: ${err.message}`);
});

frontend.on('error', (err) => {
    console.error(`Frontend failed to start: ${err.message}`);
});

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
