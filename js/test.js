$(document).ready(function() {
    var i, j, engine, kobold;
    // SET UP LEVEL (moving objects, solid objects, etc)
    {
        for (i=1; i<=8; i++)
            for (j=0; j<1; j++)
                $('#content')
                .append('<div id="stone' + i*(j+1) + '" class="stone' + i +
                    ' solid"></div>');
        $('#stone3').addClass('fallThroughBar');
        $('#stone6').addClass('solidOnlyTop');
        /*$('#content').append('<div id="elevator1" class="elevator1 solid ' +
            'solidMoving"></div>');
        moveUp = function () {
            $('#elevator1').animate(
                {"bottom" : "+=450px"},
                //{"top" : "-=450px"},
                "slow",
                moveDown
            );
        };
        moveDown = function () {
            $('#elevator1').animate(
                {"bottom" : "-=450px"},
                //{"top" : "+=450px"},
                "slow",
                moveUp
            );
        };
        moveUp();
        $('#content').append('<div id="elevator2" class="elevator2 solid ' +
                'solidMoving"></div>');
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
        moveRight();*/
        $('#content').append('<div id="pickUp1" class="pickUp1 pickUp"></div>');
        $('#content').append('<div id="pickUp2" class="pickUp2 pickUp"></div>');
        $('#solidCnt').text((i-1)*j);
    }

    // START ENGINE AND CUSTOMIZE
    {
        engine = new Engine();
        kobold = engine.newMovable();
        engine.start();
        kobold.enableMe();

        $('#' + kobold.getId())
            .click(function () {
                alert("Kobold: Hey, I was just clicked!");
            })
            .css('cursor', 'pointer');
    }

    // DEBUG STUFF
    {
        $('#debug').click(function () {
            $('body').toggleClass('debug');
            $(this).toggleClass('disable');
            $('#movableClass').toggle();
        });

        $('#enable').click(function () {
            kobold.toggleEnableMe();
            $(this).toggleClass('disable');
        });
        $('#enable-forceDirection').click(function () {
            kobold.toggleEnableAttr('forceDirection');
            $(this).toggleClass('disable');
        });
        $('#enable-run').click(function () {
            kobold.toggleEnableAttr('run');
            $(this).toggleClass('disable');
        });
        $('#enable-jump').click(function () {
            kobold.toggleEnableAttr('jump');
            $(this).toggleClass('disable');
        });
        $('#enable-jumpMovingSolid').click(function () {
            kobold.toggleEnableAttr('jumpMovingSolid');
            $(this).toggleClass('disable');
        });
        $('#enable-crouch').click(function () {
            kobold.toggleEnableAttr('crouch');
            $(this).toggleClass('disable');
        });
        $('#enable-crouchRun').click(function () {
            kobold.toggleEnableAttr('crouchRun');
            $(this).toggleClass('disable');
        });
        $('#enable-crouchJump').click(function () {
            kobold.toggleEnableAttr('crouchJump');
            $(this).toggleClass('disable');
        });
        $('#enable-crouchJumpHigh').click(function () {
            kobold.toggleEnableAttr('crouchJumpHigh');
            $(this).toggleClass('disable');
        });
        $('#enable-forceStand').click(function () {
            kobold.toggleEnableAttr('forceStand');
            $(this).toggleClass('disable');
        });
        $('#enable-forceWalk').click(function () {
            kobold.toggleEnableAttr('forceWalk');
            $(this).toggleClass('disable');
        });
        $('#enable-appear').click(function () {
            kobold.toggleEnableAttr('appear');
            $(this).toggleClass('disable');
        });
        $('#enable-pickUp').click(function () {
            kobold.toggleEnableAttr('pickUp');
            $(this).toggleClass('disable');
        });
        $('#enable-checkPositionAlways').click(function () {
            kobold.toggleEnableAttr('checkPositionAlways');
            $(this).toggleClass('disable');
        });
        $('#enable-checkPositionAllDirections').click(function () {
            kobold.toggleEnableAttr('checkPositionAllDirections');
            $(this).toggleClass('disable');
        });

        $('div[id^="enable"]').each(function () {
            var attr = $(this).attr('id').split('-');
            if (attr.length > 1) {
                if (!kobold.getEnableStatus(attr[1])) {
                    $(this).addClass('disable');
                }
            }
        });
        $('#testStuff').click(function () {
            kobold.teleport(200, 200);
            engine.toggleEnableCollider($('#stone6'));
            engine.toggleEnableCollider($('#elevator1'));
        });
    }
    refresh = function () {
        $('#movableClass').html($('#kobold-img').attr('class'));
        setTimeout(refresh, 100);
    }
    refresh();
});

