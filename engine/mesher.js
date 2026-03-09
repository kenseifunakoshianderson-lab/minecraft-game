import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"
import {UV} from "./blocks.js"

const atlas = new THREE.TextureLoader().load("../textures/atlas.png")
atlas.magFilter = THREE.NearestFilter
atlas.minFilter = THREE.NearestFilter

function tileUV(type,face){

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

export function buildMesh(blocks){

const verts=[]
const uvs=[]

function has(x,y,z){
return blocks.get(x+","+y+","+z)>0
}

function addQuad(x,y,z,w,h,dir,type,face){

const [u0,u1,v0,v1]=tileUV(type,face)

let a,b,c,d

if(dir=="top"){

a=[x,y,z]
b=[x+w,y,z]
c=[x+w,y,z+h]
d=[x,y,z+h]

}

if(dir=="bottom"){

a=[x,y,z]
b=[x,y,z+h]
c=[x+w,y,z+h]
d=[x+w,y,z]

}

if(dir=="north"){

a=[x,y,z]
b=[x+w,y,z]
c=[x+w,y+h,z]
d=[x,y+h,z]

}

if(dir=="south"){

a=[x,y,z]
b=[x,y+h,z]
c=[x+w,y+h,z]
d=[x+w,y,z]

}

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

const visited=new Set()

for(let key of blocks.keys()){

if(visited.has(key)) continue

let [x,y,z]=key.split(",").map(Number)
let type=blocks.get(key)

if(type===0) continue

let width=1

while(blocks.get((x+width)+","+y+","+z)==type){

visited.add((x+width)+","+y+","+z)
width++

}

addQuad(x,y+1,z,width,1,"top",type,"top")

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
