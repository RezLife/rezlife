var parse = require('csv-parse');
var fs = require('fs');

exports.parseIntoDatabase = function (con, fileName, tableName, func) {
    fs.readFile(fileName, function(err, data) {
        if (err) throw err;
        parse(data, function(err, output){
            if (err) throw err;
            var csv = output;

            con.connect(function (err) {
                if (err) throw err;
                // get a string of the columns that will contain the info.
                var columns = "";
                var columns2 = ""; // doesn't have types
                for (var i = 0; i < csv[0].length - 1; i++) {
                    columns += "\`" + csv[0][i] + "\` VARCHAR(255), ";
                    columns2 += "\`" + csv[0][i] + "\`, ";
                }
                columns += "\`" + csv[0][csv[0].length - 1] + "\` VARCHAR(255)";
                columns2 += "\`" + csv[0][csv[0].length - 1] + "\`";

                // Create the table with the columns corresponding to the csv
                con.query("CREATE TABLE IF NOT EXISTS " + tableName + " (" + columns + ")", function(err, result, fields) {
                    if (err) throw err;
                    // parse in all the students
                    con.query("INSERT INTO " + tableName + " (" + columns2 + ") VALUES ?", [csv.slice(1)], function(err, result, fields) {
                        if (err) throw err;
                        con.end();
                        // this continues the function call so things run in order.
                        func();
                    });
                });
            });
        });
    });
};