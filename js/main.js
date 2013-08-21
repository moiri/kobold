$(document).ready(function() {
    for (i=1; i<=6; i++)
        for (j=0; j<1; j++)
            $('body')
            .append('<div id="stone' + j + '" class="stone' + i + ' solid"></div>');
    var globalVar = [];
    globalVar.enable = true;
    setEnable = function (val) {
        globalVar.enable = val
    };
    var solids = $('.solid');
    var ticker = new Ticker();
    var keyHandler = new KeyHandler();
    var kobold = new Movable('kobold', solids, setEnable);
    var tempJumpDist = null;
    $('#solidCnt').text(solids.length);
    ticker.drawFps();
    ticker.startTicker(function () {
        if (globalVar.enable) {
            kobold.setDeltaTime(ticker.getDeltaTime());
            kobold.checkPosition();
            kobold.inAir();
            if (keyHandler.keyCodeMap[32]) kobold.jump();
            if (keyHandler.keyCodeMap[37]) {
                if (keyHandler.keyCodeMap[16]) {
                    kobold.run();
                    kobold.moveLeft(true);
                }
                else {
                    kobold.walk();
                    kobold.moveLeft(false);
                }
            }
            if (keyHandler.keyCodeMap[39]) {
                if (keyHandler.keyCodeMap[16]) {
                    kobold.run();
                    kobold.moveRight(true);
                }
                else {
                    kobold.walk();
                    kobold.moveRight(false);
                }
            }
            if (keyHandler.keyCodeMap[17]) kobold.crouch();
            if (!keyHandler.keyCodeMap[17]) kobold.standUp();
            if (!keyHandler.keyCodeMap[39] && !keyHandler.keyCodeMap[37]) {
                kobold.stop();
                kobold.idle();
            }
            if (keyHandler.isAnyKeyPressed()) kobold.active();
        }
    });

    $(document).keydown( function (event) {
        if ((event.keyCode === 37) || (event.keyCode === 39) || (event.keyCode === 32))
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

function Movable (id, solids, setEnable) {
    var me = this;
    me.id = id;
    me.idImg = me.id + "-img";
    me.idCollider = me.id + "-collider";
    me.obj = $('#' + me.id);
    me.collider = [];
    me.collider.left = [];
    me.collider.left.isColliding = false;
    me.collider.left.tolerance = 10;
    me.collider.right = [];
    me.collider.right.isColliding = false;
    me.collider.right.tolerance = 10;
    me.collider.top = [];
    me.collider.top.isColliding = false;
    me.collider.top.obj = null;
    me.collider.bottom = [];
    me.collider.bottom.isColliding = false;
    me.speed = [];
    me.speed.right = 200;
    me.speed.rightRun = 300;
    me.speed.left = -200;
    me.speed.leftRun = -300;
    me.speed.jump = 1200;
    me.speed.fall = -1200;
    me.speed.inAir = 0;
    me.move = [];
    me.move.x = 0;
    me.move.y = 0;
    me.jumpAttr = [];
    me.jumpAttr.lut = [];
    me.jumpAttr.height = [];
    me.jumpAttr.height.start = 0;
    me.jumpAttr.height.max = 160;
    me.jumpAttr.height.actual = 0;
    me.jumpAttr.count = [];
    me.jumpAttr.count.actual = 0;
    me.jumpAttr.count.last = 0;
    me.delta = [];
    me.delta.time = [];
    me.delta.time.min = 0.025;
    me.delta.time.actual = me.delta.time.min;
    me.delta.dist = [];
    me.delta.dist.up = me.speed.jump / 
        (me.jumpAttr.height.max /
            (me.speed.jump * me.delta.time.actual)
        * 2 + 1);
    me.delta.dist.down = me.speed.fall /
        (me.jumpAttr.height.max /
            (Math.abs(me.speed.fall) * me.delta.time.actual)
        * 2 + 1);
    me.height = [];
    me.height.stand = 85;
    me.height.crouch = 40;
    me.action = [];
    me.action.crouch = false;
    me.action.wink = false;
    me.action.wave = false;
    me.action.jawn = false;
    me.action.jump = false;
    me.rand = [];
    me.rand.count = 0;
    me.rand.minVal = 4;     // seconds
    me.rand.maxVal = 10;    // seconds
    me.rand.nextVal = -1;
    me.pos = [];
    me.pos.x = 0;
    me.pos.y = 0;

    $('#' + me.id).append('<div id="' + me.idCollider + '" class="colliderContainer">' +
        '<div id="' + me.idCollider + '-left" class="collider colliderLeft"></div>' +
        '<div id="' + me.idCollider + '-right" class="collider colliderRight"></div>' +
        '<div id="' + me.idCollider + '-top" class="collider colliderTop"></div>' +
        '<div id="' + me.idCollider + '-bottom" class="collider colliderBottom"></div>' +
    '</div>');
    me.collider.left.obj = $('#' + me.idCollider + '-left');
    me.collider.right.obj = $('#' + me.idCollider + '-right');
    me.collider.top.obj = $('#' + me.idCollider + '-top');
    me.collider.bottom.obj = $('#' + me.idCollider + '-bottom');

    this.setDeltaTime = function (val) {
        me.delta.time.actual = val;
    };

    this.genJumpLut = function () {
        var pos = 0,
            speed = me.speed.jump,
            i = 1;
        me.jumpAttr.lut[0] = 0;
        while (pos < me.jumpAttr.height.max) {
            speed -= me.delta.dist.up;
            pos += speed*me.delta.time.actual;;
            me.jumpAttr.lut[i] = Math.ceil(pos);
            i++;
        }
    };

    this.checkPosition = function () {
        if ((me.obj.offset().left < 0) || (parseInt(me.obj.css('right')) < 0)) {
            me.obj.css('left', me.pos.x);
        }
        else if ((parseInt(me.obj.css('bottom')) + me.obj.height()) < 0) {
            setEnable(false);
            me.singleAnimation('appear');
            $('#' + me.idImg).removeClass('walk run');
            $('#' + me.idImg).addClass('idle');
            me.obj.css('bottom', parseInt(me.pos.y));
            me.obj.css('left', me.pos.x);
        }
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

    this.moveLeft = function (run) {
        var speed = (run) ? me.speed.leftRun : me.speed.left;
        $('#' + me.idImg).removeClass('idle right');
        $('#' + me.idImg).addClass('left');
        me.move.x = Math.floor(speed * me.delta.time.actual);
        me.updateCollider("left", Math.abs(me.move.x) + 1);
        var collidedObjects = me.collisionCheck("left");
        if (!me.collider.left.isColliding) {
            me.obj.css("left", "+=" + me.move.x + "px");
            if (me.collider.bottom.isColliding)
                me.pos.x = me.obj.offset().left + me.obj.width();
        }
        else {
            collidedObjects.sort(function(a,b) {return b[0][1] - a[0][1]});
            me.obj.css("left", collidedObjects[0][0][1] + "px");
        }
    };

    this.moveRight = function (run) {
        var speed = (run) ? me.speed.rightRun : me.speed.right;
        $('#' + me.idImg).removeClass('idle left');
        $('#' + me.idImg).addClass('right');
        me.move.x = Math.floor(speed * me.delta.time.actual);
        me.updateCollider("right", me.move.x + 1);
        var collidedObjects = me.collisionCheck("right");
        if (!me.collider.right.isColliding) {
            me.obj.css("left", "+=" + me.move.x + "px");
            if (me.collider.bottom.isColliding)
                me.pos.x = me.obj.offset().left - me.obj.width();
        }
        else {
            collidedObjects.sort(function(a,b) {return a[0][0] - b[0][0]});
            me.obj.css("left", (collidedObjects[0][0][0] - me.obj.outerWidth()) + "px");
        }
    };

    this.walk = function () {
        $('#' + me.idImg).removeClass('run');
        $('#' + me.idImg).addClass('walk');
    };

    this.run = function () {
        $('#' + me.idImg).removeClass('walk');
        $('#' + me.idImg).addClass('run');
    };

    this.inAir = function () {
        var collidedObjects = null;
        if (!me.action.jump) {
            me.speed.inAir += me.delta.dist.down *
                me.delta.time.actual / me.delta.time.min;
            me.move.y = Math.round(me.speed.inAir * me.delta.time.actual);
            me.updateCollider("bottom", Math.abs(me.move.y) + 1);
            collidedObjects = me.collisionCheck("bottom");
            me.collisionCheck("top");
            if (!me.collider.bottom.isColliding) {
                me.obj.css("bottom", "+=" + me.move.y + "px");
                if (me.speed.inAir < me.speed.fall) me.speed.inAir = me.speed.fall;
            }
            else {
                me.speed.inAir = me.delta.dist.down;
                collidedObjects.sort(function(a,b) {return a[1][0] - b[1][0]});
                me.obj.css("bottom",
                    $(window).height() - collidedObjects[0][1][0] + "px");
                me.pos.y = me.obj.css("bottom");
            }
        }
        else {
            me.jumpAttr.count.actual += Math.round(
                me.delta.time.actual / me.delta.time.min);
            var lastElem = false;
            if (me.jumpAttr.count.actual > (me.jumpAttr.lut.length - 1)) {
                me.jumpAttr.count.actual = me.jumpAttr.lut.length - 1;
                lastElem = true;
            }
            me.move.y = me.jumpAttr.lut[me.jumpAttr.count.actual] -
                me.jumpAttr.lut[me.jumpAttr.count.last];
            me.jumpAttr.height.actual += me.move.y;
            if (lastElem || me.jumpAttr.height.actual > me.jumpAttr.height.max) {
                var jumpDiff = me.jumpAttr.height.max - me.jumpAttr.height.actual;
                if (jumpDiff != 0)
                    me.move.y += jumpDiff;
                me.jumpAttr.height.actual = 0;
                me.action.jump = false;
            }
            me.jumpAttr.count.last = me.jumpAttr.count.actual;
            me.updateCollider("top", me.move.y + 1);
            collidedObjects = me.collisionCheck("top");
            if (!me.collider.top.isColliding) {
                me.obj.css("bottom", "+=" + me.move.y + "px");
            }
            else {
                me.action.jump = false;
                me.jumpAttr.height.actual = 0;
                collidedObjects.sort(function(a,b) {return b[1][1] - a[1][1]});
                me.obj.css("bottom", $(window).height() - 
                    collidedObjects[0][1][1] - me.obj.outerHeight() + "px");
            }
        }
    };

    this.jump = function () {
        if (me.collider.bottom.isColliding && !me.action.jump) {
            me.action.jump = true;
            me.jumpAttr.count.actual = 0;
            me.jumpAttr.count.last = 0;
            me.jumpAttr.height.start = me.obj.offset().top;
            me.collider.bottom.isColliding = false;
        }
    };

    this.idle = function () {
        if (me.rand.nextVal < 0)
            this.setNextRandVal();
        $('#' + me.idImg).addClass('idle');
        if (me.rand.count === me.rand.nextVal) {
            me.singleAnimation('rand');
        }
        me.rand.count++;
    };

    this.active = function () {
        $('#' + me.idImg).removeClass('rand');
        me.rand.count = 0;
    };

    this.singleAnimation = function (cssClass) {
        var animationDuration = 0,
            animationIterationCount = 0,
            randClassNb = 0;
        if (cssClass === 'rand') {
            randClassNb = Math.floor((Math.random()*3)+1);
            switch(randClassNb) {
                case 1: cssClass += ' wave'; break;
                case 2: cssClass += ' wink'; break;
                case 3: cssClass += ' jawn'; break;
            };
        }
        $('#' + me.idImg).addClass(cssClass);
        animationDuration = $('#' + me.idImg).css('animation-duration');
        if (animationDuration === null)
            animationDuration = $('#' + me.idImg).css('-webkit-animation-duration')
        animationIterationCount = $('#' + me.idImg).css('animation-iteration-count');
        if (animationIterationCount === null)
            animationIterationCount = $('#' + me.idImg)
                .css('-webkit-animation-iteration-count');
        animationDuration = parseFloat(animationDuration);
        animationIterationCount = parseInt(animationIterationCount);
        setTimeout(function () {
            $('#' + me.idImg).removeClass(cssClass);
            if (randClassNb > 0) me.setNextRandVal();
            setEnable(true);
        }, animationDuration * animationIterationCount * 1000);
    };

    this.setNextRandVal = function () {
        me.rand.count = 0;
        me.rand.nextVal = Math.floor(
            (1 / me.delta.time.actual) *
                ((Math.random() * me.rand.maxVal) + me.rand.minVal)
        );
    }

    this.crouch = function () {
        if (!me.action.crouch) {
            $('#' + me.idImg).addClass('crouch');
            $('#' + me.idImg).css('top', '-60px');
            $('#' + me.idCollider).height(me.height.crouch + 'px');
            if (!me.collider.bottom.isColliding)
                $('#' + me.id).css('bottom', '+=' + me.height.crouch + 'px');
            me.updateCollider();
            me.action.crouch = true;
        }
    };

    this.standUp = function () {
        if (me.action.crouch) {
            $('#' + me.idImg).removeClass('crouch');
            $('#' + me.idImg).removeAttr('style');
            if (me.collider.top.isColliding)
                $('#' + me.id).css(
                    'bottom', '-=' + (me.height.stand - me.height.crouch) + 'px'
                );
            $('#' + me.idCollider).height(me.height.stand + 'px');
            me.updateCollider();
            me.action.crouch = false;
        }
    }

    this.stop = function () {
        $('#' + me.idImg).removeClass('walk run');
    }

    this.updateCollider = function (direction, colliderSize) {
        var toleranceLeft = 0,
            toleranceRight = 0;
        if ((direction === undefined) || (direction === 'left')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(Math.floor(me.delta.time.actual * me.speed.left));
            if (me.collider.bottom.isColliding)
                toleranceLeft = me.collider.left.tolerance;
            $('#' + me.id + '-collider-left')
            .width(colliderSize  + "px")
            .height($('#' + me.idCollider).height() - toleranceLeft + "px")
            .css("left", "-" + colliderSize + "px");
        }

        if ((direction === undefined) || (direction === 'right')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(
                    Math.floor(me.delta.time.actual * me.speed.right));
            if (me.collider.bottom.isColliding)
                toleranceRight = me.collider.right.tolerance;
            $('#' + me.id + '-collider-right')
            .width(colliderSize + "px")
            .height($('#' + me.idCollider).height() - toleranceRight + "px")
            .css("left", ($('#' + me.idCollider).width()) + "px");
        }

        if ((direction === undefined) || (direction === 'top')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(Math.floor(me.delta.time.actual * me.speed.jump));
            $('#' + me.id + '-collider-top')
            .height((colliderSize + me.height.crouch) + "px")
            .width($('#' + me.idCollider).width() + "px")
            .css("top", "-" + colliderSize + "px");
        }

        if ((direction === undefined) || (direction === 'bottom')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(Math.floor(me.delta.time.actual * me.speed.fall));
            $('#' + me.id + '-collider-bottom')
            .height((colliderSize + me.height.crouch) + "px")
            .width($('#' + me.idCollider).width() + "px")
            .css("top", ($('#' + me.idCollider).height() - me.height.crouch) + "px");
        }
    }

    this.updateCollider();
    this.genJumpLut();
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
        return (me.tick.real / 1000);
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
