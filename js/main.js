// Use this class to configure your character abilites
function Configurator() {
    var me = this;
    me.enable = [];
    me.enable.crouch = [];
    me.keyCode = [];
    me.movable = [];
    me.movable.colliderTolerance = [];
    me.movable.speed = [];
    me.movable.height = [];
    me.movable.randIdle = [];

    /* frame cap */
    me.maxFps = 40;
    this.setMaxFps = function (val) {me.maxFps = val;};

    /* Enables the character to wlak faster, hence run
     * the speed can be set with me.movable.speed.rightRun
     * and me.movable.speed.leftRun.
     * The character is always able to walk. The walk speed can be
     * set with me.movable.speed.left and me.movable.speed.right.
     */
    me.enable.run = true;
    this.enableRun = function () {me.enable.run = true;};
    this.disableRun = function () {me.enable.run = false;};

    /* Enables character to jump. The character can only jump
     * if he is standing on a solid. The jump height can be set
     * with me.movable.maxJumpHeight.
     */
    me.enable.jump = true;
    this.enableJump = function () {me.enable.jump = true;};
    this.disableJump = function () {me.enable.jump = false;};

    /* Enables the character to crouch. The crouch height of the
     * character is set with me.movable.height.crouch. Keep in mind
     * that this depends on the size of the crouch animation.
     */
    me.enable.crouch.all = true;
    this.enableCrouch = function () {me.enable.crouch.all = true;};
    this.disableCrouch = function () {me.enable.crouch.all = false;};

    /* Enables the character to crouch when running. If this is turned
     * off, the character stands up as soon the run button is pressed.
     * If me.enable.crouch.all is turned off, this parameter has no effect.
     * If me.enable.run is turned off, this parameter has no effect.
     */
    me.enable.crouch.run = false;
    this.enableCrouchRun = function () {me.enable.crouch.run = true;};
    this.disableCrouchRun = function () {me.enable.crouch.run = false;};

    /* Enables the character to crouch when jumping. If this is turned
     * off, the character stands up as soon the character is in the air.
     * If me.enable.crouch.all is turned off, this parameter has no effect.
     * If me.enable.jump is turned off, this parameter has no effect.
     */
    me.enable.crouch.jump = true;
    this.enableCrouchJump = function () {me.enable.crouch.jump = true;};
    this.disableCrouchJump = function () {me.enable.crouch.jump = false;};

    /* Enables the character to jump higher when crouch is pressed while
     * jumping (me.movable.maxJumpHeight + me.movable.height.stand
     * - me.movable.height.crouch). If this is turned off, the character
     * jumps only to me.movable.maxJumpHeight.
     * If me.enable.crouch.all is turned off, this parameter has no effect.
     * If me.enable.jump is turned off, this parameter has no effect.
     * If me.enable.crouch.jump is turned off, this parameter has no effect.
     */
    me.enable.crouch.jumpHigh = true;
    this.enableCrouchJumpHigh = function () {me.enable.crouch.jumpHigh = true;};
    this.disableCrouchJumpHigh = function () {me.enable.crouch.jumpHigh = false;};

    /* With this enabled, the character cannot leave the visible screen and
     * teleported back near to the last valid position if he drops beow the
     * screen.
     */
    me.enable.appear = true;
    this.enableAppear = function () {me.enable.appear = true;};
    this.disableAppear = function () {me.enable.appear = false;};

    /* With this enabled, the character is able to pick up elements marked with
     * the me.movable.pickUpClass class.
     */
    me.enable.pickUp = true;
    this.enablePickUp = function () {me.enable.pickUp = true;};
    this.disablePickUp = function () {me.enable.pickUp = false;};

    /* Define keyCodes to use the character abilities by pressing the keys.
     * Keep in mind, that this will prevent the default browser behavior
     * of the keys.
     */ 
    me.keyCode.jump = 32;
    me.keyCode.run = 16;
    me.keyCode.left = 37;
    me.keyCode.right = 39;
    me.keyCode.crouch = 17;
    this.setKeyCode = function (type, val) {me.keyCode[type] = val;};

    /* Id of the character the corresponding div element must exist on the
     * web page.
     */
    me.movable.id = 'kobold';
    this.setMovableId = function (val) {me.movable.id = val;};

    /* Class name definig which elements are solid, i.e. with which elements
     * the character is colliding (lets call them collidables). All elements
     * on the web page intended to be a collidable must have this css class.
     */
    me.movable.solidClass = 'solid';
    this.setMovableSolidClass = function (val) {me.movable.solidClass = val;};

    /* Id of element where the pick up count should appear. The corresponding 
     * element must exist on he webpage.
     * If me.enable.pickUp is turned off, this parameter has no effect.
     */
    me.movable.idPickUpCnt = 'pickUpCnt';
    this.setMovablePickUpClass = function (val) {me.movable.pickUpClass = val;};

    /* Class name definig which elements the character can pick up by moving
     * over them. All elements on the web page intended to be objects that
     * can be picked up must have this css class.
     * If me.enable.pickUp is turned off, this parameter has no effect.
     */
    me.movable.pickUpClass = 'pickUp';
    this.setMovablePickUpClass = function (val) {me.movable.pickUpClass = val;};

    /* These parameters allow the character to move over objects of small
     * heights, without colliding (move up stairs without jumping). The value
     * is the maxium height (in pixel) of an objet in order to be ignored by
     * right and left collision. This can be turned off by setting both
     * values to zero.
     */
    me.movable.colliderTolerance.left = 10;
    me.movable.colliderTolerance.right = 10;
    this.setMovableColliderTolerance = function (type, val) {
        me.movable.colliderTolerance[type] = val;
    };

    /* Define the speed of the character. Please pay attention to the minus
     * sign.
     */
    me.movable.speed.right = 200;
    me.movable.speed.rightRun = 300;
    me.movable.speed.left = -200;
    me.movable.speed.leftRun = -300;
    me.movable.speed.jump = 1200;
    me.movable.speed.fall = -1200;
    this.setMovableSpeed = function (type, val) {me.movable.speed[type] = val;};

    /* Define the maximal height (in pixel) the character can jump. One
     * exception to surpass this height is by enabling
     * me.enable.crouch.jumpHeight. Please check the comments there to get
     * more information.
     * If me.enable.jump is turned off, this parameter has no effect.
     */
    me.movable.maxJumpHeight = 160;
    this.setMovableMaxJumpHeight = function (val) {me.movable.maxJumpHeight = val;};

    /* Define the height (in pixel) of the character (standing / crouching)
     * -> i thing this should be moved to css
     */ 
    me.movable.height.stand = 85;
    me.movable.height.crouch = 40;

    /* Define the intervall of random idle animations (in seconds). After
     * completion of an animation, The next random animation well tart in
     * me.movable.randIdle.minVal seconds at the erliest and in
     * me.movable.randIdle.maxVal seconds at the latest.
     */
    me.movable.randIdle.min = 4;
    me.movable.randIdle.max = 10;
    this.setMovableRandIdle = function (type, val) {me.movable.randIdle[type] = val};
};

