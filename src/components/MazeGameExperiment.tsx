import React, { useEffect, useRef, useState } from 'react';
import {
  // Import necessary Three.js classes
  PerspectiveCamera, Scene, Color, AmbientLight, DirectionalLight, WebGLRenderer,
  BoxGeometry, MeshStandardMaterial, InstancedMesh, PlaneGeometry, Mesh, DoubleSide,
  DynamicDrawUsage, Vector3, Matrix4, Quaternion, Box3, Frustum, MathUtils, Vector2,
  Clock // <-- Import the Clock
} from 'three';
import { Link } from 'react-router-dom';

// --- Type Definitions ---
type MazeCell = {
  north: boolean; east: boolean; south: boolean; west: boolean; visited: boolean;
};
type ControlMode = 'keyboard' | 'mouse';

// --- Constants ---
const MAZE_SIZE = 150;
const CELL_SIZE = 5;
const WALL_HEIGHT = 3;
const RENDER_DISTANCE = 12;
const MAX_WALL_INSTANCES = 2000;

// --- SOLUTION: Frame-rate independent constants ---
// These values now represent units per SECOND, not per frame.
const MOVE_SPEED = 5; // Roughly 0.08 * 60fps
const TURN_SPEED = 2.5; // Roughly 0.045 * 60fps
const MOUSE_SENSITIVITY = 0.002;
const TOUCH_SENSITIVITY = 0.003;

// Safeguard clamp for mouse input (optional but good practice)
const MAX_MOUSE_DELTA = 50;

const PLAYER_HEIGHT = 1.75;
const PLAYER_COLLIDER = new Vector3(0.5, PLAYER_HEIGHT * 2, 0.5);
const JOYSTICK_AREA_SIZE = 160;
const JOYSTICK_DEAD_ZONE = 0.1;
const DEFAULT_FOV = 70; // FOV for landscape
const PORTRAIT_FOV = 120; // Wider FOV for portrait to avoid "zoom"

// Reusable Three.js objects
const wallGeometry = new BoxGeometry(1, 1, 1);
const wallMaterial = new MeshStandardMaterial({ color: 0x808080 });
const groundGeometry = new PlaneGeometry(4000, 4000);
const groundMaterial = new MeshStandardMaterial({ color: 0x3a7e4f, side: DoubleSide });

// --- Better Mobile Detection ---
const isProbablyMobile = () => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const canHover = window.matchMedia('(hover: hover)').matches;
    return hasTouch && !canHover;
};

// --- Calculate Initial Player Position ---
const initialPlayerCellX = Math.floor(MAZE_SIZE / 2);
const initialPlayerCellZ = Math.floor(MAZE_SIZE / 2);
const initialPlayerPosition = new Vector3(
  initialPlayerCellX * CELL_SIZE + CELL_SIZE / 2,
  PLAYER_HEIGHT,
  initialPlayerCellZ * CELL_SIZE + CELL_SIZE / 2
);


