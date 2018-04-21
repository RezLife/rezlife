/**
* calendar.js
* Handles calendar page input/rendering.
*/

$(document).ready(function () {
    //when a dorm is selected, the calendar specific to the dorm will be displayed
    $('#cal-option').change(function(){
        
        //remove any calendars 
        $('iframe').remove();

        //grab value from select drop down
        let val = $('#cal-option option:selected').val();
        
        //append calendar according to the selected dorm name
        if (val == "Smith-Traber") {
            $("#calendar").append("<iframe src='https://calendar.google.com/calendar/embed?src=wheatontraber%40gmail.com&ctz=America%2FChicago' style='border: 0' width='800' height='600' frameborder='0' scrolling='no'></iframe>");
        } else if (val == "Fischer") {
            $("#calendar").append("<iframe src='https://calendar.google.com/calendar/embed?src=wheatonfischer%40gmail.com&ctz=America%2FChicago' style='border: 0' width='800' height='600' frameborder='0' scrolling='no'></iframe>");
        } else if (val == "Mac-Evans") {
            $("#calendar").append("<iframe src='https://calendar.google.com/calendar/embed?src=wheatonmacevans%40gmail.com&ctz=America%2FChicago' style='border: 0' width='800' height='600' frameborder='0' scrolling='no'></iframe>");
        } else {
        }
    })
});