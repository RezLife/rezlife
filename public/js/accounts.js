/**
* accounts.js
* Handles account page input/rendering.
*/



//Show dorms for RA Account creation
$('#roles').change(function () {
    //If Admin or Select hide the dorm and floor options
    if ($(this).val() === "Admin"|| $(this).val() == "Select") {
        $('#dorms').addClass("hidden");
        $('#floors').addClass("hidden");
       // $('#fiscFL').hide();
    }
    //If RA shoow list of dorms
    if ($(this).val() === "RA") {
        $('#dorms').removeClass("hidden");
    }
});

//Show floors for RA Account creation
$('#dorms').change(function () {
     $('#floors').removeClass("hidden");
});
