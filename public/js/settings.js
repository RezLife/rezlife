/**
* settings.js
* Handles settings page input/rendering.
*/

//Use Ajax for the post method so we can get better error handling
$("#password-update").submit(function (event) {

    //stop submit the form, we will post it manually.
    event.preventDefault();

    // Get form
    var form = $('#password-update')[0];

    // Create an FormData object
    var data = new FormData(form);
    // disabled the submit button
    $("#password-submit").prop("disabled", true);

    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "/settings",
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data, status, xhr) {
            alert("SUCCESS : " + xhr.responseText);
            $("#password-submit").prop("disabled", false);
            form.reset();
        },
        error: function (xhr) {
            alert("ERROR : " + xhr.responseText);
            $("#password-submit").prop("disabled", false);
        }
    });
});