
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

app.get('/login', function(req, res) {
    res.sendFile(path.join(publicPath,'views/login','login.html'));
});

app.get('/resapp',function(req,res){
	res.sendFile(path.join(publicPath,'views/webapp','resapp.html'));
});

app.get('/accounts',function(req,res){
	res.sendFile(path.join(publicPath,'views/webapp','accounts.html'));
});
app.get('/roster',function(req,res){
	res.sendFile(path.join(publicPath,'views/webapp','roster.html'));
});
app.get('/calendar',function(req,res){
	res.sendFile(path.join(publicPath,'views/webapp','calendar.html'));
});
app.get('/inopen',function(req,res){
	res.sendFile(path.join(publicPath,'views/webapp','inopen.html'));
});
app.get('/emergency',function(req,res){
	res.sendFile(path.join(publicPath,'views/webapp','emergency.html'));
});

app.get('/blank',function(req,res){
	res.sendFile(path.join(publicPath,'views/webapp','blank.html'));
});






//the server is listening on port 3000. access in browser with localhost:3000
app.listen(3000, function(req,res){
	console.log('Listening on port 3000...');
});