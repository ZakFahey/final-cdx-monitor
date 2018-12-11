const monitor = require('./monitor');
const db = require('./db');

async function run() {
    await db.initialize();
    monitor();
}

run();