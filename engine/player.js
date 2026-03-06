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

this.keys={}

document.addEventListener("keydown",e=>this.keys[e.code]=true)
document.addEventListener("keyup",e=>this.keys[e.code]=false)

}

update(){

let speed=this.keys["ControlLeft"]?this.RUN:this.WALK

if(this.keys["KeyW"])this.position.z-=speed*0.016
if(this.keys["KeyS"])this.position.z+=speed*0.016
if(this.keys["KeyA"])this.position.x-=speed*0.016
if(this.keys["KeyD"])this.position.x+=speed*0.016

this.velY-=this.GRAVITY

this.position.y+=this.velY

let ground=this.world.getGround(this.position.x,this.position.z)

if(this.position.y<=ground){

this.position.y=ground
this.velY=0
this.onGround=true

}

if(this.keys["Space"]&&this.onGround){

this.velY=Math.sqrt(2*this.GRAVITY*this.JUMP_HEIGHT)

}

this.camera.position.set(
this.position.x,
this.position.y+1.6,
this.position.z
)

}

}
