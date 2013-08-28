kobold
======

this project aims to provide a engine to design a jump and run on a web page

Configuration
-------------

 /* Configure the engine */
Engine.setConfigAttr(attr, val);
    attr:
        "maxFps": 40
            frame cap

        "solidClass": "solid"
            Class name definig which elements are solid, i.e. with which
            elements the character is colliding (lets call them collidables).
            All elements on the web page intended to be a collidable must have
            this css class.

        "solidMovingClass": "solidMoving"
            Class name defining which elements are moving. Only elements using
            the animate function of jquery to change the position (left, right,
            top, bottom) work properly. The animation must be already defined.
            A moving element with this class will collide with the character
            only if the character falls/jummps on top of it.

        "solidColliderClass": "solidCollider"
            Only used internaly, make sure this class is not used anywhere else

        "solidColliderMovingClass": "solidColliderMoving"
            Only used internaly, make sure this class is not used anywhere else

    val:
        value to configure the attribute

/* Add a new character to the engine */
Engine.addMovable(id);
    id: "movable1"
        id of the added character. This id must like any other id be unique

/* Enable skill of the character */
Movable.enableAttr(attr);
    attr:
        "run": true
            Enables the character to walk faster, hence run. The speed can be
            set with Movable.setSpeed("rightRun"/"leftRun", speed).
            The character is always able to walk. The walk speed can be set with
            Movable.setSpeed("right"/"left", speed).

        "jump": true
            Enables character to jump. The character can only jump if he is
            standing on a solid. The jump height can be set with
            Movable.setMaxJumpHeight(maxHeight).

        "jump.movingSolid": false
            !!! This is experimental, please do not turn this feature on !!!
            Enables character to jump on a moving solid, with the same
            properties as with a normal jump.
            If "jump" is turned off, this parameter has no effect.

        "crouch": true
            Enables the character to crouch. The crouch height of the character
            is set with setSize("heightCrouch", height). Keep in mind that this
            depends on the size of the crouch animation.

        "crouchRun": false
            Enables the character to crouch while running. If this is turned
            off, the character stands up as soon the run button is pressed.
            If "crouch" is turned off, this parameter has no effect.
            If "run" is turned off, this parameter has no effect.

        "crouchJump": true
            Enables the character to crouch when jumping. If this is turned
            off, the character stands up as soon the character is in the air.
            If "crouch" is turned off, this parameter has no effect.
            If "jump" is turned off, this parameter has no effect.

        "crouchJumpHigh":true
            Enables the character to jump higher when crouch is pressed while
            jumping. If this is turned off, the character jumps only to the
            maximal height set by Movable.setMaxJumpHeight(maxHeight)
            If "crouch" is turned off, this parameter has no effect.
            If "jump" is turned off, this parameter has no effect.
            If "crouchJump" is turned off, this parameter has no effect.

        "appear": true
            With this enabled, the character cannot leave the visible screen and
            is teleported back near to the last valid position if he drops below
            the screen.

        "pickUp": true
            With this enabled, the character is able to pick up elements marked
            with the css class set by Movable.setPickUpCssClass(cssClass).

/* Disable skill of the character */
Movable.disableAttr(attr);
    attr:
        the same attributes as in Movable.enableAttr(attr)

/* Get the enable status of a skill */
Movable..getEnableStatus(attr);
    attr:
        the same attributes as in Movable.enableAttr(attr)

/* Define keyCodes to use the character abilities by pressing the keys.
 * Keep in mind, that this will prevent the default browser behavior of the
 * keys.
 */ 
Movable.setKeyCode(attr, keyCode);
    attr:
        "jump": 32
            32 (<space>) is the default to make the character jump

        "run": 16
            16 (<shift>) is the default to make the character run

        "left": 37
            37 (<leftArrow>) is the default to make the character move left

        "right": 39
            39 (<rightArrow>) is the default to make the character move right

        "crouch": 17
            17 (<ctrl>) is the default to make the character crouch

        this.setKeyCode = function (attr, keyCode) {
            me.keyCode[attr] = keyCode;
        };
        this.getKeyCode = function (attr) {
            return me.keyCode[attr];
        };

        // PickUps
        me.pickUp.idCnt = 'pickUpCnt';
        me.pickUp.cssClass = 'pickUp';
        me.pickUp.jObjects = $('.' + me.pickUp.cssClass);
        me.pickUp.counter = 0; // internal

        this.configPickUpCounterId = function (id) {
            me.pickUp.idCnt = id;
        };
        this.configPickUpCssClass = function (cssClass) {
            me.pickUp.cssClass = cssClass;
            me.pickUp.jObjects = $('.' + me.pickUp.cssClass);
        };
        this.getPickUpCounter = function () {
            return me.pickUp.counter;
        };

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
                console.log('not allowed to set ' + attr + 'manually!');
            }
            else me.speed[attr] = speed;
        };

        // Position
        me.pos.initX = 30;
        me.pos.initY = 500;
        me.pos.x = 0; // internal
        me.pos.y = 0; // internal
        me.pos.absolute = true; // internal
        me.pos.absoluteJObject = $('#' + me.id).parent(); // internal

        this.setInitialPosition = function (x, y) {
            me.pos.initX = x;
            me.pos.initY = y;
        };

        // Size
        me.size.heightStand = 85;
        me.size.heightCrouch = 40;
        me.size.width = 53;

        this.setSize = function (attr, val) {
            me.size[attr] = val;
        };

        // Collider
        me.collider.left.tolerance = 10;
        me.collider.left.isColliding = false; // internal
        me.collider.left.jObject = null; // internal
        me.collider.right.tolerance = 10;
        me.collider.right.isColliding = false; // internal
        me.collider.right.jObject = null; // internal
        me.collider.top.isColliding = false; // internal
        me.collider.top.jObject = null; // internal
        me.collider.bottom.isColliding = false; // internal
        me.collider.bottom.jObject = null; // internal
        me.collider.bottom.activeId = null; // internal

        this.setColliderTolerance = function (left, right) {
            me.collider.left.tolerance = left;
            me.collider.right.tolerance = (right === undefined) left : right;
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

        // Random Animations
        me.rand.minVal = 4;
        me.rand.maxVal = 10;
        me.rand.count = 0; // internal
        me.rand.nextVal = -1; // internal

        this.setRandomAnimationInterval = function (min, max) {
            me.rand.minVal = min;
            me.rand.maxVal = (max === undefined) ? min : max;
        };

        // Action Flags
        me.action.crouch = false; // internal
        me.action.wink = false; // internal
        me.action.wave = false; // internal
        me.action.jawn = false; // internal
        me.action.jump = false; // internal
        me.action.moveLeft = false; // internal
        me.action.moveRight = false; // internal


        // Temporal Information Needed for the Next Frame
        me.delta.time.min = 1 / config.maxFps;
        me.delta.time.actual = me.delta.time.min;
        me.delta.move.x = 0;
        me.delta.move.y = 0;
        me.delta.dist.up = me.speed.jump / 
            (me.jumpAttr.height.max /
                (me.speed.jump * me.delta.time.actual)
            * 2 + 1);
        me.delta.dist.down = me.speed.fall /
            (me.jumpAttr.height.max /
                (Math.abs(me.speed.fall) * me.delta.time.actual)
            * 2 + 1);

        // Engine configurations
        me.solidColliderClass = config.solidColliderClass
        me.solidColliderMovingClass = config.solidColliderMovingClass
        me.solids = $('.' + me.solidColliderClass);
        me.solidsMoving = $('.' + me.solidColliderMovingClass);
    }
