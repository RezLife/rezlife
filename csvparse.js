var parse = require('csv-parse');
var fs = require('fs');
var mysql = require('mysql');

var con = mysql.createConnection ( {
	host: "localhost",
	user: "root",
	password: "",
	database: "housing"
});

fs.readFile('./smithtraber.csv', function(err, data) {
	if (err) throw err;
	parse(data, {comment: '#'}, function(err, output){
		if (err) throw err;
		var csv = output;

		con.connect(function (err) {
			if (err) throw err;
			// get a string of the columns that will contain the info.
			var columns = "";
			var columns2 = ""; // doesn't have types
			for (var i = 0; i < csv[0].length - 1; i++) {
				columns += csv[0][i].toLowerCase().replace(/\s/g,'') + " VARCHAR(255), ";
				columns2 += csv[0][i].toLowerCase().replace(/\s/g,'') + ", ";
			}
			columns += csv[0][csv[0].length - 1].toLowerCase().replace(/\s/g,'') + " VARCHAR(255)";
			columns2 += csv[0][csv[0].length - 1].toLowerCase().replace(/\s/g,'');

			console.log(columns);

			// Create the table with the columns corresponding to the csv
			con.query("CREATE TABLE students (" + columns + ")", function(err, result, fields) {
				if (err) throw err;
				// parse in all the students
				con.query("INSERT INTO students (" + columns2 + ") VALUES ?", [csv.slice(1)], function(err, result, fields) {
					if (err) throw err;
                    con.end();


                    //display upload complete div
                    var x = document.getElementById("myDiv");
                    if (x.style.display == "none") {

                        x.style.display = "block";
                    }
				});
			});
		});
	});
});