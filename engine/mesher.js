import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"
import {BLOCK_COLORS} from "./blocks.js"

export function buildMesh(blocks){

const vertices=[]
const colors=[]

let minX=Infinity,minY=Infinity,minZ=Infinity
let maxX=-Infinity,maxY=-Infinity,maxZ=-Infinity

for(let key of blocks.keys()){

let [x,y,z]=key.split(",").map(Number)

if(x<minX)minX=x
if(y<minY)minY=y
if(z<minZ)minZ=z

if(x>maxX)maxX=x
if(y>maxY)maxY=y
if(z>maxZ)maxZ=z

}

function get(x,y,z){

return blocks.get(x+","+y+","+z)||0

}

for(let key of blocks.keys()){

let [x,y,z]=key.split(",").map(Number)

let type=blocks.get(key)

let color=new THREE.Color(BLOCK_COLORS[type]||0xffffff)

addCube(x,y,z,color)

}

function addCube(x,y,z,color){

const cube=[
[0,0,0],[1,0,0],[1,1,0],[0,1,0],
[0,0,1],[1,0,1],[1,1,1],[0,1,1]
]

const faces=[
[0,1,2,3],
[5,4,7,6],
[4,0,3,7],
[1,5,6,2],
[3,2,6,7],
[4,5,1,0]
]

for(let f of faces){

const v1=cube[f[0]]
const v2=cube[f[1]]
const v3=cube[f[2]]
const v4=cube[f[3]]

push(v1,v2,v3)
push(v1,v3,v4)

}

function push(a,b,c){

vertices.push(
x+a[0],y+a[1],z+a[2],
x+b[0],y+b[1],z+b[2],
x+c[0],y+c[1],z+c[2]
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
