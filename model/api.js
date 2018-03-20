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

//get all data from stated table
exports.getAllFromTable = (req,res,table) => {
    con.query('SELECT * FROM ' + table, (error, results, fields) => {
        if (error) res.status(500).send('Something broke!'); //need work
        return res.status(200).json({ results });
    });
}

//get data from stated table and column
exports.getColumnFromTable = (req,res,table,column) => {
    con.query('SELECT ' + column + ' FROM ' + table, (error, results, fields) => {
        if (error) res.status(500).send('Something broke!'); //need work
        return res.status(200).json({ results });
    });
}

//get data by condition
exports.getRowFromTableEqual = (req,res,table,column,row) => {
    con.query('SELECT * FROM ' + table + ' WHERE ' + column + '=\'' + row + '\'', (error, results, fields) => {
        if (error) res.status(500).send('Something broke!'); //need work
        return res.status(200).json({ results });
    });
}