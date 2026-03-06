import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"

export class Player{
  constructor(camera,world){
    this.camera=camera
    this.world=world

    this.position=new THREE.Vector3(0,40,0)
    this.vel=new THREE.Vector3(0,0,0)
    this.onGround=false

    // Minecraft準拠
    this.GRAVITY=-0.08
    this.JUMP=0.42
    this.FRICTION=0.6

    this.walkSpeed=259/60
    this.runSpeed=336.72/60

    this.yaw=0
    this.pitch=0
    this.keys={}

    // インベントリ・ホットバー
    this.inventory=new Array(9).fill(null)
    this.selectedSlot=0
    this.inventoryOpen=false

    document.addEventListener("keydown",e=>{
      this.keys[e.code]=true
      // 1-9ホットバー選択
      if(e.code.startsWith("Digit")){
        let n=parseInt(e.code.slice(5))
        if(n>=1 && n<=9) this.selectedSlot=n-1
        this.updateHotbar()
      }
      // Eでインベントリ開閉
      if(e.code==="KeyE"){
        this.inventoryOpen=!this.inventoryOpen
        document.getElementById("hotbar").style.display=this.inventoryOpen?"flex":"none"
      }
    })
    document.addEventListener("keyup",e=>this.keys[e.code]=false)

    document.body.addEventListener("click",()=>document.body.requestPointerLock())

    document.addEventListener("mousemove",e=>{
      if(document.pointerLockElement!==document.body) return
      this.yaw-=e.movementX*0.002
      this.pitch-=e.movementY*0.002
      this.pitch=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.pitch))
    })
  }

  updateHotbar(){
    const slots=document.querySelectorAll("#hotbar .slot")
    slots.forEach((slot,i)=>{
      slot.classList.toggle("selected",i===this.selectedSlot)
    })
  }

  update(){
    let speed=this.keys["ControlLeft"]?this.runSpeed:this.walkSpeed
    let forward=new THREE.Vector3(Math.sin(this.yaw),0,Math.cos(this.yaw))
    let right=new THREE.Vector3(forward.z,0,-forward.x)

    if(this.keys["KeyW"]) this.position.add(forward.clone().multiplyScalar(-speed*0.016))
    if(this.keys["KeyS"]) this.position.add(forward.clone().multiplyScalar(speed*0.016))
    if(this.keys["KeyA"]) this.position.add(right.clone().multiplyScalar(-speed*0.016))
    if(this.keys["KeyD"]) this.position.add(right.clone().multiplyScalar(speed*0.016))

    // 重力
    this.vel.y+=this.GRAVITY
    this.vel.x*=this.FRICTION
    this.vel.z*=this.FRICTION
    this.position.y+=this.vel.y

    // 衝突判定
    let ground=this.world.getGround(this.position.x,this.position.z)
    if(this.position.y<=ground){
      this.position.y=ground
      this.vel.y=0
      this.onGround=true
    } else this.onGround=false

    // ジャンプ
    if(this.keys["Space"] && this.onGround){
      this.vel.y=this.JUMP
    }

    this.camera.position.set(this.position.x,this.position.y+1.6,this.position.z)
    this.camera.rotation.order="YXZ"
    this.camera.rotation.y=this.yaw
    this.camera.rotation.x=this.pitch
  }
}
