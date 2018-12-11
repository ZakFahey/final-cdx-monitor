const ftp = require('ftp');

module.exports = {
    name: "ftp server",
    async check(ip) {
        let client;
        await new Promise((resolve, reject) => {
            client = new ftp();
            client.on('greeting', resolve);
            client.on('error', reject);
            client.connect({
                host: ip
            });
        });
        client.end();
    }
};