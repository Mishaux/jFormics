jFormics
===========

Flexible, customazable, interactive, behaviorally rich, pure Javascript Bugs

I'd love to have more bug sprite images available, but making them is not my strong suit. Please feel free to contribute and I'll set up a little downloadable gallery if we get some good ones.

An elaboration on the themes of, and indebted to, these excellent works:

Original Screen Bug http://screen-bug.googlecode.com/git/index.html
Upgraded Screen Bug https://github.com/Auz/Bug


Features
--------

* Creates multiple bug sprites which fly and walk around the page.
* Bugs are responsive to mouse movements (optional) and mouse over events.

Demo
----

For now, see the source project page: http://auz.github.io/Bug/ or http://jsfiddle.net/snfmn/


Dependancies
------------

None, all native js code


Compatibility
-------------

Works on all browsers that support CSS3 transforms, even mobile (that I've tested). See http://caniuse.com/transforms2d


How to use 
----------

Include the JS somewhere, and then initialize with 
```js
  new BugController();
```
or
```js
  new BugController({'minBugs':10, 'maxBugs':50, 'mouseOver':'die'});
```
See example.html 

BugController constructor can optionally take an object of options. To make this js more async friendly, you can adjust the default options at the top of bug.js, and then instantiate at the bottom of the file as above. This will allow one to wrap the entire script in a closure to prevent any global window name space overlaps.


Options
-------

* minDelay - Minimum delay before first bug will be created on startup. (default: 500)
* maxDelay - Maximum delay before last bug will be created on startup. (default: 10000)
* minBugs - Minumum starting bug count. (default: 1)
* maxBugs - Maximum bug count. (default: 20)
* entrance - Defines how new bugs will appear, can be 'fly in', 'walk in', or 'pop in'. (default: 'fly_in')
* minSpeed - Minimum walking speed of a bug, in no particular units. (default: 1)
* maxSpeed - Maximum walking speed of a bug, in no particular units. (default: 3)
* maxFlySpeed: 5 - Max bug flight speed, in no particular units. (default 5)

* imageSprite - Location of the sprite sheet for this bug set. (default: 'fly-sprite.png')
* flyWidth - The width of the fly sprite cell, and also div width. (default: 13)
* flyHeight - The height of the fly sprite cell, and also div height. (default: 14)
* walkFrames - Number of frames in walk animation. (default 5)

* mouseOver - What to do when the mouse is over (or near) a fly. Can be 'fly', 'flyoff', 'fall', 'squish', multiply', or 'random'. See Modes. (default: random)
* minTimeBetweenMultipy - When in 'multiply' mode, this is the minimum time in ms between a multiply event. (default: 1000)

* deathTypes - Number of death variation rows in sprite (If using twitch, a row of twitch frames is expected for each death variation). (default: 2)

* twitchFrames - Number of frames in twitch animation rows. (default: 5)
* twitchMode - Twitch behavior mode. Can be 'random' (random frames at random times), 'sequential' (frames loop at speed set by twitchRate), 'random-sequential' (frame cycle starts randomly). (default: 'random-sequential')
* twitchRate - Frequency of twitching, Can be 0 - 1000 (never - constantly). (default: 400)

* respawn - Replace bugs which have died or flown away? (default: true)
* minRespawnDelay - Min time to wait before replacing departed bugs. (default: 4000)

* removeDead - Runs dead bug removal frames then destroys bug after delay. (default: true)
* removeDeadFrames - Number of frames in the removal animation rows. For fading or disintigration or whatever. (default: 5)
* removeDeadDelay - Delay after bug dies before removal frames are cycled and bug is destroyed. (default: 3000)

* monitorMouseMovement - If enabled, a mousemove event will be added to the window, and used to detect if the cursor is near a fly. Currently Buggy. (default: false)
* eventDistanceToBug - If monitorMouseMovemenet is enabled, this is the distance from the bug in pixels which will trigger the near bug event. (default: 40)



Modes
-----

* random: Randomly pick one of the other modes on each mouse over/near event
* fly: The bug will fly away to another random point on the page
* flyoff: The bug will fly off the screen and be destroyed
* fall: The bug will be struck dead, and fall to the bottom of the page
* squish: The bug will be squished on the spot
* multiply: The bug will spawn a new bug and both will fly away to other parts of the page

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