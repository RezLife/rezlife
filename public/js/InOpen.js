
function toggle(id) {

    var stat = "p".concat(id);
    //var popup = document.getElementById(stat);
   // popup.classList.toggle("show");
     $(document).ready(function() {
     $('.popuptext').hide();
     $('#'+stat).fadeIn();

     });

}
var schedule = [];

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

function func(val, j, i) {
    var id = (j * 10) + i;
    var status = "In";
    if (val == 2) status = "Open";
    else if (val == 3) status = id;
    //schedule[j][i].innerHTML = createButton(status, j, i);
    $(document).ready(function() {
        $('#'+id).text(status);
        $('#p'+id).hide();
   
    });
}


//change which week is being displayed
$(document).ready(function () {
    $('.clicker').on('click', function(){
        $('.popuptext').hide();
        $('#p' + this.id).fadeIn();
    });
    $('#submitButton').on('click', function () {
        $('#buildLable').html($('#building').val());
        $('#weekLable').html($('#theWeek').val());
    });
    $('#testing').text(email);

    //Monday of current week
    var date = getMonday(new Date());
    //Format to MM/dd
    var firstSt = (date.getMonth() + 1) + '/' + date.getDate();
    //add 6 days to that week's Sunday
    date.setDate(date.getDate() + 6);
    //Format to MM/dd
    var secondSt = (date.getMonth() + 1) + '/' + date.getDate();
    //startdate - enddate
    var final1 = "Current week (" + firstSt + ' - ' + secondSt + ')';
    $('#week1').text(final1);

    //increment one day to next Monday, then repeat for next two weeks
    date.setDate(date.getDate() + 1);

    var thirdSt = (date.getMonth() + 1) + '/' + date.getDate();
    date.setDate(date.getDate() + 6);
    var fourthSt = (date.getMonth() + 1) + '/' + date.getDate();
    var final2 = "Next week (" + thirdSt + ' - ' + fourthSt + ')';
    $('#week2').text(final2);

    //increment 1 day
    date.setDate(date.getDate() + 1);

    var fifthSt = (date.getMonth() + 1) + '/' + date.getDate();
    date.setDate(date.getDate() + 6);
    var sixthSt = (date.getMonth() + 1) + '/' + date.getDate();
    var final3 = "2 weeks (" + fifthSt + ' - ' + sixthSt+')';
    $('#week3').text(final3);
});

    //Create the button for each cell
    function createButton(val, j, i) {
        var id = (j * 10) + i;

        var part1 = "<line id="+id+" class=clicker>"+val+"</line><div " + ' class="popup"><span class="popuptext" id="p' + id + '"><button onclick="func(1, ';
        return part1 + j + ',' + i + ')">In</button><button onclick="func(2, ' + j + ',' + i + ')">Open</button><button onclick="func(3, ' + j + ',' + i + ')">Off</button></span>';
        //$(document).ready(function () {    
           // $("#p" + id).hide();
        //});
    }

//fill the table 
function addRow() {

    var table = document.getElementsByTagName('table')[0];
    if (typeof addRow.counter == 'undefined') {
        addRow.counter = 0;
    }

    var rows = [];
    var isAccount = true;
    for (var j = 0; j < 4; j++) {
        rows[j] = table.insertRow(1);
        addRow.counter += 1;
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
    $(document).ready(function() {
                    $(".popuptext").hide();
                });

}






