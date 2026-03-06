import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js"
import {World} from "./engine/world.js"
import {Player} from "./engine/player.js"
import {buildMesh} from "./engine/mesher.js"

// シーン・カメラ・レンダラー
const scene=new THREE.Scene()
scene.background=new THREE.Color(0x87CEEB)
const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
const renderer=new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff,0.4))
const sun=new THREE.DirectionalLight(0xffffff,1)
sun.position.set(100,200,100)
scene.add(sun)

// ワールド・プレイヤー
const world=new World(scene)
const player=new Player(camera,world)

function animate(){
  requestAnimationFrame(animate)
  player.update()
  world.update(player.position)
  renderer.render(scene,camera)
}
animate()
