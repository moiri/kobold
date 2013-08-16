$(document).ready(function() {
    for (i=1; i<=6; i++)
        for (j=0; j<20; j++)
            $('body')
            .append('<div id="stone' + j + '" class="stone' + i + ' solid"></div>');
    var solids = $('.solid');
    var ticker = new Ticker();
    var keyHandler = new KeyHandler();
    var kobold = new Movable('kobold', solids);
    var tempJumpDist = null;
    $('#solidCnt').text(solids.length);
    ticker.drawFps();
    ticker.startTicker(function () {
        kobold.setDeltaTime(ticker.getDeltaTime() * 0.2);
        kobold.inAir();
        if (keyHandler.keyCodeMap[32]) kobold.jump();
        if (keyHandler.keyCodeMap[37]) kobold.moveLeft();
        if (keyHandler.keyCodeMap[39]) kobold.moveRight();
        if (keyHandler.keyCodeMap[17]) kobold.crouch();
        if (!keyHandler.keyCodeMap[17]) kobold.standUp();
        if (!keyHandler.keyCodeMap[39] && !keyHandler.keyCodeMap[37]) {
            kobold.stop();
            kobold.idle();
        }
    });

    $(document).keydown( function (event) {
        event.preventDefault();
        keyHandler.setKey(event.keyCode, true);
    });

    $(document).keyup( function (event) {
        keyHandler.setKey(event.keyCode, false);
    });

    $(document).blur( function (event) {
        keyHandler.clearKeyCodeMap();
    });
});

