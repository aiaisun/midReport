const mysql = require('mysql');
const bluebird = require('bluebird')
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    port: '8889',
    database : 'midReport'
}) ;

db.connect();
bluebird.promisifyAll(db);

module.exports = db;
