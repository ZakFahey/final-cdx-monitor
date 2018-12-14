/*
 * Runs an individual monitoring program once.
 * To use, run IPS_TO_MONITOR=<ip> MONITOR=<daytime | ftp | icmp | ipp | mysql | website | wordpress> npm run test
 */

const monitor = require(`./src/monitors/${process.env.MONITOR}`);

monitor.check(process.env.IP)
    .then(result => {
        console.log('success');
        console.log(result);
    })
    .catch(err => {
        console.log('fail');
        console.log(err);
    });