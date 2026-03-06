import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);

const renderer = new THREE.WebGLRenderer({
canvas: document.getElementById("game")
});

renderer.setSize(window.innerWidth, window.innerHeight);

const light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(10,20,10);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff,0.5);
scene.add(ambient);

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshLambertMaterial({color:0x55aa55});

for(let x=-10;x<10;x++){
for(let z=-10;z<10;z++){

const block = new THREE.Mesh(geometry,material);

block.position.set(x,0,z);

scene.add(block);

}
}

camera.position.set(5,5,5);
camera.lookAt(0,0,0);

function animate(){

requestAnimationFrame(animate);

renderer.render(scene,camera);

}

animate();
