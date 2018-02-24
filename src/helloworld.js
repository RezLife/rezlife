/** 
 "import" express javascript library
 Express is a framework package (or in JS terms, a "module"), which makes
 it easier for us to organize our web application
**/
const express = require('express');

const app = express(); 

app.use('/',express.static(__dirname + '/views'));


app.get('/test',function(req,res){	
	res.send('This is a test! I am testing to make sure that my tools work');
});

app.get('/test2',function(req,res){
	res.send('Other text to show function');
});
//the server is listening on port 3000. access in browser with localhost:3000
app.listen(3000, function(req,res){
	console.log('Listening on port 3000...');
});