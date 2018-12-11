const fs = require('fs');
const db = require('./db');

// Load all of the monitors from the monitor folder
const monitors = fs.readdirSync(`${__dirname}/monitors/`).map(fname => require(`./monitors/${fname}`));
const IPsToMonitor = process.env.IPS_TO_MONITOR.split(', ');

async function handleStatus(type, ip, success) {
    console.log(`${type} is ${(success ? 'up' : 'down')}`);
    try {
        const lastStatus = db.lastStatus(type, ip);
        if (lastStatus === !success) {
            //Send alert
        }
    } catch (err) {
        console.log('DB update failed');
        console.log(err);
    }
    db.logStatus(type, ip, success)
        .catch(err => {
            console.log('DB update failed');
            console.log(err);
        });
}

async function run() {
    setInterval(() => {
        console.log('pinging services');
        for (let m = 0; m < monitors.length; m++) {
            const monitor = monitors[m];
            for (let i = 0; i < IPsToMonitor.length; i++) {
                const ip = IPsToMonitor[i];
                monitor.check(ip)
                    .then(async result => handleStatus(monitor.name, ip, true))
                    .catch(async err => handleStatus(monitor.name, ip, false));
            }
        }
    }, 60000);
}

module.exports = run;