// src/components/MazeGame.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  // Import necessary Three.js classes
  PerspectiveCamera, Scene, Color, AmbientLight, DirectionalLight, WebGLRenderer,
  BoxGeometry, MeshStandardMaterial, InstancedMesh, PlaneGeometry, Mesh, DoubleSide,
  DynamicDrawUsage, Vector3, Matrix4, Quaternion, Box3, Frustum, MathUtils, Vector2
} from 'three';
import { Link } from 'react-router-dom';

// --- Type Definitions ---
type MazeCell = {
  north: boolean; east: boolean; south: boolean; west: boolean; visited: boolean;
};
type ControlMode = 'keyboard' | 'mouse';

// --- Constants ---
const MAZE_SIZE = 30;
const CELL_SIZE = 5;
const WALL_HEIGHT = 3;
const RENDER_DISTANCE = 8;
const MAX_WALL_INSTANCES = 2000;
const MOVE_SPEED = 0.1;
const TURN_SPEED = 0.03;
const MOUSE_SENSITIVITY = 0.002;
const TOUCH_SENSITIVITY = 0.003;
const PLAYER_HEIGHT = 1.0;
const PLAYER_COLLIDER = new Vector3(0.5, PLAYER_HEIGHT * 2, 0.5);
const JOYSTICK_AREA_SIZE = 160; // Increased size for better touch accuracy
const JOYSTICK_DEAD_ZONE = 0.1;

// Reusable Three.js objects
const wallGeometry = new BoxGeometry(1, 1, 1);
const wallMaterial = new MeshStandardMaterial({ color: 0x808080 });
const groundGeometry = new PlaneGeometry(1000, 1000);
const groundMaterial = new MeshStandardMaterial({ color: 0x3a7e4f, side: DoubleSide });

// --- Better Mobile Detection ---
// Checks for touch support and lack of hover capability. This correctly identifies
// mobile devices even in landscape mode, while mostly excluding touchscreen laptops.
const isProbablyMobile = () => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const canHover = window.matchMedia('(hover: hover)').matches;
    return hasTouch && !canHover;
};


