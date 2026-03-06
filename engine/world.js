import {Chunk} from "./chunk.js"

export class World{

constructor(scene){

this.scene=scene

this.chunks=new Map()

this.CHUNK=16

}

key(x,z){

return x+","+z

}

update(playerPos){

let cx=Math.floor(playerPos.x/this.CHUNK)
let cz=Math.floor(playerPos.z/this.CHUNK)

for(let x=-2;x<=2;x++)
for(let z=-2;z<=2;z++){

let k=this.key(cx+x,cz+z)

if(!this.chunks.has(k)){

let chunk=new Chunk(cx+x,cz+z,this.scene)

this.chunks.set(k,chunk)

}

}

}

getGround(x,z){

let gx=Math.floor(x)
let gz=Math.floor(z)

for(let y=256;y>-50;y--){

for(let c of this.chunks.values()){

if(c.hasBlock(gx,y,gz)) return y+1

}

}

return -100

}

}
