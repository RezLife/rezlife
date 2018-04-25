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

//Dynamically put in the floor lists
$('#dorm').change(function() {
    $('#floor-select').empty();
    switch ($(this).val()) {
        case 'Fischer':
            $('#floor-select').append(
                "<option disabled selected hidden>Select Floor</option>"+
                "<option disabled>Fischer</option>"+
                "<option value='1 West'>1 West</option>"+
                "<option value='2 West'>2 West</option>"+
                "<option value='3 West'>3 West</option>"+
                "<option value='4 West'>4 West</option>"+
                "<option value='5 West'>5 West</option>"+
                "<option value='3 South'>3 South</option>"+
                "<option value='4 South'>4 South</option>"+
                "<option value='5 South'>5 South</option>"+
                "<option value='2 East'>2 East</option>"+
                "<option value='3 East'>3 East</option>"+
                "<option value='4 East'>4 East</option>"+
                "<option value='5 East'>5 East</option>"
            );
            break;
        case 'Smaber':
            $('#floor-select').append(
                "<option disabled selected hidden>Select Floor</option>"+
                "<option disabled>Smith-Traber</option>"+
                "<option value='1 South'>1 South</option>"+
                "<option value='2 South'>2 South</option>"+
                "<option value='3 South'>3 South</option>"+
                "<option value='2 East'>2 East</option>"+
                "<option value='3 East'>3 East</option>"+
                "<option value='Traber 2'>Traber 2</option>"+
                "<option value='Traber 3'>Traber 3</option>"+
                "<option value='Traber 4'>Traber 4</option>"+
                "<option value='Traber 5'>Traber 5</option>"+
                "<option value='Traber 6'>Traber 6</option>"+
                "<option value='Traber 7'>Traber 7</option>"
            );
            break;
        case 'UCH':
            $('#floor-select').append(
                "<option disabled selected hidden>Select Floor</option>"+
                "<option disabled>UCH</option>"+
                "<option value='McManis 1'>McManis 1</option>"+
                "<option value='McManis 2'>McManis 2</option>"+
                "<option value='McManis 3'>McManis 3</option>"+
                "<option value='McManis 4'>McManis 4</option>"+
                "<option value='McManis 5'>McManis 5</option>"+
                "<option value='Evans 1'>Evans 1</option>"+
                "<option value='Evans 2'>Evans 2</option>"+
                "<option value='Evans 3'>Evans 3</option>"+
                "<option value='Evans 4'>Evans 4</option>"+
                "<option value='Evans 5'>Evans 5</option>"+
                "<option value='Willie 1'>Willie 1</option>"+
                "<option value='Willie 2'>Willie 2</option>"+
                "<option value='Willie 3'>Willie 3</option>"
            );
        default:
            break;
    }
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
        //stop submit the form, we will post it manually.
        event.preventDefault();

    if (confirm('Are you sure you would like to delete this account?\nThis action cannot be undone.')) {
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