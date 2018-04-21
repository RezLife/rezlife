/**
 * InOpen.js
 * Code behind for InOpen.
 */

var schedule = [];
var table = document.getElementById('maintable').getElementsByTagName('tbody')[0];
var totalRows = 0;
var rows = [];
var user;
var FirstMonday;
var SecondMonday;
var ThirdMonday;
//The monday of the week being viewed
var MainDate;

//connect to mysql database
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "csdb.wheaton.edu",
    port: "3306",
    user: "reslife_user",
    password: "rez4Life!)GrTZ",
    database: "reslife"
});

function getMonday(d) {
    d = new Date(d); document.get
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

function update(val, j, r) {
    var id = (j * 10) + r;

    var status = "In";
    if (val == 2) status = "Open";
    else if (val == 3) status = "Off";


    $(document).ready(function() {
        $('#'+id).text(status);
        $('#p'+id).hide();
   
    });
}



$(document).ready(function () {
    //Show the corresponding popup
    $('.clicker').on('click', function(){
        $('#weekLable').html("working");
    var hid = $('#p' + this.id).is(':visible');
        $('.popuptext').hide();
       if(hid != true) $('#p' + this.id).fadeIn();


    });
    //change which week is being displayed
    $('#submitButton').on('click', function () {
        $('#buildLable').html($('#building').val());
        $('#weekLable').html($('#theWeek').val());
        for(var i = 0; i < 4; i++){
            table.deleteRow(1);
        }
        $(document).ready(function() {
            $(".popuptext").hide();
        });
        //schedule.length = 0;
        
    });

    $('#testing').text(user);

    //Monday of current week
    var date = getMonday(new Date());
    //Format to MM/dd
    var firstSt = (date.getMonth() + 1) + '/' + date.getDate();
    //add 6 days to that week's Sunday
    date.setDate(date.getDate() + 6);
    FirstMonday = date;
    //Format to MM/dd
    var secondSt = (date.getMonth() + 1) + '/' + date.getDate();
    //startdate - enddate
    var final1 = "Current week (" + firstSt + ' - ' + secondSt + ')';
    $('#week1').text(final1);

    //increment one day to next Monday, then repeat for next two weeks
    date.setDate(date.getDate() + 1);
    SecondMonday = date;
    var thirdSt = (date.getMonth() + 1) + '/' + date.getDate();
    date.setDate(date.getDate() + 6);
    var fourthSt = (date.getMonth() + 1) + '/' + date.getDate();
    var final2 = "Next week (" + thirdSt + ' - ' + fourthSt + ')';
    $('#week2').text(final2);

    //increment 1 day
    date.setDate(date.getDate() + 1);
    ThirdMonday = date;
    var fifthSt = (date.getMonth() + 1) + '/' + date.getDate();
    date.setDate(date.getDate() + 6);
    var sixthSt = (date.getMonth() + 1) + '/' + date.getDate();
    var final3 = "2 weeks (" + fifthSt + ' - ' + sixthSt+')';
    $('#week3').text(final3);
});

    //Create the button for each cell
    function createButton(val, j, i) {
        var id = (j * 10) + i;

        var part1 = "<line id="+id+" class=clicker>"+val+'</line><div class="popup"><span class="popuptext" id="p' + id + '"><button onclick="update(1, ';
        return part1 + j + ',' + i + ')">In</button><button onclick="update(2, ' + j + ',' + i + ')">Open</button><button onclick="update(3, ' + j + ',' + i + ')">Off</button></span>';
    }
function setFirstMonday(){
    MainDate = FirstMonday;
}

//fill the table 
function addRow() {
    user = getUser();

    //schedule.length = 0;
   // schedule.splice(0,schedule.length)
    if (typeof addRow.counter == 'undefined') {
        addRow.counter = 0;
    }

    
    var isAccount = true;
    for (var j = totalRows; j < totalRows + 8; j++) {
        rows[j] = table.insertRow(1);
        schedule[j] = new Array(8);
        for (var i = 0; i < 8; i++) {
            schedule[j][i] = rows[j].insertCell(i);
        }


        schedule[j][0].innerHTML = "Steve";
        var testVal = "Open";

        for (var r = 1; r < 8; r++) {

            if (isAccount == true){
                 schedule[j][r].innerHTML = createButton(testVal, j, r);
                 
            }
            else schedule[j][r].innerHTML = testVal;

        }
        if (isAccount == true) isAccount = false;
    }
    totalRows = j;
    $(document).ready(function() {
        $(".popuptext").hide();
    });
}







