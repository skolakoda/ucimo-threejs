![threejs](screen.png)

# Učimo Three.js

Učimo Three.js, biblioteku za 3D grafiku na webu. Crtamo geometriju, pravimo 3D scene, učitavamo modele i teksture.

Repozitorij: [github.com/skolakoda/ucimo-threejs](https://github.com/skolakoda/ucimo-threejs)

Vidi još: [github.com/skolakoda/pravimo-3d-sajtove](https://github.com/skolakoda/pravimo-3d-sajtove)

## Pokretanje

Neke html fajlove je moguće direktno otvoriti. Za učitavanje modela i tekstura je potreban lokalni server:

```
npm i
npm start
```

## Pojmovi

* [Extrusion](https://en.wikipedia.org/wiki/Extrusion): Create an array of 2D points, make a 2D shape, and create an extrusion (a 3D shape whose cross-sections are the given 2D shape).
* [SkyBox](https://en.wikipedia.org/wiki/Skybox_(video_games)): Using textures to create a "SkyBox": backgrounds images projected onto a cube surrounding the rendering region, which creates the illusion of distant 3D surroundings.
* [Sprites](https://en.wikipedia.org/wiki/Sprite_(computer_graphics)): Sprites are images (not attached to geometries/surfaces) displayed in a scene, always orthogonal to the camera. They can either appear in the 3D scene (useful as part of a particle effect) or rendered using screen coordinates (useful as part of a graphical user interface (GUI) or a heads-up display (HUD)).
* [Metaballs](https://en.wikipedia.org/wiki/Metaballs): A effect where spheres move around and their surfaces merge and split; the surfaces are calculated by implicit functions and drawn using the "Marching Cubes" algorithm.
* [Constructive solid geometry](https://en.wikipedia.org/wiki/Constructive_solid_geometry): Create a new mesh from the union, intersection, or subtraction of two meshes. Uses the [ThreeCSG](http://github.com/chandlerprall/ThreeCSG/) library.

## Primeri

* [Ptice](https://threejs.org/examples/webgl_gpgpu_birds.html)
* [Skeletal Animation Blending](https://threejs.org/examples/#webgl_animation_skinning_blending)
* [morph targets - horse](https://github.com/mrdoob/three.js/blob/master/examples/webgl_morphtargets_horse.html)
- https://threejs.org/examples/#webgl_geometry_terrain
- https://threejs.org/examples/#webgl_terrain_dynamic

## Izvori

Primeri su preuzeti iz:
* 3D Game Programming for Kids (Chris Strom)
* [Interactive 3D Graphics](https://in.udacity.com/course/interactive-3d-graphics--cs291/) (Eric Haines)
* [Three.js tutorials by example](http://stemkoski.github.io/Three.js/) (Lee Stemkoski)
* [WebGL and Three.js Fundamentals](https://github.com/alexmackey/threeJsBasicExamples) (Alex Mackey)
* [Examples created by Yomotsu using THREE.js](http://yomotsu.github.io/threejs-examples/) (Akihiro Oyamada)
* [Learning Threejs](https://github.com/josdirksen/learning-threejs) (Jos Dirksen)
* [Essential Three.js](https://github.com/josdirksen/essential-threejs) (Jos Dirksen)
* [Three.js Cookbook](https://github.com/josdirksen/threejs-cookbook) (Jos Dirksen)
* [Realistic Rain](https://github.com/solusipse/threejs-examples)

---
### Škola koda, učimo narod programiranju!
