const sendmail = require('sendmail')();

async function alert(message) {
    console.log('Sending alert');
    await new Promise((resolve, reject) => {
        sendmail({
            from: process.env.EMAIL_SOURCE,
            to: process.env.EMAIL_RECIPIENTS,
            subject: message
        }, (err, reply) => {
            if (err) reject(err);
            resolve(reply);
        });
    });
}

module.exports = alert;