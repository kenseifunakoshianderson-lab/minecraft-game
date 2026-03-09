import {buildMesh} from "./mesher.js"
import {BLOCKS} from "./blocks.js"

export class World{

constructor(scene){

this.scene = scene
this.chunks = new Map()

this.CHUNK = 16
this.HEIGHT = 32

}

key(x,z){
return x+","+z
}

generateChunk(cx,cz){

const blocks = new Map()

for(let x=0;x<this.CHUNK;x++)
for(let z=0;z<this.CHUNK;z++){

const wx = cx*this.CHUNK+x
const wz = cz*this.CHUNK+z

const height = Math.floor(
10 +
Math.sin(wx*0.05)*3 +
Math.sin(wz*0.05)*3
)

for(let y=0;y<this.HEIGHT;y++){

let type = BLOCKS.AIR

if(y<height){

if(y===height-1) type = BLOCKS.GRASS
else if(y>height-4) type = BLOCKS.DIRT
else type = BLOCKS.STONE

}

blocks.set(wx+","+y+","+wz,type)

}

}

const mesh = buildMesh(blocks)

this.scene.add(mesh)

this.chunks.set(
this.key(cx,cz),
{
blocks:blocks,
mesh:mesh
}
)

}

update(playerPos){

const cx = Math.floor(playerPos.x/this.CHUNK)
const cz = Math.floor(playerPos.z/this.CHUNK)

const render = 3

for(let x=-render;x<=render;x++)
for(let z=-render;z<=render;z++){

const k = this.key(cx+x,cz+z)

if(!this.chunks.has(k))
this.generateChunk(cx+x,cz+z)

}

for(let k of this.chunks.keys()){

const [x,z] = k.split(",").map(Number)

if(Math.abs(x-cx)>render || Math.abs(z-cz)>render){

const chunk = this.chunks.get(k)

this.scene.remove(chunk.mesh)

this.chunks.delete(k)

}

}

}

hasBlockAt(x,y,z){

x=Math.floor(x)
y=Math.floor(y)
z=Math.floor(z)

for(let chunk of this.chunks.values()){

if(chunk.blocks.get(x+","+y+","+z)>0)
return true

}

return false

}

getGround(x,z){

x=Math.floor(x)
z=Math.floor(z)

for(let y=this.HEIGHT;y>=0;y--){

if(this.hasBlockAt(x,y,z))
return y+1

}

return 0

}

}
