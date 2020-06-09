const config = require("../config");
const mysql = require("mysql");

const pool = mysql.createPool({
    connectionLimit : 10,
    host: config.dbconfig.host,
    port: config.dbconfig.port,
    user: config.dbconfig.username,
    password: config.dbconfig.password,
    database: config.dbconfig.database,
    debug: ['ComQueryPacket']
});

module.exports.getDb = () => {
    return new Promise((resove, reject) => {
        pool.getConnection((err, connection) => {
            if(err) {
                return reject(err);
            }
            resove(connection);
        });
    });    
};

module.exports.returnDb = (connection) => {
    return new Promise((resolve, reject) => {
        connection.release();
        resolve(null);
    });
};    