const MazeGame: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const joystickThumbRef = useRef<HTMLDivElement>(null);
  const gameLoopId = useRef<number>();

  const [controlMode, setControlMode] = useState<ControlMode>('keyboard');
  const [positionDisplay, setPositionDisplay] = useState('0, 0, 0');
  // Initialize state directly from the detection function
  const [isMobile, setIsMobile] = useState(isProbablyMobile());

  const threeJsState = useRef({
    camera: new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
    scene: new Scene(),
    wallInstances: new InstancedMesh(wallGeometry, wallMaterial, MAX_WALL_INSTANCES),
    maze: [] as MazeCell[][],
    playerPosition: new Vector3(CELL_SIZE / 2, PLAYER_HEIGHT, CELL_SIZE / 2),
    playerRotation: 0, // Yaw
    cameraPitch: 0,    // Pitch
    keysPressed: {} as Record<string, boolean>,
    isPointerLocked: false,
    touchState: {
        joystickActive: false,
        joystickIdentifier: null as number | null,
        joystickCenter: new Vector2(),
        joystickCurrent: new Vector2(),
        lookTouchIdentifier: null as number | null,
        lookTouchStart: new Vector2(),
        lookTouchCurrent: new Vector2()
    }
  });

  // Effect for ONE-TIME scene setup
  useEffect(() => {
    const state = threeJsState.current;
    
    const tempMatrix = new Matrix4();
    const tempQuaternion = new Quaternion();
    const tempWallBox = new Box3();
    const tempPlayerBox = new Box3();
    const tempWallPosition = new Vector3();
    const tempWallScale = new Vector3();
    const moveVector = new Vector3();
    const nextPlayerPos = new Vector3();

    const init = () => {
      if (isMobile && gameContainerRef.current) {
        gameContainerRef.current.requestFullscreen().catch(err => {
          console.log(`Fullscreen request failed: ${err.message}`);
        });
      }
      
      state.scene.background = new Color(0x87ceeb);
      state.camera.position.copy(state.playerPosition);
      state.camera.rotation.order = 'YXZ';
      state.scene.add(new AmbientLight(0x505050));
      const dirLight = new DirectionalLight(0xffffff, 0.5);
      dirLight.position.set(10, 15, 5);
      state.scene.add(dirLight);

      const renderer = new WebGLRenderer({ antialias: true });
      // Use the container's client dimensions for the renderer size
      if (gameContainerRef.current) {
        renderer.setSize(gameContainerRef.current.clientWidth, gameContainerRef.current.clientHeight);
      }
      rendererRef.current = renderer;
      gameContainerRef.current!.appendChild(renderer.domElement);

      generateMaze();
      state.wallInstances.instanceMatrix.setUsage(DynamicDrawUsage);
      state.scene.add(state.wallInstances);
      const ground = new Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      state.scene.add(ground);
      
      animate();
    };

    const generateMaze = () => {
        state.maze = Array.from({ length: MAZE_SIZE }, () =>
        Array.from({ length: MAZE_SIZE }, () => ({
          north: true, east: true, south: true, west: true, visited: false
        }))
      );
      const stack: { x: number, z: number }[] = [];
      let current = { x: 0, z: 0 };
      state.maze[current.x][current.z].visited = true;
      let visitedCells = 1;
    
      while (visitedCells < MAZE_SIZE * MAZE_SIZE) {
        const neighbors = [];
        const { x, z } = current;
        if (z > 0 && !state.maze[x][z - 1].visited) neighbors.push({ x, z: z - 1, dir: 'north' });
        if (x < MAZE_SIZE - 1 && !state.maze[x + 1][z].visited) neighbors.push({ x: x + 1, z, dir: 'east' });
        if (z < MAZE_SIZE - 1 && !state.maze[x][z + 1].visited) neighbors.push({ x, z: z + 1, dir: 'south' });
        if (x > 0 && !state.maze[x - 1][z].visited) neighbors.push({ x: x - 1, z, dir: 'west' });
    
        if (neighbors.length > 0) {
          const next = neighbors[Math.floor(Math.random() * neighbors.length)];
          stack.push(current);
    
          if (next.dir === 'north') { state.maze[x][z].north = false; state.maze[next.x][next.z].south = false; }
          else if (next.dir === 'east') { state.maze[x][z].east = false; state.maze[next.x][next.z].west = false; }
          else if (next.dir === 'south') { state.maze[x][z].south = false; state.maze[next.x][next.z].north = false; }
          else if (next.dir === 'west') { state.maze[x][z].west = false; state.maze[next.x][next.z].east = false; }
    
          current = { x: next.x, z: next.z };
          state.maze[current.x][current.z].visited = true;
          visitedCells++;
        } else if (stack.length > 0) {
          current = stack.pop()!;
        } else {
          let found = false;
          for (let i = 0; i < MAZE_SIZE && !found; i++) {
            for (let j = 0; j < MAZE_SIZE && !found; j++) {
              if (!state.maze[i][j].visited) {
                current = { x: i, z: j };
                state.maze[i][j].visited = true;
                visitedCells++;
                found = true;
              }
            }
          }
        }
      }
    };
    
    const processInput = () => {
      moveVector.set(0, 0, 0);
      const forward = new Vector3(Math.sin(state.playerRotation), 0, Math.cos(state.playerRotation));
      const right = new Vector3(forward.z, 0, -forward.x);

      if (isMobile && state.touchState.joystickActive) {
          const { joystickCenter, joystickCurrent } = state.touchState;
          const offset = joystickCurrent.clone().sub(joystickCenter);
          const maxOffset = JOYSTICK_AREA_SIZE / 3;
          let forwardAmount = -offset.y / maxOffset;
          let strafeAmount = offset.x / maxOffset;

          if (Math.abs(forwardAmount) > 1) forwardAmount = Math.sign(forwardAmount);
          if (Math.abs(strafeAmount) > 1) strafeAmount = Math.sign(strafeAmount);

          if (Math.abs(forwardAmount) > JOYSTICK_DEAD_ZONE) moveVector.sub(forward.clone().multiplyScalar(forwardAmount));
          if (Math.abs(strafeAmount) > JOYSTICK_DEAD_ZONE) moveVector.add(right.clone().multiplyScalar(strafeAmount));
      } else if (!isMobile) {
        if (state.keysPressed['w'] || state.keysPressed['arrowup']) moveVector.sub(forward);
        if (state.keysPressed['s'] || state.keysPressed['arrowdown']) moveVector.add(forward);
        if (controlMode === 'mouse') {
          if (state.keysPressed['a'] || state.keysPressed['arrowleft']) moveVector.sub(right);
          if (state.keysPressed['d'] || state.keysPressed['arrowright']) moveVector.add(right);
        } else {
          if (state.keysPressed['a'] || state.keysPressed['arrowleft']) state.playerRotation += TURN_SPEED;
          if (state.keysPressed['d'] || state.keysPressed['arrowright']) state.playerRotation -= TURN_SPEED;
        }
      }
      
      moveVector.normalize().multiplyScalar(MOVE_SPEED);

      const currentPos = state.playerPosition;
      nextPlayerPos.copy(currentPos).add(new Vector3(moveVector.x, 0, 0));
      if (!isCollidingAt(nextPlayerPos)) currentPos.x = nextPlayerPos.x;
      nextPlayerPos.copy(currentPos).add(new Vector3(0, 0, moveVector.z));
      if (!isCollidingAt(nextPlayerPos)) currentPos.z = nextPlayerPos.z;

      setPositionDisplay(`${currentPos.x.toFixed(1)}, ${currentPos.y.toFixed(1)}, ${currentPos.z.toFixed(1)}`);
    };

    const isCollidingAt = (predictedPos: Vector3): boolean => {
      tempPlayerBox.setFromCenterAndSize(predictedPos, PLAYER_COLLIDER);
      const cx = Math.floor(predictedPos.x / CELL_SIZE);
      const cz = Math.floor(predictedPos.z / CELL_SIZE);
      for (let x = cx - 1; x <= cx + 1; x++) {
        for (let z = cz - 1; z <= cz + 1; z++) {
          if (x < 0 || x >= MAZE_SIZE || z < 0 || z >= MAZE_SIZE) continue;
          const cell = state.maze[x][z];
          const checkWall = (dir: 'north' | 'east' | 'south' | 'west') => {
            if (!cell[dir]) return false;
            getWallTransform(tempWallPosition, tempWallScale, x, z, dir);
            tempWallBox.setFromCenterAndSize(tempWallPosition, tempWallScale);
            return tempPlayerBox.intersectsBox(tempWallBox);
          };
          if (checkWall('north') || checkWall('east') || checkWall('south') || checkWall('west')) return true;
        }
      }
      return false;
    };
    
    const getWallTransform = (pos: Vector3, scale: Vector3, x: number, z: number, dir: string) => {
      const cx = x * CELL_SIZE; const cz = z * CELL_SIZE;
      let wallX, wallZ, scaleX, scaleZ;
      switch (dir) {
        case 'north': wallX = cx + CELL_SIZE / 2; wallZ = cz; scaleX = CELL_SIZE; scaleZ = 0.3; break;
        case 'east': wallX = cx + CELL_SIZE; wallZ = cz + CELL_SIZE / 2; scaleX = 0.3; scaleZ = CELL_SIZE; break;
        case 'south': wallX = cx + CELL_SIZE / 2; wallZ = cz + CELL_SIZE; scaleX = CELL_SIZE; scaleZ = 0.3; break;
        case 'west': wallX = cx; wallZ = cz + CELL_SIZE / 2; scaleX = 0.3; scaleZ = CELL_SIZE; break;
        default: return;
      }
      pos.set(wallX, WALL_HEIGHT / 2, wallZ);
      scale.set(scaleX, WALL_HEIGHT, scaleZ);
    };

    const updateMazeSection = (frustum: Frustum) => {
      const cx = Math.floor(state.playerPosition.x / CELL_SIZE);
      const cz = Math.floor(state.playerPosition.z / CELL_SIZE);
      let count = 0;
      for (let x = cx - RENDER_DISTANCE; x <= cx + RENDER_DISTANCE && count < MAX_WALL_INSTANCES; x++) {
        for (let z = cz - RENDER_DISTANCE; z <= cz + RENDER_DISTANCE && count < MAX_WALL_INSTANCES; z++) {
          if (x < 0 || x >= MAZE_SIZE || z < 0 || z >= MAZE_SIZE) continue;
          const cell = state.maze[x][z];
          const checkAndSetWall = (dir: 'north' | 'east' | 'south' | 'west') => {
            if (cell[dir]) {
              getWallTransform(tempWallPosition, tempWallScale, x, z, dir);
              tempWallBox.setFromCenterAndSize(tempWallPosition, tempWallScale);
              if (frustum.intersectsBox(tempWallBox)) {
                if (count < MAX_WALL_INSTANCES) {
                  tempMatrix.compose(tempWallPosition, tempQuaternion, tempWallScale);
                  state.wallInstances.setMatrixAt(count++, tempMatrix);
                }
              }
            }
          };
          checkAndSetWall('north'); checkAndSetWall('east'); checkAndSetWall('south'); checkAndSetWall('west');
        }
      }
      state.wallInstances.count = count;
      state.wallInstances.instanceMatrix.needsUpdate = true;
    };

    const updateJoystickUI = () => {
        if (isMobile && state.touchState.joystickActive && joystickThumbRef.current) {
            const { joystickCenter, joystickCurrent } = state.touchState;
            const offset = joystickCurrent.clone().sub(joystickCenter);
            const maxOffset = JOYSTICK_AREA_SIZE / 3;
            if (offset.length() > maxOffset) {
                offset.normalize().multiplyScalar(maxOffset);
            }
            joystickThumbRef.current.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
        }
    }

    const animate = () => {
      gameLoopId.current = requestAnimationFrame(animate);
      processInput();
      state.camera.position.copy(state.playerPosition);
      state.camera.rotation.set(state.cameraPitch, state.playerRotation, 0);
      state.camera.updateMatrixWorld();
      const frustum = new Frustum().setFromProjectionMatrix(
        new Matrix4().multiplyMatrices(state.camera.projectionMatrix, state.camera.matrixWorldInverse)
      );
      updateMazeSection(frustum);
      updateJoystickUI();
      rendererRef.current!.render(state.scene, state.camera);
    };

    init();

    return () => {
      if (gameLoopId.current) cancelAnimationFrame(gameLoopId.current);
      if (document.fullscreenElement) document.exitFullscreen();
      rendererRef.current?.dispose();
      state.wallInstances.dispose();
      if (gameContainerRef.current && rendererRef.current) {
        gameContainerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []); // This effect runs only once to set up the scene

  // Effect for managing event listeners based on device type
  useEffect(() => {
    const state = threeJsState.current;
    
    // --- Define all event handlers here ---
    const handleKeyDown = (e: KeyboardEvent) => { state.keysPressed[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { state.keysPressed[e.key.toLowerCase()] = false; };
    const handleMouseMove = (e: MouseEvent) => {
      if (state.isPointerLocked) {
        state.playerRotation -= e.movementX * MOUSE_SENSITIVITY;
        state.cameraPitch -= e.movementY * MOUSE_SENSITIVITY;
        state.cameraPitch = MathUtils.clamp(state.cameraPitch, -Math.PI / 2, Math.PI / 2);
      }
    };
    const handlePointerLockChange = () => {
      state.isPointerLocked = document.pointerLockElement === gameContainerRef.current;
      if (!state.isPointerLocked) setControlMode('keyboard');
    };
    const toggleControlMode = () => {
      setControlMode(prevMode => {
        const newMode = prevMode === 'keyboard' ? 'mouse' : 'keyboard';
        if (newMode === 'mouse') gameContainerRef.current?.requestPointerLock();
        else document.exitPointerLock();
        return newMode;
      });
    };
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const { touchState } = state;
      for (const touch of Array.from(e.changedTouches)) {
        const touchPos = new Vector2(touch.clientX, touch.clientY);
        // Use window.innerHeight to correctly determine joystick area
        if (touchPos.x < JOYSTICK_AREA_SIZE && touchPos.y > window.innerHeight - JOYSTICK_AREA_SIZE && touchState.joystickIdentifier === null) {
          touchState.joystickIdentifier = touch.identifier;
          touchState.joystickCenter.copy(touchPos);
          touchState.joystickCurrent.copy(touchPos);
          touchState.joystickActive = true;
        } else if (touchState.lookTouchIdentifier === null) {
          touchState.lookTouchIdentifier = touch.identifier;
          touchState.lookTouchStart.copy(touchPos);
          touchState.lookTouchCurrent.copy(touchPos);
        }
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const { touchState } = state;
      for (const touch of Array.from(e.changedTouches)) {
        if (touch.identifier === touchState.joystickIdentifier) {
          touchState.joystickCurrent.set(touch.clientX, touch.clientY);
        } else if (touch.identifier === touchState.lookTouchIdentifier) {
          touchState.lookTouchCurrent.set(touch.clientX, touch.clientY);
          const deltaX = touchState.lookTouchCurrent.x - touchState.lookTouchStart.x;
          const deltaY = touchState.lookTouchCurrent.y - touchState.lookTouchStart.y;
          state.playerRotation -= deltaX * TOUCH_SENSITIVITY;
          state.cameraPitch -= deltaY * TOUCH_SENSITIVITY;
          state.cameraPitch = MathUtils.clamp(state.cameraPitch, -Math.PI / 2, Math.PI / 2);
          touchState.lookTouchStart.copy(touchState.lookTouchCurrent);
        }
      }
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const { touchState } = state;
      for (const touch of Array.from(e.changedTouches)) {
        if (touch.identifier === touchState.joystickIdentifier) {
          touchState.joystickActive = false;
          touchState.joystickIdentifier = null;
          if (joystickThumbRef.current) joystickThumbRef.current.style.transform = `translate(0px, 0px)`;
        } else if (touch.identifier === touchState.lookTouchIdentifier) {
          touchState.lookTouchIdentifier = null;
        }
      }
    };
    
    // This handler will re-check the device type and update the state
    const onWindowResize = () => {
      setIsMobile(isProbablyMobile());
      const container = gameContainerRef.current;
      if (rendererRef.current && container) {
          // Set container height to deal with mobile browser UI
          container.style.height = `${window.innerHeight}px`;
          
          state.camera.aspect = container.clientWidth / container.clientHeight;
          state.camera.updateProjectionMatrix();
          rendererRef.current.setSize(container.clientWidth, container.clientHeight);
      }
    };
    
    // Initial resize call
    onWindowResize();

    // --- Add and remove listeners based on the current `isMobile` state ---
    const touchOptions = { passive: false };
    const toggleButton = document.getElementById('toggle-mode');
    
    window.addEventListener('resize', onWindowResize);
    if (isMobile) {
      gameContainerRef.current?.addEventListener('touchstart', handleTouchStart, touchOptions);
      gameContainerRef.current?.addEventListener('touchmove', handleTouchMove, touchOptions);
      gameContainerRef.current?.addEventListener('touchend', handleTouchEnd, touchOptions);
    } else {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('pointerlockchange', handlePointerLockChange);
      if (toggleButton) toggleButton.addEventListener('click', toggleControlMode);
    }
    
    // The cleanup function for this effect
    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (isMobile) {
        gameContainerRef.current?.removeEventListener('touchstart', handleTouchStart);
        gameContainerRef.current?.removeEventListener('touchmove', handleTouchMove);
        gameContainerRef.current?.removeEventListener('touchend', handleTouchEnd);
      } else {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('pointerlockchange', handlePointerLockChange);
        if (toggleButton) toggleButton.removeEventListener('click', toggleControlMode);
      }
    };
  }, [isMobile]); // Re-run this effect if `isMobile` changes

  return (
    <>
      <style>{`
        body { margin:0; overflow:hidden; font-family:Arial,sans-serif; }
        /* Set container to fill the window and correct height issues on mobile */
        #game-container { 
            position:relative; 
            width:100vw; 
            /* Height will be set dynamically by JS to avoid 100vh issues */
            height: 100%; 
            background:#000; 
            cursor: default; 
            -webkit-tap-highlight-color: transparent; 
        }
        .hud-element { position:absolute; background:rgba(0,0,0,0.5); color:#fff; padding:10px; border-radius:5px; z-index:100; user-select: none; }
        #back-button { top:10px; left:10px; border:1px solid #fff; text-decoration: none; display:flex; align-items:center; cursor: pointer; }
        #back-button .icon { margin-right:5px; }
        #hud { top:60px; left:10px; }
        #instructions { bottom:10px; left:50%; transform:translateX(-50%); text-align:center; padding: 5px 10px; }
        #toggle-mode { top:10px; right:10px; border:1px solid #fff; cursor:pointer; }
        
        #joystick-base {
            position: absolute;
            bottom: 30px;
            left: 30px;
            width: 120px;
            height: 120px;
            background: rgba(128, 128, 128, 0.5);
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            z-index: 110;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #joystick-thumb {
            width: 60px;
            height: 60px;
            background: rgba(220, 220, 220, 0.7);
            border-radius: 50%;
        }
      `}</style>
      <div id="game-container" ref={gameContainerRef}>
        <Link id="back-button" className="hud-element" to="/"><span className="icon">←</span> Back to Website</Link>
        <div id="hud" className="hud-element">
          <div>Position: <span>{positionDisplay}</span></div>
          {!isMobile && (
            <div>Mode: {controlMode}</div>
          )}
        </div>
        <div id="instructions" className="hud-element">
            {isMobile ? "Use the joystick to move. Drag anywhere else to look." : (
                controlMode === 'keyboard' ? "W/A/S/D or Arrows to move and turn." : "Mouse to look | W/A/S/D to move/strafe | 'Esc' to release."
            )}
        </div>
        {!isMobile && (
            <button id="toggle-mode" className="hud-element">
                Toggle Control Mode
            </button>
        )}
        {isMobile && (
            <div id="joystick-base" ref={joystickBaseRef}>
                <div id="joystick-thumb" ref={joystickThumbRef}></div>
            </div>
        )}
      </div>
    </>
  );
};

export default MazeGame;