const axios = require('axios');

module.exports = {
    name: "web server",
    async check(ip) {
        await axios.get(`http://${ip}`);
    }
};