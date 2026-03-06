import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"
import {BLOCK_COLORS} from "./blocks.js"

export function buildMesh(blocks){

const vertices=[]
const colors=[]

const size=16
const height=64

function get(x,y,z){

const key=x+","+y+","+z

return blocks.get(key)||0

}

const dims=[size,height,size]

const mask=[]

const x=[0,0,0]
const q=[0,0,0]

for(let d=0;d<3;d++){

const u=(d+1)%3
const v=(d+2)%3

q[0]=q[1]=q[2]=0
q[d]=1

for(x[d]=-1;x[d]<dims[d];){

let n=0

for(x[v]=0;x[v]<dims[v];x[v]++)
for(x[u]=0;x[u]<dims[u];x[u]++){

let a,b

if(x[d]>=0)
a=get(x[0],x[1],x[2])
else
a=0

if(x[d]<dims[d]-1)
b=get(x[0]+q[0],x[1]+q[1],x[2]+q[2])
else
b=0

if((!!a)==(!!b)) mask[n++]=0
else if(a) mask[n++]=a
else mask[n++]=-b

}

x[d]++

n=0

for(let j=0;j<dims[v];j++)
for(let i=0;i<dims[u];){

const c=mask[n]

if(!c){ i++; n++; continue }

let w
for(w=1;i+w<dims[u]&&mask[n+w]==c;w++){}

let h
let done=false

for(h=1;j+h<dims[v];h++){

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

const color=new THREE.Color(BLOCK_COLORS[type]||0xffffff)

const v1=[x[0],x[1],x[2]]
const v2=[x[0]+du[0],x[1]+du[1],x[2]+du[2]]
const v3=[x[0]+du[0]+dv[0],x[1]+du[1]+dv[1],x[2]+du[2]+dv[2]]
const v4=[x[0]+dv[0],x[1]+dv[1],x[2]+dv[2]]

if(c>0){

push(v1,v2,v3,v4)

}else{

push(v1,v4,v3,v2)

}

for(let l=0;l<h;l++)
for(let k=0;k<w;k++)
mask[n+k+l*dims[u]]=0

i+=w
n+=w

}

}

}

function push(a,b,c,d){

vertices.push(
...a,...b,...c,
...a,...c,...d
)

for(let i=0;i<6;i++)
colors.push(color.r,color.g,color.b)

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
