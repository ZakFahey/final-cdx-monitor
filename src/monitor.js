const db = require('./db');
const alert = require('./alert');

const IPsToMonitor = process.env.IPS_TO_MONITOR.split(', ');
let monitors;

function run(m) {
    monitors = m;
    // Entry point for the module. Pings all the services every minute.
    setInterval(pingServices, 60000);
}

async function pingServices() {
    console.log('pinging services');
    // Loop through each combination of service and IP address.
    for (let m = 0; m < monitors.length; m++) {
        const monitor = monitors[m];
        for (let i = 0; i < IPsToMonitor.length; i++) {
            const ip = IPsToMonitor[i];
            // Run the monitor with a 12-second timeout.
            Promise.race([
                monitor.check(ip),
                new Promise((resolve, reject) => {
                    setTimeout(reject, 12000);
                })
            ])
                // Check was successful
                .then(async result => handleStatus(monitor.name, ip, true))
                // Check was unsuccessful
                .catch(async err => handleStatus(monitor.name, ip, false));
        }
    }
}

async function handleStatus(type, ip, success) {
    const message = `Final CDX: The ${type} is ${(success ? 'up' : 'down')} on IP ${ip}`;
    console.log(message);
    try {
        const lastStatus = await db.lastStatus(type, ip);
        if (lastStatus !== null && lastStatus != success) {
            // Status changed from up to down or down to up, so send email alert.
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
    // Log the status of the service
    db.logStatus(type, ip, success)
        .catch(err => {
            console.log('DB update failed');
            console.log(err);
        });
}

module.exports = run;