var parse = require('csv-parse');
var fs = require('fs');

exports.parseIntoDatabase = function (con, fileName, tableName, year, callback) {
    fs.readFile(fileName, function(err, data) {
        if (err) return callback(err.message);
        parse(data, function(err, output) {
            if (err) return callback(err.message);
            var csv = output;

            con.connect(function (err) {
                if (err) return callback(err.message);
                var columns = "name_last, name_first, studentID, date_of_birth, " +
                            "name_preferred, cohort_year, room_space_description, " +
                            //"record_building, record_floor, record_room_number, " +
                            "email, classification_description_1, city, state_province, record_year";
                // this variable is meant to keep track of which columns in the csv file
                // correlate to actual columns in the DB; some csv files might include
                // columns other than the 12 provided above.
                var validColumns = [];
                for (var i = 0; i < csv[0].length; i++) {
                    if (isColumn(csv[0][i]))
                        validColumns[i] = csv[0][i];
                }
                // for row in the csv (each student) parse out the data and insert it
                for (let i = 1; i < csv.length; i++) {
                    let record = ""; // the list of elements of the record.
                    let id;          // temporary store the student's ID number
                    // for each column of the row (each attribute of the student)
                    for (var j = 0; j < validColumns.length; j++) {
                        // split the DOB into a valid SQL format.
                        if (validColumns[j] === "Date of Birth") {
                            var date_arr = csv[i][j].split("/")
                            record += "\"" + date_arr[2] + "-" + date_arr[0] + "-" + date_arr[1] + "\", ";
                        }
                        else if (isIntCol(validColumns[j]))
                            record += csv[i][j] + ", ";
                        else record += "\"" + csv[i][j] + "\", ";
                        if (validColumns[j] === "Student ID") {
                            id = csv[i][j];
                        }
                        //addBuildingFloorRoom(csv[i][j], record);
                    }
                    record += year; // this column won't be in any csv files
                    // first delete any instances of this same student in case there are duplicates
                    // this will replace duplicate records.
                    con.query("DELETE FROM t_students WHERE record_year = " + year + " AND studentID = " + id, function (err, result, fields) {
                        if (err) return callback(err.message);
                        // insert the info.
                        con.query("INSERT INTO t_students (" + columns + ") VALUES (" + record + ")", function (err, result, fields) {
                            if (err) return callback(err.message);
                            // this continues the function call so things run in order.
                            // Make sure to only callback when the for loop has ended.
                            if (i == (csv.length - 1)) callback();
                        });
                    });
                }

                // OLD ALGORITHM
                // // get a string of the columns that will contain the info.
                // var columns = "";
                // var columns2 = ""; // doesn't have types
                // for (var i = 0; i < csv[0].length - 1; i++) {
                //     columns += "\`" + csv[0][i] + "\` VARCHAR(255), ";
                //     columns2 += "\`" + csv[0][i] + "\`, ";
                // }
                // columns += "\`" + csv[0][csv[0].length - 1] + "\` VARCHAR(255)";
                // columns2 += "\`" + csv[0][csv[0].length - 1] + "\`";
                //
                // // Create the table with the columns corresponding to the csv
                // con.query("CREATE TABLE IF NOT EXISTS " + tableName + " (" + columns + ")", function(err, result, fields) {
                //     if (err) throw err;
                //     // parse in all the students
                //     con.query("INSERT INTO " + tableName + " (" + columns2 + ") VALUES ?", [csv.slice(1)], function(err, result, fields) {
                //         if (err) throw err;
                //         con.end();
                //         // this continues the function call so things run in order.
                //         callback();
                //     });
                // });
            });
        });
    });
};

function isColumn(str) {
    return  str === "Name Last" |
            str === "Name First" |
            str === "Student ID" |
            str === "Date of Birth" |
            str === "Name Preferred" |
            str === "Cohort Year" |
            str === "Room Space Description" |
            str === "Email" |
            str === "Classification Description 1" |
            str === "City" |
            str === "State Province";
}

// returns true if the field is an int type.
function isIntCol(str) {
    return  str === "Student ID" |
            // str === "Date of Birth" |
            str === "Cohort Year";
}

// Not needed with the implementation that does not have record_building
// function addBuildingFloorRoom(str, record) {
//     var regRSD = /.{5}\s\d*/; // The pattern consistent with all Room Space Descriptions.
//     if (regRSD.test(str)) {
//
//     }
//     return
// }