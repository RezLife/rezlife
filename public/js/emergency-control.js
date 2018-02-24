$(document).ready(function(){
    $('#tornado-button').click(function(){
        $('#emergency-content').load("/views/emergencies/tornado.html");
    });

    $('#emergency-home-button').click(function(){
        $('#emergency-content').load("/views/emergencies/emergency-home.html");
    });
    
});
