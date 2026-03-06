import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"
import {BLOCK_COLORS} from "./blocks.js"

export function buildMesh(blocks){

const vertices=[]
const colors=[]

function has(x,y,z){
return blocks.has(x+","+y+","+z)
}

for(let key of blocks.keys()){

let [x,y,z]=key.split(",").map(Number)

let type=blocks.get(key)

let color=new THREE.Color(BLOCK_COLORS[type]||0xffffff)

addFace(x,y,z,0,0,-1)
addFace(x,y,z,0,0,1)
addFace(x,y,z,-1,0,0)
addFace(x,y,z,1,0,0)
addFace(x,y,z,0,-1,0)
addFace(x,y,z,0,1,0)

function addFace(x,y,z,dx,dy,dz){

if(has(x+dx,y+dy,z+dz)) return

const p=[
[x,y,z],
[x+1,y,z],
[x+1,y+1,z],
[x,y+1,z]
]

push(p[0],p[1],p[2])
push(p[0],p[2],p[3])

}

function push(a,b,c){

vertices.push(
a[0],a[1],a[2],
b[0],b[1],b[2],
c[0],c[1],c[2]
)

for(let i=0;i<3;i++)
colors.push(color.r,color.g,color.b)

}

}

const geometry=new THREE.BufferGeometry()

geometry.setAttribute(
"position",
new THREE.Float32BufferAttribute(vertices,3)
)

geometry.setAttribute(
"color",
new THREE.Float32BufferAttribute(colors,3)
)

geometry.computeVertexNormals()

const material=new THREE.MeshLambertMaterial({vertexColors:true})

return new THREE.Mesh(geometry,material)

}
