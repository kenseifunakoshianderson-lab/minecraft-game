update(playerPos){

const cx=Math.floor(playerPos.x/this.CHUNK)
const cz=Math.floor(playerPos.z/this.CHUNK)

const render=4

for(let x=-render;x<=render;x++)
for(let z=-render;z<=render;z++){

const k=this.key(cx+x,cz+z)

if(!this.chunks.has(k))
this.generateChunk(cx+x,cz+z)

}

for(let k of this.chunks.keys()){

const [x,z]=k.split(",").map(Number)

if(Math.abs(x-cx)>render || Math.abs(z-cz)>render){

const chunk=this.chunks.get(k)

this.scene.remove(chunk.mesh)

this.chunks.delete(k)

}

}

}
