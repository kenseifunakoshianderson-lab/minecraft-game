import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"
import {UV} from "./blocks.js"

const atlas = new THREE.TextureLoader().load("../textures/atlas.png")
atlas.magFilter = THREE.NearestFilter
atlas.minFilter = THREE.NearestFilter

export function buildMesh(blocks){

const verts=[]
const uvs=[]

function has(x,y,z){
return blocks.get(x+","+y+","+z)>0
}

function faceUV(type,face){

let tile

if(face=="top") tile=UV[type].top
else if(face=="bottom") tile=UV[type].bottom
else tile=UV[type].side

const tx=tile[0]
const ty=tile[1]

const u0=tx/16
const u1=(tx+1)/16
const v0=1-(ty+1)/16
const v1=1-ty/16

return [u0,u1,v0,v1]
}

function addFace(a,b,c,d,type,face){

const [u0,u1,v0,v1]=faceUV(type,face)

verts.push(...a,...b,...c,...a,...c,...d)

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

if(!has(x,y,z+1))
addFace([x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1],type,"side")

if(!has(x,y,z-1))
addFace([x+1,y,z],[x,y,z],[x,y+1,z],[x+1,y+1,z],type,"side")

if(!has(x-1,y,z))
addFace([x,y,z],[x,y,z+1],[x,y+1,z+1],[x,y+1,z],type,"side")

if(!has(x+1,y,z))
addFace([x+1,y,z+1],[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],type,"side")

if(!has(x,y+1,z))
addFace([x,y+1,z],[x,y+1,z+1],[x+1,y+1,z+1],[x+1,y+1,z],type,"top")

if(!has(x,y-1,z))
addFace([x,y,z],[x+1,y,z],[x+1,y,z+1],[x,y,z+1],type,"bottom")

}

const g=new THREE.BufferGeometry()

g.setAttribute("position",new THREE.Float32BufferAttribute(verts,3))
g.setAttribute("uv",new THREE.Float32BufferAttribute(uvs,2))

g.computeVertexNormals()

return new THREE.Mesh(
g,
new THREE.MeshLambertMaterial({map:atlas})
)

}
