/*
 * Entry point for the application
 */

const monitor = require('./monitor');
const db = require('./db');
const webserver = require('./webserver');
const fs = require('fs');

// Dynamically load all of the monitors from the monitor folder
const monitors = fs.readdirSync(`${__dirname}/monitors/`).map(fname => require(`./monitors/${fname}`));

async function run() {
    // Initialize the DB and run all the services
    await db.initialize();
    monitor(monitors);
    webserver(monitors);
}

run();