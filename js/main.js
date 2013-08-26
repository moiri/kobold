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

    /* Class name definig which elements are solid, i.e. with which elements
     * the character is colliding (lets call them collidables). All elements
     * on the web page intended to be a collidable must have this css class.
     */
    me.solidClass = 'solid';
    this.setSolidClass = function (val) {me.solidClass = val;};

    /* Class name defining which elements are moving. Only elements using the
     * animate function of jquery to change to position work properly. the
     * animation must be already defined. A moving element with this class will
     * collide with the character from all sides. If it should only collide
     * when the character is jumping/falling on top of it, please use
     * me.solidMovingGhostClass.
     */
    me.solidMovingClass = 'solidMoving';
    this.setSolidMovingClass = function (val) {me.solidMovingClass = val;};

    /* Class name defining which elements are moving. Only elements using the
     * animate function of jquery to change to position work properly. The
     * animation must be already defined. A moving element with this class will
     * collide with the character only if the character falls/jummps on to of it.
     * If it should collide with the character from all sides, please use
     * me.solidMovingClass.
     */
    me.solidMovingGhostClass = 'solidMovingGhost';
    this.setSolidMovingGhostClass = function (val) {me.solidMovingGhostClass = val;};

    /* Id of the character the corresponding div element must exist on the
     * web page.
     */
    me.movable.id = 'kobold';
    this.setMovableId = function (val) {me.movable.id = val;};

    me.movable.initialPositionX = 30;
    me.movable.initialPositionY = 500;

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

    /* Define the height (in pixel) of the character in either standing or
     * crouching position. Keep in mind that these values depend directly on
     * the animation of the movable
     */ 
    me.movable.height.stand = 85;
    me.movable.height.crouch = 40;
    this.setMovableHeight = function (type, val) {me.movable.height[type] = val;};

    /* Define the width (in pixel) of the character in either standing or
     * crouching position. Keep in mind that these values depend directly on
     * the animation of the movable
     */ 
    me.movable.width = 53
    this.setMovableWidth = function (val) {me.movable.width = val;};

    /* Define the intervall of random idle animations (in seconds). After
     * completion of an animation, The next random animation well tart in
     * me.movable.randIdle.minVal seconds at the erliest and in
     * me.movable.randIdle.maxVal seconds at the latest.
     */
    me.movable.randIdle.min = 4;
    me.movable.randIdle.max = 10;
    this.setMovableRandIdle = function (type, val) {me.movable.randIdle[type] = val};
}

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
    me.solidClass = config.solidClass;
    me.solidMovingClass = config.solidMovingClass;
    me.solidMovingGhostClass = config.solidMovingGhostClass;
    me.solidColliderClass = "solidCollider";
    me.solidColliderGhostClass = me.solidColliderClass + "Ghost";
    me.solidColliderXClass = me.solidColliderClass + "left";
    me.solidColliderYClass = me.solidColliderClass + "bottom";
    me.configMovable = config.movable;
    me.configMovable.solidColliderClass = me.solidColliderClass;
    me.configMovable.solidColliderGhostClass = me.solidColliderGhostClass;
    me.configMovable.solidColliderXClass = me.solidColliderXClass;
    me.configMovable.solidColliderYClass = me.solidColliderYClass;
    me.configMovable.enableCrouchJumpHigh = me.enable.crouch.jumpHigh;
    me.configMovable.minDeltaTime = 1 / config.maxFps;

    this.movableHandler = function () {
        var inAir = false;
        me.movable.setDeltaTime(me.ticker.getDeltaTime());
        if (me.enable.appear) me.movable.checkPosition();
        me.movable.checkCollision();
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

    this.setPosMovableSolid = function (elem, prop, val) {
        var deltaSize = (val - parseFloat($(elem).css(prop))) *
                me.ticker.getDeltaTime() / me.configMovable.minDeltaTime;
        if ($(elem).hasClass(me.solidMovingGhostClass)) {
            $(elem).attr('data-position', 'relative');
            if (prop === 'bottom') {
                $(elem).attr('data-position', 'absolute');
                if (deltaSize > 0) {
                    deltaSize++;
                    $(elem).attr('data-position', 'relative');
                    $(elem).children().first()
                        .height($(elem).outerHeight() + deltaSize);
                }
            }
        }
        else {
            if (deltaSize < 0) {
                // moving down/left
                deltaSize--;
                $(elem).attr('data-position', 'absolute');
                $(elem).children('.' + me.solidColliderClass + prop)
                    .css(prop, (deltaSize - parseInt($(elem)
                                    .css('border-' + prop + '-width'))) + 'px');
                deltaSize = Math.abs(deltaSize);
            }
            else {
                // moving up/right
                $(elem).attr('data-position', 'relative');
                $(elem).children('.' + me.solidColliderClass + prop)
                    .css(prop, '-' + $(elem).css('border-' + prop + '-width'));
            }
            if (prop === 'bottom') {
                $(elem).children('.' + me.solidColliderClass + prop)
                    .height($(elem).height() + deltaSize);
            }
            else if (prop === 'left') {
                $(elem).attr('data-position', 'relative');
                $(elem).children('.' + me.solidColliderClass + prop)
                    .width($(elem).outerWidth() + deltaSize);
            }
        }
    };

    this.setup = function () {
        jQuery.extend(jQuery.fx, {
            step: {
                _default: function( fx ) {
                    if (fx.prop === 'left' || fx.prop === 'bottom') {
                        me.setPosMovableSolid(fx.elem, fx.prop, fx.now);
                    }
                    if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
                        fx.elem.style[ fx.prop ] = fx.now + fx.unit;
                    } else {
                        fx.elem[ fx.prop ] = fx.now;
                    }
                }
            }
        });
        $('.' + me.solidClass).each(function () {
            var width = $(this).outerWidth(),
                height = $(this).outerHeight(),
                borderLeftWidth = $(this).css('border-left-width'),
                borderBottomWidth = $(this).css('border-bottom-width');
            if ($(this).hasClass(me.solidMovingClass)) {
                $(this).append('<div class="' + me.solidColliderClass + ' ' +
                    me.solidColliderXClass + '"></div>');
                $(this).append('<div class="' + me.solidColliderClass + ' ' +
                    me.solidColliderYClass + '"></div>');
            }
            else if ($(this).hasClass(me.solidMovingGhostClass)) {
                $(this).append('<div class="' + me.solidColliderClass + ' ' +
                    me.solidColliderGhostClass + '"></div>');
            }
            else {
                $(this).append('<div class="' + me.solidColliderClass + '"></div>');
            }
            $(this).children().each(function () {
                $(this).width(width);
                $(this).height(height);
                $(this).css('left', '-' + borderLeftWidth);
                $(this).css('bottom', '-' + borderBottomWidth);
            });
        });
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

    me.setup();
}

