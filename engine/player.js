import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"

export class Player{

constructor(camera,world){

this.camera=camera
this.world=world

this.pos=new THREE.Vector3(0,20,0)
this.vel=new THREE.Vector3()

this.GRAVITY=-0.04
this.JUMP=0.18

this.onGround=false

this.yaw=0
this.pitch=0

this.keys={}

document.addEventListener("keydown",e=>this.keys[e.code]=true)
document.addEventListener("keyup",e=>this.keys[e.code]=false)

document.body.onclick=()=>document.body.requestPointerLock()

document.addEventListener("mousemove",e=>{

if(document.pointerLockElement!==document.body) return

this.yaw-=e.movementX*0.002
this.pitch-=e.movementY*0.002

})

}

update(){

const speed=0.15

const forward=new THREE.Vector3(
Math.sin(this.yaw),
0,
Math.cos(this.yaw)
)

const right=new THREE.Vector3(
forward.z,
0,
-forward.x
)

if(this.keys["KeyW"])
this.pos.add(forward.clone().multiplyScalar(-speed))

if(this.keys["KeyS"])
this.pos.add(forward.clone().multiplyScalar(speed))

if(this.keys["KeyA"])
this.pos.add(right.clone().multiplyScalar(-speed))

if(this.keys["KeyD"])
this.pos.add(right.clone().multiplyScalar(speed))

this.vel.y+=this.GRAVITY
this.pos.add(this.vel)

const ground=this.world.getGround(this.pos.x,this.pos.z)

if(this.pos.y<ground){

this.pos.y=ground
this.vel.y=0
this.onGround=true

}else{

this.onGround=false

}

if(this.keys["Space"]&&this.onGround){

this.vel.y=this.JUMP

}

this.camera.position.set(
this.pos.x,
this.pos.y+1.6,
this.pos.z
)

this.camera.rotation.order="YXZ"
this.camera.rotation.y=this.yaw
this.camera.rotation.x=this.pitch

}

}
