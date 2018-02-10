/** 
 "import" express javascript library
 Express is a framework package (or in JS terms, a "module"), which makes
 it easier for us to organize our web application
**/
const express = require('express'); 

//the function returns an express "object", which we can do all sorts of things with
const app = express(); 
var path = require('path');
var publicPath = path.join(__dirname,'public');
//function used to "serve" or for the server to deliver a static html file, 
//which is stored in the views directory stated as "index.html". 
//first argument determines the address of which the server sends the file to.
//(in this example, it serves: localhost:3000/ , in the second it is localhost:3000/log-in)
app.use(express.static(publicPath));

app.get('/',function(req,res){
	res.sendFile(path.join(publicPath,'views','homepage.html'));
});

app.get('/log-in', function(req, res) {
    res.sendFile(path.join(publicPath,'views','log-in.html'));
});

app.get('/resapp',function(req,res){
	res.sendFile(path.join(publicPath,'views','resapp.html'));
});





//the server is listening on port 3000. access in browser with localhost:3000
app.listen(3000, function(req,res){
	console.log('Listening on port 3000...');
});