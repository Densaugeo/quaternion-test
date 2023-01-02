import * as THREE from './three.module.js';
import * as THREE_Densaugeo from './three.Densaugeo.js'

export const f3D = THREE_Densaugeo.forgeObject3D

export class LineGeometry extends THREE.BufferGeometry {
  constructor(length=1) {
    super()
    this.type = 'LineGeometry'
    this.parameters = { length: length }
    this.setAttribute('position', new THREE.Float32BufferAttribute([
       0, -length/2, 0,
       0,  length/2, 0,
    ], 3))
  }
}

export const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 )

camera.matrix.compose(
  new THREE.Vector3(8, 8, 5),
  new THREE.Quaternion().setFromEuler(new THREE.Euler(0.3*Math.PI, 0, 0.75*Math.PI, 'ZYX')),
  new THREE.Vector3(1, 1, 1)
)
export const scene = new THREE.Scene()

export const quaternion_tester = f3D(THREE.Group, {}, [
  f3D(THREE.Mesh, {
    geometry: new THREE.CylinderGeometry(0.1, 0.1, 4.5),
    material: new THREE.MeshPhongMaterial({ color: 0x00ffff }),
    position: [0, 0, -2.25],
    euler: [-Math.PI/2, 0, 0],
  }),
  f3D(THREE.Mesh, {
    geometry: new THREE.ConeGeometry(0.2, 1, 8),
    material: new THREE.MeshPhongMaterial({ color: 0x00ffff }),
    position: [0, 0, -5],
    euler: [-Math.PI/2, 0, 0],
  }),
  f3D(THREE.Mesh, {
    geometry: new THREE.ConeGeometry(0.1, 1, 8),
    material: new THREE.MeshPhongMaterial({ color: 0x00ffff }),
    position: [0, 0.5, -4],
  }),
])
scene.add(quaternion_tester)

export const axis_geometry = new LineGeometry(100)
export const axis_cone_geometry = new THREE.ConeGeometry(0.1, 1)

export const grid_points = new Float32Array(240)
for(let i = 1; i <= 10; ++i) {
  grid_points.set([
    -10,  -i, 0,
     10,  -i, 0,
    -10,   i, 0,
     10,   i, 0,
     -i, -10, 0,
     -i,  10, 0,
      i, -10, 0,
      i,  10, 0,
  ], 24*(i - 1))
}
export const grid_geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(grid_points, 3))

export const grid = f3D(THREE.Group, {}, [
  f3D(THREE.Line, {
    geometry: axis_geometry,
    material: new THREE.LineBasicMaterial({ color: 0xff0000 }),
    euler: [0, 0, -Math.PI/2],
  }),
  f3D(THREE.Mesh, {
    geometry: axis_cone_geometry,
    material: new THREE.MeshPhongMaterial({ color: 0xff0000 }),
    position: [5, 0, 0],
    euler: [0, 0, -Math.PI/2],
  }),
  f3D(THREE.Line, {
    geometry: axis_geometry,
    material: new THREE.LineBasicMaterial({ color: 0x00ff00 }),
  }),
  f3D(THREE.Mesh, {
    geometry: axis_cone_geometry,
    material: new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
    position: [0, 5, 0],
  }),
  f3D(THREE.Line, {
    geometry: axis_geometry,
    material: new THREE.LineBasicMaterial({ color: 0x0000ff }),
    euler: [Math.PI/2, 0, 0],
  }),
  f3D(THREE.Mesh, {
    geometry: axis_cone_geometry,
    material: new THREE.MeshPhongMaterial({ color: 0x0000ff }),
    position: [0, 0, 5],
    euler: [Math.PI/2, 0, 0],
  }),
  f3D(THREE.LineSegments, {
    geometry: grid_geometry,
    material: new THREE.LineBasicMaterial({ color: 0x808080 }),
  }),
])
scene.add(grid)

export const ambient_light = f3D(THREE.AmbientLight, { color: new THREE.Color(0x404040) })
scene.add(ambient_light);

export const directional_light = f3D(THREE.DirectionalLight, {
  color: new THREE.Color(0x808080),
  position: [1, 2, 5],
})
scene.add(directional_light);

export const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );

export const controls = new THREE_Densaugeo.FreeControls(camera, renderer.domElement, {panMouseSpeed: 0.05, dollySpeed: 5});

function animation(time) {
  renderer.render(scene, camera);
}

// WebGL occupies entire browser window
window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth/window.innerHeight
  camera.updateProjectionMatrix()
  
  renderer.setSize(window.innerWidth, window.innerHeight)
})

document.getElementById('quaternion_form').addEventListener('change', e => {
  e.preventDefault()
  
  const form = document.getElementById('quaternion_form')
  
  document.getElementById('quaternion_magnitude').textContent = (form.real.value**2 + form.i.value**2 + form.j.value**2 + form.k.value**2)**0.5
  
  quaternion_tester.matrix.compose(
    new THREE.Vector3(0, 0, 0),
    new THREE.Quaternion(Number(form.i.value), Number(form.j.value), Number(form.k.value), Number(form.real.value)),
    new THREE.Vector3(1, 1, 1)
  )
  
})

document.getElementById('quaternion_form').addEventListener('keydown', e => e.stopPropagation())