const MazeGame: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const joystickThumbRef = useRef<HTMLDivElement>(null);
  const gameLoopId = useRef<number>();

  const [controlMode, setControlMode] = useState<ControlMode>('keyboard');
  const [isMobile, setIsMobile] = useState(isProbablyMobile());

  const threeJsState = useRef({
    camera: new PerspectiveCamera(DEFAULT_FOV, window.innerWidth / window.innerHeight, 0.1, 1000),
    scene: new Scene(),
    clock: new Clock(), // <-- NEW: Clock for tracking delta time
    wallInstances: new InstancedMesh(wallGeometry, wallMaterial, MAX_WALL_INSTANCES),
    maze: [] as MazeCell[][],
    playerPosition: initialPlayerPosition.clone(),
    playerRotation: 0,
    cameraPitch: 0,
    targetPlayerRotation: 0,
    targetCameraPitch: 0,
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

    // --- Pre-allocated objects for the animation loop to improve performance ---
    const tempMatrix = new Matrix4();
    const tempQuaternion = new Quaternion();
    const tempWallBox = new Box3();
    const tempPlayerBox = new Box3();
    const tempWallPosition = new Vector3();
    const tempWallScale = new Vector3();
    const moveVector = new Vector3();
    const nextPlayerPos = new Vector3();
    const frustum = new Frustum();
    const projScreenMatrix = new Matrix4();

    const init = () => {
      state.scene.background = new Color(0x87ceeb);
      state.camera.position.copy(state.playerPosition);
      state.camera.rotation.order = 'YXZ';
      state.scene.add(new AmbientLight(0x505050));
      const dirLight = new DirectionalLight(0xffffff, 0.5);
      dirLight.position.set(10, 15, 5);
      state.scene.add(dirLight);

      const renderer = new WebGLRenderer({ antialias: true });
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

      state.clock.start(); // Start the clock
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
        }
      }
    };

    // --- MODIFIED: processInput now accepts deltaTime ---
    const processInput = (deltaTime: number) => {
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
          // --- SOLUTION ---
          // Update the target rotation, scaled by deltaTime for consistent speed.
          if (state.keysPressed['a'] || state.keysPressed['arrowleft']) state.targetPlayerRotation += TURN_SPEED * deltaTime;
          if (state.keysPressed['d'] || state.keysPressed['arrowright']) state.targetPlayerRotation -= TURN_SPEED * deltaTime;
        }
      }

      if (moveVector.lengthSq() === 0) return;

      // --- SOLUTION ---
      // Scale final movement vector by MOVE_SPEED and deltaTime.
      moveVector.normalize().multiplyScalar(MOVE_SPEED * deltaTime);

      const currentPos = state.playerPosition;
      // Check X and Z movement separately for smoother wall sliding
      nextPlayerPos.copy(currentPos).add(new Vector3(moveVector.x, 0, 0));
      if (!isCollidingAt(nextPlayerPos)) currentPos.x = nextPlayerPos.x;
      nextPlayerPos.copy(currentPos).add(new Vector3(0, 0, moveVector.z));
      if (!isCollidingAt(nextPlayerPos)) currentPos.z = nextPlayerPos.z;
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
      tempQuaternion.identity();

      for (let x = cx - RENDER_DISTANCE; x <= cx + RENDER_DISTANCE; x++) {
        for (let z = cz - RENDER_DISTANCE; z <= cz + RENDER_DISTANCE; z++) {
          if (count >= MAX_WALL_INSTANCES) break;
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
        if (count >= MAX_WALL_INSTANCES) break;
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
    };

    const checkAndUpdateFov = () => {
        const { camera } = state;
        const isPortrait = camera.aspect < 1;

        if (isPortrait && camera.fov !== PORTRAIT_FOV) {
            camera.fov = PORTRAIT_FOV;
            camera.updateProjectionMatrix();
        } else if (!isPortrait && camera.fov !== DEFAULT_FOV) {
            camera.fov = DEFAULT_FOV;
            camera.updateProjectionMatrix();
        }
    };

    const animate = () => {
      gameLoopId.current = requestAnimationFrame(animate);
      
      // --- SOLUTION: Get deltaTime at the start of the loop ---
      const deltaTime = state.clock.getDelta();
      
      checkAndUpdateFov();
      processInput(deltaTime); // Pass deltaTime to the input handler

      // --- SOLUTION: Frame-rate Independent Smoothing ---
      // This formula ensures the smoothing feels consistent at any frame rate.
      // A higher 'smoothingConstant' makes the camera more responsive.
      const smoothingConstant = 20;
      const timeBasedSmoothingFactor = 1 - Math.exp(-smoothingConstant * deltaTime);

      state.playerRotation = MathUtils.lerp(state.playerRotation, state.targetPlayerRotation, timeBasedSmoothingFactor);
      state.cameraPitch = MathUtils.lerp(state.cameraPitch, state.targetCameraPitch, timeBasedSmoothingFactor);
      // --- End of new smoothing logic ---

      // Apply the final, smoothed rotation to the camera.
      state.camera.rotation.set(state.cameraPitch, state.playerRotation, 0);

      state.camera.position.copy(state.playerPosition);
      
      state.camera.updateMatrixWorld();
      projScreenMatrix.multiplyMatrices(state.camera.projectionMatrix, state.camera.matrixWorldInverse);
      frustum.setFromProjectionMatrix(projScreenMatrix);

      updateMazeSection(frustum);
      updateJoystickUI();
      rendererRef.current!.render(state.scene, state.camera);
    };

    init();

    return () => {
      if (gameLoopId.current) cancelAnimationFrame(gameLoopId.current);
      if (document.fullscreenElement) document.exitFullscreen();
      rendererRef.current?.dispose();
      wallGeometry.dispose();
      wallMaterial.dispose();
      groundGeometry.dispose();
      groundMaterial.dispose();
      state.wallInstances.dispose();
      if (gameContainerRef.current && rendererRef.current) {
        gameContainerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []); // This effect runs only once on mount

  // Effect for managing event listeners and dynamic UI based on device type
  useEffect(() => {
    const state = threeJsState.current;
    
    const handleKeyDown = (e: KeyboardEvent) => { state.keysPressed[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { state.keysPressed[e.key.toLowerCase()] = false; };
    const handleMouseMove = (e: MouseEvent) => {
      if (state.isPointerLocked) {
        // Clamp raw mouse input as a safeguard against huge delta values
        const movementX = MathUtils.clamp(e.movementX, -MAX_MOUSE_DELTA, MAX_MOUSE_DELTA);
        const movementY = MathUtils.clamp(e.movementY, -MAX_MOUSE_DELTA, MAX_MOUSE_DELTA);

        // Update the target values. The animate loop will handle the rest smoothly.
        state.targetPlayerRotation -= movementX * MOUSE_SENSITIVITY;
        state.targetCameraPitch -= movementY * MOUSE_SENSITIVITY;
        state.targetCameraPitch = MathUtils.clamp(state.targetCameraPitch, -Math.PI / 2, Math.PI / 2);
      }
    };
    const handlePointerLockChange = () => {
      state.isPointerLocked = document.pointerLockElement === gameContainerRef.current;
      if (!state.isPointerLocked) {
        setControlMode('keyboard');
        // Reset target to current rotation to prevent snapping when exiting pointer lock
        state.targetPlayerRotation = state.playerRotation;
        state.targetCameraPitch = state.cameraPitch;
      }
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
      const targetElement = e.target as HTMLElement;
      if (targetElement.closest('.hud-element')) return;
      e.preventDefault();

      const { touchState } = state;
      for (const touch of Array.from(e.changedTouches)) {
        const touchPos = new Vector2(touch.clientX, touch.clientY);
        if (touchPos.x < JOYSTICK_AREA_SIZE && touchPos.y > gameContainerRef.current!.clientHeight - JOYSTICK_AREA_SIZE && touchState.joystickIdentifier === null) {
          touchState.joystickIdentifier = touch.identifier;
          touchState.joystickCenter.copy(touchPos);
          touchState.joystickCurrent.copy(touchPos);
          touchState.joystickActive = true;
          if (joystickBaseRef.current) joystickBaseRef.current.style.opacity = '0.8';
        } else if (touchState.lookTouchIdentifier === null) {
          touchState.lookTouchIdentifier = touch.identifier;
          touchState.lookTouchStart.copy(touchPos);
          touchState.lookTouchCurrent.copy(touchPos);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
        const targetElement = e.target as HTMLElement;
        if (targetElement.closest('.hud-element')) return;
        e.preventDefault();

        const { touchState } = state;
        for (const touch of Array.from(e.changedTouches)) {
            if (touch.identifier === touchState.joystickIdentifier) {
              touchState.joystickCurrent.set(touch.clientX, touch.clientY);
            } else if (touch.identifier === touchState.lookTouchIdentifier) {
              touchState.lookTouchCurrent.set(touch.clientX, touch.clientY);
              const deltaX = touchState.lookTouchCurrent.x - touchState.lookTouchStart.x;
              const deltaY = touchState.lookTouchCurrent.y - touchState.lookTouchStart.y;
              
              // Update the target values. The animate loop handles smoothing.
              state.targetPlayerRotation -= deltaX * TOUCH_SENSITIVITY;
              state.targetCameraPitch -= deltaY * TOUCH_SENSITIVITY;
              state.targetCameraPitch = MathUtils.clamp(state.targetCameraPitch, -Math.PI / 2, Math.PI / 2);
              touchState.lookTouchStart.copy(touchState.lookTouchCurrent);
            }
        }
    };

    const handleTouchEnd = (e: TouchEvent) => {
        const targetElement = e.target as HTMLElement;
        if (targetElement.closest('.hud-element')) return;
        e.preventDefault();

        const { touchState } = state;
        for (const touch of Array.from(e.changedTouches)) {
            if (touch.identifier === touchState.joystickIdentifier) {
              touchState.joystickActive = false;
              touchState.joystickIdentifier = null;
              if (joystickThumbRef.current) joystickThumbRef.current.style.transform = `translate(0px, 0px)`;
              if (joystickBaseRef.current) joystickBaseRef.current.style.opacity = '0.5';
            } else if (touch.identifier === touchState.lookTouchIdentifier) {
              touchState.lookTouchIdentifier = null;
            }
        }
    };
    
    const onWindowResize = () => {
      const currentIsMobile = isProbablyMobile();
      setIsMobile(currentIsMobile);
      const container = gameContainerRef.current;
      if (rendererRef.current && container) {
          const width = container.clientWidth;
          const height = container.clientHeight;
          rendererRef.current.setSize(width, height);
          state.camera.aspect = width / height;
          // FOV is automatically adjusted in the animate loop
      }
    };

    onWindowResize();

    const touchOptions = { passive: false };
    const toggleButton = document.getElementById('toggle-mode');
    
    window.addEventListener('resize', onWindowResize);
    
    const joystick = joystickBaseRef.current;
    if (joystick) {
        joystick.classList.toggle('joystick-hidden', !isMobile);
    }

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
    
    return () => {
      window.removeEventListener('resize', onWindowResize);
      gameContainerRef.current?.removeEventListener('touchstart', handleTouchStart);
      gameContainerRef.current?.removeEventListener('touchmove', handleTouchMove);
      gameContainerRef.current?.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      if (toggleButton) toggleButton.removeEventListener('click', toggleControlMode);
    };
  }, [isMobile]);

  return (
    <>
      <style>{`
        /* CSS styles remain unchanged */
        body { margin:0; overflow:hidden; font-family:Arial,sans-serif; }
        #game-container { position:relative; width:100vw; height: 100dvh; background:#000; cursor: default; -webkit-tap-highlight-color: transparent; }
        .hud-element { position:absolute; background:rgba(0,0,0,0.5); color:#fff; padding:10px; border-radius:5px; z-index:100; user-select: none; }
        #back-button { top:10px; left:10px; border:1px solid #fff; text-decoration: none; display:flex; align-items:center; cursor: pointer; }
        #back-button .icon { margin-right:5px; }
        #hud { top:60px; left:10px; }
        #instructions { bottom:10px; left:50%; transform:translateX(-50%); text-align:center; padding: 5px 10px; pointer-events: none; }
        #toggle-mode { top:10px; right:10px; border:1px solid #fff; cursor:pointer; }
        #joystick-base { position: absolute; bottom: 30px; left: 30px; width: 120px; height: 120px; background: rgba(128, 128, 128, 0.5); border: 2px solid rgba(255, 255, 255, 0.5); border-radius: 50%; z-index: 110; display: flex; justify-content: center; align-items: center; transition: opacity 0.2s; }
        #joystick-thumb { width: 60px; height: 60px; background: rgba(220, 220, 220, 0.7); border-radius: 50%; transition: transform 0.05s; }
        .joystick-hidden { display: none !important; }
      `}</style>
      <div id="game-container" ref={gameContainerRef}>
        <Link id="back-button" className="hud-element" to="/"><span className="icon">←</span> Back to Website</Link>
        {!isMobile && (
          <>
            <div id="hud" className="hud-element">
              <div>Mode: {controlMode}</div>
            </div>
            <button id="toggle-mode" className="hud-element">
              Toggle Control Mode
            </button>
          </>
        )}
        <div id="joystick-base" ref={joystickBaseRef} className="joystick-hidden">
            <div id="joystick-thumb" ref={joystickThumbRef}></div>
        </div>
      </div>
    </>
  );
};

export default MazeGame;