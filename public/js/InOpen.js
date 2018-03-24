
function toggle(id) {

    var stat = "p".concat(id);
   // $(document).ready(function() {
    //  $('.popuptext').hide();
    //  $('#'+stat).show();
   // });
    var popup = document.getElementById(stat);
    popup.classList.toggle("show");
  }
  var schedule = [];

  function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  function func(val, j, i){
    var id = (j*10)+i;
      var status= "In";
    if(val==2)status = "Open";
    else if(val==3) status = id;
    schedule[j][i].innerHTML = createButton(status, j, i);
    toggle(id);
  }


//change which week is being displayed
$(document).ready(function() {
   $('#submitButton').on('click', function() {
     $('#buildLable').html($('#building').val());
     $('#weekLable').html($('#theWeek').val());
   });
   $('#testing').text(email);
   var date = getMonday(new Date());
  var firstSt = (date.getMonth() + 1) +'/' + date.getDate();
   var date2 = (date.getDate() + 6);
  var secondSt = (date2.getMonth() + 1) +'/' + date2.getDate();
  var final = firstSt + ' - ' + secondSt;
   $('#week1').text(secondSt);
});

//Create the button for each cell
  function createButton(val, j, i){
    var id = (j*10)+i;
   
      var part1 = "<div id="+id+' class="popup" onclick="toggle('+id+')">'+val+'<span class="popuptext" id="p'+id+'"><button onclick="func(1, ';
      return part1+j+','+i+')">In</button><button onclick="func(2, '+j+','+i+')">Open</button><button onclick="func(3, '+j+','+i+')">Off</button></span>';
  }
  //fill the table 
function addRow() {

  var table = document.getElementsByTagName('table')[0];
  if (typeof addRow.counter == 'undefined') {
    addRow.counter = 0;
  }

  var rows = [];
  var isAccount = true;
  for(var j = 0; j < 4; j++){
      rows[j] = table.insertRow(1);
      addRow.counter += 1;
      schedule[j] = new Array(8);
      for(var i = 0; i < 8; i++){
        schedule[j][i] = rows[j].insertCell(i);
      }
      

      schedule[j][0].innerHTML = "Steve";
      var testVal = "Open";
      
      for(var r = 1; r < 8; r++){
        
        if(isAccount == true) schedule[j][r].innerHTML = createButton(testVal,j ,r);
        else schedule[j][r].innerHTML = testVal;
        
      }
      if(isAccount == true) isAccount = false;
    }  

  }
  





