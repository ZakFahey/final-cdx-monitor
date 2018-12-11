const fs = require('fs');
const db = require('./db');
const alert = require('./alert');

// Load all of the monitors from the monitor folder
const monitors = fs.readdirSync(`${__dirname}/monitors/`).map(fname => require(`./monitors/${fname}`));
const IPsToMonitor = process.env.IPS_TO_MONITOR.split(', ');

async function handleStatus(type, ip, success) {
    const message = `Final CDX: The ${type} is ${(success ? 'up' : 'down')} on IP ${ip}`;
    console.log(message);
    try {
        const lastStatus = await db.lastStatus(type, ip);
        if (lastStatus !== null && lastStatus != success) {
            alert(message)
                .catch(err => {
                    console.log('Email sending failed');
                    console.log(err);
                });
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
                Promise.race([
                    monitor.check(ip),
                    new Promise((resolve, reject) => {
                        setTimeout(reject, 12000);
                    })
                ])
                    .then(async result => handleStatus(monitor.name, ip, true))
                    .catch(async err => handleStatus(monitor.name, ip, false));
            }
        }
    }, 60000);
}

module.exports = run;