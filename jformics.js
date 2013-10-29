// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name bug-min.js
// ==/ClosureCompiler==

/**
 * @preserve jFormics.js - https://github.com/Mishaux/jFormics
 * Released under MIT-style license.
 * Original Screen Bug http://screen-bug.googlecode.com/git/index.html
 * Upgraded Screen Bug https://github.com/Auz/Bug
 */

/**
* jFormics.js - Add bugs to your stuff
*
* https://github.com/Mishaux/jFormics
*
* license: MIT license.
* copyright: Copyright (c) 2013 Mike Michaud (mishuax (no at for bots ಠ_ಠ) gmail)
* 
* I needed some behaviorally rich interactive bugs for a little prank and built on
* work of the credited projects. Enjoy!
*
* MIT says I should say:
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* Credits:
* 
* Bug https://github.com/Auz/Bug
* Copyright (c) 2013 Graham McNicoll
* Released under WTFPL license.
* 
* Original Screen Bug http://screen-bug.googlecode.com/git/index.html
* Copyright ©2011 Kernc (kerncece ^_^ gmail)
* Released under WTFPL license.
* 
*/
"use strict";


var BugDispatch = {

  options: {
    minDelay: 500, // Min delay before making first bug on startup
    maxDelay: 10000, // Max delay before making last bug on startup
    minBugs: 1, // Min starting bug count
    maxBugs: 20, // Max starting bug count. Also limits multiply mode.
    minSpeed: 1, // Min bug walking speed
    maxSpeed: 3, // Max bug walking speed
    maxFlySpeed: 5, // Max bug flight speed
    imageSprite: 'template.png', //Sprite to use for this bug set
    flyWidth: 128, // Width in pixels of each bug frame on sprite
    flyHeight: 128, // Height in pixels of each bug frame on sprite
    walkFrames: 4, // Number of frames in walk animation
    deathTypes: 2, // Number of death variation rows in sprite (If using twitch, a row of twitch frames is expected for each death variation)
    twitchFrames: 5, // Number of frames in twitch animations
    twitchMode: 'random-sequential', //can be 'random (random frames at random times)', 'sequential (frames loop at speed set by twitchRate)', 'random-sequential(frame cycle starts randomly)'
    twitchRate: 800, //frequency of twitch, 0 - 1000 (never - constantly)
    monitorMouseMovement: false, //This is buggy still
    eventDistanceToBug: 40, // This is buggy still
    minTimeBetweenMultipy: 1000, // Limits frequency of multiply effect
    entrance: 'fly in', //can be 'fly in', 'walk in', 'pop in'
    respawn: true, // Replace bugs which have died or flown away
    minRespawnDelay: 4000, // Min time to wait before replacing departed bugs
    removeDead: true, // Runs dead bug removal frames after delay
    removeDeadFrames: 5, // Number of dead bug removal frames
    removeDeadDelay: 3000, // Delay after bug dies before removal frames are run and bug is destroyed
    mouseOver: 'random' // can be 'fly', 'flyoff', 'fall, 'squish', multiply', or 'random'
  },

  initialize: function (options) {
    this.options = mergeOptions(this.options, options);

    // sanity check:
    if(this.options.minBugs > this.options.maxBugs) {
      this.options.minBugs = this.options.maxBugs;
    }

    this.modes = ['fall', 'multiply', 'fly', 'flyoff', 'squish'];

    // can we transform?
    this.transform = null;

    this.transformFns = {
      'MozTransform': function (s) {
        this.bug.style.MozTransform = s;
      },
      'WebkitTransform': function (s) {
        this.bug.style.webkitTransform = s;
      },
      'OTransform': function (s) {
        this.bug.style.OTransform = s;
      },
      'MsTransform': function (s) {
        this.bug.style.msTransform = s;
      },
      'KhtmlTransform': function (s) {
        this.bug.style.KhtmlTransform = s;
      },
      'W3Ctransform': function (s) {
        this.bug.style.transform = s;
      }
    };

    this.transforms = {
      'Moz': this.transformFns.MozTransform,
      'webkit': this.transformFns.WebkitTransform,
      'O': this.transformFns.OTransform,
      'ms': this.transformFns.MsTransform,
      'Khtml': this.transformFns.KhtmlTransform,
      'w3c': this.transformFns.W3Ctransform
    };

    // check to see if it is a modern browser:
    if ('transform' in document.documentElement.style) {
      this.transform = this.transforms.w3c;
    } else {

      // feature detection for the other transforms:
      var vendors = ['Moz', 'webkit', 'O', 'ms', 'Khtml'],
        i = 0;

      for (i = 0; i < vendors.length; i++) {
        if (vendors[i] + 'Transform' in document.documentElement.style) {
          this.transform = this.transforms[vendors[i]];
          break;
        }
      }
    }
    
    // dont support transforms... quit
    if(!this.transform) return;

    // make bugs:
    this.bugs = [];
    var numBugs = (this.options.mouseOver === 'multiply') ? this.options.minBugs : this.random(this.options.minBugs, this.options.maxBugs, true),
      i = 0,
      that = this;
      
    for (i = 0; i < numBugs; i++) {
      var b = this.makeNewBug();
      this.bugs.push(b);
    }

    // fly them in staggered:
    for (i = 0; i < numBugs; i++) {
      var that = this
      var delay = this.random(this.options.minDelay, this.options.maxDelay, true),
        thebug = this.bugs[i];
      // bring the bug onto the page:
      setTimeout((function (thebug) {
        return function () {
          thebug.makeEntrance(that.options.entrance)
        };
      }(thebug)), delay);
    }

    // add window event if required:
    if (this.options.monitorMouseMovement) {
      window.onmousemove = function () {
        that.check_if_mouse_close_to_bug();
      };
    }

  },

  add_events_to_bug: function (thebug) {
    var that = this;
    if (thebug.bug) {
      if(thebug.bug.addEventListener) {
  		  thebug.bug.addEventListener('mouseover', function (e) {
				  that.on_bug(thebug);
			  });
		  } else if(thebug.bug.attachEvent) {
			  thebug.bug.attachEvent('onmouseover', function(e){
			  	that.on_bug(thebug);
			  });
		  }
    }
  },

  check_if_mouse_close_to_bug: function (e) {
    e = e || window.event;
    if (!e) {
      return;
    }

    var posx = 0,
      posy = 0;
    if (e.client && e.client.x) {
      posx = e.client.x;
      posy = e.client.y;
    } else if (e.clientX) {
      posx = e.clientX;
      posy = e.clientY;
    } else if (e.page && e.page.x) {
      posx = e.page.x - (document.body.scrollLeft + document.documentElement.scrollLeft);
      posy = e.page.y - (document.body.scrollTop + document.documentElement.scrollTop);
    } else if (e.pageX) {
      posx = e.pageX - (document.body.scrollLeft + document.documentElement.scrollLeft);
      posy = e.pageY - (document.body.scrollTop + document.documentElement.scrollTop);
    }
    var numBugs = this.bugs.length,
      i = 0;
    for (i = 0; i < numBugs; i++) {
      var pos = this.bugs[i].getPos();
      if (pos) {
        if (Math.abs(pos.top - posy) + Math.abs(pos.left - posx) < this.options.eventDistanceToBug && !this.bugs[i].flyperiodical) {
          this.near_bug(this.bugs[i]);
        }
      }
    }

  },

  near_bug: function (bug) {
    this.on_bug(bug);
  },

  on_bug: function (bug) {
    if (!bug.alive) {
      return;
    }

    var mode = this.options.mouseOver;
    if (mode === 'random') {
      mode = this.modes[(this.random(0, (this.modes.length - 1), true))];
    }
    if (mode === 'fly') {
      // fly away!
      bug.stop();
      bug.flyRand();
    } else if (mode === 'flyoff') {
    	// fly away and off the page
      that = this;
      bug.stop();
      bug.flyOff();
      if (this.options.respawn) {
        setTimeout(function() {
          var b = that.makeNewBug();
          b.makeEntrance(that.options.entrance);
        }, that.options.minRespawnDelay)
      }
    } else if (mode === 'fall') {
    	// drop dead!
      that = this;
      bug.fall();

      if (this.options.respawn) {
        setTimeout(function() {
          var b = that.makeNewBug();
          b.makeEntrance(that.options.entrance);
        }, that.options.minRespawnDelay)
      }
    } else if (mode === 'squish') {
      // splut!
      that = this;
      bug.squish();

      if (this.options.respawn) {
        setTimeout(function() {
          var b = that.makeNewBug();
          b.makeEntrance(that.options.entrance);
        }, that.options.minRespawnDelay)
      }
    } else if (mode === 'multiply') {
      if (!this.multiplyDelay && this.bugs.length < this.options.maxBugs) {
        var that = this;
        // spawn another: 
        // create new bug:
        var b = this.makeNewBug();
        var pos = bug.getPos();

        b.drawBug(pos.top, pos.left);
        // fly them both away:
        b.flyRand();
        bug.flyRand();
        // store new bug:
        this.bugs.push(b);
        // watch out for spawning too quickly:
        this.multiplyDelay = true;
        setTimeout(function () {
          // add event to this bug:
          that.add_events_to_bug(b);
          that.multiplyDelay = false;
        }, this.options.minTimeBetweenMultipy);
      }
    }
  },

  makeNewBug: function () {
    var options = {
      imageSprite: this.options.imageSprite,
      flyWidth: this.options.flyWidth,
      flyHeight: this.options.flyHeight,
      maxFlySpeed: this.options.maxFlySpeed,
      decelEffect: this.options.decelEffect,
      walkFrames: this.options.walkFrames,
      deathTypes: this.options.deathTypes,
      removeDead: this.options.removeDead,
      removeDeadFrames: this.options.removeDeadFrames,
      removeDeadDelay: this.options.removeDeadDelay,
      twitchRate: this.options.twitchRate,
      twitchMode: this.options.twitchMode,
      twitchFrames: this.options.twitchFrames,
      walkSpeed: this.random(this.options.minSpeed, this.options.maxSpeed)
    },
    b = SpawnBug();
    b.initialize(this.transform, options);
    this.add_events_to_bug(b);
    return b
  },

  random: function (min, max, round) {
    var result = ((min - 0.5) + (Math.random() * (max - min + 1)));
    if (result > max) {
      result = max;
    } else if (result < min) {
      result = min;
    }
    return ((round) ? Math.round(result) : result);
  }
};

