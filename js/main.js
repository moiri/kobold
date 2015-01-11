function Engine() {
    var me = this;
    {
        // INITIALISATION
        me.config = [];
        me.enable = [];
        me.movable = [];
        me.keyCodes = [];
        me.ticker = null;
        me.keyHandler = null;
        me.colliderCnt = 0;
    }

    {
        // CONFIGURATION
        me.config.maxFps = 40;
        me.config.solidClass = 'solid';
        me.config.solidOnlyTopClass = me.config.solidClass + 'OnlyTop';
        me.config.solidColliderClass = 'solidCollider';
        me.config.solidColliderWrapperClass = me.config.solidColliderClass
            + 'Wrapper';
        me.config.solidColliderOnlyTopClass = me.config.solidColliderClass
            + 'OnlyTop';
        me.config.solidColliderIgnoreClass = me.config.solidColliderClass
            + 'Ignore';

        me.enable.forceDirection = true;
        me.enable.crouchRun = false;
        me.enable.forceRun = false;
        me.enable.crouchJumpHigh = true;
    }

    // PRIVATE METHODS
    // =========================================================================
    // handle key events and trigger abilities of movable
    function movableHandler(movable) {
        var run = false,
            crouch = false,
            left = false,
            right = false,
            jump = false,
            forceDirection = false,
            forceRun = false,
            forceWalk = false,
            forceCrouch = false;

        // set tick-time period. This is needed to calculate speeds
        movable.setDeltaTime(me.ticker.getDeltaTime());

        // evaluate keyboard commands
        run = me.keyHandler.keyCodeMap[movable.getKeyCode('run')];
        crouch = me.keyHandler.keyCodeMap[movable.getKeyCode('crouch')];
        left = me.keyHandler.keyCodeMap[movable.getKeyCode('left')];
        right = me.keyHandler.keyCodeMap[movable.getKeyCode('right')];
        jump = me.keyHandler.keyCodeMap[movable.getKeyCode('jump')];

        // check multi-key enables
        forceDirection = me.enable.forceDirection && left && right;
        forceRun = !me.enable.crouchRun && me.enable.forceRun && crouch
            && run;
        forceWalk = !me.enable.crouchRun && !me.enable.forceRun && crouch
            && run;

        // handle stance states
        switch (movable.getState('stance')) {
            case 'stand':
                if (crouch && !forceRun)
                    movable.doCrouch(me.enable.crouchJumpHigh);
                break;
            case 'crouch':
                if (crouch && !forceRun)
                    movable.doCrouch(me.enable.crouchJumpHigh);
                else if (!crouch || forceRun)
                    forceCrouch = !movable.doStand(forceRun);
                break;
            default:
                throw 'bad stance argument: ' + movable.getState('stance');
        }

        // update forceWalk, if movable cannot stand up
        forceWalk = forceWalk || (forceCrouch && !me.enable.crouchRun);

        // handle locomotion states
        switch (movable.getState('locomotion')) {
            case 'walk':
                if (run && !forceWalk) movable.doRun();
                break;
            case 'run':
                if (!run || forceWalk) movable.doWalk();
                break;
            default:
                throw 'bad locomotion argument: '
                    + movable.getState('locomotion');
        }

        // handle direction states
        switch (movable.getState('direction')) {
            case 'idle':
                if (left) movable.doMove('left');
                else if (right) movable.doMove('right');
                else movable.doIdle(); // needed for random idle animation
                break;
            case 'left':
                if (left && !forceDirection) movable.doMove('left');
                else if (right || forceDirection)
                    movable.doMove('right', forceDirection);
                else if (!left) movable.doIdle();
                break;
            case 'right':
                if (right && !forceDirection) movable.doMove('right');
                else if (left || forceDirection)
                    movable.doMove('left', forceDirection);
                else if (!right) movable.doIdle();
                break;
            default:
                throw 'bad direction argument: '
                    + movable.getState('direction');
        }

        if (jump) movable.doJump();
        movable.updatePosition();
        movable.doPickUp();
    };

    // add keyCode to keyCode array
    function setKeyCode(keyCode) {
        if (!(keyCode in me.keyCodes)) {
            me.keyCodes.push(keyCode);
        }
    };

    // enable movable by id
    function setEnableMovable(id, val) {
        if (val === undefined) val = !me.movable[id].enable;
        me.movable[id].enable = val;
        return val;
    };


    // PRIVILEGED METHODS
    // =========================================================================
    // Ability and Behaviour enabler and disabler
    this.enableAttr = function (attr) {
        if (me.enable[attr] === undefined)
            throw 'attribute ' + attr + ' is undefined';
        me.enable[attr] = true;
    };
    this.disableAttr = function (attr) {
        if (me.enable[attr] === undefined)
            throw 'attribute ' + attr + ' is undefined';
        me.enable[attr] = false;
    };
    this.toggleEnableAttr = function (attr) {
        if (me.enable[attr] === undefined)
            throw 'attribute ' + attr + ' is undefined';
        me.enable[attr] = !me.enable[attr];
    };
    this.getEnableStatusAttr = function (attr) {
        if (me.enable[attr] === undefined)
            throw 'attribute ' + attr + ' is undefined';
        return me.enable[attr];
    };

    // Configuration setter and getter
    this.setConfigAttr = function (attr, val) {
        if (me.config[attr] === undefined)
            throw 'attribute ' + attr + ' is undefined';
        me.config[attr] = val;
    };
    this.getConfigAttr = function (attr) {
        if (me.config[attr] === undefined)
            throw 'attribute ' + attr + ' is undefined';
        return me.config[attr];
    };

    // Collider enabler and disabler
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

    // create new movable
    this.newMovable = function (id, cssClass) {
        var newMovable = [];
        if (id === undefined) id = 'kobold';
        if (me.movable[id] === undefined) {
            if (cssClass === undefined) cssClass = 'koboldImg';
            $('body')
                .append('<div id="' + id + '" class="movable">'
                        + '<div id="' + id + '-imgCont" class="imgCont right">'
                        + '<div id="' + id + '-img" class="' + cssClass
                        + ' idle"></div></div></div>');
            newMovable.enable = false;
            newMovable.obj = new Movable(id, me.config,
                    setEnableMovable, setKeyCode);
            me.movable[id] = newMovable;
        }
        else {
            throw 'Movable with id ' + id + ' already exists';
        }
        return me.movable[id].obj;
    };

    // start the engine
    this.start = function () {
        me.updateCollider();
        me.ticker = new Ticker(me.config.maxFps);
        me.keyHandler = new KeyHandler();
        me.keyHandler.registerKeyEvents(me.keyCodes);
        me.ticker.startTicker(function () {
            for (id in me.movable) {
                if (me.movable[id].enable) {
                    movableHandler(me.movable[id].obj);
                }
            }
        });
        me.ticker.drawFps();
    };

    // update collider of solids (used whenever the webpage changes)
    this.updateCollider = function () {
        var newCollider = false;

        $('.' + me.config.solidClass + ':not(:has(>.'
                    + me.config.solidColliderWrapperClass + '))')
        .each(function () {
            var jObject = $('<div id="' + me.config.solidColliderClass
                + me.colliderCnt + '" class="' + me.config.solidColliderClass
                + '"></div>');
            $('<div class="' + me.config.solidColliderWrapperClass + '"></div>')
            .appendTo(this)
            .append(jObject);
            if ($(this).hasClass(me.config.solidOnlyTopClass)) {
                jObject.addClass(me.config.solidColliderOnlyTopClass);
            }
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
                'margin-right': myParent.offset().left - $(this).offset().left,
                'left': myParent.offset().left - $(this).offset().left,
                'bottom': $(this).offset().top - myParent.offset().top
            });
        });
        if (newCollider) {
            for (id in me.movable) {
                me.movable[id].obj.setSolidCollider();
            }
        }
    };
}

