// src/pages/MazeGame.tsx
import React, { useEffect } from 'react';
import {
  // Import necessary Three.js classes for 3D rendering
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

// Main MazeGame React functional component
const MazeGame: React.FC = () => {
  useEffect(() => {
    // === Game constants ===
    const CELL_SIZE = 5;           // Size of each maze cell
    const WALL_HEIGHT = 3;         // Height of each wall
    const RENDER_DISTANCE = 10;     // How many cells away to render
    const MOVE_SPEED = 0.1;        // Player movement speed
    const TURN_SPEED = 0.03;       // Player turn speed (keyboard)
    const MOUSE_SENSITIVITY = 0.002; // Mouse look sensitivity
    const MAX_WALL_INSTANCES = 1000; // Max number of wall meshes

    // === Game state variables ===
    let camera: PerspectiveCamera;
    let scene: Scene;
    let renderer: WebGLRenderer;
    let wallInstances: InstancedMesh;
    let wallGeometry: BoxGeometry;
    let wallMaterial: MeshStandardMaterial;
    let maze: Record<string, any> = {}; // Stores generated maze cells
    let playerPosition = { x: 0, y: 1, z: 0 }; // Player's position in world
    let playerRotation = 0;                   // Player's Y rotation (radians)
    let keysPressed: Record<string, boolean> = {}; // Tracks pressed keys
    let mouseMode = false;                    // Mouse look mode enabled?
    let mouseY = 0;                           // Vertical look angle
    let pointerLocked = false;                // Pointer lock state

    // === Initialization function ===
    function init() {
      // Create the scene and set background color
      scene = new Scene();
      scene.background = new Color(0x87ceeb);

      // Set up the camera with FOV, aspect, near/far planes
      camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(playerPosition.x, playerPosition.y, playerPosition.z);

      // Add ambient and directional lighting to the scene
      scene.add(new AmbientLight(0x404040));
      const dirLight = new DirectionalLight(0xffffff, 0.5);
      dirLight.position.set(5, 3, 1);
      scene.add(dirLight);

      // Create the WebGL renderer and add it to the DOM
      renderer = new WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById('game-container')!.appendChild(renderer.domElement);

      // Create instanced mesh for maze walls
      wallGeometry = new BoxGeometry(1, 1, 1);
      wallMaterial = new MeshStandardMaterial({ color: 0x808080 });
      wallInstances = new InstancedMesh(wallGeometry, wallMaterial, MAX_WALL_INSTANCES);
      wallInstances.instanceMatrix.setUsage(DynamicDrawUsage);
      scene.add(wallInstances);

      // Create the ground plane
      const groundGeo = new PlaneGeometry(1000, 1000);
      const groundMat = new MeshStandardMaterial({ color: 0x3a7e4f, side: DoubleSide });
      const ground = new Mesh(groundGeo, groundMat);
      ground.rotation.x = Math.PI / 2;
      ground.position.y = -0.5;
      scene.add(ground);

      // === Event listeners for input and resizing ===
      window.addEventListener('resize', onWindowResize);
      window.addEventListener('keydown', e => { keysPressed[e.key.toLowerCase()] = true; });
      window.addEventListener('keyup',   e => { keysPressed[e.key.toLowerCase()] = false; });

      // Toggle between keyboard and mouse control modes
      document.getElementById('toggle-mode')!
        .addEventListener('click', toggleControlMode);

      // Enable pointer lock on canvas click (for mouse look)
      const canvas = renderer.domElement;
      canvas.addEventListener('click', () => {
        if (mouseMode && !pointerLocked) canvas.requestPointerLock();
      });

      // Listen for pointer lock state changes and mouse movement
      document.addEventListener('pointerlockchange', pointerLockChange);
      document.addEventListener('mousemove', onMouseMove);

      // Allow exiting mouse mode with Escape key
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mouseMode) toggleControlMode();
      });

      // Start the animation/game loop
      animate();
    }

    // === Handle pointer lock state changes ===
    function pointerLockChange() {
      pointerLocked = !!document.pointerLockElement;
      // Show/hide mouse capture notice based on pointer lock
      document.getElementById('mouse-capture-notice')!.style.display = pointerLocked ? 'block' : 'none';
    }

    // === Toggle between keyboard and mouse control modes ===
    function toggleControlMode() {
      mouseMode = !mouseMode;
      document.getElementById('control-mode')!.textContent = mouseMode ? 'Mouse' : 'Keyboard';
      if (mouseMode) renderer.domElement.requestPointerLock();
      else document.exitPointerLock();
    }

    // === Handle window resizing to keep aspect ratio ===
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // === Handle mouse movement for camera look (when in mouse mode) ===
    function onMouseMove(e: MouseEvent) {
      if (mouseMode && pointerLocked) {
        // Adjust player rotation and vertical look angle
        playerRotation -= e.movementX * MOUSE_SENSITIVITY;
        mouseY = MathUtils.clamp(
          mouseY - e.movementY * MOUSE_SENSITIVITY,
          -Math.PI/2 + 0.1,
          Math.PI/2 - 0.1
        );
      }
    }

    // === Generate a new maze cell with random walls ===
    function generateMazeCell(x: number, z: number) {
      const cell = {
        north: Math.random() > 0.6,
        east:  Math.random() > 0.6,
        south: Math.random() > 0.6,
        west:  Math.random() > 0.6,
      };
      // Ensure at least one wall is missing for connectivity
      if (Object.values(cell).every(v => v)) {
        const dirs = ['north','east','south','west'] as const;
        cell[dirs[Math.floor(Math.random()*4)]] = false;
      }
      return cell;
    }

    // === Retrieve or generate a maze cell at (x, z) ===
    function getCell(x: number, z: number) {
      const key = `${x},${z}`;
      return maze[key] ||= generateMazeCell(x, z);
    }

    // === Get the world position for a wall in a cell ===
    function getWallPosition(x: number, z: number, dir: string) {
      const cx = x * CELL_SIZE, cz = z * CELL_SIZE;
      switch (dir ) {
        case 'north': return new Vector3(cx+CELL_SIZE/2, WALL_HEIGHT/2-0.5, cz);
        case 'east':  return new Vector3(cx+CELL_SIZE, WALL_HEIGHT/2-0.5, cz+CELL_SIZE/2);
        case 'south': return new Vector3(cx+CELL_SIZE/2, WALL_HEIGHT/2-0.5, cz+CELL_SIZE);
        case 'west':  return new Vector3(cx, WALL_HEIGHT/2-0.5, cz+CELL_SIZE/2);
      }
    }

    // === Get the rotation (in radians) for a wall based on direction ===
    function getWallRotation(dir: string) {
      switch (dir) {
        case 'north': return Math.PI/2;
        case 'east':  return 0;
        case 'south': return -Math.PI/2;
        case 'west':  return Math.PI;
      }
    }

    // === Update the visible maze section based on camera frustum ===
    function updateMazeSection(frustum: Frustum) {
      // Center cell coordinates
      const cx = Math.floor(playerPosition.x / CELL_SIZE),
            cz = Math.floor(playerPosition.z / CELL_SIZE);
      const m = new Matrix4();
      let count = 0;

      // Loop through cells within render distance
      for (let x = cx - RENDER_DISTANCE; x <= cx + RENDER_DISTANCE; x++) {
        for (let z = cz - RENDER_DISTANCE; z <= cz + RENDER_DISTANCE; z++) {
          const cell = getCell(x, z);
          // For each wall direction, check if wall exists and is visible
          (['north', 'east', 'south', 'west'] as const).forEach(dir => {
            if (!cell[dir]) return;
            const pos = getWallPosition(x, z, dir);

            // Use direction-specific scale so walls stretch along correct axis
            const scale = (dir === 'north' || dir === 'south')
              ? new Vector3(0.3, WALL_HEIGHT, CELL_SIZE)
              : new Vector3(CELL_SIZE, WALL_HEIGHT, 0.3);

            // No rotation needed since scale already defines orientation
            const quat = new Quaternion(); // Identity rotation (0,0,0)

            // Create bounding box for frustum culling
            const box = new Box3().setFromCenterAndSize(pos, scale);

            // Only render walls inside the camera frustum and within instance limit
            if (frustum.intersectsBox(box) && count < MAX_WALL_INSTANCES) {
              m.compose(pos, quat, scale);
              wallInstances.setMatrixAt(count++, m);
            }
          });
        }
      }

      wallInstances.count = count;
      wallInstances.instanceMatrix.needsUpdate = true;
    }

    // === Process keyboard input for movement and turning ===
    function processInput() {
      // Calculate movement deltas based on player rotation
      const dx = Math.sin(playerRotation) * MOVE_SPEED;
      const dz = Math.cos(playerRotation) * MOVE_SPEED;
      let moved = false;

      let moveX = 0;
      let moveZ = 0;

      // Handle forward/backward input
      if (keysPressed['w'] || keysPressed['arrowup']) {
        moveX -= dx;
        moveZ -= dz;
        moved = true;
      }
      if (keysPressed['s'] || keysPressed['arrowdown']) {
        moveX += dx;
        moveZ += dz;
        moved = true;
      }

      // Get the player's current cell
      const cx = Math.floor(playerPosition.x / CELL_SIZE);
      const cz = Math.floor(playerPosition.z / CELL_SIZE);

      // --- X-axis collision detection ---
      let nextX = playerPosition.x + moveX;
      let collidedX = false;

      // Check walls in nearby cells for X collisions
      for (let x = cx - 1; x <= cx + 1; x++) {
        for (let z = cz - 1; z <= cz + 1; z++) {
          const cell = getCell(x, z);

          (['north', 'east', 'south', 'west'] as const).forEach(dir => {
            if (!cell[dir]) return;

            const pos = getWallPosition(x, z, dir);
            const size = (dir === 'north' || dir === 'south')
              ? new Vector3(0.3, WALL_HEIGHT, CELL_SIZE)
              : new Vector3(CELL_SIZE, WALL_HEIGHT, 0.3);

            const wallBox = new Box3().setFromCenterAndSize(pos, size);

            // Predict where player would be if moved on X
            const playerBox = new Box3().setFromCenterAndSize(
              new Vector3(nextX, playerPosition.y, playerPosition.z),
              new Vector3(0.5, 1.8, 0.5) // Player collider size
            );

            if (wallBox.intersectsBox(playerBox)) {
              collidedX = true;
            }
          });
        }
      }

      // Apply X movement if there's no collision
      if (!collidedX) {
        playerPosition.x = nextX;
      }

      // --- Z-axis collision detection ---
      let nextZ = playerPosition.z + moveZ;
      let collidedZ = false;

      // Check walls in nearby cells for Z collisions
      for (let x = cx - 1; x <= cx + 1; x++) {
        for (let z = cz - 1; z <= cz + 1; z++) {
          const cell = getCell(x, z);

          (['north', 'east', 'south', 'west'] as const).forEach(dir => {
            if (!cell[dir]) return;

            const pos = getWallPosition(x, z, dir);
            const size = (dir === 'north' || dir === 'south')
              ? new Vector3(0.3, WALL_HEIGHT, CELL_SIZE)
              : new Vector3(CELL_SIZE, WALL_HEIGHT, 0.3);

            const wallBox = new Box3().setFromCenterAndSize(pos, size);

            // Predict where player would be if moved on Z
            const playerBox = new Box3().setFromCenterAndSize(
              new Vector3(playerPosition.x, playerPosition.y, nextZ),
              new Vector3(0.5, 1.8, 0.5)
            );

            if (wallBox.intersectsBox(playerBox)) {
              collidedZ = true;
            }
          });
        }
      }

      // Apply Z movement if there's no collision
      if (!collidedZ) {
        playerPosition.z = nextZ;
      }

      // Handle turning (no collision detection needed)
      if (keysPressed['a'] || keysPressed['arrowleft']) {
        playerRotation += TURN_SPEED;
        moved = true;
      }
      if (keysPressed['d'] || keysPressed['arrowright']) {
        playerRotation -= TURN_SPEED;
        moved = true;
      }

      // Update on-screen position display
      document.getElementById('position')!.textContent =
        `${playerPosition.x.toFixed(1)}, ${playerPosition.y.toFixed(1)}, ${playerPosition.z.toFixed(1)}`;

      return moved;
    }

    // === Main animation loop ===
    function animate() {
      requestAnimationFrame(animate);
      processInput();

      // Update camera position and orientation
      camera.position.set(playerPosition.x, playerPosition.y, playerPosition.z);
      camera.rotation.set(mouseY, playerRotation, 0, 'YXZ');

      camera.updateMatrixWorld();
      // Create a frustum for culling walls outside of view
      const fr = new Frustum().setFromProjectionMatrix(
        new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
      );

      // Update visible maze section and render the scene
      updateMazeSection(fr);
      renderer.render(scene, camera);
    }

    // === Start the game ===
    init();
  }, []);

  // === Render the game container and HUD/UI elements ===
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
        {/* Back button to return to main website */}
        <Link id="back-button" to="/">
          <span className="icon">&#8592;</span>Go Back to Website
        </Link>

        {/* Heads-up display for position and control mode */}
        <div id="hud">
          Position: <span id="position">0,0,0</span><br/>
          Mode: <span id="control-mode">Keyboard</span><br/>
        </div>

        {/* Instructions for controls */}
        <div id="instructions">
          W/Up Arrow to move forward | S/Down to move back<br/>
          A/D or ←/→ to turn<br/>
          Click Toggle Mode for mouse (ESC to exit)
        </div>
        {/* Button to toggle control mode */}
        <button id="toggle-mode">Toggle Control Mode</button>
        {/* Notice shown when mouse capture is active */}
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
