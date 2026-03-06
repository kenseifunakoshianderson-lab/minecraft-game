import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"
import {BLOCK_COLORS} from "./blocks.js"

export function buildMesh(blocks){
  const vertices=[]
  const colors=[]

  function has(x,y,z){ return blocks.has(x+","+y+","+z) }

  for(let key of blocks.keys()){
    let [x,y,z]=key.split(",").map(Number)
    let type=blocks.get(key)
    let color=new THREE.Color(BLOCK_COLORS[type]||0xffffff)

    // FRONT
    if(!has(x,y,z+1)) face([x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1])
    // BACK
    if(!has(x,y,z-1)) face([x+1,y,z],[x,y,z],[x,y+1,z],[x+1,y+1,z])
    // LEFT
    if(!has(x-1,y,z)) face([x,y,z],[x,y,z+1],[x,y+1,z+1],[x,y+1,z])
    // RIGHT
    if(!has(x+1,y,z)) face([x+1,y,z+1],[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1])
    // TOP
    if(!has(x,y+1,z)) face([x,y+1,z],[x,y+1,z+1],[x+1,y+1,z+1],[x+1,y+1,z])
    // BOTTOM
    if(!has(x,y-1,z)) face([x,y,z],[x+1,y,z],[x+1,y,z+1],[x,y,z+1])

    function face(a,b,c,d){
      push(a,b,c); push(a,c,d)
    }
    function push(a,b,c){
      vertices.push(...a,...b,...c)
      for(let i=0;i<3;i++) colors.push(color.r,color.g,color.b)
    }
  }

  const geometry=new THREE.BufferGeometry()
  geometry.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3))
  geometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,3))
  geometry.computeVertexNormals()
  const material=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.FrontSide})
  return new THREE.Mesh(geometry,material)
}
