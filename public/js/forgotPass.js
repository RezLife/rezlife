
/**
 * forgotPass.js
 * File to handle client-side validation on forgot password page. 
 */

"use strict";

//input classes grouped into a variable
var input = $('.validate-input .input100');

//on submit, validate the inputs in the form
$('.validate-form').on('submit', function (event) {
    var check = true;

    //validate input individually
    for (var i = 0; i < input.length; i++) {
        if (validate(input[i]) == false) {
            showValidate(input[i]);
            check = false;
        }
    }

    //if input not valid, prevent form from posting
    if (check == false) {
        event.preventDefault();
    }

});

//hide error if error is being fixed by the user
$('.validate-form .input100').each(function () {
    $(this).focus(function () {
        hideValidate(this);
    });
});

//validate the input 
function validate(input) {
    //validation for email
    if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
        if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            return false;
        }
    }
    else {
        //validation for name
        if ($(input).val().trim() == '') {
            return false;
        }
    }
}

//function to add class that shows validation error
function showValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).addClass('alert-validate');
}

//function to remove class, removing validation error
function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
}


/**
 * Jquery for Server Side validation
 */
$('form').submit(function(event){

    //grab data to be sent
    var formData = {
        'email' : $('input[name=email]').val()
    };

    //send data through AJAX for client-side validation
    $.ajax({
        type: "POST",
        url: "/login/forgot",
        data: formData,
        cache: false,
        timeout: 600000,
        error: function (xhr) {
            //if error occurs, give alert
    		alert("ERROR : " + xhr.responseText);
        },
        success: function (response){
            if (response.redirect){
                // response.redirect contains the string URL to redirect to
                window.location = response.redirect;
            }
        }
    });

    //prevent form from submitting like normal
    event.preventDefault();
    
    
});