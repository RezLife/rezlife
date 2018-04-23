/**
* accounts.js
* Handles account page input/rendering.
*/

//Show dorms for RA Account creation
$('#roles').change(function () {
    //If Admin or Select hide the dorm and floor options
    if ($(this).val() === "Admin" || $(this).val() == "Select") {
        $('#dorms').addClass("hidden");
        $('#floors').addClass("hidden");
       // $('#fiscFL').hide();
    }
    //If RA show list of dorms
    if ($(this).val() === "RA") {
        $('#dorms').removeClass("hidden");
    }
});

//Show floors for RA Account creation
$('#dorms').change(function () {
     $('#floors').removeClass("hidden");
});

//Use Ajax for the post method so we can get better error handling
$("#create-account").submit(function (event) {

    //stop submit the form, we will post it manually.
    event.preventDefault();

    // Get form
    var form = $('#create-account')[0];

    // Create an FormData object
    var data = new FormData(form);
    // disabled the submit button
    $("#create-submit").prop("disabled", true);

    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/accounts",
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data, status, xhr) {
            alert("SUCCESS : " + xhr.responseText);
            $("#create-submit").prop("disabled", false);
        },
        error: function (xhr) {
            alert("ERROR : " + xhr.responseText);
            $("#create-submit").prop("disabled", false);
        }
    });
});

//Use Ajax for the post method so we can get better error handling
$("#delete-account").submit(function (event) {
    if (confirm('Are you sure you would like to delete this account?\nThis action cannot be undone.')) {
        //stop submit the form, we will post it manually.
        event.preventDefault();

        // Get form
        var form = $('#delete-account')[0];

        // Create an FormData object
        var data = new FormData(form);
        // disabled the submit button
        $("#delete-submit").prop("disabled", true);

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/deleteAccount",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data, status, xhr) {
                alert("SUCCESS : " + xhr.responseText);
                $("#delete-submit").prop("disabled", false);
            },
            error: function (xhr) {
                alert("ERROR : " + xhr.responseText);
                $("#delete-submit").prop("disabled", false);
            }
        });
    }
});