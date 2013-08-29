Kobold
======

This project aims to provide an engine to design a jump and run on a web page.
The key point is, that the character of the jump and run will be able to
interact with standard elements on the web page.

License
-------

The origin of this project is an idea of the Swiss game designer company
[Koboldgames](http://www.koboldgames.ch/home/). The animations and images were
provided by these nice people and are part of their corporate design.

Fast Setup
----------

1.  add main.js, main.css and jQuery (for development jQuery 1.7.1 was used) to
    your page.

2.  add the css class "solid" to the page elements you want the character to
    collide with.

3.  make sure a js file contains the following lines

    ```javascript
    $(document).ready(function () {
        var engine, kobold;
        engine = new Engine();
        kobold = engine.addMovable();
        engine.start();
        kobold.enableMe();
    });
    ```

Configuration
-------------

Configure the engine

    Engine.setConfigAttr(attr, val);
        attr:
            "maxFps": 40
                frame cap

            "solidClass": "solid"
                Class name definig which elements are solid, i.e. with which
                elements the character is colliding (lets call them
                collidables). All elements on the web page intended to be a
                collidable must have this css class.
                The character is positioned realtive to the element on which he
                is standing (colliding with the bottom collider). If this object
                is moved, the character will move with it and still collide with
                all the other solids. It is recommenden to disable the character
                during the movements to prevent collisions. Anlso nNote, that
                these elements should not move while the character is able to
                jump on them. For this purpose the "solidMovingClass" is
                needed.

            "solidMovingClass": "solidMoving"
                Class name defining which elements are moving. Only elements
                using the animate function of jquery to change the position
                (left, right, top, bottom) work properly. The animation must be
                already defined.
                A moving element with this class will collide with the character
                only if the character falls/jumps on top of it.
                The character is positioned realative to the element on which he
                is standing and will move with it. The character will not
                collide with other solid but may collide with other moving
                solids. Note that moving solids should be placed in such a way
                that they can not interfere with each other.
                The "solidClass" is ignored if an element has the
                "solidMovingClass".

            "solidColliderClass": "solidCollider"
                Only used internaly, make sure this class is not used anywhere
                else.

            "solidColliderMovingClass": "solidColliderMoving"
                Only used internaly, make sure this class is not used anywhere
                else.

        val:
            value to configure the attribute

Create and add a new character to the engine. Example animations are provided.
To add different animations for other characters, create new css definitions
similar to the ones provided in main.css.

    Engine.addMovable(id, cssClass);
        id: "kobold"
            id of the added character. This id must like any other id be unique.
            if no id is provided, the default value is set.

        cssClass: "koboldImg"
            name of the css class definig the size and animations of the
            character. One set for the default names is provided. If no cssClass
            is provided, the default value is set.

        return
            Movable object of the added charcter

Enable or Disable character by id

    Engine.setEnableMovable(id, val);
        id:
            id of the character to enable or diable

        val:
            true to enable character, false to disable character. If val is
            not defined, the enable status of the character is toggled.

Enable character

    Movable.enableMe();

Disable character

    Movable.disableMe();

Toggle enable status of the character

    Movable.toggleEnableMe();

Enable ability of the character

    Movable.enableAttr(attr);
        attr:
            "run": true
                Enables the character to walk faster, hence run. The speed can
                be set with Movable.setSpeed("rightRun"/"leftRun", speed).
                The character is always able to walk. The walk speed can be set
                with Movable.setSpeed("right"/"left", speed).

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
                Enables the character to crouch. The crouch height of the
                character is set with setSize("heightCrouch", height). Keep in
                mind that this depends on the size of the crouch animation.

            "crouchRun": false
                Enables the character to crouch while running. If this is turned
                off, the character stands up as soon the run button is pressed.
                If "crouch" is turned off, this parameter has no effect.
                If "run" is turned off, this parameter has no effect.

            "crouchJump": true
                Enables the character to crouch when jumping. If this is turned
                off, the character stands up as soon the character is in the
                air.
                If "crouch" is turned off, this parameter has no effect.
                If "jump" is turned off, this parameter has no effect.

            "crouchJumpHigh":true
                Enables the character to jump higher when crouch is pressed
                while jumping. If this is turned off, the character jumps Only
                to the maximal height set by Movable.setMaxJumpHeight(maxHeight)
                This works also if "crouchJump" is turned off.
                If "crouch" is turned off, this parameter has no effect.
                If "jump" is turned off, this parameter has no effect.

            "appear": true
                With this enabled, the character cannot leave the visible screen
                and is teleported back near to the last valid position if he
                drops below the screen.

            "pickUp": true
                With this enabled, the character is able to pick up elements
                marked with the css class set by
                Movable.setPickUpCssClass(cssClass).

Disable ability of the character

    Movable.disableAttr(attr);
        attr:
            the same attributes as in Movable.enableAttr(attr).

Toggle ability enable status of the character

    Movable.toggleEnableAttr(attr);
        attr:
            the same attributes as in Movable.enableAttr(attr).

Get the enable status of an ability

    Movable.getEnableStatus(attr);
        attr:
            the same attributes as in Movable.enableAttr(attr).

        return
            true if enabled, false if disabled

Define keyCodes to use the character abilities by pressing the keys.
Keep in mind, that this will prevent the default browser behavior of the
keys.
 
    Movable.setKeyCode(attr, keyCode);
        attr:
            "jump": 32
                32 (<space>) is default to make the character jump.

            "run": 16
                16 (<shift>) is default to make the character run.

            "left": 37
                37 (<leftArrow>) is default to make the character move left.

            "right": 39
                39 (<rightArrow>) is default to make the character move right.

            "crouch": 17
                17 (<ctrl>) is default to make the character crouch.

Get the key code of the corresponding ability

    Movable.getKeyCode(attr);
        attr:
            the same attributes as in Movable.setKeyCode(attr).

        return
            keyCode

Id of element where the pick up count should appear. The corresponding
element must exist on the webpage.
If "pickUp" is turned off, this parameter has no effect.
    
    Movable.setPickUpCounterId(id);
        id: "pickUpCnt"

Class name definig which elements the character can pick up by moving over them.
All elements on the web page intended to be objects that can be picked up must
have this css class.
If "pickUp" is turned off, this parameter has no effect.
    
    Movable.setPickUpCssClass(cssClass);
        cssClass: "pickUp"

Get the actual pick up counter value

    Movable.getPickUpCounter();
        return
            value of the pick up counter

Define the speed of the character. Please pay attention to the minus sign.

    Movable.setSpeed(attr, speed);
        attr:
            "right": 200
                walking speed to the right

            "rightRun": 300
                running speed to the right

            "left": -200
                walking speed to the left

            "leftRun": -300
                running speed to the left

            "jump": 1200
                initial jumping speed

            "fall": -1200
                maximal falling speed

        speed:
            speed value

Define the absolute screen position (in pixel) where the character will start.
This coordinates will also be used if the character needs to be reset.

    Movable.setInitialPosition(x, y);
        x: 30
            Distance in pixel from the left screen frame to the left border of
            the character.

        y: 500
            Distance in pixel from the bottom screen frame to the bottom border
            of the character.

Define the size (in pixel) of the character in either standing or crouching
position. Keep in mind that these values depend directly on the animation of the
movable. It may be unwise to change this after the inital configuration.

    Movable.setSize(attr, val);
        attr:
            "heightStand": 85
                Height (in pixel) of the character in standing position.

            "heightCrouch": 40
                Height (in pixel) of the character in crouching position.

            "width": 53
                Width (in pixel) of the character.

Set these parameters allow the character to move over objects of small heights,
without colliding (move up stairs without jumping). The value is the maxium
height (in pixel) of an objet in order to be ignored by right and left
collision. This can be turned off by setting both values to zero.

    Movable.setColliderTolerance(left, right);
        left: 10
            Tolarance (in pixel) for the left collider.

        right: 10
            Tolarance (in pixel) for the right collider. If this value is not
            set, both colliders are set to the left value.

Define the maximal height (in pixel) the character can jump. One exception to
surpass this height is by enabling "crouchJumpHeight". Please check the comments
there to get more information.
If "jump" is turned off, this parameter has no effect.

    Movable.setMaxJumpHeight(maxHeight);
        maxHeight: 160
            Maximal jump height (in pixel) of the character.

Define the intervall of random idle animations (in seconds). After completion of
an animation, The next random animation will start in min seconds at the
erliest and in max seconds at the latest.

    Movable.setRandomAnimationInterval(min, max);
        min: 4
            erliest time of a random animation to start the next time after
            completion.

        max: 10
            latest time of a random animation to start the next time after
            completion. If no max value is spezified, the next annimation will
            alway start after min seconds.
