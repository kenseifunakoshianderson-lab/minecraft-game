import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js";

export class Player{
  constructor(camera, world){
    this.camera = camera;
    this.world = world;

    this.position = new THREE.Vector3(0,20,0);
    this.vel = new THREE.Vector3(0,0,0);
    this.onGround = false;

    this.GRAVITY = -0.08;
    this.JUMP = 0.42;
    this.FRICTION = 0.6;

    this.walkSpeed = 259/60;
    this.runSpeed = 336.72/60;

    this.yaw=0; this.pitch=0;
    this.keys={};

    this.inventory = new Array(36).fill(null);
    this.selectedSlot = 0;
    this.inventoryOpen = false;

    this.hotbarEl = document.getElementById("hotbar");
    this.inventoryEl = document.getElementById("inventory");
    this.updateHotbar();
    this.updateInventory();

    document.addEventListener("keydown", e=>{
      this.keys[e.code]=true;
      if(e.code.startsWith("Digit")){
        let n=parseInt(e.code.slice(5));
        if(n>=1 && n<=9) this.selectedSlot=n-1;
        this.updateHotbar();
      }
      if(e.code==="KeyE"){
        this.inventoryOpen = !this.inventoryOpen;
        this.inventoryEl.style.display = this.inventoryOpen?"grid":"none";
      }
    });
    document.addEventListener("keyup", e=>this.keys[e.code]=false);

    document.body.addEventListener("click", ()=>document.body.requestPointerLock());

    document.addEventListener("mousemove", e=>{
      if(document.pointerLockElement!==document.body) return;
      this.yaw -= e.movementX*0.002;
      this.pitch -= e.movementY*0.002;
      this.pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.pitch));
    });
  }

  updateHotbar(){
    const slots = this.hotbarEl.querySelectorAll(".slot");
    slots.forEach((s,i)=> s.classList.toggle("selected", i===this.selectedSlot));
  }

  updateInventory(){
    this.inventoryEl.innerHTML="";
    for(let i=0;i<36;i++){
      const div = document.createElement("div");
      div.className="slot";
      if(i<9 && i===this.selectedSlot) div.classList.add("selected");
      this.inventoryEl.appendChild(div);
    }
  }

  update(){
    let speed = this.keys["ControlLeft"]?this.runSpeed:this.walkSpeed;
    const forward = new THREE.Vector3(Math.sin(this.yaw),0,Math.cos(this.yaw));
    const right = new THREE.Vector3(forward.z,0,-forward.x);

    if(this.keys["KeyW"]) this.position.add(forward.clone().multiplyScalar(-speed*0.016));
    if(this.keys["KeyS"]) this.position.add(forward.clone().multiplyScalar(speed*0.016));
    if(this.keys["KeyA"]) this.position.add(right.clone().multiplyScalar(-speed*0.016));
    if(this.keys["KeyD"]) this.position.add(right.clone().multiplyScalar(speed*0.016));

    this.vel.y += this.GRAVITY;
    this.vel.x *= this.FRICTION;
    this.vel.z *= this.FRICTION;
    this.position.add(this.vel);

    const playerHeight=1.8;
    const feet = this.position.clone();
    const head = this.position.clone(); head.y += playerHeight;

    // 上方向衝突
    if(this.vel.y>0 && this.world.hasBlockAt(this.position.x, Math.ceil(head.y), this.position.z)){
      this.vel.y=0;
      this.position.y=Math.floor(head.y)-playerHeight;
    }

    // 下方向衝突
    let ground = this.world.getGround(this.position.x,this.position.z);
    if(this.position.y<=ground){
      this.position.y=ground;
      this.vel.y=0;
      this.onGround=true;
    } else this.onGround=false;

    if(this.keys["Space"] && this.onGround) this.vel.y=this.JUMP;

    this.camera.position.set(
      this.position.x,
      this.position.y+1.6,
      this.position.z
    );
    this.camera.rotation.order="YXZ";
    this.camera.rotation.y=this.yaw;
    this.camera.rotation.x=this.pitch;
  }
}
