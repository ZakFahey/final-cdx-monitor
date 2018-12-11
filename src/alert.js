const send = require('gmail-send')({
    user: process.env.EMAIL_SERVER_USERNAME,
    pass: process.env.EMAIL_SERVER_PASSWORD,
    to: process.env.EMAIL_RECIPIENTS,
    from: process.env.EMAIL_SERVER_USERNAME,
    text: ''
});

async function alert(message) {
    console.log('Sending alert');
    await new Promise((resolve, reject) => {
        send({ subject: message }, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}

module.exports = alert;