const mysql = require('mysql2/promise');

module.exports = {
    name: "MySQL database",
    async check(ip) {
        const connection = await mysql.createConnection({
            host: ip,
            user: 'root',
            password: ''
        });
    }
};