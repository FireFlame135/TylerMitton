// src/pages/MazeGame.tsx
import React, { useEffect } from 'react';
import {
  PerspectiveCamera,
  Scene,
  Color,
  AmbientLight,
  DirectionalLight,
  WebGLRenderer,
  BoxGeometry,
  MeshStandardMaterial,
  InstancedMesh,
  PlaneGeometry,
  Mesh,
  DoubleSide,
  DynamicDrawUsage,
  MathUtils,
  Vector3,
  Matrix4,
  Quaternion,
  Euler,
  Box3,
  Frustum
} from 'three';
import { Link } from 'react-router-dom';

const MazeGame: React.FC = () => {
  useEffect(() => {
    // Game constants
    const CELL_SIZE = 5;
    const WALL_HEIGHT = 3;
    const RENDER_DISTANCE = 5;
    const MOVE_SPEED = 0.1;
    const TURN_SPEED = 0.03;
    const MOUSE_SENSITIVITY = 0.002;
    const MAX_WALL_INSTANCES = 2000;

    // Game state
    let camera: PerspectiveCamera;
    let scene: Scene;
    let renderer: WebGLRenderer;
    let wallInstances: InstancedMesh;
    let wallGeometry: BoxGeometry;
    let wallMaterial: MeshStandardMaterial;
    let maze: Record<string, any> = {};
    let playerPosition = { x: 0, y: 1, z: 0 };
    let playerRotation = 0;
    let keysPressed: Record<string, boolean> = {};
    let mouseMode = false;
    let mouseY = 0;
    let pointerLocked = false;

    function init() {
      scene = new Scene();
      scene.background = new Color(0x87ceeb);

      camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(playerPosition.x, playerPosition.y, playerPosition.z);

      scene.add(new AmbientLight(0x404040));
      const dirLight = new DirectionalLight(0xffffff, 0.5);
      dirLight.position.set(1, 1, 1);
      scene.add(dirLight);

      renderer = new WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById('game-container')!.appendChild(renderer.domElement);

      wallGeometry = new BoxGeometry(1, 1, 1);
      wallMaterial = new MeshStandardMaterial({ color: 0x808080 });
      wallInstances = new InstancedMesh(wallGeometry, wallMaterial, MAX_WALL_INSTANCES);
      wallInstances.instanceMatrix.setUsage(DynamicDrawUsage);
      scene.add(wallInstances);

      const groundGeo = new PlaneGeometry(1000, 1000);
      const groundMat = new MeshStandardMaterial({ color: 0x3a7e4f, side: DoubleSide });
      const ground = new Mesh(groundGeo, groundMat);
      ground.rotation.x = Math.PI / 2;
      ground.position.y = -0.5;
      scene.add(ground);

      window.addEventListener('resize', onWindowResize);
      window.addEventListener('keydown', e => { keysPressed[e.key.toLowerCase()] = true; });
      window.addEventListener('keyup',   e => { keysPressed[e.key.toLowerCase()] = false; });

      document.getElementById('toggle-mode')!
        .addEventListener('click', toggleControlMode);

      const canvas = renderer.domElement;
      canvas.addEventListener('click', () => {
        if (mouseMode && !pointerLocked) canvas.requestPointerLock();
      });

      document.addEventListener('pointerlockchange', pointerLockChange);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mouseMode) toggleControlMode();
      });

      animate();
    }

    function pointerLockChange() {
      pointerLocked = !!document.pointerLockElement;
      document.getElementById('mouse-capture-notice')!.style.display = pointerLocked ? 'block' : 'none';
    }

    function toggleControlMode() {
      mouseMode = !mouseMode;
      document.getElementById('control-mode')!.textContent = mouseMode ? 'Mouse' : 'Keyboard';
      if (mouseMode) renderer.domElement.requestPointerLock();
      else document.exitPointerLock();
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseMove(e: MouseEvent) {
      if (mouseMode && pointerLocked) {
        playerRotation -= e.movementX * MOUSE_SENSITIVITY;
        mouseY = MathUtils.clamp(
          mouseY - e.movementY * MOUSE_SENSITIVITY,
          -Math.PI/2 + 0.1,
          Math.PI/2 - 0.1
        );
      }
    }

    function generateMazeCell(x: number, z: number) {
      const cell = {
        north: Math.random() > 0.6,
        east:  Math.random() > 0.6,
        south: Math.random() > 0.6,
        west:  Math.random() > 0.6,
      };
      if (Object.values(cell).every(v => v)) {
        const dirs = ['north','east','south','west'] as const;
        cell[dirs[Math.floor(Math.random()*4)]] = false;
      }
      return cell;
    }

    function getCell(x: number, z: number) {
      const key = `${x},${z}`;
      return maze[key] ||= generateMazeCell(x, z);
    }

    function getWallPosition(x: number, z: number, dir: string) {
      const cx = x * CELL_SIZE, cz = z * CELL_SIZE;
      switch (dir ) {
        case 'north': return new Vector3(cx+CELL_SIZE/2, WALL_HEIGHT/2-0.5, cz);
        case 'east':  return new Vector3(cx+CELL_SIZE, WALL_HEIGHT/2-0.5, cz+CELL_SIZE/2);
        case 'south': return new Vector3(cx+CELL_SIZE/2, WALL_HEIGHT/2-0.5, cz+CELL_SIZE);
        case 'west':  return new Vector3(cx, WALL_HEIGHT/2-0.5, cz+CELL_SIZE/2);
      }
    }

    function getWallRotation(dir: string) {
      switch (dir) {
        case 'north': return Math.PI/2;
        case 'east':  return 0;
        case 'south': return -Math.PI/2;
        case 'west':  return Math.PI;
      }
    }

    function updateMazeSection(frustum: Frustum) {
      const cx = Math.floor(playerPosition.x/CELL_SIZE),
            cz = Math.floor(playerPosition.z/CELL_SIZE);
      const m = new Matrix4();
      let count = 0;

      for (let x=cx-RENDER_DISTANCE; x<=cx+RENDER_DISTANCE; x++) {
        for (let z=cz-RENDER_DISTANCE; z<=cz+RENDER_DISTANCE; z++) {
          const cell = getCell(x,z);
          (['north','east','south','west'] as const).forEach(dir => {
            if (!cell[dir]) return;
            const pos = getWallPosition(x,z,dir),
                  rot = getWallRotation(dir),
                  box = new Box3().setFromCenterAndSize(
                    pos,
                    new Vector3(CELL_SIZE, WALL_HEIGHT, 0.3)
                  );
            if (frustum.intersectsBox(box) && count<MAX_WALL_INSTANCES) {
              m.compose(pos, new Quaternion().setFromEuler(new Euler(0,rot,0)), new Vector3(CELL_SIZE,WALL_HEIGHT,0.3));
              wallInstances.setMatrixAt(count++, m);
            }
          });
        }
      }
      wallInstances.count = count;
      wallInstances.instanceMatrix.needsUpdate = true;
    }

    function processInput() {
      const dx = Math.sin(playerRotation)*MOVE_SPEED,
            dz = Math.cos(playerRotation)*MOVE_SPEED;
      let moved = false;

      if (keysPressed['w']||keysPressed['arrowup'])   { playerPosition.x -= dx; playerPosition.z -= dz; moved = true; }
      if (keysPressed['s']||keysPressed['arrowdown']) { playerPosition.x += dx; playerPosition.z += dz; moved = true; }
      if (keysPressed['a']||keysPressed['arrowleft']) { playerRotation += TURN_SPEED; moved = true; }
      if (keysPressed['d']||keysPressed['arrowright']){ playerRotation -= TURN_SPEED; moved = true; }

      document.getElementById('position')!.textContent =
        `${playerPosition.x.toFixed(1)}, ${playerPosition.y.toFixed(1)}, ${playerPosition.z.toFixed(1)}`;

      return moved;
    }

    function animate() {
      requestAnimationFrame(animate);
      processInput();

      camera.position.set(playerPosition.x, playerPosition.y, playerPosition.z);
      camera.rotation.set(mouseY, playerRotation, 0, 'YXZ');

      camera.updateMatrixWorld();
      const fr = new Frustum().setFromProjectionMatrix(
        new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
      );

      updateMazeSection(fr);
      renderer.render(scene, camera);
    }

    // start
    init();
  }, []);

  return (
    <>
      <style>{`
        body { margin:0; overflow:hidden; font-family:Arial,sans-serif; }
        #game-container { position:relative; width:100vw; height:100vh; background:#000; }
        #back-button { position:absolute; top:10px; left:10px; padding:10px; background:rgba(0,0,0,0.5);
          color:#fff; border:1px solid #fff; border-radius:5px; cursor:pointer; z-index:100;
          display:flex; align-items:center; font-size:14px; }
        #back-button .icon { margin-right:5px; font-size:16px; }
        #hud { position:absolute; top:60px; left:10px; color:#fff; background:rgba(0,0,0,0.5);
          padding:10px; border-radius:5px; z-index:100; }
        #instructions { position:absolute; bottom:10px; left:50%; transform:translateX(-50%);
          color:#fff; background:rgba(0,0,0,0.5); padding:10px; border-radius:5px;
          text-align:center; z-index:100; }
        #toggle-mode { position:absolute; top:10px; right:10px; padding:10px;
          background:rgba(0,0,0,0.5); color:#fff; border:1px solid #fff; border-radius:5px;
          cursor:pointer; z-index:100; }
        #mouse-capture-notice { display:none; position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%); background:rgba(0,0,0,0.7);
          color:#fff; padding:20px; border-radius:10px; text-align:center; z-index:200; }
      `}</style>

      <div id="game-container">
        <Link id="back-button" to="/">
          <span className="icon">&#8592;</span>Go Back to Website
        </Link>

        <div id="hud">
          Position: <span id="position">0,0,0</span><br/>
          Mode: <span id="control-mode">Keyboard</span><br/>
        </div>

        <div id="instructions">
          W/Up Arrow to move forward | S/Down to move back<br/>
          A/D or ←/→ to turn<br/>
          Click Toggle Mode for mouse (ESC to exit)
        </div>
        <button id="toggle-mode">Toggle Control Mode</button>
        <div id="mouse-capture-notice">
          Mouse camera control enabled<br/>
          Move mouse to look around<br/>
          Press ESC to exit this mode
        </div>
      </div>
    </>
  );
};

export default MazeGame;
