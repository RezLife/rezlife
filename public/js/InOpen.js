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
  var schedule = new Array(10);

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
  var rows = new Array(6)
  for(var j = 0; j < 4; j++){
      rows[j] = table.insertRow(1);
      addRow.counter += 1;
      schedule[j] = new Array(8);
      for(var i = 0; i < 8; i++){
        schedule[j][i] = rows[j].insertCell(i);
      }
      

      schedule[j][0].innerHTML = "Steve";
      var testVal = "Open";
      var isAccount = true;
      for(var r = 1; r < 8; r++){
        
        if(isAccount == true) schedule[j][r].innerHTML = createButton(testVal,j ,r);
        else schedule[j][r].innerHTML = testVal;
        
      }
    }  

  }
  