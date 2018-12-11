const monitor = require('./monitor');
const db = require('./db');
const webserver = require('./webserver');
const fs = require('fs');

// Load all of the monitors from the monitor folder
const monitors = fs.readdirSync(`${__dirname}/monitors/`).map(fname => require(`./monitors/${fname}`));

async function run() {
    await db.initialize();
    monitor(monitors);
    webserver(monitors);
}

run();