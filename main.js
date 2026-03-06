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

scene.add(new THREE.AmbientLight(0xffffff,0.7))

const sun=new THREE.DirectionalLight(0xffffff,1)
sun.position.set(100,200,100)
scene.add(sun)

const loader=new THREE.TextureLoader()
const atlas=loader.load("./atlas.png")

atlas.magFilter=THREE.NearestFilter
atlas.minFilter=THREE.NearestFilter

function block(x,y,z){

const geo=new THREE.BoxGeometry(1,1,1)

const mat=new THREE.MeshLambertMaterial({map:atlas})

const mesh=new THREE.Mesh(geo,mat)

mesh.position.set(x,y,z)

scene.add(mesh)

}

function generate(){

for(let x=-20;x<20;x++){

for(let z=-20;z<20;z++){

let h=Math.floor(
10+Math.sin(x*0.4)+Math.sin(z*0.4)
)

for(let y=0;y<h;y++){

block(x,y,z)

}

}

}

}

generate()

let yvel=0
const gravity=-0.04
const jump=0.28

const keys={}

document.addEventListener("keydown",e=>{

keys[e.code]=true

if(e.code=="KeyE"){

const inv=document.getElementById("inventory")

inv.style.display=
inv.style.display=="none"?"grid":"none"

}

})

document.addEventListener("keyup",e=>keys[e.code]=false)

document.body.onclick=()=>document.body.requestPointerLock()

let yaw=0
let pitch=0

document.addEventListener("mousemove",e=>{

if(document.pointerLockElement!==document.body)return

yaw-=e.movementX*0.002
pitch-=e.movementY*0.002

})

camera.position.set(0,15,0)

function animate(){

requestAnimationFrame(animate)

const speed=0.15

const forward=new THREE.Vector3(
Math.sin(yaw),
0,
Math.cos(yaw)
)

const right=new THREE.Vector3(
forward.z,
0,
-forward.x
)

if(keys["KeyW"])
camera.position.add(forward.clone().multiplyScalar(-speed))

if(keys["KeyS"])
camera.position.add(forward.clone().multiplyScalar(speed))

if(keys["KeyA"])
camera.position.add(right.clone().multiplyScalar(-speed))

if(keys["KeyD"])
camera.position.add(right.clone().multiplyScalar(speed))

yvel+=gravity

camera.position.y+=yvel

if(camera.position.y<10){

camera.position.y=10
yvel=0

if(keys["Space"]) yvel=jump

}

camera.rotation.order="YXZ"
camera.rotation.y=yaw
camera.rotation.x=pitch

renderer.render(scene,camera)

}

animate()
