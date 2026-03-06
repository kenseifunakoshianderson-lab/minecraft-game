import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"

export class Chunk{

constructor(cx,cz,scene){

this.cx=cx
this.cz=cz

this.blocks=new Map()

this.scene=scene

this.generate()

}

noise(x,z){

return Math.sin(x*0.05)*5+Math.cos(z*0.05)*5

}

key(x,y,z){

return x+","+y+","+z

}

generate(){

for(let x=0;x<16;x++)
for(let z=0;z<16;z++){

let wx=this.cx*16+x
let wz=this.cz*16+z

let h=Math.floor(this.noise(wx,wz)+20)

for(let y=0;y<=h;y++){

this.blocks.set(this.key(wx,y,wz),1)

const geo=new THREE.BoxGeometry(1,1,1)

const mat=new THREE.MeshLambertMaterial({color:0x55aa55})

const mesh=new THREE.Mesh(geo,mat)

mesh.position.set(wx,y,wz)

this.scene.add(mesh)

}

}

}

hasBlock(x,y,z){

return this.blocks.has(this.key(x,y,z))

}

}
