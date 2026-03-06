import {buildMesh} from "./mesher.js";

export class World{
  constructor(scene){
    this.scene = scene;
    this.chunks = new Map();
    this.CHUNK_SIZE = 16;
    this.HEIGHT = 32;
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
          for(let bx=0;bx<16;bx++){
            for(let bz=0;bz<16;bz++){
              const wx = (cx+x)*16+bx;
              const wz = (cz+z)*16+bz;
              const height = Math.floor(10 + Math.sin(wx*0.05)+Math.sin(wz*0.05)*3);
              for(let by=0;by<this.HEIGHT;by++){
                let type = 0;
                if(by<height){
                  if(by===height-1) type=1; // grass
                  else if(by>height-4) type=2; // dirt
                  else type=3; // stone
                } else {
                  type=2; // 未生成部分も dirt にして黒くならない
                }
                blocks.set(wx+","+by+","+wz,type);
              }
            }
          }
          const mesh = buildMesh(blocks);
          mesh.position.set(0,0,0);
          this.scene.add(mesh);
          this.chunks.set(k,blocks);
        }
      }
    }
  }

  getGround(x,z){
    let gx = Math.floor(x);
    let gz = Math.floor(z);
    let maxY = 0;
    for(let chunk of this.chunks.values()){
      for(let key of chunk.keys()){
        let [bx,by,bz] = key.split(",").map(Number);
        if(bx===gx && bz===gz && by>maxY && chunk.get(key)>0) maxY=by;
      }
    }
    return maxY;
  }

  hasBlockAt(x,y,z){
    for(let chunk of this.chunks.values()){
      if(chunk.get(x+","+y+","+z)>0) return true;
    }
    return false;
  }
}
