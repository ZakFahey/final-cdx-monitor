/*
 * MySQL database to log which services are up or down.
 */

const Sequelize = require('sequelize');

let sequelize, Statuses;

async function initialize() {
    console.log('initializing database');
    // Connect to the database.
    sequelize = new Sequelize('final-cdx-monitor', process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
        host: process.env.RDS_HOSTNAME,
        port: process.env.RDS_PORT,
        dialect: 'mysql',
        operatorsAliases: false
    });

    // Create the statuses table if it does not exist.
    Statuses = sequelize.define('statuses', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        ip: {
            type: Sequelize.STRING,
            allowNull: false
        },
        connectionSuccessful: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        type: Sequelize.STRING,
        createdAt: Sequelize.DATE
    }, {
        timestamps: true,
        updatedAt: false
    });

    await Statuses.sync();
    console.log('initialized database');
}

async function logStatus(type, ip, success) {
    console.log('logging status');
    await Statuses.create({
        type,
        ip,
        connectionSuccessful: success
    });
}

async function lastStatus(type, ip) {
    // Gets the current status of the given service on the given ip address
    console.log('fetching last status');
    const lastEntry = await Statuses.findAll({
        limit: 1,
        order: [['createdAt', 'DESC']],
        where: { type, ip }
    });
    if (lastEntry.length === 0) return null;
    return lastEntry[0].connectionSuccessful;
}

module.exports = {
    initialize,
    logStatus,
    lastStatus
};