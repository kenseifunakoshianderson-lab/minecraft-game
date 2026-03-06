import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"
import {BLOCK_COLORS} from "./blocks.js"

export function buildMesh(blocks){
  const verts=[], cols=[];

  function has(x,y,z){ return blocks.has(x+","+y+","+z); }

  for(let key of blocks.keys()){
    let [x,y,z]=key.split(",").map(Number)
    let type=blocks.get(key)
    let c=new THREE.Color(BLOCK_COLORS[type]||0xffffff)

    if(!has(x,y,z+1)) face([x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1])
    if(!has(x,y,z-1)) face([x+1,y,z],[x,y,z],[x,y+1,z],[x+1,y+1,z])
    if(!has(x-1,y,z)) face([x,y,z],[x,y,z+1],[x,y+1,z+1],[x,y+1,z])
    if(!has(x+1,y,z)) face([x+1,y,z+1],[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1])
    if(!has(x,y+1,z)) face([x,y+1,z],[x,y+1,z+1],[x+1,y+1,z+1],[x+1,y+1,z])
    if(!has(x,y-1,z)) face([x,y,z],[x+1,y,z],[x+1,y,z+1],[x,y,z+1])

    function face(a,b,c,d){ push(a,b,c); push(a,c,d) }
    function push(a,b,c){
      verts.push(...a,...b,...c)
      for(let i=0;i<3;i++) cols.push(c.r,c.g,c.b)
    }
  }

  const g=new THREE.BufferGeometry()
  g.setAttribute("position",new THREE.Float32BufferAttribute(verts,3))
  g.setAttribute("color",new THREE.Float32BufferAttribute(cols,3))
  g.computeVertexNormals()
  return new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true}))
}
