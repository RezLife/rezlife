
// $(document).ready(function(){
//     $("#Fischer").select(function(){
      
//     });
//     });


function showDorms(id) {
    var dorm = document.getElementById(id);
    dorm.classList.toggle("show");
}


//Show dorms for RA Account creation
$('#roles').change(function () {
    if ($(this).val() == "Admin") {
        $('#dorms').hide();
        $('#stFL').hide();
        $('#fiscFL').hide();
    }
    if ($(this).val() == "RA") {
        $('#dorms').show();
    }
});

//Show floors for RA Account creation
$('#dorms').change(function () {
    if ($(this).val() == "Fischer") {
        $('#stFL').hide();
        $('#fiscFL').show();
    }
    if ($(this).val() == "Smith-Traber") {
        $('#fiscFL').hide();
        $('#stFL').show();
    }
});
