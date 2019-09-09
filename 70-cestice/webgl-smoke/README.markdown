# WebGL Smoke
 _A Pen created at CodePen.io. Original URL: [https://codepen.io/teolitto/pen/KwOVvL](https://codepen.io/teolitto/pen/KwOVvL).

 Smoke particle system using an old vfx trick of scaled and rotating single sprite texture in WebGL, plus some additive blending for extra sass :)

Color of smoke may be changed by modifying "color" attribute for smokeMaterial on line 45.

Performance improvement can be had by reducing number of particles, and/or removing "opacity" setting from smokeTex (png will supply opacity, opacity setting simply allows us to "tone it back" or make it slightly more transparent)

Low hanging fruit for visual improvement is randomly setting individual particles to have opposite direction rotation (helps with random look, and avoids edge cases where spinning particles are noticeable)

Coolness improvement: wire up angular with an input box to change the text to user input. Tough to execute on canvas with good, non-aliased results though. Best bet might be wiring up a spritesheet with every letter of the alphabet, then generating planes and painting correct sprite position tex on them...