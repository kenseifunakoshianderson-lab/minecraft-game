import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"
import {UV} from "./blocks.js"

const atlas = new THREE.TextureLoader().load("../textures/atlas.png")
atlas.magFilter = THREE.NearestFilter
atlas.minFilter = THREE.NearestFilter

function getUV(type,face){

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

function block(x,y,z){
return blocks.get(x+","+y+","+z)||0
}

const dims=[16,32,16]

const mask=[]

for(let d=0; d<3; d++){

const u=(d+1)%3
const v=(d+2)%3

const x=[0,0,0]
const q=[0,0,0]
q[d]=1

for(x[d]=-1; x[d]<dims[d]; ){

let n=0

for(x[v]=0; x[v]<dims[v]; x[v]++){
for(x[u]=0; x[u]<dims[u]; x[u]++){

let a=0
let b=0

if(x[d]>=0)
a=block(x[0],x[1],x[2])

if(x[d]<dims[d]-1)
b=block(x[0]+q[0],x[1]+q[1],x[2]+q[2])

if((a>0)!=(b>0))
mask[n++]=(a>0)?a:-b
else
mask[n++]=0

}
}

x[d]++
n=0

for(let j=0; j<dims[v]; j++){
for(let i=0; i<dims[u]; ){

const c=mask[n]

if(c){

let w
for(w=1; i+w<dims[u] && mask[n+w]==c; w++){}

let h
let done=false

for(h=1; j+h<dims[v]; h++){

for(let k=0;k<w;k++){
if(mask[n+k+h*dims[u]]!=c){
done=true
break
}
}

if(done) break

}

x[u]=i
x[v]=j

const du=[0,0,0]
const dv=[0,0,0]

du[u]=w
dv[v]=h

const type=Math.abs(c)

let face="side"
if(d==1 && c>0) face="top"
if(d==1 && c<0) face="bottom"

const [u0,u1,v0,v1]=getUV(type,face)

const p=[x[0],x[1],x[2]]

const v1p=[p[0],p[1],p[2]]
const v2p=[p[0]+du[0],p[1]+du[1],p[2]+du[2]]
const v3p=[p[0]+du[0]+dv[0],p[1]+du[1]+dv[1],p[2]+du[2]+dv[2]]
const v4p=[p[0]+dv[0],p[1]+dv[1],p[2]+dv[2]]

verts.push(...v1p,...v2p,...v3p,...v1p,...v3p,...v4p)

uvs.push(
u0,v0,
u1,v0,
u1,v1,
u0,v0,
u1,v1,
u0,v1
)

for(let l=0;l<h;l++){
for(let k=0;k<w;k++){
mask[n+k+l*dims[u]]=0
}
}

i+=w
n+=w

}else{

i++
n++

}

}
}

}

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
