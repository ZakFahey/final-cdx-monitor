const axios = require('axios');

module.exports = {
    name: "wordpress site",
    async check(ip) {
        await axios.get(`http://${ip}/wordpress/?page=4`);
    }
};