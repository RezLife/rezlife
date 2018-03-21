
function toggle(id) {
    var stat = "p".concat(id);
    var popup = document.getElementById(stat);
    popup.classList.toggle("show");
  }
  var schedule = new Array(8);

  function func(val, id){
      var status= "In";
    if(val==2)status = "Open";
    else if(val==3) status = "----"
    schedule[id].innerHTML = createButton(status,id);
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

  function createButton(val, i){
    var part1 = "<div id=".concat(i);
        part1 = part1.concat(' class="popup" onclick="toggle(');
        part1 = part1.concat(i);
        part1 = part1.concat(')">').concat(val).concat('<span class="popuptext" id="p');
        part1 = part1.concat(i);
        part1 = part1.concat('"><button onclick="func(1, ');
        part1 = part1.concat(i);
        part1 = part1.concat(')">In</button><button onclick="func(2, ');
        part1 = part1.concat(i);
        part1 = part1.concat(')">Open</button><button onclick="func(3, ');
        part1 = part1.concat(i);
        part1 = part1.concat(')">Off</button></span>');
        return part1;
  }

  function addRow(){
    var table = document.getElementsByTagName('table')[0];
    if( typeof addRow.counter == 'undefined' ) {
      addRow.counter = 0;
  }
      var newRow = table.insertRow(1);
      for(var i = 0; i < 8; i++){
        schedule[i] = newRow.insertCell(i);
      }
      

      schedule[0].innerHTML = "Steve";
      var testVal = "Open";
      var isAccount = true;
      for(var i = 1; i < 8; i++){
        
        if(isAccount == true) schedule[i].innerHTML = createButton(testVal,i);
        else schedule[i].innerHTML = testVal;
        /*schedule[i].innerHTML = createButton("testVal",i);*/
      }
      

  }