function Movable (id, solids) {
    var me = this;
    me.id = id;
    me.idImg = me.id + "-img";
    me.obj = $('#' + me.id);
    me.collider = [];
    me.collider.left = [];
    me.collider.left.isColliding = false;
    me.collider.left.tolerance = 2;
    me.collider.right = [];
    me.collider.right.isColliding = false;
    me.collider.right.tolerance = 2;
    me.collider.top = [];
    me.collider.top.isColliding = false;
    me.collider.top.obj = null;
    me.collider.bottom = [];
    me.collider.bottom.isColliding = false;
    me.speed = [];
    me.speed.right = 1;
    me.speed.left = -1;
    me.speed.jump = 6;
    me.speed.fall = -6;
    me.speed.inAir = 0;
    me.move = [];
    me.move.x = 0;
    me.move.y = 0;
    me.deltaTime = 5;
    me.deltaDistFactor = 50;
    me.deltaDist = me.speed.fall/me.deltaDistFactor;
    me.jumpLimiter = [];
    me.jumpLimiter.maxHeight = Math.floor(me.speed.jump * (2.5 + me.deltaDistFactor / 2));
    me.jumpLimiter.startHeight = 0;
    me.height = [];
    me.height.stand = 85;
    me.height.crouch = 40;
    me.action = [];
    me.action.crouch = false;

    $('<div id="' + me.id + '-collider-left" class="collider colliderLeft"></div>')
    .appendTo('#' + me.id);
    me.collider.left.obj = $('#' + me.id + '-collider-left');

    $('<div id="' + me.id + '-collider-right" class="collider colliderRight"></div>')
    .appendTo('#' + me.id);
    me.collider.right.obj = $('#' + me.id + '-collider-right');

    $('<div id="' + me.id + '-collider-top" class="collider colliderTop"></div>')
    .appendTo('#' + me.id);
    me.collider.top.obj = $('#' + me.id + '-collider-top');

    $('<div id="' + me.id + '-collider-bottom" class="collider colliderBottom"></div>')
    .appendTo('#' + me.id);
    me.collider.bottom.obj = $('#' + me.id + '-collider-bottom');

    this.setDeltaTime = function (val) {
        me.deltaTime = val;
    };

    this.collisionCheck = function (direction) {
        var collision = false;
        var collidedObjects = [];
        solids.each(function () {
            collisionRes = overlaps(me.collider[direction].obj, $(this));
            if (collisionRes.isColliding) {
                collision = true;
                collidedObjects.push(collisionRes.pos2);
            }
        });
        me.collider[direction].isColliding = collision;
        return collidedObjects;
    };

    this.moveLeft = function () {
        $('#' + me.idImg).removeClass('idle right');
        $('#' + me.idImg).addClass('walk left');
        me.move.x = Math.floor(me.speed.left * me.deltaTime);
        var moveDistCollider = Math.abs(me.move.x) + 1;
        me.collider.left.obj.width(moveDistCollider + "px");
        me.collider.left.obj.css("left", "-" + moveDistCollider + "px");
        var collidedObjects = me.collisionCheck("left");
        if (!me.collider.left.isColliding)
            me.obj.css("left", "+=" + me.move.x + "px");
        else {
            collidedObjects.sort(function(a,b) {return b[0][1] - a[0][1]});
            me.obj.css("left", collidedObjects[0][0][1] + "px");
        }
    };

    this.moveRight = function () {
        $('#' + me.idImg).removeClass('idle left');
        $('#' + me.idImg).addClass('walk right');
        me.move.x = Math.floor(me.speed.right * me.deltaTime);
        var moveDistCollider = me.move.x + 1;
        me.collider.right.obj.width(moveDistCollider + "px");
        var collidedObjects = me.collisionCheck("right");
        if (!me.collider.right.isColliding)
            me.obj.css("left", "+=" + me.move.x + "px");
        else {
            collidedObjects.sort(function(a,b) {return a[0][0] - b[0][0]});
            me.obj.css("left", (collidedObjects[0][0][0] - me.obj.outerWidth()) + "px");
        }
    };

    this.inAir = function () {
        var collidedObjects = null,
            moveDistCollider = 0;
        me.move.y = Math.floor(me.speed.inAir * me.deltaTime);
        if (me.move.y <= 0) {
            moveDistCollider = Math.abs(me.move.y) + 1;
            me.collider.bottom.obj.height(moveDistCollider + "px");
            collidedObjects = me.collisionCheck("bottom");
            if (!me.collider.bottom.isColliding) {
                me.obj.css("bottom", "+=" + me.move.y + "px");
                me.speed.inAir += (me.deltaDist * me.deltaTime);
                if (me.speed.inAir < me.speed.fall) me.speed.inAir = me.speed.fall;
            }
            else {
                me.speed.inAir = (me.deltaDist * me.deltaTime);
                collidedObjects.sort(function(a,b) {return a[1][0] - b[1][0]});
                me.obj.css("bottom",
                    $(window).height() - collidedObjects[0][1][0] + "px");
            }
        }
        else {
            moveDistCollider = me.move.y + 1;
            me.collider.top.obj.height(moveDistCollider + "px");
            me.collider.top.obj.css("top", "-" + moveDistCollider + "px");
            collidedObjects = me.collisionCheck("top");
            if (!me.collider.top.isColliding) {
                var jumpOffset = me.jumpLimiter.maxHeight -
                        (me.jumpLimiter.startHeight - (me.obj.offset().top - me.move.y));
                if (jumpOffset < 0) {
                    me.speed.inAir = 0;
                    me.move.y += jumpOffset;
                }
                me.obj.css("bottom", "+=" + me.move.y + "px");
                me.speed.inAir += (me.deltaDist * me.deltaTime);
            }
            else {
                me.speed.inAir = 0;
                me.collider.top.obj.height("0px");
                me.collider.top.obj.css("top", "0px");
                collidedObjects.sort(function(a,b) {return b[1][1] - a[1][1]});
                me.obj.css("bottom", $(window).height() - 
                    collidedObjects[0][1][1] - me.obj.outerHeight() + "px");
            }
        }
    };

    this.jump = function () {
        if (me.collider.bottom.isColliding) {
            me.speed.inAir = me.speed.jump;
            me.jumpLimiter.startHeight = me.obj.offset().top;
            me.collider.bottom.isColliding = false;
        }
    };

    this.idle = function () {
        $('#' + me.idImg).addClass('idle');
    }

    this.crouch = function () {
        if (!me.action.crouch) {
            $('#' + me.idImg).addClass('crouch');
            $('#' + me.idImg).css('top', '-60px');
            $('#' + me.id).height(me.height.crouch + 'px');
            if (!me.collider.bottom.isColliding)
                $('#' + me.id).css('bottom', '+=' + me.height.crouch + 'px');
            me.updateCollider();
            me.action.crouch = true;
        }
    }

    this.standUp = function () {
        if (me.action.crouch) {
            $('#' + me.idImg).removeClass('crouch');
            $('#' + me.idImg).removeAttr('style');
            $('#' + me.id).height(me.height.stand + 'px');
            me.updateCollider();
            me.action.crouch = false;
        }
    }

    this.stop = function () {
        $('#' + me.idImg).removeClass('walk');
    }

    this.updateCollider = function () {
        $('#' + me.id + '-collider-left')
        .width("10px")
        .height($('#' + me.id).height() - me.collider.left.tolerance + "px")
        .css("left", "-10px");

        $('#' + me.id + '-collider-right')
        .width("10px")
        .height($('#' + me.id).height() - me.collider.right.tolerance + "px")
        .css("left", ($('#' + me.id).width()) + "px");

        $('#' + me.id + '-collider-top')
        .height("20px")
        .width($('#' + me.id).width() + "px")
        .css("top", "-20px");

        $('#' + me.id + '-collider-bottom')
        .height("10px")
        .width($('#' + me.id).width() + "px")
        .css("top", $('#' + me.id).height() + "px");
    }

    this.updateCollider();
}

