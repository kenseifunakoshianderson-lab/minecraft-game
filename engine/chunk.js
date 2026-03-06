import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"

import {buildMesh} from "./mesher.js"
import {BLOCKS} from "./blocks.js"

export class Chunk{

constructor(cx,cz,scene){

this.cx=cx
this.cz=cz

this.scene=scene

this.blocks=new Map()

this.mesh=null

this.SIZE=16

this.generate()

}



noise(x,z){

return (
Math.sin(x*0.05)*5+
Math.cos(z*0.05)*5+
Math.sin((x+z)*0.02)*8
)

}



key(x,y,z){

return x+","+y+","+z

}



setBlock(x,y,z,type){

this.blocks.set(this.key(x,y,z),type)

}



hasBlock(x,y,z){

return this.blocks.has(this.key(x,y,z))

}



generate(){

for(let x=0;x<this.SIZE;x++)
for(let z=0;z<this.SIZE;z++){

let wx=this.cx*this.SIZE+x
let wz=this.cz*this.SIZE+z

let height=Math.floor(this.noise(wx,wz)+20)



for(let y=0;y<=height;y++){

let type

if(y==height) type=BLOCKS.GRASS
else if(y>height-3) type=BLOCKS.DIRT
else type=BLOCKS.STONE

this.setBlock(wx,y,wz,type)

}

}



this.build()

}



build(){

if(this.mesh){

this.scene.remove(this.mesh)

}



this.mesh=buildMesh(this.blocks)

this.scene.add(this.mesh)

}



removeBlock(x,y,z){

this.blocks.delete(this.key(x,y,z))

this.build()

}



addBlock(x,y,z,type){

this.blocks.set(this.key(x,y,z),type)

this.build()

}

}
