import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"

const scene=new THREE.Scene()
scene.background=new THREE.Color(0x87CEEB)

const camera=new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
)

const renderer=new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)

const light=new THREE.DirectionalLight(0xffffff,1)
light.position.set(50,100,50)
scene.add(light)

const geometry=new THREE.BoxGeometry()
const material=new THREE.MeshLambertMaterial({color:0x55aa55})

for(let x=-10;x<10;x++)
for(let z=-10;z<10;z++){

const cube=new THREE.Mesh(geometry,material)
cube.position.set(x,0,z)

scene.add(cube)

}

camera.position.set(0,10,15)
camera.lookAt(0,0,0)

function animate(){

requestAnimationFrame(animate)

renderer.render(scene,camera)

}

animate()
