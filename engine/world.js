import {buildMesh} from "./mesher.js";

export class World{
  constructor(scene){
    this.scene = scene;
    this.chunks = new Map();
    this.CHUNK_SIZE = 16;
  }

  key(x,z){ return x+","+z; }

  update(playerPos){
    let cx = Math.floor(playerPos.x/this.CHUNK_SIZE);
    let cz = Math.floor(playerPos.z/this.CHUNK_SIZE);

    for(let x=-2;x<=2;x++){
      for(let z=-2;z<=2;z++){
        let k = this.key(cx+x, cz+z);
        if(!this.chunks.has(k)){
          const blocks = new Map();
          // simple flat terrain
          for(let bx=0;bx<16;bx++)
            for(let bz=0;bz<16;bz++)
              for(let by=0;by<10;by++){
                let type = (by===9)?1: (by>6)?2:3;
                blocks.set((cx*16+bx)+","+(by)+","+(cz*16+bz),type);
              }
          const mesh = buildMesh(blocks);
          mesh.position.set(cx*16,0,cz*16);
          this.scene.add(mesh);
          this.chunks.set(k,blocks);
        }
      }
    }
  }

  getGround(x,z){
    let gx = Math.floor(x);
    let gz = Math.floor(z);
    let maxY = -Infinity;
    for(let chunk of this.chunks.values()){
      for(let key of chunk.keys()){
        let [bx,by,bz] = key.split(",").map(Number);
        if(bx===gx && bz===gz && by>maxY) maxY=by;
      }
    }
    return maxY===-Infinity?0:maxY;
  }

  hasBlockAt(x,y,z){
    for(let chunk of this.chunks.values()){
      if(chunk.has(x+","+y+","+z)) return true;
    }
    return false;
  }
}