function Engine(config) {
    var me = this;
    me.enable = [];
    me.enable.run = config.enable.run;
    me.enable.jump = config.enable.jump;
    me.enable.crouch = config.enable.crouch;
    me.enable.appear = config.enable.appear;
    me.enable.pickUp = config.enable.pickUp;
    me.enable.all = true;
    me.keyCode = [];
    me.keyCode.jump = config.keyCode.jump;
    me.keyCode.run = config.keyCode.run;
    me.keyCode.left = config.keyCode.left;
    me.keyCode.right = config.keyCode.right;
    me.keyCode.crouch = config.keyCode.crouch;
    me.ticker = null;
    me.movable = null;
    me.keyHandler = null;
    me.configMovable = config.movable;
    me.configMovable.enableCrouchJumpHigh = me.enable.crouch.jumpHigh;
    me.configMovable.minDeltaTime = 1 / config.maxFps;

    this.movableHandler = function () {
        var inAir = false;
        me.movable.setDeltaTime(me.ticker.getDeltaTime());
        if (me.enable.appear) me.movable.checkPosition();
        inAir = me.movable.inAir();
        if (me.enable.pickUp) me.movable.pickUp();
        if (me.enable.jump && me.keyHandler.keyCodeMap[me.keyCode.jump]) {
            me.movable.jump();
            if (!me.enable.crouch.jump) me.movable.standUp();
        }
        if (me.enable.run && me.keyHandler.keyCodeMap[me.keyCode.run]) {
            me.movable.run();
            if (me.keyHandler.keyCodeMap[me.keyCode.left]) {
                me.movable.moveLeft(true);
            }
            else if (me.keyHandler.keyCodeMap[me.keyCode.right]) {
                me.movable.moveRight(true);
            }
        }
        else {
            me.movable.walk();
            if (me.keyHandler.keyCodeMap[me.keyCode.left]) {
                me.movable.moveLeft(false);
            }
            else if (me.keyHandler.keyCodeMap[me.keyCode.right]) {
                me.movable.moveRight(false);
            }
        }
        if (me.enable.crouch.all && (!inAir || (inAir && me.enable.crouch.jump))) {
            if (me.keyHandler.keyCodeMap[me.keyCode.crouch] &&
                (!me.keyHandler.keyCodeMap[me.keyCode.run] ||
                (me.enable.crouch.run && me.keyHandler.keyCodeMap[me.keyCode.run]))) {
                me.movable.crouch();
            }
            if (!me.keyHandler.keyCodeMap[me.keyCode.crouch] ||
                (me.keyHandler.keyCodeMap[me.keyCode.crouch] &&
                me.keyHandler.keyCodeMap[me.keyCode.run] && !me.enable.crouch.run)) {
                me.movable.standUp();
            }
        }
        if (!me.keyHandler.keyCodeMap[me.keyCode.left] &&
            !me.keyHandler.keyCodeMap[me.keyCode.right]) {
            me.movable.stop();
            me.movable.idle();
        }
        if (me.keyHandler.isAnyKeyPressed()) me.movable.active();
    };

    this.registerKeyEvents = function () {
        $(document).keydown( function (event) {
            for (action in me.keyCode)
                if (event.keyCode === me.keyCode[action])
                    event.preventDefault();
            me.keyHandler.setKey(event.keyCode, true);
        });
        $(document).keyup( function (event) {
            me.keyHandler.setKey(event.keyCode, false);
        });
        $(document).blur( function (event) {
            me.keyHandler.clearKeyCodeMap();
        });
    };

    this.setEnableAll = function (val) {
        me.enable.all = val;
    };

    this.start = function () {
        me.ticker = new Ticker(config.maxFps);
        me.keyHandler = new KeyHandler();
        me.movable = new Movable(me.configMovable, me.setEnableAll);
        me.registerKeyEvents();
        me.ticker.startTicker(function () {
            if (me.enable.all) me.movableHandler();
        });
        me.ticker.drawFps();
    };
};

