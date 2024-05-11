import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GUI } from 'dat.gui'


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.z = 13
camera.position.y = 8
scene.add(camera)



const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5)
const material = new THREE.MeshPhongMaterial({ color: 'white' })

const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)


const canvas = document.querySelector('.webgl')
const orbitControls = new OrbitControls(camera, canvas)
orbitControls.enableDamping = true
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(sizes.width, sizes.height)

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(sizes.width, sizes.height)
})

window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen()
  }
  else {
    document.exitFullscreen()
  }
})


const ambientLight = new THREE.AmbientLight('#ffffff', 10)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffff', 250)
directionalLight.x = 1
directionalLight.y = 1.5
directionalLight.z = -6
scene.add(directionalLight)

const planeGeo = new THREE.PlaneGeometry()
const plane = new THREE.Mesh(planeGeo, material)
scene.add(plane)
plane.rotation.x = -Math.PI * 0.5
plane.scale.set(100,100,100)

const group = new THREE.Group()
scene.add(group)


const fbxLoader = new FBXLoader()
fbxLoader.load(
  'assets/model.fbx',
  (object) => {
    group.add(object)
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  (error) => {
    console.log(error)
  }
)

function changeOrigin(group, desiredOrigin) {
  
  var currentOrigin = new THREE.Vector3();
  group.getWorldPosition(currentOrigin);
  console.log(currentOrigin);

  
  var offset = desiredOrigin.clone().sub(currentOrigin);

  
  group.children.forEach(function(child) {
      child.position.add(offset);
  });
}

// Example usage:
// Change origin of `group` to a new position (5, 0, 0)
changeOrigin(group, new THREE.Vector3(0, 0, 0));

const params = {
  scale: 0.01
}

function updateScale(){
  group.scale.set(params.scale, params.scale, params.scale)
}

group.scale.set(.001, .001, .001)
group.rotation.x = -Math.PI * 0.5
group.position.x = 5

console.log(group);

const gui = new GUI()
const rotationFolder = gui.addFolder('Rotation')
rotationFolder.add(group.rotation, 'z', 0, Math.PI*2)

gui.add(params, 'scale', 0.001, 0.01).onChange(updateScale)

// const helper = new THREE.DirectionalLightHelper( directionalLight, 1);
// scene.add( helper );

// const lightFolder = gui.addFolder('Light')
// lightFolder.add(directionalLight.position, 'x', -50, 50)
// lightFolder.add(directionalLight.position, 'y', -50, 50)
// lightFolder.add(directionalLight.position, 'z', -50, 50)


const clock = new THREE.Clock()

const tick = () => {
  const elapsedTiem = clock.getElapsedTime()

  orbitControls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)

}

tick()

