
//"import" express javascript library
var express = require('express'); 
var path = require('path');
var fileUpload = require('express-fileupload');

//the function returns an express "object", which we can do all sorts of things with
var app = express();
app.use(fileUpload());
var publicPath = path.join(__dirname,'public');

//middleware, serves static files
app.use('/',express.static(publicPath));




//handles get requests
app.get('/',function(req,res){
	res.sendFile(path.join(publicPath,'views/home','homepage.html'));
});

app.get('/start',function(req,res){
	res.sendFile(path.join(__dirname,'public/views/start.html'));
});

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

// This handles the uploading done in the roster tab.
app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field is used to retrieve the uploaded file
    var chart = req.files.chartupload;

    // Use the mv() method to place the file somewhere on your server
    chart.mv(path.join(__dirname, 'chart'), function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.sendFile(path.join(publicPath,'views/webapp','roster.html'));
    });
});




//the server is listening on port 3000. access in browser with localhost:3000
app.listen(3000, function(req,res){
	console.log('Listening on port 3000...');
});