function KeyHandler () {
    var me = this;
    me.keyCodeMap = [];

    this.isKeyDown = function (keyCode) {
        if (me.keyCodeMap[keyCode] === undefined)
            me.keyCodeMap[keyCode] = false;
        return me.keyCodeMap[keyCode];
    };

    this.setKey = function (keyCode, val) {
        me.keyCodeMap[keyCode] = val;
    };

    this.clearKeyCodeMap = function () {
        var val;
        for (val in me.keyCodeMap)
            me.keyCodeMap[val] = false;
    }

    this.isAnyKeyPressed = function () {
        var val;
        for (val in me.keyCodeMap)
            if (me.keyCodeMap[val])
                return true
        return false;
    }
}

function Ticker () {
    var me = this;
    me.timerId = null;
    me.fps = [];
    me.fps.max = 40;
    me.fps.real = me.fps.max;
    me.fps.min = 10;
    me.time = [];
    me.time.start = 0;
    me.time.diff = 0;
    me.tick = [];
    me.tick.min = 1000/me.fps.max;
    me.tick.real = 1000/me.fps.real;
    me.tickCnt = 0;

    this.startTicker = function (cb) {
        me.handleTicker(cb);
        me.timerId = setInterval(function () {
            me.handleTicker(cb);
        }, me.tick.real);
    };

    this.handleTicker = function (cb) {
        me.time.start = $.now();
        me.tickCnt++;
        cb();
        if (me.tickCnt >= me.fps.real) {
            me.drawFps();
            me.tickCnt = 0;
        }
        me.time.diff = $.now() - me.time.start;
        me.tick.real = me.time.diff;
        if (me.time.diff < me.tick.min) {
            me.tick.real = me.tick.min;
        }
    };

    this.drawFps = function () {
        me.fps.real = Math.floor(1000 / me.tick.real);
        $('#fps').text(me.fps.real + " / " + me.fps.max );

    };

    this.stopTicker = function () {
        me.timerId = null;
    };

    this.getDeltaTime = function () {
        return me.tick.real;
    };
}

var overlaps = (function () {
    function getPositions( elem ) {
        var pos, width, height, res;
        pos = elem.offset();
        width = elem.outerWidth();
        height = elem.outerHeight();
        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
    }

    function comparePositions( p1, p2 ) {
        var r1, r2;
        if (p1[0] < p2[0]) {
            r1 = p1;
            r2 = p2;
        }
        else {
            r1 = p2;
            r2 = p1;
        }
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    return function ( a, b ) {
        var pos1 = getPositions( a ),
            pos2 = getPositions( b ),
            ret = [];
        ret.isColliding = (comparePositions(pos1[0], pos2[0]) &&
            comparePositions(pos1[1], pos2[1]));
        ret.pos1 = pos1;
        ret.pos2 = pos2;
        return ret
    };
})();
