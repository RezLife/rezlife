



function showDorms(id) {
    var dorm = document.getElementById(id);
    dorm.classList.toggle("show");
}


//Show dorms for RA Account creation
$('#roles').change(function () {
    if ($(this).val() == "Admin") {
        $('#dorms').hide();
    }
    if ($(this).val() == "RA") {
        $('#dorms').show();
    }
});

//Show floors for RA Account creation
$('#dorms').change(function () {
    if ($(this).val() == "Fischer") {
        $('#fiscFL').show();
        $('#stFL').hide();
    }
    if ($(this).val() == "Smith-Traber") {
        $('#stFL').show();
        $('#fiscFL').hide();
    }
});
