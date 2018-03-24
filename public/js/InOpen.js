/*$(document).ready(function() {
   function changeTable(bui){
     var building=document.getElementById("building").value;
     var cWeek=document.getElementById("theWeek").value;
     var bChange=document.getElementById("buildLable");
     bChange.innerHTML = building;
     var wChange=document.getElementById("weekLable");
     wChange.innerHTML = cWeek;
   }
   $('submitButton').on('click', function() {
     $('buildLable').html($('building').val());
     $('weekLable').html($('theWeek').val());
   });
});*/
function toggle(id) {
    var stat = "p".concat(id);
    var popup = document.getElementById(stat);
    popup.classList.toggle("show");
  }
  var schedule = [[],[]]

  function func(val, j, i){
    var id = (j*10)+i;
      var status= "In";
    if(val==2)status = "Open";
    else if(val==3) status = id;
    schedule[j][i].innerHTML = createButton(status, j, i);
    toggle(id);
  }

  function changeTable(bui){
    var building=document.getElementById("building").value;
    var cWeek=document.getElementById("theWeek").value;
    var bChange=document.getElementById("buildLable");
    bChange.innerHTML = building;
    var wChange=document.getElementById("weekLable");
    wChange.innerHTML = cWeek;
  }

  function createButton(val, j, i){
    var id = (j*10)+i;
    var part1 = "<div id=".concat(id);
        part1 = part1.concat(' class="popup" onclick="toggle(');
        part1 = part1.concat(id);
        part1 = part1.concat(')">').concat(val).concat('<span class="popuptext" id="p');
        part1 = part1.concat(id);
        part1 = part1.concat('"><button onclick="func(1, ');
        part1 = part1.concat(j).concat(',').concat(i);
        part1 = part1.concat(')">In</button><button onclick="func(2, ');
        part1 = part1.concat(j).concat(',').concat(i);
        part1 = part1.concat(')">Open</button><button onclick="func(3, ');
        part1 = part1.concat(j).concat(',').concat(i);
        part1 = part1.concat(')">Off</button></span>');
        return part1;
  }

  function addRow(){
    var table = document.getElementsByTagName('table')[0];
    if( typeof addRow.counter == 'undefined' ) {
      addRow.counter = 0;
  }
  
  for(var j = 0; j < 3; j++){
      var newRow = table.insertRow(1);
      for(var i = 0; i < 8; i++){
        schedule[j][i] = newRow.insertCell(i);
      }
      

      schedule[j][0].innerHTML = "Steve";
      var testVal = "Open";
      var isAccount = true;
      for(var i = 1; i < 8; i++){
        
        if(isAccount == true) schedule[j][i].innerHTML = createButton(testVal,j ,i);
        else schedule[j][i].innerHTML = testVal;
        
      }
    }  

  }
  