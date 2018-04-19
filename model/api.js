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
exports.getAllStudents = (req,res,order) => {
    con.query('SELECT * FROM t_students ORDER BY '+order.split(';')[0], (error, results, fields) => {
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
exports.getAllFromBuilding = (req,res,building,order) => {
    con.query('SELECT * FROM t_students WHERE building=? ORDER BY '+order.split(';')[0], [building], (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

exports.getAllFromFloor = (req,res,building,floor,order) => {
    // var regex = floorNameToQuery(floor) + '%';
    con.query('SELECT * FROM t_students WHERE building=? AND floor=? ORDER BY '+order.split(';')[0],
            [building, floor], (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

//get data from room
exports.getAllFromRoom = (req,res,building,floor,room,order) => {
    // var regex = room + '%';
    con.query('SELECT * FROM t_students WHERE building=? AND floor=? AND room=? ORDER BY '+order.split(';')[0],
            [building, floor, rooom], (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

//search for students
exports.searchAllStudents = (req,res,query,order) => {
    // this allows for each word to be searched for separately
    // all spaces are replaced with ORs in the regex
    var oredWords = query.replace(/ /g, '|');
    var searchString = '.*(' + oredWords + ').*';
    con.query('SELECT * FROM t_students WHERE building RLIKE ? OR floor_and_room RLIKE ? OR name_first RLIKE ?'+
            'OR name_last RLIKE ? OR studentID RLIKE ? OR name_preferred RLIKE ? OR city RLIKE ? OR state_province RLIKE ?'+
            'ORDER BY '+order.split(';')[0],
            [searchString,searchString,searchString,searchString,searchString,searchString, searchString, searchString], (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

//add a students
exports.addStudent = (req,res,fields) => {
    if (fields[2] === 'NULL')
        fields[2] = '';
    var today = new Date();
    fields.push(today.getFullYear());
    con.query('INSERT INTO t_students (name_first, name_last, name_preferred, email, studentID, date_of_birth, cohort_year, classification_description_1, state_province, city, building, floor, room) ' +
            'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
            fields, (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

//delete a students
exports.deleteStudent = (req,res,id) => {
    var today = new Date();
    console.log([id, today.getFullYear()]);
    con.query('DELETE FROM t_students WHERE studentID=?',
            [id], (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

// this function turns the building query into the correct format
function buildingNameToQuery(str) {
    switch (str.toLowerCase()) {
        // case "traber":
        //     return "TRABE";
        // case "smith":
        //     return "SMITH";
        // case "fischer":
        //     return "FISCH";
        // case "macManis":
        //     return "MACMAN";
        // case "evans":
        //     return "EVANS";
        default:
            return str;
    }
}

// this function turns the floor query into the correct format
function floorNameToQuery(str) {
    // if (isNaN(str)) {
    //     return str.substring(str.length - 1, str.length) + str.substring(0,str.length - 1);
    // }
    // else 
    return str;
}