# Kobold

This project aims to provide an engine to design a jump and run on a web page.
The key point is, that the character of the jump and run will be able to
interact with standard elements on the web page.

## Table of Contents
  * [License](#chapter-1)
  * [Version](#chapter-2)
  * [Fast Setup](#chapter-3)
  * [Configuration](#chapter-4)
    * [Engine](#chapter-41)
    * [Movable](#chapter-42)
  * [Control the Movable](#chapter-5)

## License <a id="chapter-1"></a>

The origin of this project is an idea of the Swiss game designer company
[Koboldgames](http://www.koboldgames.ch/home/). The animations and images were
provided by these nice people and are part of their corporate design.

## Version <a id="chapter-2"></a>

This README should be up to date to the current commits. If you use a released
version, only consider the attached README to this version.

## Fast Setup <a id="chapter-3"></a>

1.  add main.js, main.css and jQuery (for development jQuery 2.1.3 was used) to
    your page.

2.  add the css class "solid" to the page elements you want the character to
    collide with.

3.  make sure a js file contains the following lines

    ```javascript
    $(document).ready(function () {
        var engine, kobold;
        engine = new Engine();
        kobold = engine.newMovable();
        // START CONFIG
        // configure engine and movable(s)
        // END CONFIG
        engine.start();
        kobold.enableMe();
    });
    ```

## Configuration <a id="chapter-4"></a>

### Engine <a id="chapter-41"></a>

Configure attributes of the engine such as classes to identify colliders and
frame limiters.

    Engine.setConfigAttr(attr, val);
        attr:
            "maxFps": 40
                frame cap

            "solidClass": "solid"
                Class name definig which elements are solid, i.e. with which
                elements the character is colliding (lets call them
                collidables). All elements on the web page intended to be a
                collidable must have this css class.
                Animated objects should not be declared as solid.

            "solidOnlyTopClass": "solidOnlyTop"
                Class name definig which elemets (already having the
                "solidClass") will be solids that only check collision when the
                character is falling on top of them. In all other directions,
                the collision is ignored.

            "solidColliderClass": "solidCollider"
                Only used internaly, make sure this class is not used anywhere
                else.

            "solidColliderOnlyTopClass": "solidColliderOnlyTop""
                Only used internaly, make sure this class is not used anywhere
                else.

        val:
            value to configure the attribute

Get configuration attributes

    Engine.getConfigAttr(attr);
        attr:
            the same attributes as in Engine.setConfigAttr(attr, val).

        return
            value of the attribute

Create and add a new character to the engine. Example animations are provided.
To add different animations for other characters, create new css definitions
similar to the ones provided in main.css.

    Engine.newMovable(id, cssClass);
        id: "kobold" [optional]
            id of the added character. This id must like any other id be unique.
            if no id is provided, the default value is set.

        cssClass: "koboldImg" [optional]
            name of the css class definig the size and animations of the
            character. One set for the default names is provided. If no cssClass
            is provided, the default value is set.

        return
            Movable object of the added charcter

Start the engine (frame manager, key bindings, etc)

    Engine.start();

Enable ability/behaviour of all characters

    Engine.enableAttr(attr);
        attr:
            "forceDirection": true
                When set, the character will move in the direction of the last
                pushed direction button even if the former pressed direction
                button is still pressed. In other words: when the left and
                right buttons are pressed at the same time, with this attribute
                set to true, the character will move in the direction of the
                butten pressed last. If the attribute is set to false, the
                character will stick to the direction it was already moving.

            "crouchRun": false
                Allows characters to crouch and run at the same time wothout
                standing up. If turned off either crouch or run will be
                prioritised. Check the attribute "forceRun" for more
                information

            "forceRun": false
                This attribute allows to prioritize run or crouch if
                "crouchRun" is off and both the crouch and the run buttons are
                pressed. When turned off, crouch will be prioritised (the
                charcter will always crouch when the crouch button is pressed)
                If "crouchRun" is turned on, this parameter has no effect.

            "crouchJumpHigh": true
                This attribute determines whether the characters lift their
                legs or duck while in the air. This changes the jump height of
                the character. If this is turned off, the character jumps only
                to the maximal height set by Movable.setMaxJumpHeight(maxHeight)

Disable ability/behaviour of all characters

    Engine.disableAttr(attr);
        attr:
            the same attributes as in Engine.enableAttr(attr).

Toggle ability/behaviour of all characters

    Engine.toggleEnableAttr(attr);
        attr:
            the same attributes as in Engine.enableAttr(attr).

Get the enable status of an ability/behaviour of all characters

    Engine.getEnableStatusAttr(attr);
        attr:
            the same attributes as in Engine.enableAttr(attr).

        return
            true if enabled, false if disabled

Update the collider. Always call this method, if the content of the page changes
in such a way, that elements intended as solids are changed (size, new elements,
etc.)

    Engine.updateCollider();

Disable a specific collider.

    Engine.disableCollider(jObject);
        jObject:
            jQuery object of the solid, where the collider should be disabled
            (ignored).

Enable a specific collider. By default all created colliders are enabled.

    Engine.enableCollider(jObject);
        jObject:
            jQuery object of the solid, where the collider should be enabled

Toggle the enable status of a specific collider.

    Engine.toggleEnableCollider(jObject);
        jObject:
            jQuery object of the solid, where the collider enable status should
            be toggled.

### Movable <a id="chapter-42"></a>

Get Id of character

    Movable.getId();

Enable character

    Movable.enableMe();

Disable character

    Movable.disableMe();

Toggle enable status of the character

    Movable.toggleEnableMe();

Define behaviour after the method Movable.enableMe() has completed. Note that
Movable.appear() will execute this function as well.

    Movable.setEnableCb(cb);
        cb:
            Devine the behaviour. By default nothing is executed.

Define behaviour after the method Movable.disableMe() has completed. Note that
Movable.appear() and Movable.vanish() will execute this function as well.

    Movable.setDisableCb(cb);
        cb:
            Devine the behaviour. By default nothing is executed.

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

            "crouch": true
                Enables the character to crouch. The crouch height of the
                character is set with setSize("heightCrouch", height). Keep in
                mind that this depends on the size of the crouch animation.

            "appear": true
                With this enabled, the character is able to appear at a defined
                position.

            "vanish": true
                With this enabled, the characte is able to vanish from the
                screen or teleport to a defined position.

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

    Movable.getEnableStatusAttr(attr);
        attr:
            the same attributes as in Movable.enableAttr(attr).

        return
            true if enabled, false if disabled

Define keyCodes to use the character abilities by pressing the keys.
Keep in mind, that this will prevent the default browser behaviour of the
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
            keyCode as integer

Id of element where the pick up count should appear. The corresponding
element must exist on the webpage.
If "pickUp" is turned off, this parameter has no effect.
    
    Movable.setPickUpCounterId(id);
        id: "pickUpCnt"

Get pick up counter id

    Movable.getPickUpCounterId();
        return
            pick up counter id as string.

Class name definig which elements the character can pick up by moving over them.
All elements on the web page intended to be objects that can be picked up must
have this css class.
If "pickUp" is turned off, this parameter has no effect.
    
    Movable.setPickUpCssClass(cssClass);
        cssClass: "pickUp"

Get pick up class

    Movable.getPickUpCssClass();
        return
            pick up css class as string

Get the actual pick up counter value

    Movable.getPickUpCounter();
        return
            value of the pick up counter as integer

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

Get the speed value of an ability

    Movabe.getSpeed(attr);
        attr:
            same values as descriped in Movable.setSpeed(attr, speed), with one
            addition:

            "inAir":
                speed of the character while falling

        return
            speed value as signed integer

Define the absolute screen position (in pixel) where the character will start.
This coordinates will also be used if the character needs to be reset.

    Movable.setInitialPosition(x, y);
        x: 30
            Distance in pixel from the left screen frame to the left border of
            the character.

        y: 100
            Distance in pixel from the top screen frame to the bottom border
            of the character.

Get the defined initial position (in pixel) of the character

    Movable.getInitialPosition();
        return
            object with attribute x and y as pixel values.

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

Get size attribute of character

    Movable.getSize(attr);
        attr:
            the same values as described in Movable.setSize(attr, val);

        return
            the size attribute as pixel value.

Set the z-index of the character image

    Movable.setZIndex(zIndex);
        zIndex: 10
            value to define the css property z-index

Get the z-index of the character images

    Movable.getZIndex();
        return
            value of css property z-index

Setting these parameters allows the character to move over objects of small
heights, without colliding (move up stairs without jumping). The value is the
maxium height (in pixel) of an objet in order to be ignored by right and left
collision. This can be turned off by setting both values to zero. Note that
due to imprecision when zooming functionnality of the browsers is used, this
values should not be set lower than 3.

    Movable.setColliderToleranceBottom(tol);
        tol: 10
            Bottom tolarance (in pixel) for the left and right collider.

Get the bottom collider tolerance value.

    Movable.getColliderToleranceBottom();
        return
            Bottom tolerance as pixel value.

Setting these parameters allows the character to move below objects of small
heights hanging down from the ceiling, without colliding.The value is the
maxium height (in pixel) of an objet in order to be ignored by right and left
collision. This can be turned off by setting both values to zero. Note that
due to imprecision when zooming functionnality of the browsers is used, this
values should not be set lower than 3.

    Movable.setColliderToleranceTop(tol);
        left: 3
            Top tolarance (in pixel) for the lefti and right collider.

Get the top collider tolerance value.

    Movable.getColliderToleranceTop();
        return
            Top tolerance as pixel value.

Define the maximal height (in pixel) the character can jump. One exception to
surpass this height is by enabling "crouchJumpHeight". Please check the comments
there to get more information.
If "jump" is turned off, this parameter has no effect.

    Movable.setMaxJumpHeight(maxHeight);
        maxHeight: 160
            Maximal jump height (in pixel) of the character.

Get the maximum jump height

    Movable.getMaxJumpHeight();
        return
            maximal jump height as pixel value

Define the intervall of random idle animations (in seconds). After completion of
an animation, The next random animation will start in min seconds at the
erliest and in max seconds at the latest.

    Movable.setRandomAnimationInterval(min, max);
        min: 4
            erliest time of a random animation to start the next time after
            completion (in seconds).

        max: 10
            latest time of a random animation to start the next time after
            completion (in seconds). If no max value is spezified, the next
            animation will alway start after min seconds.

Get the random animation interval values

    Movable.getRandomAnimationInterval();
        return
            object with attributes min and max (seconds).

Define the document overflow behavior.

    Movable.setDocumentOverflowCb(direction, cb);
        direction:
            "left": default behavior description see below
                the callback function triggers as soon as the character touches
                the left border of the document. The default behavior is, that
                the character cannot move any further to the left.

            "right": default behavior description see below
                the callback function triggers as soon as the character touches
                the right border of the document. The default behavior is, that
                the character cannot move any further to the right.

            "top": default behaviour see description below
                the callback function triggers as soon as the character touches
                the top border of the document. By default nothing happens.

            "bottom": default behavior description see below
                the callback function triggers as soon as the character touches
                the bottom border of the document. The default behavior is, that
                the character is teleported back to the last valid position.
                This works only if "appear" is enabled.

        cb:
            definition of the callback function if the default behaviour should
            be overridden.

Get document overflow behavior. This could be useful if the default behavior
should be extended, not overwritten completely.

    Movable.getDocumentOverflowCb(direction);
        direction:
            The same directions as in
            Movable.setDocumentOverflowDelta(direction, delta).

        return
            function, definig the document overflow behavior.

Define a distance (in pixel) from the document border at which the document
overflow callback function triggers.

    Movable.setDocumentOverflowDelta(direction, delta);
        direction:
            "left": 0
                Distance in pixel to the left document border.

            "right": 0
                Distance in pixel to the right document border.

            "top": 0
                Distance in pixel to the top document border.

            "bottom": 0
                Distance in pixel to the bottom document border.

        delta:
            value in pixel

Get the distance (in pixel) from the document border at which the document
overflow callback function triggers.

    Movable.getDocumentOverflowDelta(direction);
        direction:
            The same directions as in
            Movable.setDocumentOverflowDelta(direction, delta).

Define the window overflow behavior.

    Movable.setWindowOverflowCb(direction, cb);
        direction:
            "left": default behavior description see below
                the callback function triggers as soon as the character touches
                the left border of the windwo. The default behavior is, that
                the window is scrolled left with the same speed as the character
                is moving.

            "right": default behavior description see below
                the callback function triggers as soon as the character touches
                the right border of the window. The default behavior is, that
                the window is scrolled right with the same speed as the
                character is moving.

            "top": default behaviour see description below
                the callback function triggers as soon as the character touches
                the top border of the windwo. The default behavior is, that the
                window is scrolled to the top with the same speed as the
                character is moving.

            "bottom": default behavior description see below
                the callback function triggers as soon as the character touches
                the bottom border of the window. The default behavior is, that
                the window is scrolled down by the same speed as the character
                is moving.

        cb:
            definition of the callback function if the default behaviour should
            be overridden.

Get window overflow behavior. This could be useful if the default behavior
should be extended, not overwritten completely.

    Movable.getWindowOverflowCb(direction);
        direction:
            The same directions as in
            Movable.setWindowOverflowDelta(direction, delta).

        return
            function, definig the window overflow behavior.

Define a distance (in pixel) from the window border at which the document
overflow callback function triggers.

    Movable.setWindowOverflowDelta(direction, delta);
        direction:
            "left": 500
                Distance in pixel to the left windwo border.

            "right": 500
                Distance in pixel to the right window border.

            "top": 100;
                Distance in pixel to the top window border.

            "bottom": 100
                Distance in pixel to the bottom window border.

        delta:
            value in pixel

Get the distance (in pixel) from the window border at which the window overflow
callback function triggers.

    Movable.getWindowOverflowDelta(direction);
        direction:
            The same directions as in
            Movable.setWindowOverflowDelta(direction, delta).

<!---Define the behavior when the scroll event of the document triggers.

    Movable.setScrollEventCb(cb);
        cb:
            definition of the callback function if the default behaviour should
            be overridden. The default operation is to turn of the position
            check. This allows to scroll the screen without an automatic
            recentering on the character. The position check is turned on again
            when the character is activated (any character relevant key is pressed)

Get the behavior when the scroll event of the document triggers. This could be useful
if the default behavior should be extended, not overwritten completely.

    Movable.getScrollEventCb();
        return
            function, definig the behavior if a document scroll event occures.--->

## Control the Movable <a id="chapter-5"></a>

Let the character appear at a specific position on the screen with a fancy
animation. Only works if appear is enabled.

    Movable.doAppear(x, y, cb);
        x: last valid x position of the character [optional]
            x coordiante (in pixel) starting from the left document border

        y: last valid y position of the character [optional]
            y coordiante (in pixel) starting from the top document border

        cb: [optional]
            callback function which is executed on success, after the animation
            as finished

        return
            true if success, false if not

Let the character crouch. Only works if crouch is enabled.

    Movable.doCrouch(crouchJumpHigh);
        crouchJumpHigh: true [optional]
            if set to true, the character will lift its feet instead of ducking
            its head while in the air. If set to false the charactre will duck
            its head when in the air. For more information check the comments
            on Engine.enableAttr('crouchJumpHigh')

        return
            true if success, false if not

Change the character into idle state which will enable the random idle
animations.

    Movable.doIdle();

Let the Character Jump. Only works if jump is enabled.

    Movable.doJump();
        return
            true if success, false if not

Move the character in a direction by a distance. If an obstacle is in the way,
the character will only move to the border of the obstacle. Even if the
distance to move is larger than the obstacle.

    Movable.doMove(direction, dist);
        direction:
            must be a string with the value of either 'left', 'right', 'top',
            or 'bottom'.

        dist: standard distance depending on speed and direction [optional]
            must be a positive number (negative signes are ignored) indication
            the distance in pixel the character will move in a given direction.
            
        return
            true if success, false if there was a collision

Make the character run. This changes the speed and the animation but does not
move the character. To actually move it, Movable.doMove(direction, dist) must
be invoked. This works only if run is enabled and there is no impact if the
character is already running.

    Movable.doRun();
        return
            true if success, false if not

Let the character stand up. The character will only stand up if it is crouched
and no obstacle is preventing it from standing up.

    Movable.doStand();
        return
            true if success, false if not. If the character is already
            standing, the method returns true.

Let the character teleport to a specified location with fancy animations. This
works only if both appear and vanish are enabled.

    Movable.doTeleport(x, y)
        x: last valid x position of the character [optional]
            x coordiante (in pixel) starting from the left document border

        y: last valid y position of the character [optional]
            y coordiante (in pixel) starting from the top document border

        cb: [optional]
            callback function which is executed on success, after the animation
            has finished

        return
            true if success, false if not

Let the character vanish with a fancy animation. This only works if vanish is
enabled.

    Movable.doVanish(cb);
        cb: [optional]
            callback function which is executed on success, after the animation
            has finished

        return
            true if success, false if not

Make the character walk. This changes the speed and the animation but does not
move the character. To actually move it, Movable.doMove(direction, dist) must
be invoked. This has no impact when the character is already walking.

    Movable.doWalk();
        return true
            This always returns true

