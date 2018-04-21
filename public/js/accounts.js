/**
* accounts.js
* Handles account page input/rendering.
*/

function showDorms(id) {
    var dorm = document.getElementById(id);
    dorm.classList.toggle("show");
}


//Show dorms for RA Account creation
$('#roles').change(function () {

    if ($(this).val() === "Admin"|| $(this).val() == "Select") {
        $('#dorms').addClass("hidden");
        $('#floors').addClass("hidden");
       // $('#fiscFL').hide();
    }
    if ($(this).val() === "RA") {
        $('#dorms').removeClass("hidden");
    }
});

//Show floors for RA Account creation
$('#dorms').change(function () {
     $('#floors').removeClass("hidden");
});
