var parse = require('csv-parse');
var fs = require('fs');

exports.parseIntoDatabase = function (con, fileName, tableName, year, callback) {
    fs.readFile(fileName, function(err, data) {
        if (err) throw err;
        parse(data, function(err, output){
            if (err) throw err;
            var csv = output;

            con.connect(function (err) {
                if (err) throw err;
                var columns = "name_last, name_first, student_id, date_of_birth, " +
                            "name_preferred, cohort_year, room_space_description, " +
                            "email, classification_description_1, city, state_province, year";
                // this variable is meant to keep track of which columns in the csv file
                // correlate to actual columns in the DB; some csv files might include
                // columns other than the 12 provided above.
                var validColumns = [];
                for (var i = 0; i < csv[0].length; i++) {
                    if (isColumn(csv[0][i]))
                        validColumns[i] = csv[0][i];
                }
                console.log(columns);
                for (var i = 1; i < csv.length; i++) {
                    var record = "";
                    for (var j = 0; j < validColumns.length; j++) {
                        record += "\"" + csv[i][j] + "\", ";
                    }
                    record += "\"" + year + "\""; // this column won't be in any csv files
                    console.log(record);
                    con.query("INSERT INTO students (" + columns + ") VALUES (" + record + ")", function(err, result, fields) {
                        if (err) throw err;
                        // this continues the function call so things run in order.
                        callback();
                    });
                }


// create table students (name_last VARCHAR(255), name_first VARCHAR(255), student_id VARCHAR(255), date_of_birth VARCHAR(255), name_preferred VARCHAR(255), cohort_year VARCHAR(255), room_space_description VARCHAR(255), email VARCHAR(255), classification_description_1 VARCHAR(255), city VARCHAR(255), state_province VARCHAR(255), year VARCHAR(255));
// INSERT INTO students (name_last, name_first, student_id, date_of_birth, name_preferred, cohort_year, room_space_description, email, classification_description_1, city, state_province, year) VALUES (`Jo`, `Hye Hyun`, `88547`, `8/1/1996`, `Esther`, `2`, `SMITH E234-1`, `esther.jo@my.wheaton.edu`, `Continuing 2nd Year`, `Perry Hall`, `MD`, `2017`);




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