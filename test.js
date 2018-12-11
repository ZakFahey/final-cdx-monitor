const monitor = require(`./src/monitors/${process.env.MONITOR}`);

monitor.check(process.env.IP)
    .then(result => {
        console.log('success');
    })
    .catch(err => {
        console.log('fail');
        console.log(err);
    });*/