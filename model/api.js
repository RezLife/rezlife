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
exports.getAllStudents = (req,res) => {
    con.query('SELECT * FROM t_students', (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
}

//get data from stated table and column
exports.getColumnFromTable = (req,res,table,column) => {
    con.query('SELECT ' + column + ' FROM ' + table, (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

//get data by condition
exports.getRowFromTableEqual = (req,res,table,column,row) => {
    con.query('SELECT * FROM ' + table + ' WHERE ' + column + '=\'' + row + '\'', (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

//get data from building
exports.getAllFromBuilding = (req,res,building) => {
    con.query('SELECT * FROM t_students WHERE building=?', buildingNameToQuery(building), (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

exports.getAllFromFloor = (req,res,building,floor) => {
    var regex = floorNameToQuery(floor) + '%';
    con.query('SELECT * FROM t_students WHERE building=? AND floor_and_room LIKE ?',
            [buildingNameToQuery(building), regex], (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

//get data from room
exports.getAllFromRoom = (req,res,building,floor,room) => {
    var regex = room + '%';
    con.query('SELECT * FROM t_students WHERE building=? AND floor_and_room LIKE ?',
            [buildingNameToQuery(building), regex], (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

//search for students
exports.searchAllStudents = (req,res,query) => {
    var searchString = '%' + query + '%';
    console.log(searchString);
    con.query('SELECT * FROM t_students WHERE building LIKE ? OR floor_and_room LIKE ? OR name_first LIKE ?'+
            'OR name_last LIKE ? OR studentID LIKE ? OR name_preferred LIKE ?',
            [searchString,searchString,searchString,searchString,searchString,searchString], (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

// this function turns the building query into the correct format
function buildingNameToQuery(str) {
    switch (str.toLowerCase()) {
        case "traber":
            return "Traber";
        case "smith":
            return "Smith";
        case "fischer":
            return "Fischer";
        case "macManis":
            return "MacManis";
        case "evans":
            return "Evans";
        default:
            return str;
    }
}

// this function turns the floor query into the correct format
function floorNameToQuery(str) {
    if (isNaN(str)) {
        return str.substring(str.length - 1, str.length) + str.substring(0,str.length - 1);
    }
    else return str;
}