import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"

const atlas = new THREE.TextureLoader().load("../textures/atlas.png")

atlas.magFilter = THREE.NearestFilter
atlas.minFilter = THREE.NearestFilter

export function buildMesh(blocks){

const verts=[]
const uvs=[]

function has(x,y,z){
return blocks.get(x+","+y+","+z)>0
}

for(let key of blocks.keys()){

let [x,y,z]=key.split(",").map(Number)
let type=blocks.get(key)

if(type===0) continue

function face(a,b,c,d){

verts.push(...a,...b,...c,...a,...c,...d)

uvs.push(
0,0,
1,0,
1,1,
0,0,
1,1,
0,1
)

}

if(!has(x,y,z+1))
face([x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1])

if(!has(x,y,z-1))
face([x+1,y,z],[x,y,z],[x,y+1,z],[x+1,y+1,z])

if(!has(x-1,y,z))
face([x,y,z],[x,y,z+1],[x,y+1,z+1],[x,y+1,z])

if(!has(x+1,y,z))
face([x+1,y,z+1],[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1])

if(!has(x,y+1,z))
face([x,y+1,z],[x,y+1,z+1],[x+1,y+1,z+1],[x+1,y+1,z])

if(!has(x,y-1,z))
face([x,y,z],[x+1,y,z],[x+1,y,z+1],[x,y,z+1])

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