var BugController = function () {
  this.initialize.apply(this, arguments);
}
BugController.prototype = BugDispatch;


/***************/
/**    Bug    **/
/***************/

var Bug = {

  options: {
    walkSpeed: 2,
    edge_resistance: 50
  },

  initialize: function (transform, options) {


    this.options = mergeOptions(this.options, options);
    this.NEAR_TOP_EDGE = 1;
    this.NEAR_BOTTOM_EDGE = 2;
    this.NEAR_LEFT_EDGE = 4;
    this.NEAR_RIGHT_EDGE = 8;
    this.directions = {}; // 0 degrees starts on the East
    this.directions[this.NEAR_TOP_EDGE] = 270;
    this.directions[this.NEAR_BOTTOM_EDGE] = 90;
    this.directions[this.NEAR_LEFT_EDGE] = 0;
    this.directions[this.NEAR_RIGHT_EDGE] = 180;
    this.directions[this.NEAR_TOP_EDGE + this.NEAR_LEFT_EDGE] = 315;
    this.directions[this.NEAR_TOP_EDGE + this.NEAR_RIGHT_EDGE] = 225;
    this.directions[this.NEAR_BOTTOM_EDGE + this.NEAR_LEFT_EDGE] = 45;
    this.directions[this.NEAR_BOTTOM_EDGE + this.NEAR_RIGHT_EDGE] = 135;

    this.angle_deg = 0;
    this.angle_rad = 0;
    this.large_turn_angle_deg = 0;
    this.near_edge = false;
    this.edge_test_counter = 10;
    this.small_turn_counter = 0;
    this.large_turn_counter = 0;
    this.fly_counter = 0;
    this.toggle_stationary_counter = Math.random() * 50;

    this.stationary = false;
    this.bug = null;
    this.transform = transform;
    this.walkIndex = 0;
    this.flyIndex = 0;
    this.alive = true;

    this.rad2deg_k = 180 / Math.PI;
    this.deg2rad_k = Math.PI / 180;

    this.makeBug();

    this.angle_rad = this.deg2rad(this.angle_deg);

    this.angle_deg = this.random(0, 360, true);

  },

  go: function () {
    if (this.transform) {
      this.drawBug();
      var that = this;

      this.going = setInterval(function () {
        that.animate();
      }, 40);
      //this.going = requestAnimFrame(function(t){ that.animate(t); });
    }
  },

  stop: function () {
    if (this.going) {
      clearTimeout(this.going);
      this.going = null;
    }
    if (this.flyperiodical) {
      clearTimeout(this.flyperiodical);
      this.flyperiodical = null;
    }
    if (this.twitching) {
      clearTimeout(this.twitching);
      this.twitching = null;
    }
  },

  animate: function () {

    if (--this.toggle_stationary_counter <= 0) {
      this.toggleStationary();
    }
    if (this.stationary) {
      return;
    }


    if (--this.edge_test_counter <= 0 && this.bug_near_window_edge()) {
      // if near edge, go away from edge
      this.angle_deg %= 360;
      if (this.angle_deg < 0) this.angle_deg += 360;

      if (Math.abs(this.directions[this.near_edge] - this.angle_deg) > 15) {
        var angle1 = this.directions[this.near_edge] - this.angle_deg;
        var angle2 = (360 - this.angle_deg) + this.directions[this.near_edge];
        this.large_turn_angle_deg = (Math.abs(angle1) < Math.abs(angle2) ? angle1 : angle2);

        this.edge_test_counter = 10;
        this.large_turn_counter = 100;
        this.small_turn_counter = 30;
      }
    }
    if (--this.large_turn_counter <= 0) {
      this.large_turn_angle_deg = this.random(1, 150, true);
      this.next_large_turn();
    }
    if (--this.small_turn_counter <= 0) {
      this.angle_deg += this.random(1, 10);
      this.next_small_turn();
    } else {
      var dangle = this.random(1, 5, true);
      if ((this.large_turn_angle_deg > 0 && dangle < 0) || (this.large_turn_angle_deg < 0 && dangle > 0)) {
        dangle = -dangle; // ensures both values either + or -
      }
      this.large_turn_angle_deg -= dangle;
      this.angle_deg += dangle;
    }

    this.angle_rad = this.deg2rad(this.angle_deg);

    var dx = Math.cos(this.angle_rad) * this.options.walkSpeed;
    var dy = -Math.sin(this.angle_rad) * this.options.walkSpeed;

    this.moveBug(dx, dy);
    this.walkFrame();
    this.transform("rotate(" + (90 - this.angle_deg) + "deg)");
  },

  makeBug: function () {
    if (!this.bug) {
      var row = '0';
      var bug = document.createElement('div');
      bug['class'] = 'bug';
      bug.style.background = 'transparent url(' + this.options.imageSprite + ') no-repeat 0 ' + row;
      bug.style.width = this.options.flyWidth + 'px';
      bug.style.height = this.options.flyHeight + 'px';
      bug.style.position = 'fixed';
      bug.style.zIndex = '9999999';

      this.bug = bug;
    }
  },

  destroyBug: function () {
    document.body.removeChild(this.bug);
  },

  setPos: function (top, left) {
    this.bug.top = top || this.random(this.options.edge_resistance, document.documentElement.clientHeight - this.options.edge_resistance);
    //bug.top = bug.top < 0 ? -bug.top : bug.top;
    this.bug.left = left || this.random(this.options.edge_resistance, document.documentElement.clientWidth - this.options.edge_resistance);
    //bug.left = bug.left < 0 ? -bug.left : bug.left;
    this.bug.style.top = this.bug.top + 'px';
    this.bug.style.left = this.bug.left + 'px';
  },

  drawBug: function (top, left) {

    if (!this.bug) {
      this.makeBug();
    }

    if (top && left) {
      this.setPos(top, left);
    } else {
      this.setPos(this.bug.top, this.bug.left)
    }

    if (!this.inserted) {
      this.inserted = true;
      document.body.appendChild(this.bug);
    }
  },

  toggleStationary: function () {
    this.stationary = !this.stationary;
    this.next_stationary();
    if (this.stationary) {
      this.bug.style.backgroundPosition = '0 0'
    } else {
      this.bug.style.backgroundPosition = '-' + this.options.flyWidth + 'px ' + '0';
    }
  },

  walkFrame: function () {
    var xpos = (-1 * ((this.walkIndex + 1) * this.options.flyWidth)) + 'px',
      ypos = '0'
    this.bug.style.backgroundPosition = xpos + ' ' + ypos;
    this.walkIndex++;
    if (this.walkIndex >= this.options.walkFrames) this.walkIndex = 0;
  },

  moveBug: function (dx, dy) {
    this.bug.style.top = (this.bug.top += dy) + 'px';
    this.bug.style.left = (this.bug.left += dx) + 'px';
  },

  fly: function (landingPosition, after_landing) {
    var currentTop = parseInt(this.bug.style.top, 10),
      currentLeft = parseInt(this.bug.style.left, 10),
      diffx = (currentLeft - landingPosition.left),
      diffy = (currentTop - landingPosition.top)

    this.set_angle_angle_to_landing_site(landingPosition);


    if (Math.abs(diffx) + Math.abs(diffy) > 200) {
      this.bug.style.backgroundPosition = (-4 * this.options.flyWidth) + 'px -' + (this.options.flyHeight) + 'px';
    }
    if (Math.abs(diffx) + Math.abs(diffy) < 200) {
      this.bug.style.backgroundPosition = (-3 * this.options.flyWidth) + 'px -' + (this.options.flyHeight) + 'px';
    }
    if (Math.abs(diffx) + Math.abs(diffy) < 100) {
      this.bug.style.backgroundPosition = (-2 * this.options.flyWidth) + 'px -' + (this.options.flyHeight) + 'px';
    }
    if (Math.abs(diffx) + Math.abs(diffy) < 75) {
      this.bug.style.backgroundPosition = (-1 * this.options.flyWidth) + 'px -' + (this.options.flyHeight) + 'px';
    }
    if (Math.abs(diffx) + Math.abs(diffy) < 50) {
      this.bug.style.backgroundPosition = '0 -' + (this.options.flyHeight) + 'px';
    }
    if (Math.abs(diffx) < 2 && Math.abs(diffy) < 2) {
      // close enough:
      this.bug.style.backgroundPosition = '0 0'; //+row+'px'));

      this.stop();
      this.go();

      //Flight complete, run callback
      typeof after_landing === 'function' && after_landing();
      return;
    }

    var speed_this_frame = ((Math.abs(diffx) + Math.abs(diffy)) / 20) * this.options.maxFlySpeed;

    var dx = Math.cos(this.angle_rad) * speed_this_frame
    var dy = Math.sin(this.angle_rad) * speed_this_frame

    if (Math.abs(dx) <= 1) {
      (dx > 0) ? dx = 1 : dx = -1
    }

    if (Math.abs(dy) <= 1) {
      (dy > 0) ? dy = 1 : dy = -1
    }

    this.bug.style.top = Math.round(currentTop + dy) + 'px';
    this.bug.style.left = Math.round(currentLeft + dx) + 'px';
  },

  flyRand: function () {
    this.stop();
    var landingPosition = {};
    landingPosition.top = this.random(this.options.edge_resistance, document.documentElement.clientHeight - this.options.edge_resistance);
    landingPosition.left = this.random(this.options.edge_resistance, document.documentElement.clientWidth - this.options.edge_resistance);

    this.startFlying(landingPosition);
  },

  startFlying: function (landingPosition, after_landing) {
    this.bug.left = landingPosition.left;
    this.bug.top = landingPosition.top;

    this.set_angle_angle_to_landing_site(landingPosition);

    this.transform("rotate(" + (this.angle_deg + 90) + "deg)");

    // start animation:
    var that = this;
    this.flyperiodical = setInterval(function () {
      //If after landing callback is set, run it at the end of the flight
      that.fly(landingPosition, (typeof after_landing === 'function' ? after_landing : null));
    }, 10); //this.fly.periodical(10, this, [landingPosition]);
  },

  makeEntrance: function (mode) {
    if (!this.bug) {
      this.makeBug();
    }
    this.stop();
    // pick a random side:
    var side = Math.round(Math.random() * 4 - 0.5),
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      windowX = window.innerWidth || e.clientWidth || g.clientWidth,
      windowY = window.innerHeight || e.clientHeight || g.clientHeight;
    if (side > 3) side = 3;
    if (side < 0) side = 0;

    if (mode === 'pop in') {
      this.bug.style.backgroundPosition = (-3 * this.options.flyWidth) + 'px -' + (this.options.flyHeight) + 'px';
      this.setPos();
      this.go();
    
    } else {
      var style = {}, s;

      if (side === 0) {
        // top:
        style.top =  -2 * this.options.flyHeight;
        style.left = Math.random() * windowX;
      } else if (side === 1) {
        // right:
        style.top = Math.random() * windowY;
        style.left = windowX + (2 * this.options.flyWidth);
      } else if (side === 2) {
        // bottom:
        style.top = windowY + (2 * this.options.flyHeight);
        style.left = Math.random() * windowX;
      } else {
        // left: 
        style.top = Math.random() * windowY;
        style.left = -2 * this.options.flyWidth;
      }

      this.bug.style.backgroundPosition = (-3 * this.options.flyWidth) + 'px -' + (this.options.flyHeight) + 'px';
      this.bug.top = style.top
      this.bug.left = style.left
    
      if (mode == 'walk in') {

        this.go();

      } else if (mode === 'fly in') {
        // landing position:
        var landingPosition = {};
        landingPosition.top = this.random(this.options.edge_resistance, document.documentElement.clientHeight - this.options.edge_resistance);
        landingPosition.left = this.random(this.options.edge_resistance, document.documentElement.clientWidth - this.options.edge_resistance);
        this.drawBug();
        this.startFlying(landingPosition);
      };
    };
  },

  flyOff: function () {
    this.stop();
    // pick a random side to fly off to, where 0 is top and continuing clockwise.
    var bug = this
    var side = this.random(0, 3),
      style = {},
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      windowX = window.innerWidth || e.clientWidth || g.clientWidth,
      windowY = window.innerHeight || e.clientHeight || g.clientHeight;

    if (side === 0) {
      // top:
      style.top = -1000;
      style.left = Math.random() * windowX;
    } else if (side === 1) {
      // right:
      style.top = Math.random() * windowY;
      style.left = windowX + 1000;
    } else if (side === 2) {
      //bottom
      style.top = windowY + 1000;
      style.left = Math.random() * windowX;
    } else {
      // left: 
      style.top = Math.random() * windowY;
      style.left = -1000;
    }
    this.startFlying(style, function(){bug.destroyBug()});
  },

  fall: function () {
    this.stop();
    var that = this;
    //pick death style:
    var deathType = this.random(0, this.options.deathTypes - 1);
    this.bug.style.backgroundPosition = '0px -' + ((2 + deathType) * this.options.flyHeight) + 'px';
    this.alive = false;

    if (this.options.removeDead) {
      setTimeout(function(){that.fade(deathType)}, that.options.removeDeadDelay);
    }

    this.drop(deathType);
  },

  squish: function () {
    this.stop();
    var that = this;
    //pick splat style:
    var deathType = this.random(0, this.options.deathTypes - 1);
    this.bug.style.backgroundPosition = '0px -' + ((2 + deathType) * this.options.flyHeight) + 'px';
    this.alive = false;

    if (this.options.removeDead) {
      setTimeout(function(){that.fade(deathType)}, that.options.removeDeadDelay);
    }

    this.twitch(deathType);
  },

  drop: function (deathType) {
    var startPos = this.getPos().top,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      finalPos = window.innerHeight || e.clientHeight || g.clientHeight,
      finalPos = finalPos - this.options.flyHeight,
      rotationRate = this.random(0, 20, true),
      startTime = Date.now(),
      that = this;

    this.dropTimer = setInterval(function () {
      that.dropping(startTime, startPos, finalPos, rotationRate, deathType);
    }, 20);
  },

  dropping: function (startTime, startPos, finalPos, rotationRate, deathType) {
    var currentTime = Date.now(),
      elapsedTime = currentTime - startTime,
      deltaPos = (0.002 * (elapsedTime * elapsedTime)),
      newPos = startPos + deltaPos;
    //console.log(elapsedTime, deltaPos, newPos);
    if (newPos >= finalPos) {
      newPos = finalPos;
      clearTimeout(this.dropTimer);
      this.angle_deg = 0;
      this.angle_rad = this.deg2rad(this.angle_deg);
      this.transform("rotate(" + (90 - this.angle_deg) + "deg)");
      this.bug.style.top = null;
      this.bug.style.bottom = '-1px';


      this.twitch(deathType);

      return;
    }

    this.angle_deg = ((this.angle_deg + rotationRate) % 360);
    this.angle_rad = this.deg2rad(this.angle_deg);
    this.transform("rotate(" + (90 - this.angle_deg) + "deg)");
    this.bug.style.top = newPos + 'px';
  },

  twitch: function (deathType, twitchFrame) {
    //this.bug.style.back
    if (!twitchFrame) twitchFrame = 0;
    var that = this;

    if (that.options.twitchRate > 0) {
      if (that.options.twitchMode == 'random') {
        this.twitching = setTimeout(function () {
          that.bug.style.backgroundPosition = '-' + (twitchFrame) * that.options.flyWidth + 'px -' + ((2 + deathType) * that.options.flyHeight) + 'px';
          var newTwitchFrame = Math.round(that.random(0, that.options.twitchFrames - 1))
          that.twitch(deathType, newTwitchFrame);
        }, this.random(10, (600000/(that.options.twitchRate ^ 2))));
      } else if (that.options.twitchMode == 'sequential') {
        this.twitching = setTimeout(function () {
          that.bug.style.backgroundPosition = '-' + (twitchFrame) * that.options.flyWidth + 'px -' + ((2 + deathType) * that.options.flyHeight) + 'px';
          var newTwitchFrame = ++twitchFrame % that.options.twitchFrames
          that.twitch(deathType, newTwitchFrame);
        }, that.options.twitchRate);
      } else if (that.options.twitchMode == 'random-sequential') {
        this.twitching = setTimeout(function () {
          that.bug.style.backgroundPosition = '-' + (twitchFrame) * that.options.flyWidth + 'px -' + ((2 + deathType) * that.options.flyHeight) + 'px';
          var newTwitchFrame = ++twitchFrame % that.options.twitchFrames
          that.twitch(deathType, newTwitchFrame);
        }, (twitchFrame > 0) ? 100 : this.random(10, (600000/(that.options.twitchRate ^ 2))));
      }
    }
  },

  fade: function (deathType, frame) {
    if (!frame) frame = 0;
    var that = this;
    this.stop();

    if (frame === this.options.removeDeadFrames + 1) {
      this.destroyBug();
    } else {
      setTimeout(function () {
        that.bug.style.backgroundPosition = '-' + (frame * that.options.flyWidth) + 'px -' + ((2 + deathType + that.options.deathTypes) * that.options.flyHeight) + 'px';
        that.fade(deathType, ++frame);
      }, 100);
    }
  },

  /* helper methods: */
  rad2deg: function (rad) {
    return rad * this.rad2deg_k;
  },
  deg2rad: function (deg) {
    return deg * this.deg2rad_k;
  },
  set_angle_angle_to_landing_site: function(landingSite) {
    var currentTop = parseInt(this.bug.style.top, 10),
      currentLeft = parseInt(this.bug.style.left, 10),
      diffx = (landingSite.left - currentLeft),
      diffy = (landingSite.top - currentTop);

    this.angle_rad = Math.atan(diffy / diffx);
    this.angle_deg = this.rad2deg(this.angle_rad);

    if (diffx < 0) {
      // going left from quadrant 1 or 2
      this.angle_deg = this.angle_deg + 180;
    }

    if (this.ang_deg < 0) {
      this.ang_deg = 360 + this.ang_deg;
    }

    this.angle_rad = this.deg2rad(this.angle_deg);
  },
  random: function (min, max, plusminus) {
    var result = Math.round(min - 0.5 + (Math.random() * (max - min + 1)));
    if (plusminus) return Math.random() > 0.5 ? result : -result;
    return result;
  },

  next_small_turn: function () {
    this.small_turn_counter = Math.round(Math.random() * 10);
  },
  next_large_turn: function () {
    this.large_turn_counter = Math.round(Math.random() * 40);
  },
  next_stationary: function () {
    this.toggle_stationary_counter = this.random(50, 300);
  },

  bug_near_window_edge: function () {
    this.near_edge = 0;
    if (this.bug.top < this.options.edge_resistance)
      this.near_edge |= this.NEAR_TOP_EDGE;
    else if (this.bug.top > document.documentElement.clientHeight - this.options.edge_resistance)
      this.near_edge |= this.NEAR_BOTTOM_EDGE;
    if (this.bug.left < this.options.edge_resistance)
      this.near_edge |= this.NEAR_LEFT_EDGE;
    else if (this.bug.left > document.documentElement.clientWidth - this.options.edge_resistance)
      this.near_edge |= this.NEAR_RIGHT_EDGE;
    return this.near_edge;
  },

  getPos: function () {
    if (this.inserted && this.bug && this.bug.style) {
      return {
        'top': parseInt(this.bug.style.top, 10),
        'left': parseInt(this.bug.style.left, 10)
      };
    }
    return null;
  }

};

var SpawnBug = function () {
  var newBug = {}, prop;
  for (prop in Bug) {
    if (Bug.hasOwnProperty(prop)) {
      newBug[prop] = Bug[prop];
    }
  }
  return newBug;
};

// debated about which pattern to use to instantiate each bug...
// see http://jsperf.com/obj-vs-prototype-vs-other



/**
 * Helper methods:
 **/

var mergeOptions = function (obj1, obj2, clone) {
  if(typeof(clone) == 'undefined') { clone = true; }
  var newobj = (clone) ? cloneOf(obj1) : obj1;
  for (var key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      newobj[key] = obj2[key];
    }
  }
  return newobj;
};

var cloneOf = function(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj) {
      if (obj.hasOwnProperty(key)) {
        temp[key] = cloneOf(obj[key]);
      }
    }
    return temp;
}

/* Request animation frame polyfill */
/* http://paulirish.com/2011/requestanimationframe-for-smart-animating/ */
window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame || function ( /* function */ callback, /* DOMElement */ element) {
    window.setTimeout(callback, 1000 / 60);
  };
})();
