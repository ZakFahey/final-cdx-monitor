const Sequelize = require('sequelize');

let sequelize, Statuses;

async function initialize() {
    console.log('initializing database');
    sequelize = new Sequelize('final-cdx-monitor', process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
        host: process.env.RDS_HOSTNAME,
        port: process.env.RDS_PORT,
        dialect: 'mysql',
        operatorsAliases: false
    });

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
    await Statuses.create({
        type,
        ip,
        connectionSuccessful: success
    });
}

async function lastStatus(type, ip) {
    const lastEntry = await Statuses.findAll({
        limit: 1,
        order: [['updatedAt', 'DESC']],
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