function Movable(config, setEnable) {
    var me = this;
    me.id = config.id;
    me.idImg = me.id + "-img";
    me.idCollider = me.id + "-collider";
    me.idPickUpCnt = config.idPickUpCnt;
    me.obj = $('#' + me.id);
    me.solids = $('.' + config.solidClass);
    me.pickUps = $('.' + config.pickUpClass);
    me.enableCrouchJumpHigh = config.enableCrouchJumpHigh;
    me.collider = [];
    me.collider.left = [];
    me.collider.left.isColliding = false;
    me.collider.left.tolerance = config.colliderTolerance.left;
    me.collider.right = [];
    me.collider.right.isColliding = false;
    me.collider.right.tolerance = config.colliderTolerance.right;
    me.collider.top = [];
    me.collider.top.isColliding = false;
    me.collider.top.obj = null;
    me.collider.bottom = [];
    me.collider.bottom.isColliding = false;
    me.speed = [];
    me.speed.right = config.speed.right;
    me.speed.rightRun = config.speed.rightRun;
    me.speed.left = config.speed.left;
    me.speed.leftRun = config.speed.leftRun;
    me.speed.jump = config.speed.jump;
    me.speed.fall = config.speed.fall;
    me.speed.inAir = 0;
    me.move = [];
    me.move.x = 0;
    me.move.y = 0;
    me.jumpAttr = [];
    me.jumpAttr.lut = [];
    me.jumpAttr.height = [];
    me.jumpAttr.height.start = 0;
    me.jumpAttr.height.max = config.maxJumpHeight;
    me.jumpAttr.height.actual = 0;
    me.jumpAttr.count = [];
    me.jumpAttr.count.actual = 0;
    me.jumpAttr.count.last = 0;
    me.delta = [];
    me.delta.time = [];
    me.delta.time.min = config.minDeltaTime;
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
    me.height.stand = config.height.stand;
    me.height.crouch = config.height.crouch;
    me.action = [];
    me.action.crouch = false;
    me.action.wink = false;
    me.action.wave = false;
    me.action.jawn = false;
    me.action.jump = false;
    me.action.pickUp = false;
    me.rand = [];
    me.rand.count = 0;
    me.rand.minVal = config.randIdle.min;
    me.rand.maxVal = config.randIdle.max;
    me.rand.nextVal = -1;
    me.pos = [];
    me.pos.x = 0;
    me.pos.y = 0;
    me.pickUpCounter = 0;

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

    this.active = function () {
        $('#' + me.idImg).removeClass('rand');
        me.rand.count = 0;
    };

    this.checkCollision = function (direction) {
        var collision = false,
            collidedObjects = [];
        me.solids.each(function () {
            collisionRes = overlaps(me.collider[direction].obj, $(this));
            if (collisionRes.isColliding) {
                collision = true;
                collidedObjects.push(collisionRes.pos2);
            }
        });
        me.collider[direction].isColliding = collision;
        return collidedObjects;
    };

    this.checkPosition = function () {
        if ((parseInt(me.obj.css('bottom')) + me.obj.height()) < 0) {
            setEnable(false);
            me.singleAnimation($('#' + me.idImg), 'appear', function () {
                setEnable(true);
            });
            $('#' + me.idImg).removeClass('walk run');
            $('#' + me.idImg).addClass('idle');
            me.obj.css('bottom', parseInt(me.pos.y));
            me.obj.css('left', me.pos.x);
        }
        else if (me.obj.offset().left < 0) {
            me.obj.css('left', 0);
        }
        else if (parseInt(me.obj.css('right')) < 0) {
            me.obj.css('left', $(window).width() - me.obj.width());
        }
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

    this.crouch = function () {
        if (!me.action.crouch) {
            $('#' + me.idImg).addClass('crouch');
            $('#' + me.idImg).css('top', '-60px');
            $('#' + me.idCollider).height(me.height.crouch + 'px');
            if (me.enableCrouchJumpHigh && !me.collider.bottom.isColliding)
                $('#' + me.id).css('bottom', '+=' + me.height.crouch + 'px');
            me.updateCollider();
            me.action.crouch = true;
        }
    };

    this.idle = function () {
        if (me.rand.nextVal < 0)
            this.setNextRandVal();
        $('#' + me.idImg).addClass('idle');
        if (me.rand.count === me.rand.nextVal) {
            me.singleAnimation($('#' + me.idImg), 'rand', function () {
                me.setNextRandVal();
            });
        }
        me.rand.count++;
    };

    this.inAir = function () {
        var collidedObjects = null,
            lastElem = false,
            jumpDiff = 0;
        if (!me.action.jump) {
            me.speed.inAir += me.delta.dist.down *
                me.delta.time.actual / me.delta.time.min;
            me.move.y = Math.round(me.speed.inAir * me.delta.time.actual);
            me.updateCollider("bottom", Math.abs(me.move.y) + 1);
            collidedObjects = me.checkCollision("bottom");
            me.checkCollision("top");
            if (!me.collider.bottom.isColliding) {
                me.obj.css("bottom", "+=" + me.move.y + "px");
                if (me.speed.inAir < me.speed.fall) me.speed.inAir = me.speed.fall;
            }
            else {
                me.speed.inAir = me.delta.dist.down;
                collidedObjects.sort(function(a,b) {return a[1][0] - b[1][0]});
                me.obj.css("bottom",
                    $(window).height() - collidedObjects[0][1][0] + "px");
                $('#' + me.idImg).removeClass('jump');
                me.pos.y = me.obj.css("bottom");
            }
        }
        else {
            me.jumpAttr.count.actual += Math.round(
                me.delta.time.actual / me.delta.time.min);
            if (me.jumpAttr.count.actual > (me.jumpAttr.lut.length - 1)) {
                me.jumpAttr.count.actual = me.jumpAttr.lut.length - 1;
                lastElem = true;
            }
            me.move.y = me.jumpAttr.lut[me.jumpAttr.count.actual] -
                me.jumpAttr.lut[me.jumpAttr.count.last];
            me.jumpAttr.height.actual += me.move.y;
            if (lastElem || me.jumpAttr.height.actual > me.jumpAttr.height.max) {
                jumpDiff = me.jumpAttr.height.max - me.jumpAttr.height.actual;
                if (jumpDiff != 0)
                    me.move.y += jumpDiff;
                me.jumpAttr.height.actual = 0;
                me.action.jump = false;
            }
            me.jumpAttr.count.last = me.jumpAttr.count.actual;
            me.updateCollider("top", me.move.y + 1);
            collidedObjects = me.checkCollision("top");
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
        return !me.collider.bottom.isColliding;
    };

    this.jump = function () {
        if (me.collider.bottom.isColliding && !me.action.jump) {
            me.action.jump = true;
            me.jumpAttr.count.actual = 0;
            me.jumpAttr.count.last = 0;
            me.jumpAttr.height.start = me.obj.offset().top;
            me.collider.bottom.isColliding = false;
            $('#' + me.idImg).addClass('jump');
        }
    };

    this.moveLeft = function (run) {
        var collidedObjects,
            speed = (run) ? me.speed.leftRun : me.speed.left;
        $('#' + me.idImg).removeClass('idle right');
        $('#' + me.idImg).addClass('left');
        me.move.x = Math.floor(speed * me.delta.time.actual);
        me.updateCollider("left", Math.abs(me.move.x) + 1);
        collidedObjects = me.checkCollision("left");
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
        var collidedObjects, 
            speed = (run) ? me.speed.rightRun : me.speed.right;
        $('#' + me.idImg).removeClass('idle left');
        $('#' + me.idImg).addClass('right');
        me.move.x = Math.floor(speed * me.delta.time.actual);
        me.updateCollider("right", me.move.x + 1);
        collidedObjects = me.checkCollision("right");
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

    this.pickUp = function () {
        var collisionRes = null;
        me.pickUps.each(function () {
            collisionRes = overlaps(me.obj, $(this));
            if (collisionRes.isColliding) {
                $(this).removeClass(me.pickUpClass);
                me.pickUpCounter++;
                $('#' + me.idPickUpCnt).text(me.pickUpCounter);
                me.singleAnimation($(this), 'success', function () {
                    $(this).remove();
                });
            }
        });
    };

    this.run = function () {
        $('#' + me.idImg).removeClass('walk');
        $('#' + me.idImg).addClass('run');
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

    this.setDeltaTime = function (val) {
        me.delta.time.actual = val;
    };

    this.setNextRandVal = function () {
        me.rand.count = 0;
        me.rand.nextVal = Math.floor(
            (1 / me.delta.time.actual) *
                ((Math.random() * me.rand.maxVal) + me.rand.minVal)
        );
    }

    this.singleAnimation = function (obj, cssClass, cb) {
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
        obj.addClass(cssClass);
        animationDuration = obj.css('animation-duration');
        if (animationDuration === null)
            animationDuration = obj.css('-webkit-animation-duration')
        animationIterationCount = obj.css('animation-iteration-count');
        if (animationIterationCount === null)
            animationIterationCount = obj.css('-webkit-animation-iteration-count');
        animationDuration = parseFloat(animationDuration);
        animationIterationCount = parseInt(animationIterationCount);
        setTimeout(function () {
            obj.removeClass(cssClass);
            cb();
        }, animationDuration * animationIterationCount * 1000);
    };

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

    this.walk = function () {
        $('#' + me.idImg).removeClass('run');
        $('#' + me.idImg).addClass('walk');
    };

    this.updateCollider();
    this.genJumpLut();
}

function KeyHandler () {
    var me = this;
    me.keyCodeMap = [];

    this.clearKeyCodeMap = function () {
        var val;
        for (val in me.keyCodeMap)
            me.keyCodeMap[val] = false;
    };

    this.isAnyKeyPressed = function () {
        var val;
        for (val in me.keyCodeMap)
            if (me.keyCodeMap[val])
                return true
        return false;
    };

    this.isKeyDown = function (keyCode) {
        if (me.keyCodeMap[keyCode] === undefined)
            me.keyCodeMap[keyCode] = false;
        return me.keyCodeMap[keyCode];
    };

    this.setKey = function (keyCode, val) {
        me.keyCodeMap[keyCode] = val;
    };
}

function Ticker (maxFps) {
    var me = this;
    me.timerId = null;
    me.fps = [];
    me.fps.max = maxFps;
    me.fps.real = me.fps.max;
    me.time = [];
    me.time.start = 0;
    me.time.diff = 0;
    me.tick = [];
    me.tick.min = 1000/me.fps.max;
    me.tick.real = 1000/me.fps.real;
    me.tickCnt = 0;

    this.drawFps = function () {
        me.fps.real = Math.floor(1000 / me.tick.real);
        $('#fps').text(me.fps.real + " / " + me.fps.max );

    };

    this.getDeltaTime = function () {
        return (me.tick.real / 1000);
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

    this.startTicker = function (cb) {
        me.handleTicker(cb);
        me.timerId = setInterval(function () {
            me.handleTicker(cb);
        }, me.tick.real);
    };

    this.stopTicker = function () {
        me.timerId = null;
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
