function Engine() {
    var me = this;
    {
        // INITIALISATION
        me.config = [];
        me.movable = [];
        me.keyCodes = [];
        me.ticker = null;
        me.keyHandler = null;
    }

    {
        me.colliderCnt = 0;

        // CONFIGURATION
        me.config.maxFps = 40;
        me.config.solidClass = 'solid';
        me.config.solidOnlyTopClass = me.config.solidClass + 'OnlyTop';
        me.config.solidMovingClass = me.config.solidClass + 'Moving';
        me.config.solidColliderClass = 'solidCollider';
        me.config.solidColliderWrapperClass =
            me.config.solidColliderClass + 'Wrapper';
        me.config.solidColliderMovingClass =
            me.config.solidColliderClass + 'Moving';
        me.config.solidColliderOnlyTopClass =
            me.config.solidColliderClass + 'OnlyTop';
        me.config.solidColliderIgnoreClass =
            me.config.solidColliderClass + 'Ignore';

        this.setConfigAttr = function (attr, val) {
            me.config[attr] = val;
        };
        this.getConfigAttr = function (attr) {
            return me.config[attr];
        };
    }

    // METHODS
    this.disableCollider = function (obj) {
        obj.find('.' + me.config.solidColliderWrapperClass + '>:first-child')
        .addClass(me.config.solidColliderIgnoreClass);
    };

    this.enableCollider = function (obj) {
        obj.find('.' + me.config.solidColliderWrapperClass + '>:first-child')
        .removeClass(me.config.solidColliderIgnoreClass);
    };

    this.toggleEnableCollider = function (obj) {
        obj.find('.' + me.config.solidColliderWrapperClass + '>:first-child')
        .toggleClass(me.config.solidColliderIgnoreClass);
    };

    this.newMovable = function (id, cssClass) {
        var newMovable = [];
        if (id === undefined) id = 'kobold';
        if (me.movable[id] === undefined) {
            if (cssClass === undefined) cssClass = 'koboldImg';
            $('body')
                .append('<div id="' + id + '" class="movable"><div id="' +
                    id + '-img" class="' + cssClass +
                    ' idle right"></div></div>');
            newMovable.enable = false;
            newMovable.obj = new Movable(id, me.config,
                    me.setEnableMovable, me.setKeyCode);
            me.movable[id] = newMovable;
        }
        else {
            throw 'Movable with id ' + id + ' already exists';
        }
        return me.movable[id].obj;
    };

    this.movableHandler = function (movable) {
        var inAir = false,
            onMovableSolid = false,
            forcedCrouch = false;
        movable.setDeltaTime(me.ticker.getDeltaTime());
        onMovableSolid = movable.checkCollisionDynamic();
        if (movable.getEnableStatus('pickUp')) movable.pickUp();
        if (movable.getEnableStatus('jump') &&
                me.keyHandler.keyCodeMap[movable.getKeyCode('jump')] &&
                (onMovableSolid && movable.getEnableStatus('jumpMovingSolid') ||
                 !onMovableSolid)) {
            if (!movable.getEnableStatus('crouchJump')) {
                forcedCrouch = movable.standUp();
            }
            if (!forcedCrouch) movable.jump();
        }
        if (movable.getEnableStatus('run') &&
                me.keyHandler.keyCodeMap[movable.getKeyCode('run')]) {
            movable.run();
        }
        else {
            movable.walk();
        }
        if (movable.getEnableStatus('crouch')) {
            if (!me.keyHandler.keyCodeMap[movable.getKeyCode('crouch')] ||
                (me.keyHandler.keyCodeMap[movable.getKeyCode('crouch')] &&
                me.keyHandler.keyCodeMap[movable.getKeyCode('run')] &&
                !movable.getEnableStatus('crouchRun'))) {
                forcedCrouch = movable.standUp();
            }
            if ((me.keyHandler.keyCodeMap[movable.getKeyCode('crouch')] ||
                    forcedCrouch) &&
                (!me.keyHandler.keyCodeMap[movable.getKeyCode('run')] ||
                    (movable.getEnableStatus('crouchRun') &&
                        me.keyHandler.keyCodeMap[movable.getKeyCode('run')]))) {
                movable.crouch();
            }
        }
        if (!me.keyHandler.keyCodeMap[movable.getKeyCode('left')] &&
            !me.keyHandler.keyCodeMap[movable.getKeyCode('right')]) {
            movable.stop();
            movable.idle();
        }
        if (!onMovableSolid) inAir = movable.inAir();
        if (me.keyHandler.keyCodeMap[movable.getKeyCode('left')]) {
            movable.moveLeft();
        }
        else if (me.keyHandler.keyCodeMap[movable.getKeyCode('right')]) {
            movable.moveRight();
        }
        if (me.keyHandler.isAnyKeyPressed() || inAir || forcedCrouch) {
            movable.active();
        }
        if (movable.getEnableStatus('alwaysCheckPosition')) {
            movable.checkPosition();
        }
    };

    this.registerKeyEvents = function () {
        $(document).keydown( function (event) {
            var idx;
            for (idx in me.keyCodes)
                if (event.keyCode === me.keyCodes[idx])
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

    this.setEnableMovable = function (id, val) {
        if (val === undefined) val = !me.movable[id].enable;
        me.movable[id].enable = val;
    };

    this.setKeyCode = function (keyCode) {
        if (!(keyCode in me.keyCodes)) {
            me.keyCodes.push(keyCode)
        }
    };

    this.setup = function () {
        var oldFunction = jQuery.fx.step._default;
        jQuery.extend(jQuery.fx, {
            step: {
                _default: function( fx ) {
                    if (fx.prop === 'bottom' || fx.prop === 'top') {
                        me.updateMovingCollider(fx.elem, fx.prop, fx.now);
                    }
                    oldFunction(fx);
                }
            }
        });
        me.updateCollider();
    };

    this.start = function () {
        me.ticker = new Ticker(me.config.maxFps);
        me.keyHandler = new KeyHandler();
        me.registerKeyEvents();
        me.ticker.startTicker(function () {
            for (id in me.movable) {
                if (me.movable[id].enable) {
                    me.movableHandler(me.movable[id].obj);
                }
            }
        });
        me.ticker.drawFps();
    };

    this.updateCollider = function () {
        var newCollider = false;
        $('.' + me.config.solidClass + ':not(.' + me.config.solidMovingClass +
            ')' + ':not(:has(>.' + me.config.solidColliderWrapperClass + '))')
        .each(function () {
            var jObject = $('<div id="' + me.config.solidColliderClass +
                me.colliderCnt + '" class="' + me.config.solidColliderClass +
                '"></div>');
            $('<div class="' + me.config.solidColliderWrapperClass + '"></div>')
            .appendTo(this)
            .append(jObject);
            if ($(this).hasClass(me.config.solidOnlyTopClass)) {
                jObject.addClass(me.config.solidColliderOnlyTopClass);
            }
            me.colliderCnt++;
            newCollider = true;
        });
        $('.' + me.config.solidMovingClass + ':not(:has(>.' +
                    me.config.solidColliderWrapperClass + '))')
        .each(function () {
            var jObject = $('<div id="' + me.config.solidColliderMovingClass +
                me.colliderCnt + '" class="' +
                me.config.solidColliderMovingClass + ' ' +
                me.config.solidColliderOnlyTopClass + '"></div>');
            $('<div class="' + me.config.solidColliderWrapperClass + '"></div>')
            .appendTo(this)
            .append(jObject);
            jObject
            .width($(this).outerWidth())
            .height($(this).outerHeight())
            .css({
                'margin-bottom': -$(this).outerHeight(),
                'left': '-' + $(this).css('border-left-width'),
                'bottom': $(this).css('border-bottom-width')
            });
            me.colliderCnt++;
            newCollider = true;
        });
        $('.' + me.config.solidColliderClass)
        .each(function () {
            var myParent = $(this).parent().parent();
            $(this).removeAttr('style');
            $(this).width(myParent.outerWidth())
            .height(myParent.outerHeight())
            .css({
                'margin-bottom': -$(this).outerHeight(),
                'left': myParent.offset().left - $(this).offset().left,
                'bottom': $(this).offset().top - myParent.offset().top
            });
        });
        if (newCollider) {
            for (id in me.movable) {
                me.movable[id].obj.updateSolidCollider();
            }
        }
    };

    this.updateMovingCollider = function (elem, prop, val) {
        var deltaSize,
            delta = 1;
        if ($(elem).hasClass(me.config.solidMovingClass)) {
            deltaSize = Math.round((val - parseFloat($(elem).css(prop))) *
                me.ticker.getDeltaTime() * me.config.maxFps);
            if (prop === 'bottom') {
                if (deltaSize > 0) {
                    deltaSize += delta;
                    $(elem).find('.' + me.config.solidColliderMovingClass)
                        .first()
                        .height($(elem).outerHeight() + deltaSize)
                        .css('bottom', 1 + deltaSize);
                }
            }
            else if (prop === 'top') {
                if (deltaSize < 0) {
                    deltaSize -= delta;
                    $(elem).find('.' + me.config.solidColliderMovingClass)
                        .first()
                        .height($(elem).outerHeight() - deltaSize)
                        .css('bottom', 1 - deltaSize);
                }
            }
        }
    };

    me.setup();
}

function Movable(id, config, setEnableMeCb, setKeyCodeCb) {
    var me = this;
    {
        // INITIALISATION
        me.enable = [];
        me.enable.crouch = [];
        me.enable.jump = [];
        me.keyCode = [];
        me.pickUpAttr = [];
        me.speed = [];
        me.pos = [];
        me.size = [];
        me.collider = [];
        me.collider.left = [];
        me.collider.left.tolerance = [];
        me.collider.right = [];
        me.collider.right.tolerance = [];
        me.collider.top = [];
        me.collider.bottom = [];
        me.jumpAttr = [];
        me.jumpAttr.lut = [];
        me.jumpAttr.height = [];
        me.jumpAttr.count = [];
        me.rand = [];
        me.action = [];
        me.delta = [];
        me.delta.time = [];
        me.delta.dist = [];
        me.delta.move = [];
        me.overflow = [];
        me.overflow.window = [];
        me.overflow.window.left = [];
        me.overflow.window.right = [];
        me.overflow.window.top = [];
        me.overflow.window.bottom = [];
        me.overflow.document = [];
        me.overflow.document.left = [];
        me.overflow.document.right = [];
        me.overflow.document.top = [];
        me.overflow.document.bottom = [];
    }

    {
        // CONFIGURATION
        // Object
        me.obj = $('#' + id);

        // IDs
        me.id = id;
        me.idImg = me.id + '-img'; // internal
        me.idCollider = me.id + "-collider"; // internal

        this.getId = function () {
            return me.id;
        };

        // Enables
        me.enable.run = true;
        me.enable.jump = true;
        me.enable.jumpMovingSolid = false;
        me.enable.jumpAbsolute = !me.enable.jumpMovingSolid; // internal
        me.enable.crouch = true;
        me.enable.crouchRun = false;
        me.enable.crouchJump = true;
        me.enable.crouchJumpHigh = true;
        me.enable.appear = true;
        me.enable.vanish = true;
        me.enable.pickUp = true;
        me.enable.alwaysCheckPosition = false;

        this.enableAttr = function (attr) {
            if (attr === 'jumpAbsolute') {
                throw 'not allowed to set ' + attr + ' manually!';
            }
            me.enable[attr] = true;
        };
        this.disableAttr = function (attr) {
            if (attr === 'jumpAbsolute') {
                throw 'not allowed to set ' + attr + ' manually!';
            }
            me.enable[attr] = false;
        };
        this.toggleEnableAttr = function (attr) {
            if (attr === 'jumpAbsolute') {
                throw 'not allowed to set ' + attr + ' manually!';
            }
            me.enable[attr] = !me.enable[attr];
        };
        this.getEnableStatus = function (attr) {
            return me.enable[attr];
        };

        // KeyCodes
        this.setKeyCode = function (attr, keyCode) {
            me.keyCode[attr] = keyCode;
            setKeyCodeCb(keyCode);
        };
        this.getKeyCode = function (attr) {
            return me.keyCode[attr];
        };

        me.setKeyCode('jump', 32);
        me.setKeyCode('run', 16);
        me.setKeyCode('left', 37);
        me.setKeyCode('right', 39);
        me.setKeyCode('crouch', 17);

        // Speed
        me.speed.right = 200;
        me.speed.rightRun = 300;
        me.speed.left = -200;
        me.speed.leftRun = -300;
        me.speed.jump = 1200;
        me.speed.fall = -1200;
        me.speed.inAir = 0; // internal

        this.setSpeed = function (attr, speed) {
            if (attr === 'inAir') {
                throw 'not allowed to set ' + attr + 'manually!';
            }
            else me.speed[attr] = speed;
        };
        this.getSpeed = function (attr) {
            return me.speed[attr];
        };

        // Position
        me.pos.initX = 30;
        me.pos.initY = 100;
        me.pos.x = 0; // internal
        me.pos.y = 0; // internal
        me.pos.overflowX; // internal
        me.pos.overflowY; // internal
        me.pos.absolute = true; // internal
        me.pos.absoluteJObject = me.obj.parent(); // internal
        me.pos.appearCnt = 0;

        this.setInitialPosition = function (x, y) {
            me.pos.initX = x;
            me.cssSetX(x);
            me.pos.initY = y;
            me.cssSetY($(window).height() - y);
        };
        this.getInitialPosition = function () {
            var res = [];
            res.x = me.pos.initX;
            res.y = me.pos.initY;
            return res;
        };


        // Size
        me.size.heightStand = 85;
        me.size.heightCrouch = 40;
        me.size.width = 53;

        this.setSize = function (attr, val) {
            me.size[attr] = val;
        };
        this.getSize = function (attr) {
            return me.size[attr];
        };

        // z-index
        me.zIndex = 10;

        this.setZIndex = function (zIndex) {
            me.zIndex = zIndex;
            $('#' + me.idImg).css('z-index', zIndex);
        };
        this.getZIndex = function () {
            return me.zIndex;
        };

        // Collider
        me.collider.left.tolerance.top = 3;
        me.collider.left.tolerance.bottom = 10;
        me.collider.left.isColliding = false; // internal
        me.collider.left.jObject = null; // internal
        me.collider.right.tolerance.top = 3;
        me.collider.right.tolerance.bottom = 10;
        me.collider.right.isColliding = false; // internal
        me.collider.right.jObject = null; // internal
        me.collider.top.isColliding = false; // internal
        me.collider.top.jObject = null; // internal
        me.collider.bottom.isColliding = false; // internal
        me.collider.bottom.jObject = null; // internal
        me.collider.bottom.activeId = null; // internal

        this.setColliderToleranceTop = function (left, right) {
            me.collider.left.tolerance.top = left;
            me.collider.right.tolerance.top =
                (right === undefined) ? left : right;
        };
        this.getColliderToleranceTop = function () {
            var ret = [];
            ret.left = me.collider.left.tolerance.top;
            ret.right = me.collider.right.tolerance.top;
            return ret;
        };
        this.setColliderToleranceBottom = function (left, right) {
            me.collider.left.tolerance.bottom = left;
            me.collider.right.tolerance.bottom =
                (right === undefined) ? left : right;
        };
        this.getColliderToleranceBottom = function () {
            var ret = [];
            ret.left = me.collider.left.tolerance.bottom;
            ret.right = me.collider.right.tolerance.bottom;
            return ret;
        };

        // PickUp Attributes
        me.pickUpAttr.idCnt = 'pickUpCnt';
        me.pickUpAttr.cssClass = 'pickUp';
        me.pickUpAttr.jObjects = $('.' + me.pickUpAttr.cssClass);
        me.pickUpAttr.counter = 0; // internal

        this.setPickUpCounterId = function (id) {
            me.pickUpAttr.idCnt = id;
        };
        this.getPickUpCounterId = function () {
            return me.pickUpAttr.idCnt;
        };
        this.setPickUpCssClass = function (cssClass) {
            me.pickUpAttr.cssClass = cssClass;
            me.pickUpAttr.jObjects = $('.' + me.pickUpAttr.cssClass);
        };
        this.getPickUpCssClass = function () {
            return me.pickUpAttr.cssClass;
        };
        this.getPickUpCounter = function () {
            return me.pickUpAttr.counter;
        };

        // Jump Attributes
        me.jumpAttr.height.max = 160;
        me.jumpAttr.height.start = 0; // internal
        me.jumpAttr.height.actual = 0; // internal
        me.jumpAttr.count.actual = 0; // internal
        me.jumpAttr.count.last = 0; // internal

        this.setMaxJumpHeight = function (maxHeight) {
            me.jumpAttr.height.max = maxHeight;
        };
        this.getMaxJumpHeight = function () {
            return me.jumpAttr.height.max;
        };

        // Random Animations
        me.rand.minVal = 4;
        me.rand.maxVal = 10;
        me.rand.count = 0; // internal
        me.rand.nextVal = -1; // internal

        this.setRandomAnimationInterval = function (min, max) {
            me.rand.minVal = min;
            me.rand.maxVal = (max === undefined) ? min : max;
        };
        this.getRandomAnimationInterval = function () {
            var ret = [];
            ret.min = me.rand.minVal;
            ret.max = me.rand.maxVal;
            return ret;
        };

        // Action Flags
        me.action.crouch = false; // internal
        me.action.run = false; // internal
        me.action.wink = false; // internal
        me.action.wave = false; // internal
        me.action.jawn = false; // internal
        me.action.jump = false; // internal
        me.action.moveLeft = false; // internal
        me.action.moveRight = false; // internal

        // Temporal Information Needed for the Next Frame
        me.delta.time.min = 1 / config.maxFps; // internal
        me.delta.time.actual = me.delta.time.min; // internal
        me.delta.move.x = 0; // internal
        me.delta.move.y = 0; // internal
        me.delta.dist.up = me.speed.jump / 
            (me.jumpAttr.height.max /
                (me.speed.jump * me.delta.time.actual)
            * 2 + 1); // internal
        me.delta.dist.down = me.speed.fall /
            (me.jumpAttr.height.max /
                (Math.abs(me.speed.fall) * me.delta.time.actual)
            * 2 + 1); // internal

        // Engine configurations, all internal
        me.solidColliderClass = config.solidColliderClass;
        me.solidColliderMovingClass = config.solidColliderMovingClass;
        me.solidColliderOnlyTopClass = config.solidColliderOnlyTopClass;
        me.solidColliderIgnoreClass = config.solidColliderIgnoreClass;

        // Overflow Behavior
        me.overflow.document.height = $(document).height(); // internal
        me.overflow.document.heightVirtual = null; // internal
        me.overflow.document.width = $(document).width(); // internal
        me.overflow.document.widthVirtual = null; // internal

        me.overflow.document.left.delta = 0;
        me.overflow.document.left.cb = function (deltaBorder) {
            me.cssMoveX(deltaBorder);
        };
        me.overflow.document.right.delta = 0;
        me.overflow.document.right.cb = function (deltaBorder) {
            me.cssMoveX(deltaBorder);
        };
        me.overflow.document.top.delta = -me.size.heightStand;
        me.overflow.document.top.cb = function (deltaBorder) {};
        me.overflow.document.bottom.delta = -me.size.heightStand;;
        me.overflow.document.bottom.cb = function (deltaBorder) {
            me.appear();
        };
        me.overflow.window.left.delta = 500;
        me.overflow.window.left.cb = function (deltaMove) {
            if ($(document).scrollLeft() > 0) {
                $(document).scrollLeft(
                        $(document).scrollLeft() + deltaMove);
            }
        };
        me.overflow.window.right.delta = 500;
        me.overflow.window.right.cb = function (deltaMove) {
            if ($(document).width() >
                    ($(document).scrollLeft() + $(window).width())) {
                $(document).scrollLeft(
                        $(document).scrollLeft() + deltaMove);
            }
        };
        me.overflow.window.top.delta = 100;
        me.overflow.window.top.cb = function (deltaMove) {
            if ($(document).scrollTop() > 0) {
                $(document).scrollTop(
                        $(document).scrollTop() + deltaMove);
            }
        };
        me.overflow.window.bottom.delta = 100;
        me.overflow.window.bottom.cb = function (deltaMove) {
            if ($(document).height() >
                    ($(document).scrollTop() + $(window).height())) {
                $(document).scrollTop(
                        $(document).scrollTop() + deltaMove);
            }
        };

        this.setDocumentOverflowCb = function (direction, cb) {
            me.overflow.document[direction].cb = cb;
        };
        this.getDocumentOverflowCb = function (direction) {
            return me.overflow.document[direction].cb;
        };
        this.setDocumentOverflowDelta = function (direction, delta) {
            me.overflow.document[direction].delta = delta;
        };
        this.getDocumentOverflowDelta = function (direction) {
            return me.overflow.document[direction].delta;
        };
        this.setWindowOverflowCb = function (direction, cb) {
            me.overflow.window[direction].cb = cb;
        };
        this.getWindowOverflowCb = function (direction) {
            return me.overflow.window[direction].cb;
        };
        this.setWindowOverflowDelta = function (direction, delta) {
            me.overflow.window[direction].delta = delta;
        };
        this.getWindowOverflowDelta = function (direction) {
            return me.overflow.window[direction].delta;
        };
    }

    // METHODS

    this.active = function () {
        $('#' + me.idImg).removeClass('rand');
        me.rand.count = 0;
    };

    this.appear = function (x, y) {
        var collidedObjects;
        if (me.enable.appear) {
            if (x === undefined) x = me.pos.x;
            if (y === undefined) y = me.pos.y;
            me.obj.show();
            me.disableMe();
            if (me.pos.appearCnt > 0) {
                x = me.pos.initX;
                y = me.pos.initY;
            }
            me.pos.appearCnt++;
            if (!me.pos.absolute)
                me.changeToAbsolutePosition();
            me.stop();
            me.idle();
            me.standUp();
            me.obj.css({'bottom': $(window).height() - y, 'left': x});
            me.overflow.document.heightVirtual = null;
            me.singleAnimation($('#' + me.idImg), 'appear', function () {
                me.enableMe();
            });
        }
    };

    this.changeToAbsolutePosition = function () {
        me.cssSetX(me.obj.offset().left, true);
        me.cssSetY($(window).height() - me.obj.offset().top -
                me.obj.height(), true);
        me.obj.appendTo(me.pos.absoluteJObject);
        me.positionRelativeObj = null;
        me.pos.absolute = true;
    };

    this.changeToRelativePosition = function (obj) {
        me.cssSetX(me.obj.offset().left - obj.offset().left, true);
        me.cssSetY(parseInt(obj.height()) +
                parseInt(obj.css('border-top-width')), true);
        me.obj.css('top', '');
        me.obj.appendTo(obj);
        me.positionRelativeObj = obj;
        me.pos.absolute = false;
    };

    this.checkCollisionDynamic = function () {
        var collision = false,
            collidedObjects = [];
        if (!me.action.jump) {
            me.solidsMoving.each(function (idx) {
                var collisionInfo = [],
                    collisionRes = null;
                if (!$(this).hasClass(me.solidColliderIgnoreClass)) {
                    collisionRes =
                        me.overlaps(me.collider.bottom.jObject, $(this));
                    if (collisionRes.isColliding) {
                        collisionInfo.jObject = $(this);
                        collisionInfo.solidPosition = collisionRes.pos2;
                        collision = true;
                        collidedObjects.push(collisionInfo);
                    }
                }
            }).promise().done(function () {
                if (collision) {
                    if (!me.enable.alwaysCheckPosition) me.checkPosition();
                    me.collider.bottom.isColliding = true;
                    me.land(collidedObjects);
                }
            });
        }
        return collision;
    };

    this.checkCollisionStatic = function (direction) {
        var collision = false,
            collidedObjects = [];
        me.solids.each(function (idx) {
            var collisionInfo = [],
                collisionRes = null;
            if (!$(this).hasClass(me.solidColliderIgnoreClass) &&
                (($(this).hasClass(me.solidColliderOnlyTopClass) &&
                    (direction === 'bottom')) ||
                    !$(this).hasClass(me.solidColliderOnlyTopClass))) {
                collisionRes =
                    me.overlaps(me.collider[direction].jObject, $(this));
                if (collisionRes.isColliding) {
                    collisionInfo.jObject = $(this);
                    collisionInfo.solidPosition = collisionRes.pos2;
                    collision = true;
                    collidedObjects.push(collisionInfo);
                }
            }
        });
        me.collider[direction].isColliding = collision;
        return collidedObjects;
    };

    this.checkPosition = function (direction) {
        var pos = me.positionsGet(me.obj),
            posImg = me.positionsGet($('#' + me.idImg)),
            imgDiff = 0;

        // check left overflow
        if ((direction === 'left') || (direction === undefined)) {
            if (pos[0][0] < me.overflow.document.left.delta) {
                me.overflow.document.left.cb(-pos[0][0]);
            }
            else if (pos[0][0] <
                    ($(window).scrollLeft() + me.overflow.window.left.delta)) {
                me.overflow.window.left.cb(pos[0][0] - me.pos.overflowX);
            }
        }
        // check right overflow
        if ((direction === 'right') || (direction === undefined)) {
            // check document boundaries
            if (me.overflow.document.widthVirtual >=
                    me.overflow.document.width) {
                me.overflow.document.widthVirtual = null;
            }
            if ((me.overflow.document.widthVirtual === null) &&
                    ((posImg[0][1] > me.overflow.document.width) ||
                    (pos[0][1] > me.overflow.document.width))) {
                imgDiff = posImg[0][1] - pos[0][1];
                if (imgDiff < 0) imgDiff = 0;
                me.overflow.document.widthVirtual =
                    me.overflow.document.width;
            }
            if ((me.overflow.document.widthVirtual != null) &&
                    (pos[0][1] > (me.overflow.document.widthVirtual -
                        me.overflow.document.right.delta))) {
                me.overflow.document.right.cb(
                        me.overflow.document.widthVirtual - pos[0][1]);
            }
            else if (pos[0][1] > ($(window).scrollLeft() + $(window).width() -
                        me.overflow.window.right.delta)) {
                me.overflow.window.right.cb(pos[0][0] - me.pos.overflowX);
            }
        }
        // check top overflow
        if ((direction === 'top') || (direction === undefined)) {
            if (pos[1][0] < me.overflow.document.top.delta) {
                me.overflow.document.top.cb(-pos[1][0]);
            }
            else if (pos[1][0] <
                    ($(window).scrollTop() + me.overflow.window.top.delta)) {
                me.overflow.window.top.cb(pos[1][0] - me.pos.overflowY);
            }
        }
        // check bottom overflow
        if ((direction === 'bottom') || (direction === undefined)) {
            // check document boundaries
            if (me.overflow.document.heightVirtual >=
                    me.overflow.document.height) {
                me.overflow.document.heightVirtual = null;
            }
            if ((me.overflow.document.heightVirtual === null) &&
                    ((posImg[1][1] > me.overflow.document.height) ||
                    (pos[1][1] > me.overflow.document.height))) {
                imgDiff = posImg[1][1] - pos[1][1];
                if (imgDiff < 0) imgDiff = 0;
                me.overflow.document.heightVirtual =
                    me.overflow.document.height - imgDiff;
            }
            if ((me.overflow.document.heightVirtual != null) &&
                    (pos[1][1] > (me.overflow.document.heightVirtual -
                        me.overflow.document.bottom.delta))) {
                me.overflow.document.bottom.cb(
                        me.overflow.document.heightVirtual - pos[1][1]);
            }
            else if (pos[1][1] > ($(window).scrollTop() + $(window).height() -
                        me.overflow.window.bottom.delta)) {
                me.overflow.window.bottom.cb(pos[1][0] - me.pos.overflowY);
            }
        }
        me.pos.overflowX = pos[0][0];
        me.pos.overflowY = pos[1][0];
    };

    this.crouch = function () {
        if (!me.action.crouch && (me.collider.bottom.isColliding ||
                    (!me.collider.bottom.isColliding && me.enable.crouchJump))) {
            $('#' + me.idImg).addClass('crouch');
            $('#' + me.idImg).css('top',
                    (parseInt($('#' + me.idImg).css('top')) -
                    (me.size.heightStand - me.size.heightCrouch)) + 'px');
            $('#' + me.idCollider).height(me.size.heightCrouch + 'px');
            if (me.enable.crouchJumpHigh && !me.collider.bottom.isColliding)
                me.cssMoveY(me.size.heightCrouch);
            me.updateCollider();
            me.action.crouch = true;
        }
    };

    this.cssMoveX = function (val) {
        me.overflow.document.width = $(document).width();
        me.obj.css("left", "+=" + val + "px");
    };

    this.cssSetX = function (val, force) {
        me.overflow.document.width = $(document).width();
        if (me.pos.absolute || force)
            me.obj.css("left", val + "px");
    };

    this.cssMoveY = function (val) {
        me.overflow.document.height = $(document).height();
        me.obj.css("bottom", "+=" + val + "px");
    };

    this.cssSetY = function (val, force) {
        me.overflow.document.height = $(document).height();
        if (me.pos.absolute || force)
            me.obj.css("bottom", val + "px");
    };

    this.disableMe = function () {
        setEnableMeCb(me.id, false);
    };

    this.enableMe = function () {
        setEnableMeCb(me.id, true);
    };

    this.toggleEnableMe = function () {
        setEnableMeCb(me.id);
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
            me.delta.move.y = Math.round(me.speed.inAir * me.delta.time.actual);
            me.updateCollider("bottom", Math.abs(me.delta.move.y) + 1);
            collidedObjects = me.checkCollisionStatic('bottom');
            if (!me.collider.bottom.isColliding) {
                me.collider.bottom.activeId = 'inAir';
                if (!me.pos.absolute && me.enable.jumpAbsolute) {
                    me.changeToAbsolutePosition();
                }
                me.cssMoveY(me.delta.move.y);
                if (me.speed.inAir < me.speed.fall) {
                    me.speed.inAir = me.speed.fall;
                }
            }
            else {
                me.land(collidedObjects);
            }
            if (!me.enable.alwaysCheckPosition) me.checkPosition('bottom');
        }
        else {
            me.jumpAttr.count.actual += Math.round(
                me.delta.time.actual / me.delta.time.min);
            if (me.jumpAttr.count.actual > (me.jumpAttr.lut.length - 1)) {
                me.jumpAttr.count.actual = me.jumpAttr.lut.length - 1;
                lastElem = true;
            }
            me.delta.move.y = me.jumpAttr.lut[me.jumpAttr.count.actual] -
                me.jumpAttr.lut[me.jumpAttr.count.last];
            me.jumpAttr.height.actual += me.delta.move.y;
            if (lastElem ||
                    (me.jumpAttr.height.actual > me.jumpAttr.height.max)) {
                jumpDiff = me.jumpAttr.height.max - me.jumpAttr.height.actual;
                if (jumpDiff != 0)
                    me.delta.move.y += jumpDiff;
                me.jumpAttr.height.actual = 0;
                me.action.jump = false;
            }
            me.jumpAttr.count.last = me.jumpAttr.count.actual;
            me.updateCollider("top", me.delta.move.y + 1);
            collidedObjects = me.checkCollisionStatic('top');
            if (!me.collider.top.isColliding) {
                me.cssMoveY(me.delta.move.y);
            }
            else {
                me.action.jump = false;
                me.collider.top.isColliding = false;
                me.jumpAttr.height.actual = 0;
                if (collidedObjects.length > 1) {
                    collidedObjects.sort(function(a,b) {
                        return b.solidPosition[1][1] - a.solidPosition[1][1];
                    });
                }
                me.cssSetY($(window).height() -
                        collidedObjects[0].solidPosition[1][1] -
                        me.obj.outerHeight());
            }
            if (!me.enable.alwaysCheckPosition) me.checkPosition('top');
        }
        return !me.collider.bottom.isColliding;
    };

    this.jump = function () {
        if (me.collider.bottom.isColliding && !me.action.jump) {
            me.action.jump = true;
            me.collider.bottom.isColliding = false;
            me.jumpAttr.count.actual = 0;
            me.jumpAttr.count.last = 0;
            me.jumpAttr.height.actual = 0;
            me.jumpAttr.height.start = me.obj.offset().top;
            $('#' + me.idImg).addClass('jump');
            if (!me.pos.absolute && me.enable.jumpAbsolute) {
                me.changeToAbsolutePosition();
            }
        }
    };

    this.land = function (collidedObjects) {
        var newColliderId,
            newJObject;
        me.pos.appearCnt = 0;
        me.speed.inAir = me.delta.dist.down;
        if (collidedObjects.length > 1) {
            collidedObjects.sort(function(a,b) {
                return a.solidPosition[1][0] - b.solidPosition[1][0];
            });
        }
        me.pos.y = me.obj.offset().top + me.obj.height();
        newColliderId = collidedObjects[0].jObject.attr('id');
        if (me.pos.absolute ||
                (me.collider.bottom.activeId !== newColliderId)) {
            me.collider.bottom.activeId = newColliderId;
            newJObject = collidedObjects[0].jObject;
            if (newJObject.hasClass(me.solidColliderMovingClass)) {
                newJObject = newJObject.parent().parent();
            }
            me.changeToRelativePosition(newJObject);
        }
        $('#' + me.idImg).removeClass('jump');
    };

    this.moveLeft = function () {
        var collidedObjects,
            speed = (me.action.run) ? me.speed.leftRun : me.speed.left;
        me.action.moveLeft = true;
        $('#' + me.idImg).removeClass('idle right');
        $('#' + me.idImg).addClass('left');
        me.delta.move.x = Math.floor(speed * me.delta.time.actual);
        me.updateCollider("left", Math.abs(me.delta.move.x) + 1);
        collidedObjects = me.checkCollisionStatic('left');
        if (!me.collider.left.isColliding) {
            me.cssMoveX(me.delta.move.x);
            if (me.collider.bottom.isColliding) {
                me.pos.x =
                    me.obj.offset().left + me.obj.width();
            }
        }
        else {
            if (collidedObjects.length > 1) {
                collidedObjects.sort(function(a,b) {
                    return b.solidPosition[0][1] - a.solidPosition[0][1];
                });
            }
            me.cssMoveX(
                me.positionsGet(
                    collidedObjects[0].jObject.parent().parent())[0][1] -
                me.positionsGet(me.obj)[0][0]
            );
        }
        if (!me.enable.alwaysCheckPosition) me.checkPosition('left');
    };

    this.moveRight = function () {
        var collidedObjects,
            speed = (me.action.run) ? me.speed.rightRun : me.speed.right;
        me.action.moveRight = true;
        $('#' + me.idImg).removeClass('idle left');
        $('#' + me.idImg).addClass('right');
        me.delta.move.x = Math.floor(speed * me.delta.time.actual);
        me.updateCollider("right", me.delta.move.x + 1);
        collidedObjects = me.checkCollisionStatic('right');
        if (!me.collider.right.isColliding) {
            me.cssMoveX(me.delta.move.x);
            if (me.collider.bottom.isColliding) {
                me.pos.x =
                    me.obj.offset().left - me.obj.width();
            }
        }
        else {
            if (collidedObjects.length > 1) {
                collidedObjects.sort(function(a,b) {
                    return a.solidPosition[0][0] - b.solidPosition[0][0];
                });
            }
            me.cssMoveX(
                me.positionsGet(
                    collidedObjects[0].jObject.parent().parent())[0][0] -
                me.positionsGet(me.obj)[0][1]
            );
        }
        if (!me.enable.alwaysCheckPosition) me.checkPosition('right');
    };

    this.overlaps = function (a, b) {
        var pos1 = me.positionsGet(a),
            pos2 = me.positionsGet(b),
            res = [];
        res.pos1 = pos1;
        res.pos2 = pos2;
        res.isColliding = (me.positionsCompare(pos1[0], pos2[0]) &&
                me.positionsCompare(pos1[1], pos2[1]));
        return res;
    };

    this.pickUp = function () {
        var collisionRes = null;
        me.pickUpAttr.jObjects.each(function (idx) {
            collisionRes = me.overlaps(me.obj, $(this));
            if (collisionRes.isColliding) {
                me.pickUpAttr.jObjects.splice(idx, 1);
                $(this).removeClass(me.pickUpAttr.cssClass);
                me.pickUpAttr.counter++;
                $('#' + me.pickUpAttr.idCnt).text(me.pickUpAttr.counter);
                me.singleAnimation($(this), 'success', function () {
                    $(this).remove();
                });
                return false;
            }
        });
    };

    this.positionsCompare = function (p1, p2) {
        var r1, r2;
        if (p1[0] <= p2[0]) {
            r1 = p1;
            r2 = p2;
        }
        else {
            r1 = p2;
            r2 = p1;
        }
        return (r1[1] > r2[0]);
    };

    this.positionsGet = function (elem) {
        var pos, width, height, res;
        pos = elem.offset();
        width = elem.outerWidth();
        height = elem.outerHeight();
        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
    };

    this.run = function () {
        if (!me.action.run) {
            me.action.run = true;
            $('#' + me.idImg).removeClass('walk');
            $('#' + me.idImg).addClass('run');
        }
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
        me.obj
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
        me.collider.left.jObject = $('#' + me.idCollider + '-left');
        me.collider.right.jObject = $('#' + me.idCollider + '-right');
        me.collider.top.jObject = $('#' + me.idCollider + '-top');
        me.collider.bottom.jObject = $('#' + me.idCollider + '-bottom');
        $('#' + me.idCollider).width(me.size.width);
        $('#' + me.idCollider).height(me.size.heightStand);
        me.setInitialPosition(me.pos.initX, me.pos.initY);
        me.updateSolidCollider();
        me.updateCollider();
        me.genJumpLut();
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
        var colliderSize = 0,
            forcedCrouch = false;
        if (me.action.crouch) {
            colliderSize = $('#' + me.idCollider + '-top').height();
            me.updateCollider('top', colliderSize +
                    (me.size.heightStand - me.size.heightCrouch));
            me.checkCollisionStatic('top');
            if (!me.collider.top.isColliding) {
                $('#' + me.idImg).removeClass('crouch');
                $('#' + me.idImg).removeAttr('style');
                if (me.collider.top.isColliding)
                    me.cssMoveY(me.size.heightCrouch - me.size.heightStand);
                $('#' + me.idCollider).height(me.size.heightStand + 'px');
                me.updateCollider();
                me.action.crouch = false;
            }
            else {
                forcedCrouch = true;
            }
            me.updateCollider('top', colliderSize);
            me.checkCollisionStatic('top');
        }
        return forcedCrouch;
    };

    this.stop = function () {
        $('#' + me.idImg).removeClass('walk run');
        me.action.moveLeft = false;
        me.action.moveRight = false;
        me.action.run = false;
    };

    this.teleport = function (x, y) {
        me.vanish(true, x, y);
    };

    this.updateCollider = function (direction, colliderSize) {
        var tolerance = [];
        tolerance.bottom = [];
        tolerance.bottom.left = 0;
        tolerance.bottom.right = 0;

        if ((direction === undefined) || (direction === 'left')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(Math.floor(
                            me.delta.time.actual * me.speed.left));
            if (me.collider.bottom.isColliding) {
                tolerance.bottom.left = me.collider.left.tolerance.bottom;
            }
            $('#' + me.id + '-collider-left')
            .width(colliderSize  + "px")
            .height(($('#' + me.idCollider).height() - tolerance.bottom.left -
                        me.collider.left.tolerance.top) + "px")
            .css({
                "left": "-" + colliderSize + "px",
                "top": me.collider.left.tolerance.top + "px"
            });
        }

        if ((direction === undefined) || (direction === 'right')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(
                    Math.floor(me.delta.time.actual * me.speed.right));
            if (me.collider.bottom.isColliding) {
                tolerance.bottom.right = me.collider.right.tolerance.bottom;
            }
            $('#' + me.id + '-collider-right')
            .width(colliderSize + "px")
            .height(($('#' + me.idCollider).height() - tolerance.bottom.right -
                        me.collider.right.tolerance.top) + "px")
            .css({
                "left": ($('#' + me.idCollider).width()) + "px",
                "top": me.collider.right.tolerance.top + "px"
            });
        }

        if ((direction === undefined) || (direction === 'top')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(Math.floor(
                            me.delta.time.actual * me.speed.jump));
            $('#' + me.id + '-collider-top')
            .height((colliderSize) + "px")
            .width($('#' + me.idCollider).width() + "px")
            .css("top", "-" + colliderSize + "px");
        }

        if ((direction === undefined) || (direction === 'bottom')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(Math.floor(
                            me.delta.time.actual * me.speed.fall));
            $('#' + me.id + '-collider-bottom')
            .height(colliderSize + "px")
            .width($('#' + me.idCollider).width() + "px")
            .css("top", $('#' + me.idCollider).height() + "px");
        }
    };

    this.updateSolidCollider = function () {
        me.solids = $('.' + me.solidColliderClass); // internal
        me.solidsMoving = $('.' + me.solidColliderMovingClass); // internal
    };

    this.vanish = function (teleport, x, y) {
        var collidedObjects;
        if (me.enable.vanish) {
            me.disableMe();
            me.active();
            me.standUp();
            if (!me.pos.absolute)
                me.changeToAbsolutePosition();
            me.singleAnimation($('#' + me.idImg), 'vanish', function () {
                me.obj.hide();
                if(teleport) me.appear(x, y);
            });
        }
    };

    this.walk = function () {
        $('#' + me.idImg).removeClass('run');
        $('#' + me.idImg).addClass('walk');
        me.action.run = false;
    };

    this.setup();
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
    {
        // INITIALISATION
        me.fps = [];
        me.time = [];
        me.tick = [];
    }

    {
        // CONFIGURATION
        me.timerId = null;
        me.fps.max = maxFps;
        me.fps.real = me.fps.max;
        me.time.start = 0;
        me.time.diff = 0;
        me.tick.min = 1000/me.fps.max;
        me.tick.real = 1000/me.fps.real;
        me.tickCnt = 0;
    }

    // METHODS

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

