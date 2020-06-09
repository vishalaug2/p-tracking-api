const async = require("async");
const dateformat = require('dateformat');
const { v4: uuidv4 } = require('uuid');
const database = require("../../lib/database");

module.exports.checkLogin = (username, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let connection = await database.getDb();
            async.waterfall([(callback) => {
                connection.query("select id, name, address, email, phone, type, lastloggedin, doctor_id from users where is_active=1 and (email=? or phone=?) and password=?", [username, username, password], (err, results) => {
                    if(err) {
                        return callback(err.sqlMessage);
                    }
                    
                    if(results && results.length>0) {
                        callback(null, results[0]);
                    } else {
                        return callback("Invalid username or password");
                    }
                });
            }, (user, callback) => {
                let token = uuidv4();
                connection.query("insert into user_tokens set ?", {
                    user_id: user.id,
                    token: token,
                    created_on: dateformat(new Date(), 'yyyy-mm-dd HH:MM:ss')
                }, (err, results) => {
                    if(err) {
                        return callback(err.sqlMessage);
                    }
                    user.token = token;
                    callback(null, user);
                });
            }, (user, callback) => {
                connection.query("update users set lastloggedin=now() where id=?", user.id, (err, results) => {
                    if(err) {
                        return callback(err.sqlMessage);
                    }
                    callback(null, user);
                });
            }], (err, r) => {
                database.returnDb(connection);
                if(err) {
                    return reject(err);
                }
                resolve(r);
            });
        } catch(err) {            
            reject(err.message);
        }
    });
};