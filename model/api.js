/**
* api.js
* Set of functions to retrive data according to specific urls.
*/

//package added for mysql database communication
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
    con.query('SELECT * FROM t_students WHERE buildingID=? ORDER BY '+order.split(';')[0], [building], (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

exports.getAllFromFloor = (req,res,building,floor,order) => {
    // var regex = floorNameToQuery(floor) + '%';
    con.query('SELECT * FROM t_students WHERE buildingID=? AND floor=? ORDER BY '+order.split(';')[0],
            [building, floor], (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

//get data from room
exports.getAllFromRoom = (req,res,building,floor,room,order) => {
    // var regex = room + '%';
    con.query('SELECT * FROM t_students WHERE buildingID=? AND floor=? AND room=? ORDER BY '+order.split(';')[0],
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
    con.query('SELECT * FROM t_students WHERE building RLIKE ? OR floor RLIKE ? OR room RLIKE ? OR name_first RLIKE ?'+
            'OR name_last RLIKE ? OR studentID RLIKE ? OR name_preferred RLIKE ? OR city RLIKE ? OR state_province RLIKE ?'+
            'ORDER BY '+order.split(';')[0],
            [searchString,searchString,searchString,searchString,searchString,searchString, searchString, searchString, searchString], (error, results, fields) => {
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
    con.query('INSERT INTO t_students (name_first, name_last, name_preferred, email, studentID, date_of_birth, cohort_year, classification_description_1, state_province, city, buildingID, floor, room) ' +
            'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
            fields, (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

//delete a student
exports.deleteStudentByID = (req,res,id) => {
    con.query('DELETE FROM t_students WHERE studentID=?',
            [id], (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

//load dropdownlist for buildings, giving the buildingName as text and buildingID as value
exports.loadBuildingList = (req, res) => {
    con.query('Select buildingName, buildingID From t_building order by buildingOrder asc', (error, results, fields) => {
        if (error) return res.status(500).send(error);
        return res.status(200).json({ results });
    });
};

//delete all students in a dorm based on buildingID
exports.deleteStudentByBuilding = (req,res,b) => {
    con.query('DELETE FROM t_students WHERE buildingID=?',
            [b], (error, results, fields) => {
        if (error) return res.status(500).send(error); //need work
        return res.status(200).json({ results });
    });
};

//delete all students
exports.deleteAllStudents = (req,res) => {
    if (req.session && req.session.user && req.session.user.role == "Admin") {
        con.query('DELETE FROM t_students', (error, results, fields) => {
            if (error) return res.status(500).send(error); //need work
            return res.status(200).json({ results });
        });
    }
    else
        return res.status(400).send("Permission denied");
};