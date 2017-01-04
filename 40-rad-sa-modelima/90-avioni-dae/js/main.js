/** CONFIG **/

const modeli = {
	pfalzDIII: {
		naziv: "Sopwith Camel",
		opis: "The Pfalz D.III was a fighter aircraft used by the Luftstreitkräfte during the First World War.",
		putanja: "pfalz-D-III",
		izvor: "https://3dwarehouse.sketchup.com/model.html?id=414cf4ec44f4573346e211e2fce8d948"
	},
	sopwithCamel: {
		naziv: "Sopwith Camel",
		opis: "The Sopwith Camel was a British First World War single-seat biplane fighter aircraft introduced on the Western Front in 1917.",
		putanja: "sopwith-camel",
		izvor: "https://3dwarehouse.sketchup.com/model.html?id=u1dad0b39-1b3b-44a2-8421-c41119b8fcb5"
	},
	moraneSaulnierL: {
		naziv: "Morane-Saulnier L",
		opis: "The Morane-Saulnier L, also known as the Morane-Saulnier Type L was a French parasol wing one or two-seat scout aeroplane of the First World War.",
		putanja: "morane-saulnier-L",
		izvor: "https://3dwarehouse.sketchup.com/model.html?id=9bb142d767f1b6bbab27aa9295303236"
	},
	se5: {
		naziv: "Royal Aircraft Factory S.E.5",
		opis: "The Royal Aircraft Factory S.E.5 was a British biplane fighter aircraft of the First World War.",
		putanja: "s-e-5a",
		izvor: "https://3dwarehouse.sketchup.com/model.html?id=abb427042f27c884ab27aa9295303236"
	},
	a7v: {
		naziv: "A7V",
		opis: "The A7V was a tank introduced by Germany in 1918, during World War I.",
		putanja: "a7v",
		izvor: "https://3dwarehouse.sketchup.com/model.html?id=3bebb1403e9a06ae8697536215effec1"
	},
	ehrhardtEV4: {
		naziv: "E-V/4 Panzerkraftwagen Ehrhardt",
		opis: "The E-V/4 Panzerkraftwagen Ehrhardt was one of the first examples of a type of high and flatsided armoured car design that the Germans used almost until the start of the Second World War for internal policing duties. The series built in 1919 participated in the German revolution.",
		putanja: "ehrhardt-e-v4",
		izvor: "https://3dwarehouse.sketchup.com/model.html?id=baf0b285162efb4f890824251c0961f3"
	}
	
}

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
let currentId

/** INIT **/

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
renderer.setSize(WIDTH, HEIGHT)
renderer.setClearColor(0x333F47, 1)
document.body.appendChild(renderer.domElement)

const camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000)
camera.position.set(-6, 2, 9)
scene.add(camera)

var light = new THREE.PointLight(0xffffff)
light.position.set(-100, 200, 100)
scene.add(light)

const controls = new THREE.OrbitControls(camera, renderer.domElement)

/** FUNCTIONS **/

const loadModel = function (src) {
  let loader = new THREE.ColladaLoader()
  loader.options.convertUpAxis = true
  loader.load(src, collada => {
    scene.remove(scene.getObjectById(currentId))
    const model = collada.scene
    scene.add(model)
    currentId = model.id
  })
}

const animate = function () {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  controls.update()
}

/** EVENTS **/

window.addEventListener('resize', () => {
  const WIDTH = window.innerWidth
  const HEIGHT = window.innerHeight
  renderer.setSize(WIDTH, HEIGHT)
  camera.aspect = WIDTH / HEIGHT
  camera.updateProjectionMatrix()
})

document.querySelector('#izaberi-avion').addEventListener('change', function (e) {
  loadModel(this.value)
})

/** LOGIC **/

loadModel(document.querySelector('#izaberi-avion').value)
animate()

const html = `

`