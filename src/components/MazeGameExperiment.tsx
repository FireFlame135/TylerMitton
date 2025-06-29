// src/components/MazeGameExperiment.tsx
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
const MazeGameExperiment: React.FC = () => {
  useEffect(() => {
    // === Game constants ===
    const CELL_SIZE = 5;           // Size of each maze cell
    const WALL_HEIGHT = 3;         // Height of each wall
    const RENDER_DISTANCE = 10;     // How many cells away to render
    const MOVE_SPEED = 0.1;        // Player movement speed
    const TURN_SPEED = 0.03;       // Player turn speed (keyboard)
    const MOUSE_SENSITIVITY = 0.002; // Mouse look sensitivity
    const MAX_WALL_INSTANCES = 1000; // Max number of wall meshes
    const CHUNK_SIZE = 16;         // Size of each maze chunk for DFS generation

    // === Game state variables ===
    let camera: PerspectiveCamera;
    let scene: Scene;
    let renderer: WebGLRenderer;
    let wallInstances: InstancedMesh;
    let wallGeometry: BoxGeometry;
    let wallMaterial: MeshStandardMaterial;
    let maze: Record<string, any> = {}; // Stores generated maze cells
    let generatedChunks: Set<string> = new Set(); // Tracks which chunks have been generated
    let playerPosition = { x: 0, y: 1, z: 0 }; // Player's position in world (starts at 0,0)
    let playerRotation = 0;                   // Player's Y rotation (radians)
    let keysPressed: Record<string, boolean> = {}; // Tracks pressed keys
    let mouseMode = false;                    // Mouse look mode enabled?
    let mouseY = 0;                           // Vertical look angle
    let pointerLocked = false;                // Pointer lock state

    // === Maze Generation Functions ===
    
    // Get chunk coordinates for a given cell
    function getChunkCoords(x: number, z: number): [number, number] {
      return [Math.floor(x / CHUNK_SIZE), Math.floor(z / CHUNK_SIZE)];
    }

    // Get chunk key string
    function getChunkKey(chunkX: number, chunkZ: number): string {
      return `${chunkX},${chunkZ}`;
    }

    // Check if a cell position is valid within a chunk
    function isValidInChunk(x: number, z: number, chunkX: number, chunkZ: number): boolean {
      const startX = chunkX * CHUNK_SIZE;
      const startZ = chunkZ * CHUNK_SIZE;
      return x >= startX && x < startX + CHUNK_SIZE && z >= startZ && z < startZ + CHUNK_SIZE;
    }

    // Initialize a cell with all walls
    function initializeCell(x: number, z: number) {
      const key = `${x},${z}`;
      if (!maze[key]) {
        maze[key] = {
          north: true,
          east: true,
          south: true,
          west: true,
          visited: false
        };
      }
      return maze[key];
    }

    // Remove wall between two adjacent cells
    function removeWall(x1: number, z1: number, x2: number, z2: number) {
      const cell1 = maze[`${x1},${z1}`];
      const cell2 = maze[`${x2},${z2}`];
      
      if (!cell1 || !cell2) return;

      // Determine direction and remove walls
      if (x2 > x1) { // Moving east
        cell1.east = false;
        cell2.west = false;
      } else if (x2 < x1) { // Moving west
        cell1.west = false;
        cell2.east = false;
      } else if (z2 > z1) { // Moving south
        cell1.south = false;
        cell2.north = false;
      } else if (z2 < z1) { // Moving north
        cell1.north = false;
        cell2.south = false;
      }
    }

    // Get unvisited neighbors within the same chunk
    function getUnvisitedNeighbors(x: number, z: number, chunkX: number, chunkZ: number): [number, number][] {
      const neighbors: [number, number][] = [];
      const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // north, east, south, west
      
      for (const [dx, dz] of directions) {
        const nx = x + dx;
        const nz = z + dz;
        
        if (isValidInChunk(nx, nz, chunkX, chunkZ)) {
          const neighborKey = `${nx},${nz}`;
          if (maze[neighborKey] && !maze[neighborKey].visited) {
            neighbors.push([nx, nz]);
          }
        }
      }
      
      return neighbors;
    }

    // DFS maze generation for a chunk
    function generateChunkDFS(chunkX: number, chunkZ: number) {
      const startX = chunkX * CHUNK_SIZE;
      const startZ = chunkZ * CHUNK_SIZE;

      // Initialize all cells in the chunk
      for (let x = startX; x < startX + CHUNK_SIZE; x++) {
        for (let z = startZ; z < startZ + CHUNK_SIZE; z++) {
          initializeCell(x, z);
        }
      }

      let dfsStartX: number, dfsStartZ: number;

      if (chunkX === 0 && chunkZ === 0) {
        // Center spawn in the chunk
        const spawnX = startX + Math.floor(CHUNK_SIZE / 2);
        const spawnZ = startZ + Math.floor(CHUNK_SIZE / 2);

        // Mark spawn cell as visited so DFS doesn't touch it
        const spawnCell = initializeCell(spawnX, spawnZ);
        spawnCell.visited = true;

        // Start DFS at a different nearby cell (avoid modifying spawn)
        dfsStartX = spawnX + 1;
        dfsStartZ = spawnZ;
        maze[`${dfsStartX},${dfsStartZ}`].visited = true;
      } else {
        // Start DFS at top-left of the chunk
        dfsStartX = startX;
        dfsStartZ = startZ;
        maze[`${dfsStartX},${dfsStartZ}`].visited = true;
      }

      const stack: [number, number][] = [[dfsStartX, dfsStartZ]];

      while (stack.length > 0) {
        const [currentX, currentZ] = stack[stack.length - 1];
        const neighbors = getUnvisitedNeighbors(currentX, currentZ, chunkX, chunkZ);

        if (neighbors.length > 0) {
          const [nextX, nextZ] = neighbors[Math.floor(Math.random() * neighbors.length)];
          removeWall(currentX, currentZ, nextX, nextZ);
          maze[`${nextX},${nextZ}`].visited = true;
          stack.push([nextX, nextZ]);
        } else {
          stack.pop();
        }
      }

      // Connect this chunk to any already-generated neighbors
      connectToAdjacentChunks(chunkX, chunkZ);
    }

    // Connect chunk to adjacent chunks
    function connectToAdjacentChunks(chunkX: number, chunkZ: number) {
      const adjacentChunks = [
        [chunkX - 1, chunkZ], // west
        [chunkX + 1, chunkZ], // east
        [chunkX, chunkZ - 1], // north
        [chunkX, chunkZ + 1]  // south
      ];

      for (const [adjX, adjZ] of adjacentChunks) {
        const adjKey = getChunkKey(adjX, adjZ);
        if (generatedChunks.has(adjKey)) {
          createChunkConnection(chunkX, chunkZ, adjX, adjZ);
        }
      }
    }

    // Create a connection between two adjacent chunks
    function createChunkConnection(chunkX1: number, chunkZ1: number, chunkX2: number, chunkZ2: number) {
      const startX1 = chunkX1 * CHUNK_SIZE;
      const startZ1 = chunkZ1 * CHUNK_SIZE;
      const startX2 = chunkX2 * CHUNK_SIZE;
      const startZ2 = chunkZ2 * CHUNK_SIZE;

      // Determine connection direction and create random connections
      if (chunkX2 > chunkX1) { // East connection
        const connectionZ = startZ1 + Math.floor(Math.random() * CHUNK_SIZE);
        const x1 = startX1 + CHUNK_SIZE - 1;
        const x2 = startX2;
        removeWall(x1, connectionZ, x2, connectionZ);
      } else if (chunkX2 < chunkX1) { // West connection
        const connectionZ = startZ1 + Math.floor(Math.random() * CHUNK_SIZE);
        const x1 = startX1;
        const x2 = startX2 + CHUNK_SIZE - 1;
        removeWall(x1, connectionZ, x2, connectionZ);
      } else if (chunkZ2 > chunkZ1) { // South connection
        const connectionX = startX1 + Math.floor(Math.random() * CHUNK_SIZE);
        const z1 = startZ1 + CHUNK_SIZE - 1;
        const z2 = startZ2;
        removeWall(connectionX, z1, connectionX, z2);
      } else if (chunkZ2 < chunkZ1) { // North connection
        const connectionX = startX1 + Math.floor(Math.random() * CHUNK_SIZE);
        const z1 = startZ1;
        const z2 = startZ2 + CHUNK_SIZE - 1;
        removeWall(connectionX, z1, connectionX, z2);
      }
    }

    // Generate chunk if it doesn't exist
    function ensureChunkGenerated(chunkX: number, chunkZ: number) {
      const chunkKey = getChunkKey(chunkX, chunkZ);
      if (!generatedChunks.has(chunkKey)) {
        generateChunkDFS(chunkX, chunkZ);
        generatedChunks.add(chunkKey);
      }
    }

    // === Retrieve or generate a maze cell at (x, z) ===
    function getCell(x: number, z: number) {
      const [chunkX, chunkZ] = getChunkCoords(x, z);
      ensureChunkGenerated(chunkX, chunkZ);
      
      const key = `${x},${z}`;
      return maze[key];
    }

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

export default MazeGameExperiment;