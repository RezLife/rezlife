
//"import" express javascript library
var express = require('express'); 
var path = require('path');

//the function returns an express "object", which we can do all sorts of things with
var app = express(); 
var publicPath = path.join(__dirname,'public');

//middleware, serves static files
app.use('/',express.static(publicPath));
// app.get('/',function(req,res){
// 	res.sendFile(path.join(__dirname,'forfun.html'));
// });
//app.get('/forfun',function(req,res){
// 	res.sendFile(path.join(__dirname,'forfun.html'));
// })
//handles requests


app.get('/',function(req,res){
	res.sendFile(path.join(publicPath,'views/home','homepage.html'));
});

app.get('/start',function(req,res){
	res.sendFile(path.join(__dirname,'public/views/start.html'))
})

app.get('/log-in', function(req, res) {
    res.sendFile(path.join(publicPath,'views/login','log-in.html'));
});

app.get('/resapp',function(req,res){
	res.sendFile(path.join(publicPath,'views/webapp','resapp.html'));
});

app.get('/blank',function(req,res){
	res.sendFile(path.join(publicPath,'views/webapp','blank.html'));
});

app.get('/charts.html',function(req,res){
	res.sendFile(path.join(publicPath,'views/webapp/charts.html'))
})





//the server is listening on port 3000. access in browser with localhost:3000
app.listen(3000, function(req,res){
	console.log('Listening on port 3000...');
});