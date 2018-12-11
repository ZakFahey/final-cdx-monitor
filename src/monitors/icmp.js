const icmp = require('icmp');

module.exports = {
    name: "ICMP service",
    async check(ip) {
        await icmp.ping(ip);
    }
};