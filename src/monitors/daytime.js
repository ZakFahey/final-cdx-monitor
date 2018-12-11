const net = require('net');

module.exports = {
    name: "daytime service",
    async check(ip) {
        await new Promise((resolve, reject) => {
            const client = net.createConnection({
                host: ip,
                port: 13,
                timeout: 8000
            });
            client.on('data', (data) => {
                const date = new Date(data.toString());
                if (date == 'Invalid Date') reject(new Error());
                client.end();
                resolve();
            });
            client.on('end', resolve);
        });
    }
};