jFormics
===========

Flexible, customizable, interactive, behaviorally rich, pure javascript Bugs!

Bugs infest the screen and interact with the pointer. Bugs have tons of options to customize behavior and very flexible sprite system for customizing their look.


Features
--------

* Creates multiple bug sprites which fly and walk around the page.
* Bugs are responsive to mouse movements (optional) and mouse over events.
* Can be used with any combination of bug sprites with any combination of options.

Demo
----

See it in action: http://mishaux.github.io/jFormics/

I'd love to have more bug sprite images available, but making them is not my strong suit. Please feel free to contribute and I'll set up a little downloadable gallery if we get some good ones.

Dependencies
------------

None, all native js code


Compatibility
-------------

Works on all browsers that support CSS3 transforms, even mobile (that I've tested). See http://caniuse.com/transforms2d


How to use 
----------

Include the JS somewhere, and then initialize with:
```js
  new jFormics();
```
or:
```js
  new jFormics({'minBugs':10, 'maxBugs':50, 'mouseOver':'die'});
```

Use multiple instances with different options for multiple variants of bugs:

```js
  new jFormics({imageSprite:'fly-sprite-folded-wings.png'});
  new jFormics({imageSprite:'fly-sprite-spread-wings.png'});
```

See example.html 

jFormics constructor can optionally take an object of options. To make this js more async friendly, you can adjust the default options at the top of jformics.js, and then instantiate at the bottom of the file as above. This will allow one to wrap the entire script in a closure to prevent any global window name space overlaps.


Mouse Interaction Modes
-----------------------

* fly: The bug will fly away to another random point on the page
* flyoff: The bug will fly off the screen and be destroyed
* fall: The bug will be struck dead, and fall to the bottom of the page
* squish: The bug will be squished on the spot
* multiply: The bug will spawn a new bug and both will fly away to other parts of the page
* pop out: The Bug will cease to exist on the spot.
* A random selection from an array of selected possibilities, like: ['fall', 'squish']

Entrance Modes
-----------------------
* fly in: The bug will fly in from a random location off screen and land at a random location.
* walk in: The Bug will walk in from a random location off screen, may take a few extra seconds to show up if it dallies on the way on to the screen.
* pop in: The Bug will pop in to being at a random location on screen.
* A random selection from an array of selected possibilities, like: ['fly in', 'walk in']


Options
-------

* minDelay - Minimum delay before first bug will be created on startup. (default: 500)
* maxDelay - Maximum delay before last bug will be created on startup. (default: 10000)
* minBugs - Minimum starting bug count. (default: 1)
* maxBugs - Maximum bug count. (default: 20)
* entrance - Defines how new bugs will appear, can be 'fly in', 'walk in', or 'pop in', or a random selection from an array of selected possibilities on each bug entrance. See Entrance Modes. (default: ['walk in', 'fly in'])
* minSpeed - Minimum walking speed of a bug, in no particular units. (default: 1)
* maxSpeed - Maximum walking speed of a bug, in no particular units. (default: 3)
* maxFlySpeed - Max bug flight (or run) speed, in no particular units. (default 5)
* decelToLand - Strength of decelerate to land effect, 0 = No Deceleration (default 3)
* imageSprite - Location of the sprite sheet for this bug set. (default: 'template.png')
* cellWidth - The width of the sprite cells, and also div width. (default: 13)
* cellHeight - The height of the sprite cells, and also div height. (default: 14)
* walkFrames - Number of frames in walk animation. (default 5)
* mouseOver - What to do when the mouse is over (or near) a fly. Can be 'fly', 'flyoff', 'fall', 'squish', 'multiply', 'pop out' or a random selection from an array of selected possibilities on each event. See Mouse Interaction Modes. (default: ['fly', 'flyoff', 'fall', 'squish', 'multiply'])
* minTimeBetweenMultipy - When in 'multiply' mode, this is the minimum time in ms between a multiply event. (default: 1000)
* deathTypes - Number of death variation rows in sprite (If using removeDead, a row of removal frames is expected for each death variation). (default: 2)
* twitchFrames - Number of frames in twitch animation (death variation) rows. (default: 5)
* twitchMode - Twitch behavior mode. Can be 'random' (random frames at random times), 'sequential' (frames loop at speed set by twitchRate), 'random-sequential' (frame cycle starts randomly). (default: 'random-sequential')
* twitchRate - Frequency of twitching, Can be 0 - 1000 (never - constantly). (default: 400)
* respawn - Replace bugs which have died or flown away? (default: true)
* minRespawnDelay - Min time to wait before replacing departed bugs. (default: 4000)
* removeDead - Runs dead bug removal frames then destroys bug after delay. (default: true)
* removeDeadFrames - Number of frames in the removal animation rows. For fading or disintegration or whatever. (default: 5)
* removeDeadDelay - Delay after bug dies before removal frames are cycled and bug is destroyed. (default: 3000)
* monitorMouseMovement - If enabled, a mousemove event will be added to the window, and used to detect if the cursor is near a fly. Currently Buggy. (default: false)
* eventDistanceToBug - If monitorMouseMovemenet is enabled, this is the distance from the bug in pixels which will trigger the near bug event. (default: 40)


Credits
-------

Upgraded Screen Bug https://github.com/Auz/Bug

Original Screen Bug http://screen-bug.googlecode.com/git/index.html

Copyright (c) 2013 Mike Michaud

MIT says I should say:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.