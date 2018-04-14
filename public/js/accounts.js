
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
    if ($(this).val() == "Admin"|| $(this).val() == "Select") {
        $('#dorms').hide();
        $('#floors').hide();
       // $('#fiscFL').hide();
    }
    if ($(this).val() == "RA") {
        $('#dorms').show();
    }
});

//Show floors for RA Account creation
$('#dorms').change(function () {
     $('#floors').show();
});
