const fs = require('fs-extra');
const childProcess = require('child_process');

try {
    // Remove current build
    fs.removeSync('./dist/');
    // Copy front-end files
    fs.copySync('./env', './dist/env');
    fs.copySync('./src/build', './dist/client');
    // Transpile the typescript files
    const proc = childProcess.exec('tsc --build tsconfig.prod.json');
    proc.on('close', (code) => {
        if (code !== 0) {
            throw Error(`Build failed: ${code}`);
        }
    })
} catch (err) {
    console.log(err);
}