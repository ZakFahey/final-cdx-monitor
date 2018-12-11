const ipp = require('ipp');

module.exports = {
    name: "printer service",
    async check(ip) {
        const uri = `ipp://${ip}:631/ipp/print`;

        const data = ipp.serialize({
            "operation": "Get-Printer-Attributes",
            "operation-attributes-tag": {
                "attributes-charset": "utf-8",
                "attributes-natural-language": "en",
                "printer-uri": uri
            }
        });

        await new Promise((resolve, reject) => {
            ipp.request(uri, data, (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    }
};