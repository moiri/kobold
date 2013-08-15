$(document).ready(function() {

    var solids = $('.solid');
    var ticker = new Ticker();
    var keyHandler = new KeyHandler();
    var kobold = new Movable('kobold', solids);
    var tempJumpDist = null;
    ticker.drawFps();
    ticker.startTicker(function () {
        var solids = $('.solid');
        var moveDist = Math.floor(5 * ticker.getFpsRelation());
        var fallDist = Math.floor(15 * ticker.getFpsRelation());
        var jumpDist = Math.floor(20 * ticker.getFpsRelation());
        kobold.fallDown(fallDist);
        if (keyHandler.keyCodeMap[37]) kobold.moveLeft(moveDist);
        if (keyHandler.keyCodeMap[39]) kobold.moveRight(moveDist);
        if (keyHandler.keyCodeMap[32] && !kobold.isJumping())
            tempJumpDist = kobold.jump(jumpDist);
        else if (kobold.isJumping()) tempJumpDist = kobold.jump(tempJumpDist);
    });

    $(document).keydown( function (event) {
        event.preventDefault();
        keyHandler.setKey(event.keyCode, true);
    });

    $(document).keyup( function (event) {
        keyHandler.setKey(event.keyCode, false);
    });
});

function Movable (id, solids) {
    var me = this;
    me.id = id;
    me.obj = $('#' + me.id);
    me.collider = [];
    me.collider.left = [];
    me.collider.left.val = false;
    me.collider.right = [];
    me.collider.right.val = false;
    me.collider.top = [];
    me.collider.top.val = false;
    me.collider.top.obj = null;
    me.collider.bottom = [];
    me.collider.bottom.val = false;
    me.jumping = false;

    $('<div id="' + me.id + '-collider-left" class="collider colliderLeft"></div>')
    .appendTo('#' + me.id)
    .width("10px")
    .height($('#' + me.id).height() + "px")
    .css("left", "-10px");
    me.collider.left.obj = $('#' + me.id + '-collider-left');

    $('<div id="' + me.id + '-collider-right" class="collider colliderRight"></div>')
    .appendTo('#' + me.id)
    .width("10px")
    .height($('#' + me.id).height() + "px")
    .css("left", ($('#' + me.id).width()) + "px");
    me.collider.right.obj = $('#' + me.id + '-collider-right');

    $('#' + me.id).append('<div id="' + me.id
        + '-collider-top" class="collider colliderTop"></div>');
    $('<div id="' + me.id + '-collider-bottom" class="collider colliderBottom"></div>')
    .appendTo('#' + me.id)
    .height("10px")
    .width($('#' + me.id).width() + "px")
    .css("top", $('#' + me.id).height() + "px");
    me.collider.bottom.obj = $('#' + me.id + '-collider-bottom');

    this.moveLeft = function (val) {
        var collision = false;
        var collidedObject = null;
        me.collider.left.obj.width((val + 1) + "px");
        me.collider.left.obj.css("left", "-" + (val + 1) + "px");
        solids.each(function () {
            //var distColliderRight = $(this).offset().left + $(this).outerWidth();
            //var distMeLeft = me.obj.offset().left;
            //if ((distColliderRight <= distMeLeft) &&
            //    (distColliderRight > (distMeLeft - val - 1))) {
                if (overlaps(me.collider.left.obj, $(this))) {
                    collision = true;
                    collidedObject = $(this);
                }
            //}
            me.collider.left.val = collision;
        });
        if (!me.collider.left.val)
            me.obj.css("left", "-=" + val + "px");
        else {
            var newVal = collidedObject.position().left + collidedObject.outerWidth();
            me.obj.css("left", newVal + "px");
        }
    };

    this.moveRight = function (val) {
        var collision = false;
        var collidedObject = null;
        me.collider.right.obj.width((val + 1) + "px");
        solids.each(function () {
            //var distColliderLeft = $(this).offset().left;
            //var distMeRight = me.obj.offset().left + me.obj.outerWidth();
            //if ((distColliderLeft >= distMeRight) &&
            //    (distColliderLeft < (distMeRight + val + 1))) {
                if (overlaps(me.collider.right.obj, $(this))) {
                    collision = true;
                    collidedObject = $(this);
                }
            //}
            me.collider.right.val = collision;
        });
        if (!me.collider.right.val)
            me.obj.css("left", "+=" + val + "px");
        else {
            var newVal = collidedObject.position().left - me.obj.outerWidth();
            me.obj.css("left", newVal + "px");
        }
    };

    this.fallDown = function (val) {
        var collision = false;
        var collidedObject = null;
        me.collider.bottom.obj.height((val + 1) + "px");
        solids.each(function () {
            //var distColliderTop = $(this).offset().top;
            //var distMeBottom = me.obj.offset().top + me.obj.outerHeight();
            //if ((distColliderTop >= distMeBottom) &&
            //    (distColliderTop < (distMeBottom + val + 1))) {
                if (overlaps(me.collider.bottom.obj, $(this))) {
                    collision = true;
                    collidedObject = $(this);
                }
            //}
            me.collider.bottom.val = collision;
        });
        if (!me.jumping) {
            if (!me.collider.bottom.val)
                me.obj.css("bottom", "-=" + val + "px");
            else {
                var newVal = $(window).height()-collidedObject.position().top;
                me.obj.css("bottom", newVal + "px");
            }
        }
    };

    this.jump = function (val) {
        if (me.collider.bottom.val || me.jumping) {
            me.jumping = true;
            if (val === 0)
                me.jumping = false
            me.obj.css("bottom", "+=" + val + "px");
        }
        val--;
        return val;
    };

    this.isJumping = function () {
        return me.jumping;
    };
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
        if (me.time.diff > me.tick.real) {
            me.tick.real = me.time.diff + 1;
        }
        else if (me.time.diff < me.tick.min) {
            me.tick.real = me.tick.min;
        }
        me.fps.real = Math.floor(1000 / me.tick.real);
    };

    this.drawFps = function () {
        //$('#fps').toggleClass('blink');
        $('#fps').text(me.fps.real + " / " + me.fps.max );

    };

    this.stopTicker = function () {
        me.timerId = null;
    };

    this.getFpsRelation = function () {
        return me.fps.max/me.fps.real;
    };
}

var overlaps = (function () {
    function getPositions( elem ) {
        var pos, width, height;
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
            pos2 = getPositions( b );
        return comparePositions( pos1[0], pos2[0] ) &&
            comparePositions( pos1[1], pos2[1] );
    };
})();
