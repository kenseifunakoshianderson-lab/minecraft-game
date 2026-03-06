import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"

export class Player{

constructor(camera,world){

this.camera=camera
this.world=world

this.position=new THREE.Vector3(0,30,0)

this.velY=0
this.onGround=false

this.GRAVITY=0.08
this.JUMP_HEIGHT=1.2522

this.WALK=259/60
this.RUN=336.72/60

this.yaw=0
this.pitch=0

this.keys={}

document.addEventListener("keydown",e=>this.keys[e.code]=true)
document.addEventListener("keyup",e=>this.keys[e.code]=false)



/* pointer lock */

document.body.addEventListener("click",()=>{

document.body.requestPointerLock()

})



document.addEventListener("mousemove",e=>{

if(document.pointerLockElement!==document.body) return

this.yaw -= e.movementX*0.002
this.pitch -= e.movementY*0.002

this.pitch=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.pitch))

})

}



update(){

let speed=this.keys["ControlLeft"]?this.RUN:this.WALK

let forward=new THREE.Vector3(
Math.sin(this.yaw),
0,
Math.cos(this.yaw)
)

let right=new THREE.Vector3(
forward.z,
0,
-forward.x
)



if(this.keys["KeyW"])
this.position.add(forward.clone().multiplyScalar(-speed*0.016))

if(this.keys["KeyS"])
this.position.add(forward.clone().multiplyScalar(speed*0.016))

if(this.keys["KeyA"])
this.position.add(right.clone().multiplyScalar(-speed*0.016))

if(this.keys["KeyD"])
this.position.add(right.clone().multiplyScalar(speed*0.016))



/* gravity */

this.velY -= this.GRAVITY
this.position.y += this.velY



/* ground check */

let ground=this.world.getGround(this.position.x,this.position.z)

if(this.position.y<=ground){

this.position.y=ground
this.velY=0
this.onGround=true

}else{

this.onGround=false

}



/* jump */

if(this.keys["Space"] && this.onGround){

this.velY=Math.sqrt(2*this.GRAVITY*this.JUMP_HEIGHT)

}



/* camera */

this.camera.position.set(
this.position.x,
this.position.y+1.6,
this.position.z
)

this.camera.rotation.order="YXZ"

this.camera.rotation.y=this.yaw
this.camera.rotation.x=this.pitch

}

}
