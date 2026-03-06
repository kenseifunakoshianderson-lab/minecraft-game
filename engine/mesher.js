import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js";

const atlas = new THREE.TextureLoader().load("../textures/atlas.png");
atlas.magFilter = THREE.NearestFilter;
atlas.minFilter = THREE.NearestFilter;

const BLOCK_UV = {
  1: [0,0], // grass top
  2: [1,0], // dirt
  3: [2,0]  // stone
};

export function buildMesh(blocks){
  const verts=[], uvs=[];
  function has(x,y,z){ return blocks.get(x+","+y+","+z)>0; }

  for(let key of blocks.keys()){
    let [x,y,z]=key.split(",").map(Number)
    let type=blocks.get(key);

    if(type===0) continue;

    const [tx,ty] = BLOCK_UV[type]||[0,0];
    const uv0 = tx/16, uv1 = (tx+1)/16;
    const vv0 = 1-ty/16-1/16, vv1 = 1-ty/16;

    function addFace(a,b,c,d){
      verts.push(...a,...b,...c,...a,...c,...d);
      uvs.push(uv0,vv0, uv1,vv0, uv1,vv1, uv0,vv0, uv1,vv1, uv0,vv1);
    }

    if(!has(x,y,z+1)) addFace([x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]);
    if(!has(x,y,z-1)) addFace([x+1,y,z],[x,y,z],[x,y+1,z],[x+1,y+1,z]);
    if(!has(x-1,y,z)) addFace([x,y,z],[x,y,z+1],[x,y+1,z+1],[x,y+1,z]);
    if(!has(x+1,y,z)) addFace([x+1,y,z+1],[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1]);
    if(!has(x,y+1,z)) addFace([x,y+1,z],[x,y+1,z+1],[x+1,y+1,z+1],[x+1,y+1,z]);
    if(!has(x,y-1,z)) addFace([x,y,z],[x+1,y,z],[x+1,y,z+1],[x,y,z+1]);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(verts,3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs,2));
  g.computeVertexNormals();
  return new THREE.Mesh(g,new THREE.MeshLambertMaterial({map:atlas}));
}
