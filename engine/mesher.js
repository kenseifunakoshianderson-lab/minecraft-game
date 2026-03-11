import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"

const atlas = new THREE.TextureLoader().load("../textures/atlas.png")

atlas.magFilter = THREE.NearestFilter
atlas.minFilter = THREE.NearestFilter

const TILE = 1/16

function getUV(tile){

const x = tile % 16
const y = Math.floor(tile / 16)

const u0 = x * TILE
const v0 = 1 - (y+1)*TILE
const u1 = (x+1)*TILE
const v1 = 1 - y*TILE

return [u0,v0,u1,v1]

}

export function buildMesh(blocks){

const verts=[]
const uvs=[]

function has(x,y,z){
return blocks.get(x+","+y+","+z)>0
}

function face(a,b,c,d,tile){

verts.push(...a,...b,...c,...a,...c,...d)

const [u0,v0,u1,v1] = getUV(tile)

uvs.push(
u0,v0,
u1,v0,
u1,v1,

u0,v0,
u1,v1,
u0,v1
)

}

for(let key of blocks.keys()){

let [x,y,z]=key.split(",").map(Number)
let type=blocks.get(key)

if(type===0) continue

let top,side,bottom

// grass
if(type===1){
top=0
side=3
bottom=1
}

// dirt
if(type===2){
top=10
side=10
bottom=10
}

// stone
if(type===3){
top=2
side=2
bottom=2
}

if(!has(x,y,z+1))
face([x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1],side)

if(!has(x,y,z-1))
face([x+1,y,z],[x,y,z],[x,y+1,z],[x+1,y+1,z],side)

if(!has(x-1,y,z))
face([x,y,z],[x,y,z+1],[x,y+1,z+1],[x,y+1,z],side)

if(!has(x+1,y,z))
face([x+1,y,z+1],[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],side)

if(!has(x,y+1,z))
face([x,y+1,z],[x,y+1,z+1],[x+1,y+1,z+1],[x+1,y+1,z],top)

if(!has(x,y-1,z))
face([x,y,z],[x+1,y,z],[x+1,y,z+1],[x,y,z+1],bottom)

}

const g=new THREE.BufferGeometry()

g.setAttribute(
"position",
new THREE.Float32BufferAttribute(verts,3)
)

g.setAttribute(
"uv",
new THREE.Float32BufferAttribute(uvs,2)
)

g.computeVertexNormals()

return new THREE.Mesh(
g,
new THREE.MeshLambertMaterial({map:atlas})
)

}
