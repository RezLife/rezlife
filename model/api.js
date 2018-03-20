//set of functions to retrieve data according to specific urls 
let mysql = require('mysql');

//currently connected with admin user. Pool instead of connection to deal with multiple requests.
let con = mysql.createPool({
    connectionLimit: 10,
    host: 'csdb.wheaton.edu',
    port: 3306,
    user: 'reslifeadmin',
    password: 'eoekK8bRe4wa',
    database: 'reslife'
});

let tableName = 'testAPI';
// let tableName = ''
exports.getAll = function(res) {
    con.query('SELECT * FROM testAPI', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Todos list.' });
    });
}