function Movable(config, setEnable) {
    var me = this;
    me.id = config.id;
    me.idImg = me.id + "-img";
    me.idCollider = me.id + "-collider";
    me.idPickUpCnt = config.idPickUpCnt;
    me.solidColliderClass = config.solidColliderClass
    me.solidColliderGhostClass = config.solidColliderGhostClass
    me.solidColliderXClass = config.solidColliderXClass
    me.solidColliderYClass = config.solidColliderYClass
    me.solids = $('.' + me.solidColliderClass);
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
    me.width = config.width;
    me.action = [];
    me.action.crouch = false;
    me.action.wink = false;
    me.action.wave = false;
    me.action.jawn = false;
    me.action.jump = false;
    me.action.moveLeft = false;
    me.action.moveRight = false;
    me.rand = [];
    me.rand.count = 0;
    me.rand.minVal = config.randIdle.min;
    me.rand.maxVal = config.randIdle.max;
    me.rand.nextVal = -1;
    me.pos = [];
    me.pos.x = 0;
    me.pos.y = 0;
    me.pos.initX = config.initialPositionX;
    me.pos.initY = config.initialPositionY;
    me.pickUpCounter = 0;
    me.positionAbsolute = true;
    me.positionAbsoluteObj = null;
    me.positionRelativeObj = null;

    this.active = function () {
        $('#' + me.idImg).removeClass('rand');
        me.rand.count = 0;
    };

    this.appear = function (x, y) {
        setEnable(false);
        if (!me.positionAbsolute)
            me.changeToAbsolutePosition();
        me.singleAnimation($('#' + me.idImg), 'appear', function () {
            setEnable(true);
        });
        $('#' + me.idImg).removeClass('walk run');
        $('#' + me.idImg).addClass('idle');
        $('#' + me.id).css('bottom', y);
        $('#' + me.id).css('left', x);
    };

    this.changeToAbsolutePosition = function () {
        var obj = me.positionRelativeObj;
        me.cssSetX($('#' + me.id).offset().left, true);
        me.cssSetY($(window).height() - $('#' + me.id).offset().top -
                $('#' + me.id).height(), true);
        $('#' + me.id).appendTo(me.positionAbsoluteObj);
        me.positionAbsolute = true;
    };

    this.changeToRelativePosition = function (obj) {
        me.positionAbsolute = false;
        me.positionRelativeObj = obj;
        me.positionAbsoluteObj = $('#' + me.id).parent();
        me.cssSetX($('#' + me.id).offset().left - obj.offset().left, true);
        me.cssSetY(parseInt(obj.height()), true);
        $('#' + me.id).appendTo(obj);
    };

    this.checkCollision = function () {
        var collision = [],
            collidedObjects = [];
        collision.left = false;
        collision.right = false;
        collision.top = false;
        collision.bottom = false;
        collidedObjects.left = [];
        collidedObjects.right = [];
        collidedObjects.top = [];
        collidedObjects.bottom = [];
        me.solids.each(function () {
            var checkGhost = $(this).hasClass(me.solidColliderGhostClass),
                checkX = $(this).hasClass(me.solidColliderXClass),
                checkY = $(this).hasClass(me.solidColliderYClass),
                checkMoving = (checkGhost || checkX || checkY);
            if ((!checkGhost && !checkY && ((checkX && checkMoving) || !checkMoving)) &&
                    me.overlaps(me.collider.left.obj, $(this))) {
                collision.left = true;
                collidedObjects.left.push($(this).parent());
            }
            if ((!checkGhost && !checkY && ((checkX && checkMoving) || !checkMoving)) &&
                    me.overlaps(me.collider.right.obj, $(this))) {
                collision.right = true;
                collidedObjects.right.push($(this).parent());
            }
            if ((!checkGhost && !checkX) &&
                    me.overlaps(me.collider.top.obj, $(this))) {
                collision.top = true;
                collidedObjects.top.push($(this).parent());
            }
            if (!checkX &&
                    me.overlaps(me.collider.bottom.obj, $(this))) {
                collision.bottom = true;
                collidedObjects.bottom.push($(this).parent());
            }
        }).promise().done(function () {
            me.collider.bottom.isColliding = collision.bottom;
            me.collider.left.isColliding = collision.left;
            me.collider.right.isColliding = collision.right;
            me.collider.top.isColliding = collision.top;
            if ((collision.left && collision.right) ||
                (collision.top && collision.bottom)) {
                me.appear(me.pos.initX, me.pos.initY);
            }
            else {
                if (collision.bottom) {
                    me.speed.inAir = me.delta.dist.down;
                    collidedObjects.bottom.sort(function(a,b) {
                        return me.positionsGet(a)[1][0] - me.positionsGet(b)[1][0]
                    });
                    if (!me.positionAbsolute &&
                        (collidedObjects.bottom[0]
                            .attr('data-position') === 'absolute')) {
                        me.changeToAbsolutePosition();
                    }
                    else if (me.positionAbsolute &&
                        (collidedObjects.bottom[0]
                            .attr('data-position') === 'relative')) {
                        me.changeToRelativePosition(collidedObjects.bottom[0]);
                    }
                    me.cssSetY($(window).height() -
                        me.positionsGet(collidedObjects.bottom[0])[1][0]);
                }
                if (collision.left && !me.action.moveRight) {
                    collidedObjects.left.sort(function(a,b) {
                        return me.positionsGet(b)[0][1] - me.positionsGet(a)[0][1]
                    });
                    me.cssSetX(me.positionsGet(collidedObjects.left[0])[0][1]);
                }
                if (collision.right && !me.action.moveLeft) {
                    collidedObjects.right.sort(function(a,b) {
                        return me.positionsGet(a)[0][0] - me.positionsGet(b)[0][0]
                    });
                    me.cssSetX(me.positionsGet(collidedObjects.right[0])[0][0] -
                            $('#' + me.id).outerWidth());
                }
                if (collision.top && me.action.jump) {
                    collidedObjects.top.sort(function(a,b) {
                        return me.positionsGet(b)[1][1] - me.positionsGet(a)[1][1]
                    });
                    me.cssSetY($(window).height() -
                        me.positionsGet(collidedObjects.top[0])[1][1] -
                        $('#' + me.id).outerHeight());
                }
            }
        });
    };

    this.checkPosition = function () {
        if ((parseInt($('#' + me.id).css('bottom')) + $('#' + me.id).height()) < 0) {
            me.appear(me.pos.x, parseInt(me.pos.y));
        }
        else if ($('#' + me.id).offset().left < 0) {
            me.cssSetX(0);
        }
        else if (parseInt($('#' + me.id).css('right')) < 0) {
            me.cssSetX($(window).width() - $('#' + me.id).width());
        }
    };

    this.crouch = function () {
        if (!me.action.crouch) {
            $('#' + me.idImg).addClass('crouch');
            $('#' + me.idImg).css('top', '-60px');
            $('#' + me.idCollider).height(me.height.crouch + 'px');
            if (me.enableCrouchJumpHigh && !me.collider.bottom.isColliding)
                me.cssMoveY(me.height.crouch);
            me.updateCollider();
            me.action.crouch = true;
        }
    };

    this.cssMoveX = function (val) {
        $('#' + me.id).css("left", "+=" + val + "px");
    };

    this.cssSetX = function (val, force) {
        if (me.positionAbsolute || force)
            $('#' + me.id).css("left", val + "px");
    };

    this.cssMoveY = function (val) {
        $('#' + me.id).css("bottom", "+=" + val + "px");
    };

    this.cssSetY = function (val, force) {
        if (me.positionAbsolute || force)
            $('#' + me.id).css("bottom", val + "px");
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
            if (!me.collider.bottom.isColliding) {
                if (!me.positionAbsolute) {
                    me.changeToAbsolutePosition();
                }
                me.cssMoveY(me.move.y);
                if (me.speed.inAir < me.speed.fall) me.speed.inAir = me.speed.fall;
            }
            else {
                $('#' + me.idImg).removeClass('jump');
                if (me.positionAbsolute) me.pos.y = $('#' + me.id).css("bottom");
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
            if (!me.collider.top.isColliding) {
                me.cssMoveY(me.move.y);
            }
            else {
                me.action.jump = false;
                me.jumpAttr.height.actual = 0;
            }
        }
        return !me.collider.bottom.isColliding;
    };

    this.jump = function () {
        if (me.collider.bottom.isColliding && !me.action.jump) {
            me.action.jump = true;
            me.jumpAttr.count.actual = 0;
            me.jumpAttr.count.last = 0;
            me.jumpAttr.height.start = $('#' + me.id).offset().top;
            $('#' + me.idImg).addClass('jump');
            if (!me.positionAbsolute) {
                me.changeToAbsolutePosition();
            }
        }
    };

    this.moveLeft = function (run) {
        var collidedObjects,
            speed = (run) ? me.speed.leftRun : me.speed.left;
        me.action.moveLeft = true;
        $('#' + me.idImg).removeClass('idle right');
        $('#' + me.idImg).addClass('left');
        me.move.x = Math.floor(speed * me.delta.time.actual);
        me.updateCollider("left", Math.abs(me.move.x) + 1);
        if (!me.collider.left.isColliding) {
            me.cssMoveX(me.move.x);
            if (me.collider.bottom.isColliding && me.positionAbsolute)
                me.pos.x = $('#' + me.id).offset().left + $('#' + me.id).width();
        }
    };

    this.moveRight = function (run) {
        var collidedObjects, 
            speed = (run) ? me.speed.rightRun : me.speed.right;
        me.action.moveRight = true;
        $('#' + me.idImg).removeClass('idle left');
        $('#' + me.idImg).addClass('right');
        me.move.x = Math.floor(speed * me.delta.time.actual);
        me.updateCollider("right", me.move.x + 1);
        if (!me.collider.right.isColliding) {
            me.cssMoveX(me.move.x);
            if (me.collider.bottom.isColliding && me.positionAbsolute)
                me.pos.x = $('#' + me.id).offset().left - $('#' + me.id).width();
        }
    };

    this.pickUp = function () {
        var collisionRes = null;
        me.pickUps.each(function (idx) {
            if (me.overlaps($('#' + me.id), $(this))) {
                me.pickUps.splice(idx, 1);
                $(this).removeClass(me.pickUpClass);
                me.pickUpCounter++;
                $('#' + me.idPickUpCnt).text(me.pickUpCounter);
                me.singleAnimation($(this), 'success', function () {
                    $(this).remove();
                });
            }
        });
    };

    this.overlaps = function (a, b) {
        var pos1 = me.positionsGet(a),
            pos2 = me.positionsGet(b);
        return (me.positionsCompare(pos1[0], pos2[0]) &&
            me.positionsCompare(pos1[1], pos2[1]));
    };
    
    this.positionsCompare = function (p1, p2) {
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
    };
    
    this.positionsGet = function (elem) {
        var pos, width, height, res;
        pos = elem.offset();
        width = elem.outerWidth();
        height = elem.outerHeight();
        if (pos === null) {
            var test = true;
        }
        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
    };

    this.run = function () {
        $('#' + me.idImg).removeClass('walk');
        $('#' + me.idImg).addClass('run');
    };

    this.setDeltaTime = function (val) {
        me.delta.time.actual = val;
    };

    this.setNextRandVal = function () {
        me.rand.count = 0;
        me.rand.nextVal = Math.floor(
            (1 / me.delta.time.actual) *
                ((Math.random() * me.rand.maxVal) + me.rand.minVal)
        );
    };

    this.setup = function () {
        $('#' + me.id)
            .append('<div id="' + me.idCollider + '" class="colliderContainer">' +
                '<div id="' + me.idCollider +
                    '-left" class="collider colliderLeft"></div>' +
                '<div id="' + me.idCollider +
                    '-right" class="collider colliderRight"></div>' +
                '<div id="' + me.idCollider +
                    '-top" class="collider colliderTop"></div>' +
                '<div id="' + me.idCollider +
                    '-bottom" class="collider colliderBottom"></div>' +
            '</div>');
        me.collider.left.obj = $('#' + me.idCollider + '-left');
        me.collider.right.obj = $('#' + me.idCollider + '-right');
        me.collider.top.obj = $('#' + me.idCollider + '-top');
        me.collider.bottom.obj = $('#' + me.idCollider + '-bottom');
        $('#' + me.idCollider).width(me.width);
        $('#' + me.idCollider).height(me.height.stand);
    };

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

    this.standUp = function () {
        if (me.action.crouch) {
            $('#' + me.idImg).removeClass('crouch');
            $('#' + me.idImg).removeAttr('style');
            if (me.collider.top.isColliding)
                me.cssMoveY(me.height.crouch - me.height.stand);
            $('#' + me.idCollider).height(me.height.stand + 'px');
            me.updateCollider();
            me.action.crouch = false;
        }
    };

    this.stop = function () {
        $('#' + me.idImg).removeClass('walk run');
        me.action.moveLeft = false;
        me.action.moveRight = false;
    }

    this.updateCollider = function (direction, colliderSize) {
        var toleranceLeft = 0,
            toleranceRight = 0;
        if ((direction === undefined) || (direction === 'left')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(Math.floor(
                            me.delta.time.actual * me.speed.left));
            if (me.collider.bottom.isColliding) {
                toleranceLeft = me.collider.left.tolerance;
            }
            colliderSize++;
            $('#' + me.id + '-collider-left')
            .width(colliderSize  + "px")
            .height($('#' + me.idCollider).height() - toleranceLeft + "px")
            .css("left", "-" + colliderSize + "px");
        }

        if ((direction === undefined) || (direction === 'right')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(
                    Math.floor(me.delta.time.actual * me.speed.right));
            if (me.collider.bottom.isColliding) {
                toleranceRight = me.collider.right.tolerance;
            }
            colliderSize++;
            $('#' + me.id + '-collider-right')
            .width(colliderSize + "px")
            .height($('#' + me.idCollider).height() - toleranceRight + "px")
            .css("left", ($('#' + me.idCollider).width()) + "px");
        }

        if ((direction === undefined) || (direction === 'top')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(Math.floor(
                            me.delta.time.actual * me.speed.jump));
            colliderSize++;
            $('#' + me.id + '-collider-top')
            .height((colliderSize) + "px")
            .width($('#' + me.idCollider).width() + "px")
            .css("top", "-" + colliderSize + "px");
        }

        if ((direction === undefined) || (direction === 'bottom')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(Math.floor(
                            me.delta.time.actual * me.speed.fall));
            colliderSize++;
            $('#' + me.id + '-collider-bottom')
            .height(colliderSize + "px")
            .width($('#' + me.idCollider).width() + "px")
            .css("top", $('#' + me.idCollider).height() + "px");
        }
    };

    this.updateSolidCollider = function () {
        $('.' + me.solidClass + '.' + me.movingSolidClass).each(function () {

        });
    };

    this.walk = function () {
        $('#' + me.idImg).removeClass('run');
        $('#' + me.idImg).addClass('walk');
    };

    this.setup();
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