function Movable(id, config, setEnableMeCb, setKeyCodeCb) {
    var me = this;
    {
        // INITIALISATION
        me.state = [];
        me.state.direction = [];
        me.state.locomotion = [];
        me.state.stance = [];
        me.enable = [];
        me.enable.cb = [];
        me.keyCode = [];
        me.pickUpAttr = [];
        me.speed = [];
        me.speed.walk = [];
        me.speed.run = [];
        me.pos = [];
        me.size = [];
        me.collider = [];
        me.collider.left = [];
        me.collider.right = [];
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
        // CONFIGURATION (incl privileged configuartion methods)
        // IDs
        me.id = id;
        me.idImg = me.id + '-img'; // internal
        me.idImgCont = me.id + '-imgCont'; // internal
        me.idCollider = me.id + '-collider'; // internal

        this.getId = function () {
            return me.id;
        };

        // Object
        me.obj = $('#' + id);
        me.objImg = $('#' + me.idImg);
        me.objImgCont = $('#' + me.idImgCont);

        // Enables
        me.enable.run = true;
        me.enable.jump = true;
        me.enable.crouch = true;
        me.enable.appear = true;
        me.enable.vanish = true;
        me.enable.pickUp = true;
        me.enable.cb.enable = function() {};
        me.enable.cb.disable = function () {};

        this.enableAttr = function (attr) {
            me.enable[attr] = true;
        };
        this.disableAttr = function (attr) {
            me.enable[attr] = false;
        };
        this.toggleEnableAttr = function (attr) {
            me.enable[attr] = !me.enable[attr];
        };
        this.getEnableStatusAttr = function (attr) {
            return me.enable[attr];
        };
        this.setEnableCb = function (cb) {
            me.enable.cb.enable = cb;
        };
        this.setDisableCb = function (cb) {
            me.enable.cb.disable = cb;
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
        me.speed.walk.right = 200;
        me.speed.run.right = 300;
        me.speed.walk.left = -200;
        me.speed.run.left = -300;
        me.speed.jump = 1200;
        me.speed.fall = -1200;
        me.speed.inAir = 0; // internal
        me.speed.type = 'walk'; // internal

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
        me.pos.appearCnt = 0;

        this.setInitialPosition = function (x, y) {
            me.pos.initX = x;
            cssSetX(x);
            me.pos.initY = y;
            cssSetY($(window).height() - y);
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
            me.objImg.css('z-index', zIndex);
        };
        this.getZIndex = function () {
            return me.zIndex;
        };

        // Collider
        me.collider.left.isColliding = false; // internal
        me.collider.left.jObject = null; // internal
        me.collider.right.isColliding = false; // internal
        me.collider.right.jObject = null; // internal
        me.collider.top.isColliding = false; // internal
        me.collider.top.jObject = null; // internal
        me.collider.top.tolerance = 3;
        me.collider.bottom.isColliding = false; // internal
        me.collider.bottom.jObject = null; // internal
        me.collider.bottom.tolerance = 10;

        this.setColliderToleranceTop = function (tol) {
            me.collider.top.tolerance = tol;
        };
        this.getColliderToleranceTop = function () {
            return me.collider.top.tolerance;
        };
        this.setColliderToleranceBottom = function (tol) {
            me.collider.bottom.tolerance = tol;
        };
        this.getColliderToleranceBottom = function () {
            return me.collider.bottom.tolerance;
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

        // State
        me.state.direction.type = 'idle'; // internal
        me.state.locomotion.type = 'walk'; // internal
        me.state.stance.type = 'stand'; // internal

        this.getState = function (attr) {
            return me.state[attr].type;
        };

        this.setState = function (attr, val) {
            me.state[attr].type = val;
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
        me.action.inAir = false; // internal

        // Temporal Information Needed for the Next Frame
        me.delta.time.min = 1 / config.maxFps; // internal
        me.delta.time.actual = me.delta.time.min; // internal
        me.delta.dist.up = me.speed.jump
            / (me.jumpAttr.height.max
                    / (me.speed.jump * me.delta.time.actual)
                    * 2 + 1); // internal
        me.delta.dist.down = me.speed.fall
            / (me.jumpAttr.height.max
                    / (Math.abs(me.speed.fall) * me.delta.time.actual)
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
        me.overflow.document.left.cb = function () {};
        me.overflow.document.right.delta = 0;
        me.overflow.document.right.cb = function () {};
        me.overflow.document.top.delta = 0;
        me.overflow.document.top.cb = function () {};
        me.overflow.document.bottom.delta = 0;
        me.overflow.document.bottom.cb = function () {
            me.doAppear();
        };
        me.overflow.window.left.delta = 500;
        me.overflow.window.left.cb = function (deltaMove) {
            if ((deltaMove != 0) && ($(document).scrollLeft() > 0)) {
                $(document).scrollLeft(
                        $(document).scrollLeft() + deltaMove);
            }
        };
        me.overflow.window.right.delta = 500;
        me.overflow.window.right.cb = function (deltaMove) {
            if ((deltaMove != 0)
                    && ($(document).width() > ($(document).scrollLeft()
                            + $(window).width()))) {
                $(document).scrollLeft(
                        $(document).scrollLeft() + deltaMove);
            }
        };
        me.overflow.window.top.delta = 100;
        me.overflow.window.top.cb = function (deltaMove) {
            if ((deltaMove != 0) && ($(document).scrollTop() > 0)) {
                $(document).scrollTop(
                        $(document).scrollTop() + deltaMove);
            }
        };
        me.overflow.window.bottom.delta = 100;
        me.overflow.window.bottom.cb = function (deltaMove) {
            if ((deltaMove != 0)
                    && ($(document).height() > ($(document).scrollTop()
                            + $(window).height()))) {
                $(document).scrollTop(
                        $(document).scrollTop() + deltaMove);
            }
        };
        // not yet working
        me.overflow.scrollEventCb = function () {
            false;
        };
        // not yet working
        me.overflow.scrollAnimationCb = function (deltaMoveX, deltaMoveY) {
            $('html').animate({
                scrollTop:$('html').scrollTop() + deltaMoveX,
                scrollLeft:$('html').scrollLeft() + deltaMoveY
            }, '400', 'swing', function () {
                me.enable.animate = false;
            });
        }

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
        // not yet working
        this.setScrollEventCb = function (cb) {
            me.overflow.scrollEventCb = cb;
        };
        // not yet working
        this.getScrollEventCb = function () {
            return me.overflow.scrollEventCb.cb;
        };
    }

    // PRIVATE METHODS
    // =========================================================================
    // check for colliding object
    function checkCollision(direction) {
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
                    overlaps(me.collider[direction].jObject, $(this));
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

    // check wether the character leaves window or document
    function checkPosition(direction, dist) {
        var pos = positionsGet(me.obj),
            posImg = positionsGet(me.objImg),
            overflow = [];

        // check left overflow
        if ((dist != 0) && (direction === 'left')) {
            overflow.doc = pos[0][0] + dist - me.overflow.document.left.delta;
            overflow.win = pos[0][0] + dist - ($(window).scrollLeft()
                        + me.overflow.window.left.delta);
            if (overflow.doc < 0) {
                // will cross left document border margin
                dist = dist - overflow.doc;
                me.overflow.document.left.cb();
            }
            else if (overflow.win < 0) {
                // will cross left window border margin
                me.overflow.window.left.cb(overflow.win);
            }
        }
        // check right overflow
        if ((dist != 0) && (direction === 'right')) {
            overflow.doc = pos[0][1] + dist
                - (me.overflow.document.width - me.overflow.document.right.delta);
            overflow.win = pos[0][1] + dist - ($(window).scrollLeft()
                + $(window).width() - me.overflow.window.right.delta);
            if (overflow.doc > 0) {
                // will cross right document border margin
                dist = dist - overflow.doc;
                me.overflow.document.right.cb();
            }
            else if (overflow.win > 0) {
                // will cross right window border margin
                me.overflow.window.right.cb(overflow.win);
            }
        }
        // check top overflow
        if ((dist != 0) && (direction === 'top')) {
            overflow.doc = pos[1][0] - dist - me.overflow.document.top.delta;
            overflow.win = pos[1][0] - dist - ($(window).scrollTop()
                        + me.overflow.window.top.delta);
            if (overflow.doc < 0) {
                // will cross top document border margin
                me.overflow.document.top.cb();
            }
            else if (overflow.win < 0) {
                // will cross top window border margin
                me.overflow.window.top.cb(overflow.win);
            }
        }
        // check bottom overflow
        if ((dist != 0) && (direction === 'bottom')) {
            overflow.doc = pos[1][1] - dist
                - (me.overflow.document.height - me.overflow.document.bottom.delta);
            overflow.win = pos[1][1] - dist - ($(window).scrollTop()
                + $(window).height() - me.overflow.window.bottom.delta);
            if (overflow.doc > 0) {
                // will cross right document border margin
                dist = 0;
                me.overflow.document.bottom.cb();
            }
            else if (overflow.win > 0) {
                // will cross right window border margin
                me.overflow.window.bottom.cb(overflow.win);
            }
        }
        // handle trimming of image
        if ((dist != 0) && ((direction === 'left') || (direction === 'right'))) {
            overflow.img = posImg[0][1] + dist
                - (me.overflow.document.width - me.overflow.document.right.delta);
            // when turning on the spot, we dont care about the future position
            if (direction === 'left') overflow.img -= dist;
            if (overflow.img > 0) {
                // image container will cross right document border
                // resize image container by overflow distance
                me.objImgCont.width(me.objImg.width() - overflow.img);
            }
            else {
                // reset to default when nothing is overlapping
                me.objImgCont.width(me.objImg.width());
            }
        }
        return dist;
    };

    // collision occurred -> handle it
    function collision(direction, collidedObjects) {
        var newColliderId,
            newJObject;
        if (direction === 'top') {
            me.action.jump = false;
            me.collider.top.isColliding = false;
            me.jumpAttr.height.actual = 0;
        }
        else if (direction === 'bottom') {
            me.pos.appearCnt = 0;
            me.speed.inAir = me.delta.dist.down;
            // update last known position where movable was on ground
            me.pos.y = me.obj.offset().top + me.obj.height();
            me.objImg.removeClass('jump');
            // activate tolerance of collider
            updateColliderTolerance(me.collider.bottom.tolerance,
                    me.collider.top.tolerance);
            me.action.inAir = false;
        }

        // if multiple objects collide take the one with the biggest overlap
        if (collidedObjects.length > 1) {
            collidedObjects.sort(function(a,b) {
                if (direction === 'top')
                    return b.solidPosition[1][1] - a.solidPosition[1][1];
                else if (direction === 'bottom')
                    return a.solidPosition[1][0] - b.solidPosition[1][0];
                else if (direction === 'left')
                    return b.solidPosition[0][1] - a.solidPosition[0][1];
                else if (direction === 'right')
                    return a.solidPosition[0][0] - b.solidPosition[0][0];
            });
        }
        // update position to the edge of the object with the biggest overlap
        if (direction === 'top')
            cssSetY($(window).height()
                    - collidedObjects[0].solidPosition[1][1]
                    - me.obj.outerHeight());
        else if (direction === 'bottom')
            cssSetY($(window).height()
                    - collidedObjects[0].solidPosition[1][0]);
        else if (direction === 'left')
            cssSetX(collidedObjects[0].solidPosition[0][1]);
        else if (direction === 'right')
            cssSetX(collidedObjects[0].solidPosition[0][0]
                    - me.obj.outerWidth());
    };

    // update css position values
    function cssMoveX(val) {
        me.overflow.document.width = $(document).width();
        me.obj.css('left', '+=' + val + 'px');
    };
    function cssMoveY(val) {
        me.overflow.document.height = $(document).height();
        me.obj.css('bottom', '+=' + val + 'px');
    };
    function cssSetX(val) {
        me.overflow.document.width = $(document).width();
        me.obj.css('left', val + 'px');
    };
    function cssSetY(val) {
        me.overflow.document.height = $(document).height();
        me.obj.css('bottom', val + 'px');
    };

    // generate the LUT used for the jump function
    function genJumpLut() {
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

    // calculate next moving distance
    function getMovingDistance(direction) {
        var lastElem = false,
            jumpDiff = 0,
            dist = 0;
        if (direction === 'top') {
            // calculate the height of the next rising step using a LUT
            me.jumpAttr.count.actual += Math.round(
                me.delta.time.actual / me.delta.time.min);
            if (me.jumpAttr.count.actual > (me.jumpAttr.lut.length - 1)) {
                me.jumpAttr.count.actual = me.jumpAttr.lut.length - 1;
                lastElem = true;
            }
            dist = me.jumpAttr.lut[me.jumpAttr.count.actual]
                - me.jumpAttr.lut[me.jumpAttr.count.last];
            me.jumpAttr.height.actual += dist;
            // on last rising step adjust to max height in order to keep jump
            // height constant
            if (lastElem
                    || (me.jumpAttr.height.actual > me.jumpAttr.height.max)) {
                jumpDiff = me.jumpAttr.height.max - me.jumpAttr.height.actual;
                if (jumpDiff != 0)
                    dist += jumpDiff;
                me.jumpAttr.height.actual = 0;
                me.action.jump = false;
            }
            me.jumpAttr.count.last = me.jumpAttr.count.actual;
        }
        else if ((direction === 'bottom') && me.action.inAir) {
            // calculate next falling distance
            me.speed.inAir += me.delta.dist.down
                * me.delta.time.actual / me.delta.time.min;
            dist = Math.round(me.speed.inAir * me.delta.time.actual);
            // cap the speed at the defined falling speed
            if (me.speed.inAir < me.speed.fall) {
                me.speed.inAir = me.speed.fall;
            }
        }
        else if (direction === 'left') {
            dist = Math.floor(me.speed[me.state.locomotion.type].left
                    * me.delta.time.actual);
        }
        else if (direction === 'right') {
            dist = Math.floor(me.speed[me.state.locomotion.type].right
                    * me.delta.time.actual);
        }
        return dist;
    };

    // used to check whether two divs overlap
    function overlaps(a, b) {
        var pos1 = positionsGet(a),
            pos2 = positionsGet(b),
            res = [];
        res.pos1 = pos1;
        res.pos2 = pos2;
        res.isColliding = (positionsCompare(pos1[0], pos2[0])
                && positionsCompare(pos1[1], pos2[1]));
        return res;
    };

    // compares positions, used in overlap method
    function positionsCompare(p1, p2) {
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

    // get position of jquery element in a form used in overlap method
    function positionsGet(elem) {
        var pos, width, height, res;
        pos = elem.offset();
        width = elem.outerWidth();
        height = elem.outerHeight();
        return [ [ pos.left, pos.left + width ],
            [ pos.top, pos.top + height ] ];
    };

    // set a new random value, used for random animation
    function setNextRandVal() {
        me.rand.count = 0;
        me.rand.nextVal = Math.floor(
            (1 / me.delta.time.actual)
            * ((Math.random() * me.rand.maxVal) + me.rand.minVal)
        );
    };

    // used to setup the character, somewhat a constructor
    function setup() {
        me.obj
            .append('<div id="' + me.idCollider + '" class="colliderContainer">'
                    + '<div id="' + me.idCollider
                    + '-left" class="collider colliderLeft"></div>'
                    + '<div id="' + me.idCollider
                    + '-right" class="collider colliderRight"></div>'
                    + '<div id="' + me.idCollider
                    + '-top" class="collider colliderTop"></div>'
                    + '<div id="' + me.idCollider
                    + '-bottom" class="collider colliderBottom"></div>'
                    + '</div>');
        me.collider.left.jObject = $('#' + me.idCollider + '-left');
        me.collider.right.jObject = $('#' + me.idCollider + '-right');
        me.collider.top.jObject = $('#' + me.idCollider + '-top');
        me.collider.bottom.jObject = $('#' + me.idCollider + '-bottom');
        $('#' + me.idCollider).width(me.size.width);
        $('#' + me.idCollider).height(me.size.heightStand);
        me.setInitialPosition(me.pos.initX, me.pos.initY);
        me.setSolidCollider();
        updateCollider();
        genJumpLut();
        me.objImg.addClass('walk');
    };

    // used to produce an animation that triggers only once
    function singleAnimation(obj, cssClass, cb) {
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
            animationIterationCount =
                obj.css('-webkit-animation-iteration-count');
        animationDuration = parseFloat(animationDuration);
        animationIterationCount = parseInt(animationIterationCount);
        setTimeout(function () {
            obj.removeClass(cssClass);
            cb();
        }, animationDuration * animationIterationCount * 1000);
    };

    // update the colliders of the character according to its speed
    function updateCollider(direction, colliderSize) {
        if ((direction === undefined) || (direction === 'left')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(Math.floor(
                            me.delta.time.actual * me.speed.walk.left));
            $('#' + me.id + '-collider-left')
                .width(colliderSize  + 'px')
                .css({'left': '-' + colliderSize + 'px'});
        }

        if ((direction === undefined) || (direction === 'right')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(Math.floor(
                            me.delta.time.actual * me.speed.walk.right));
            $('#' + me.id + '-collider-right')
                .width(colliderSize + 'px')
                .css({'left': ($('#' + me.idCollider).width()) + 'px'});
        }

        if ((direction === undefined) || (direction === 'top')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(Math.floor(
                            me.delta.time.actual * me.speed.jump));
            $('#' + me.id + '-collider-top')
            .height((colliderSize) + 'px')
            .width($('#' + me.idCollider).width() + 'px')
            .css('top', '-' + colliderSize + 'px');
        }

        if ((direction === undefined) || (direction === 'bottom')) {
            if (colliderSize === undefined)
                colliderSize = Math.abs(Math.floor(
                            me.delta.time.actual * me.speed.fall));
            $('#' + me.id + '-collider-bottom')
            .height(colliderSize + 'px')
            .width($('#' + me.idCollider).width() + 'px')
            .css('top', $('#' + me.idCollider).height() + 'px');
        }
    };

    function updateColliderTolerance(tolBot, tolTop) {
        $('#' + me.id + '-collider-left')
            .height(($('#' + me.idCollider).height() - tolBot - tolTop) + 'px')
            .css({'top': tolTop + 'px'});
        $('#' + me.id + '-collider-right')
            .height(($('#' + me.idCollider).height() - tolBot - tolTop) + 'px')
            .css({'top': tolTop + 'px'});
    };

    // PRIVILEGED METHODS
    // =========================================================================
    // Character enabler and disabler
    this.disableMe = function () {
        setEnableMeCb(me.id, false);
        me.enable.cb.disable();
    };
    this.enableMe = function () {
        setEnableMeCb(me.id, true);
        me.enable.cb.enable();
    };
    this.toggleEnableMe = function () {
        if (setEnableMeCb(me.id)) me.enable.cb.enable();
        else me.enable.cb.disable();
    };

    // Character Abilities
    this.doAppear = function (x, y, cb) {
        var collidedObjects, res = false;
        // check arguments
        if (x === undefined) x = me.pos.x;
        else if (typeof x != 'number') throw 'bad argument type in x';
        if (y === undefined) y = me.pos.y;
        else if (typeof y != 'number') throw 'bad argument type in y';

        if (me.enable.appear) {
            res = true;
            me.obj.show();
            me.disableMe();
            if (me.pos.appearCnt > 0) {
                x = me.pos.initX;
                y = me.pos.initY;
            }
            me.pos.appearCnt++;
            me.doIdle();
            me.doStand();
            me.obj.css({'bottom': $(window).height() - y, 'left': x});
            me.overflow.document.heightVirtual = null;
            singleAnimation(me.objImg, 'appear', function () {
                me.enableMe();
                if (cb != undefined) cb();
            });
        }
        return res;
    };
    this.doCrouch = function (crouchJumpHigh) {
        var res = true;
        // check arguments
        if (crouchJumpHigh === undefined) crouchJumpHigh = true;
        else if (typeof crouchJumpHigh != 'boolean')
            throw 'bad argument type in crouchJumpHigh';

        if (!me.enable.crouch) res = false;
        else if (me.state.stance.type != 'crouch') {
            me.state.stance.type = 'crouch';
            me.objImg.addClass('crouch');
            me.objImg
                .css('top', (parseInt(me.objImg.css('top'))
                            - (me.size.heightStand - me.size.heightCrouch))
                        + 'px');
            $('#' + me.idCollider).height(me.size.heightCrouch + 'px');
            if (crouchJumpHigh && !me.collider.bottom.isColliding)
                cssMoveY(me.size.heightCrouch);
            updateCollider();
            updateColliderTolerance(me.collider.bottom.tolerance,
                    me.collider.top.tolerance);
        }
        return res;
    };
    this.doIdle = function () {
        if (me.rand.nextVal < 0)
            setNextRandVal();
        me.objImg.addClass('idle');
        me.state.direction.type = 'idle';
        if (me.rand.count === me.rand.nextVal) {
            singleAnimation(me.objImg, 'rand', function () {
                setNextRandVal();
            });
        }
        me.rand.count++;
    };
    this.doJump = function () {
        var res = false;
        if (me.collider.bottom.isColliding && !me.action.jump
                && me.enable.jump) {
            res = true;
            me.action.jump = true;
            me.collider.bottom.isColliding = false;
            me.jumpAttr.count.actual = 0;
            me.jumpAttr.count.last = 0;
            me.jumpAttr.height.actual = 0;
            me.jumpAttr.height.start = me.obj.offset().top;
            me.objImg.addClass('jump');
            // remove collider tolerance when jumping
            updateColliderTolerance(0, 0);
        }
        return res;
    };
    this.doMove = function (direction, attr) {
        var forced, dist;
        // check argument
        if (typeof attr === 'boolean') forced = attr;
        else if (typeof attr === 'number') dist = Math.abs(attr);
        else if (typeof attr === 'undefined') ; // do nothing
        else throw "bad argument type in attr";
        if ((direction === 'left') || (direction === 'right')) {
            // check if direction must be forced
            if (forced === undefined) forced = false;
            me.state.direction.forced = forced;
            if (!forced) me.state.direction.type = direction;
            // change annimation
            me.objImg.removeClass('idle');
            me.objImgCont.removeClass('right left');
            me.objImgCont.addClass(direction);
            if ((direction === 'left') && (dist != undefined)) dist = -dist;
        }
        else if ((direction != 'top') && (direction != 'bottom'))
            throw 'unknown direction "' + direction + '"';
        return me.updatePosition(direction, dist);
    };
    this.doPickUp = function () {
        // while this is an ability, it should not be invoked manually because
        // it is run periodically. Hence this method is not documented in the
        // README
        var collisionRes = null;
        if (me.enable.pickUp) {
            me.pickUpAttr.jObjects.each(function (idx) {
                collisionRes = overlaps(me.obj, $(this));
                if (collisionRes.isColliding) {
                    me.pickUpAttr.jObjects.splice(idx, 1);
                    $(this).removeClass(me.pickUpAttr.cssClass);
                    me.pickUpAttr.counter++;
                    $('#' + me.pickUpAttr.idCnt).text(me.pickUpAttr.counter);
                    singleAnimation($(this), 'success', function () {
                        $(this).remove();
                    });
                }
            });
        }
    };
    this.doRun = function () {
        var res = true;
        if (!me.enable.run) res = false;
        else if (me.state.locomotion != 'run') {
            me.state.locomotion.type = 'run';
            me.objImg.removeClass('walk');
            me.objImg.addClass('run');
        }
        return res;
    };
    this.doStand = function () {
        var colliderSize = 0;
        if (me.state.stance.type === 'crouch') {
            colliderSize = $('#' + me.idCollider + '-top').height();
            updateCollider('top', colliderSize
                    + (me.size.heightStand - me.size.heightCrouch));
            checkCollision('top');
            if (me.collider.top.isColliding) {
                // cannot stand up (object on top)
                updateCollider('top', colliderSize);
                return false;
            }
            me.state.stance.type = 'stand';
            me.objImg.removeClass('crouch');
            me.objImg.removeAttr('style');
            $('#' + me.idCollider).height(me.size.heightStand + 'px');
            updateCollider();
            updateColliderTolerance(me.collider.bottom.tolerance,
                    me.collider.top.tolerance);
        }
        return true;
    };
    this.doTeleport = function (x, y, cb) {
        var res = false;
        // check arguments (default values are handeled in doAppear)
        if ((x != undefined) && (typeof x != 'number'))
            throw 'bad argument type in x';
        if ((y != undefined) && (typeof y != 'number'))
            throw 'bad argument type in y';
        if ((me.enable.vanish) && (me.enable.appear)) {
            res = true;
            me.doVanish(function () {
                me.doAppear(x, y, cb);
            });
        }
        return res;
    };
    this.doVanish = function (cb) {
        var collidedObjects, res = false;
        if (me.enable.vanish) {
            res = true;
            me.disableMe();
            // prevent idle animation while vanishing
            me.objImg.removeClass('rand');
            me.rand.count = 0;
            me.doStand();
            singleAnimation(me.objImg, 'vanish', function () {
                me.obj.hide();
                if (cb != undefined) cb();
            });
        }
        return res;
    };
    this.doWalk = function () {
        if (me.state.locomotion != 'walk') {
            me.state.locomotion.type = 'walk';
            me.objImg.removeClass('run');
            me.objImg.addClass('walk');
        }
        return true;
    };

    // setter method for tick time
    this.setDeltaTime = function (val) {
        me.delta.time.actual = val;
    };

    // setter method to update collider of solids
    this.setSolidCollider = function () {
        me.solids = $('.' + me.solidColliderClass); // internal
    };

    // calc new position, update collider, check collision, update position
    this.updatePosition = function (direction, dist) {
        var collidedObjects, sign, res;
        if (direction === undefined) {
            if (me.action.jump) direction = 'top'; // rising
            else direction = 'bottom'; // falling
        }
        if (dist === undefined) dist = getMovingDistance(direction);
        if (me.collider[direction].last != dist) {
            // moving dist changed
            updateCollider(direction, Math.abs(dist) + 1);
            me.collider[direction].last = dist;
        }
        collidedObjects = checkCollision(direction);
        if (!me.collider[direction].isColliding) {
            // no collision, check and update position
            res = true;
            dist = checkPosition(direction, dist);
            if ((direction === 'left') || (direction === 'right')) {
                cssMoveX(dist);
                if (me.collider.bottom.isColliding) {
                    // update last known position where movable was on ground
                    sign = (dist < 0) ? -1 : 1; // Math.sign() unsupported in IE
                    me.pos.x = me.obj.offset().left - sign * me.obj.width();
                }
            }
            else {
                me.action.inAir = true;
                cssMoveY(dist);
            }
        }
        else {
            // collision, allign with object
            res = false;
            collision(direction, collidedObjects);
        }
        return res;
    };

    setup();
}

function KeyHandler() {
    var me = this;
    me.keyCodeMap = [];

    // PRIVATE METHODS
    // =========================================================================
    function clearKeyCodeMap() {
        var val;
        for (val in me.keyCodeMap)
            me.keyCodeMap[val] = false;
    };

    function setKey(keyCode, val) {
        me.keyCodeMap[keyCode] = val;
    };

    // PRIVILEGED METHODS
    // =========================================================================
    this.registerKeyEvents = function (keyCodes) {
        $(document).keydown( function (event) {
            var idx;
            for (idx in keyCodes)
                if (event.keyCode === keyCodes[idx])
                    event.preventDefault();
            setKey(event.keyCode, true);
        });
        $(document).keyup( function (event) {
            setKey(event.keyCode, false);
        });
        $(document).blur( function (event) {
            clearKeyCodeMap();
        });
    };
}

function Ticker(maxFps) {
    var me = this;
    {
        // INITIALISATION
        me.fps = [];
        me.time = [];
        me.tick = [];
        me.timerId = null;
        me.fps.max = maxFps;
        me.fps.real = me.fps.max;
        me.time.start = 0;
        me.time.diff = 0;
        me.tick.min = 1000/me.fps.max;
        me.tick.real = 1000/me.fps.real;
        me.tickCnt = 0;
    }

    // PRIVATE METHODS
    // =========================================================================
    function handleTicker(cb) {
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

    // PRIVILEGED METHODS
    // =========================================================================
    this.drawFps = function () {
        me.fps.real = Math.floor(1000 / me.tick.real);
        $('#fps').text(me.fps.real + ' / ' + me.fps.max );
    };

    this.getDeltaTime = function () {
        return (me.tick.real / 1000);
    };

    this.startTicker = function (cb) {
        handleTicker(cb);
        me.timerId = setInterval(function () {
            handleTicker(cb);
        }, me.tick.real);
    };

    this.stopTicker = function () {
        me.timerId = null;
    };
}

