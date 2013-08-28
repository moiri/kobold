$(document).ready(function() {
    var i, j, engine, kobold;
    for (i=1; i<=8; i++)
        for (j=0; j<1; j++)
            $('#content')
            .append('<div id="stone' + j + '" class="stone' + i + ' solid"></div>');
    $('#content').append('<div id="elevator1" class="elevator1 solid solidMoving"></div>');
    moveUp = function () {
        $('#elevator1').animate(
            //{"bottom" : "+=450px"},
            {"top" : "-=450px"},
            "slow",
            moveDown
        );
    };
    moveDown = function () {
        $('#elevator1').animate(
            //{"bottom" : "-=450px"},
            {"top" : "+=450px"},
            "slow",
            moveUp
        );
    };
    moveUp();
    $('#content').append('<div id="elevator2" class="elevator2 solid solidMoving"></div>');
    moveRight = function () {
        $('#elevator2').animate(
            {"left" : "-=500px"},
            {
                duration:5000,
                complete: moveLeft
            }
        );
    };
    moveLeft = function () {
        $('#elevator2').animate(
            {"left" : "+=500px"},
            "slow",
            moveRight
        );
    };
    moveRight();
    $('#debug').click(function () {
        $('#content').toggleClass('debug');
    });
    $('#content').append('<div id="pickUp1" class="pickUp1 pickUp"></div>');
    $('#content').append('<div id="pickUp2" class="pickUp2 pickUp"></div>');
    $('#solidCnt').text((i-1)*j);

    engine = new Engine();
    kobold = engine.addMovable();

    engine.start();
    kobold.enableMe();
});

