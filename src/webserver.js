/*
 * Runs a simple web console that lists which services are online.
 * Connect by going to this application's ip in your web browser.
 */

const Hapi = require('hapi');
const db = require('./db');

let monitorFiles;
const ips = process.env.IPS_TO_MONITOR.split(', ');

const server = Hapi.server({
    host: 'localhost',
    port: process.env.PORT,
    routes: { cors: true }
});

async function validate(request, username, password) {
    const isValid = username === process.env.WEBSERVER_USERNAME && password === process.env.WEBSERVER_PASSWORD;
    const credentials = { name: username, id: 0 };
    return { isValid, credentials };
}

async function run(monitors) {
    monitorFiles = monitors;
    await server.register({ plugin: require('hapi-auth-basic') });
    server.auth.strategy('simple', 'basic', { validate });
    
    server.route({
        method: 'GET',
        path: '/',
        options: {
            auth: 'simple'
        },
        handler: async (request, h) => {
            try {
                let ret = "";
                ret += '<!DOCTYPE HTML>';
                ret += '<html>';
                ret += '<head>';
                ret += '<title>Final CDX Monitor</title>';
                ret += '</head>';
                ret += '<body>';
                ret += '<table>';
                ret += '<tr>';
                ret += '<th>IP</th>';
                ret += '<th>Service</th>';
                ret += '<th>Up?</th>';
                ret += '</tr>';

                let data = [];
                for (let i = 0; i < monitorFiles.length; i++) {
                    for (let j = 0; j < ips.length; j++) {
                        data.push(db.lastStatus(monitorFiles[i].name, ips[j]));
                    }
                }

                data = await Promise.all(data);
                let d = 0;

                for (let i = 0; i < monitorFiles.length; i++) {
                    for (let j = 0; j < ips.length; j++) {
                        ret += '<tr>';
                        ret += `<td>${ips[j]}</td>`;
                        ret += `<td>${monitorFiles[i].name}</td>`;
                        ret += `<td>${(data[d] ? 'Up' : 'Down')}</td>`;
                        ret += '</tr>';
                        d++;
                    }
                }


                ret += '</table>';
                ret += '</body>';
                ret += '</html>';

                return h.response(ret);
            } catch (err) {
                console.log('Web request failed');
                console.log(err);
                return h.response('Server error').code(500);
            }
        }
    });

    await server.start();
    console.log('monitoring web server is up');
}

module.exports = run;