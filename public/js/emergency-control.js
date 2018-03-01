var speed = "500";
//Document.Ready
$(document).ready(function () {
    //Question handler
    $('li.q').on('click', function () {
        var answer = $(this).next()//next element: answer of the question

        answer.slideToggle(speed)//opens .a of selected question
        answer.siblings('li.a').slideUp();//closes .a of any open answer

        //Grab img from clicked question
        var img = $(this).children('img');
        //Remove Rotate class from all images except the active
        $('img').not(img).removeClass('rotate');
        //toggle rotate class
        img.toggleClass('rotate');



    });//End on click

});
