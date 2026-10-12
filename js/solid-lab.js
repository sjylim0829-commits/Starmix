/**
 * Starmix Similarity Lab - Solid Geometry Module (v3.0)
 * - Multi-Solid Figures: Cuboid (직육면체), Triangular Pyramid (삼각뿔), Cylinder (원기둥)
 * - Multi-Material Face Highlighting & Raycasting
 * - Real-Time 3D Edge & Radius Dimension Labels (Sprites)
 * - Smooth Camera Focus Animation & Close-Up
 * - Detached Face Pop-Out & Exploded Comparison (3D 분리 추출 및 평면 1:1 비교)
 * - 2D Flat Face Stage (Canvas) with Side-by-Side & Overlay modes for Rectangles, Triangles, and Circles
 * - Textbook-aligned mathematical proofs for Middle School Grade 2
 */

class SolidLab {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Shape State: 'cuboid' | 'pyramid' | 'cylinder'
    this.currentShape = 'cuboid';

    // Meshes & Materials
    this.baseMesh = null;
    this.transMesh = null;
    this.baseMaterials = [];
    this.transMaterials = [];
    this.gridHelper = null;
    this.labelsGroup = null;
    this.detachedGroup = null;

    // Scale State
    this.scaleX = 1.5; // Width or Radius
    this.scaleZ = 1.5; // Depth
    this.scaleY = 1.5; // Height

    // Selected face
    this.selectedFace = 'front';
    this.showDimensions = true;

    // Smooth Camera Animation State
    this.isAnimating = false;
    this.animStartTime = 0;
    this.animDuration = 850;
    this.startCamPos = new THREE.Vector3();
    this.targetCamPos = new THREE.Vector3();
    this.startLookAt = new THREE.Vector3();
    this.targetLookAt = new THREE.Vector3();
    this.currentLookAt = new THREE.Vector3(0, 2.0, 0);

    // Detached Face Pop-Out Animation State
    this.isDetaching = false;
    this.detachProgress = 0.0;
    this.targetDetachProgress = 0.0;
    this.detachStartTime = 0;
    this.startDetachVal = 0.0;

    // 2D Flat Face Stage
    this.flatStageActive = false;
    this.flatOverlayMode = false;
    this.flatCanvas = null;
    this.flatCtx = null;
    this.flatStageEl = null;

    this.init();
  }

  init() {
    this.setupThree();
    this.setupShapeSwitcher();
    this.setupControls();
    this.setupRaycasting();
    this.initFlatFaceStage();
    this.setShape('cuboid', false);
    this.animate();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupThree() {
    const parent = this.canvas.parentElement;
    const width = parent.clientWidth || 800;
    const height = Math.max(260, parent.clientHeight || 420);

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8fafc);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(7.5, 6.5, 10.5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.88);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
    dirLight.position.set(12, 22, 12);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    // Ground Grid
    this.gridHelper = new THREE.GridHelper(24, 24, 0x94a3b8, 0xe2e8f0);
    this.gridHelper.position.y = -0.01;
    this.scene.add(this.gridHelper);

    // Labels & Detached Faces Groups
    this.labelsGroup = new THREE.Group();
    this.scene.add(this.labelsGroup);

    this.detachedGroup = new THREE.Group();
    this.scene.add(this.detachedGroup);

    // OrbitControls
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
      this.controls.target.copy(this.currentLookAt);
    }
  }

  /* ---------------- Shape Switching & Dynamic UI ---------------- */
  setupShapeSwitcher() {
    const switcher = document.getElementById('solidShapeSwitcher');
    if (!switcher) return;

    switcher.querySelectorAll('.submode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const shape = btn.dataset.shape;
        if (shape && shape !== this.currentShape) {
          this.setShape(shape, true);
        }
      });
    });
  }

  setShape(shapeKey, userTriggered = false) {
    this.currentShape = shapeKey;

    // 1. Update Switcher Buttons
    const switcher = document.getElementById('solidShapeSwitcher');
    if (switcher) {
      switcher.querySelectorAll('.submode-btn').forEach(btn => {
        if (btn.dataset.shape === shapeKey) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // 2. Update Toolbar Title
    const titleEl = document.getElementById('solidToolbarTitle');
    if (titleEl) {
      if (shapeKey === 'cuboid') {
        titleEl.innerHTML = '🧊 기준 직육면체: <b>가로 2 × 세로 3 × 높이 4</b>';
      } else if (shapeKey === 'pyramid') {
        titleEl.innerHTML = '🔺 기준 삼각뿔: <b>밑변 3 × 깊이 3 × 높이 4</b>';
      } else if (shapeKey === 'cylinder') {
        titleEl.innerHTML = '🥫 기준 원기둥: <b>밑면 반지름 2 × 높이 4</b>';
      }
    }

    // 3. Update Slider Label
    const scaleAllLabel = document.getElementById('solidScaleAllLabel');
    if (scaleAllLabel) {
      if (shapeKey === 'cylinder') {
        scaleAllLabel.textContent = '전체 균일 확대 (반지름 & 높이 k배)';
      } else {
        scaleAllLabel.textContent = '전체 모서리 균일 확대 (k배)';
      }
    }

    // 4. Update Face Chips
    const chipsGroup = document.getElementById('solidFaceChipsGroup');
    if (chipsGroup) {
      if (shapeKey === 'cuboid') {
        chipsGroup.innerHTML = `
          <button class="face-select-chip active" data-face="front">앞면 (2×4)</button>
          <button class="face-select-chip" data-face="top">윗면 (2×3)</button>
          <button class="face-select-chip" data-face="side">옆면 (3×4)</button>
        `;
        this.selectedFace = 'front';
      } else if (shapeKey === 'pyramid') {
        chipsGroup.innerHTML = `
          <button class="face-select-chip active" data-face="front">앞쪽 옆면 (3×4)</button>
          <button class="face-select-chip" data-face="bottom">밑면 (3×3)</button>
          <button class="face-select-chip" data-face="side">옆면 (경사 삼각형)</button>
        `;
        this.selectedFace = 'front';
      } else if (shapeKey === 'cylinder') {
        chipsGroup.innerHTML = `
          <button class="face-select-chip active" data-face="circle">밑면 (원, r=2)</button>
          <button class="face-select-chip" data-face="side">옆면 전개도 (직사각형)</button>
          <button class="face-select-chip" data-face="profile">정면 단면 (4×4)</button>
        `;
        this.selectedFace = 'circle';
      }

      chipsGroup.querySelectorAll('.face-select-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.preventDefault();
          this.selectFace(chip.dataset.face, true);
        });
      });
    }

    // 5. Reset camera or detached state if user triggered
    if (userTriggered) {
      this.resetCameraView();
    }

    // 6. Create Meshes for the chosen shape
    this.createMeshes();
    this.selectFace(this.selectedFace, false);
  }

  /* ---------------- 3D Geometry Creation ---------------- */
  createGeometry() {
    if (this.currentShape === 'cuboid') {
      // Standard Cuboid: Width 2 (X), Height 4 (Y), Depth 3 (Z)
      return new THREE.BoxGeometry(2.0, 4.0, 3.0);
    } else if (this.currentShape === 'pyramid') {
      // Triangular Pyramid (Tetrahedron) with distinct face groups
      // Apex A(0, 4.0, 0), Base triangle on ground: B(-1.5, 0, 1.2), C(1.5, 0, 1.2), D(0, 0, -1.8)
      const geom = new THREE.BufferGeometry();
      const positions = new Float32Array([
        // Face 0: Front Triangle (Apex, B, C)
        0, 4.0, 0,    -1.5, 0, 1.2,    1.5, 0, 1.2,
        // Face 1: Right Side (Apex, C, D)
        0, 4.0, 0,     1.5, 0, 1.2,    0, 0, -1.8,
        // Face 2: Left Side (Apex, D, B)
        0, 4.0, 0,     0, 0, -1.8,    -1.5, 0, 1.2,
        // Face 3: Bottom Base (B, D, C)
        -1.5, 0, 1.2,  0, 0, -1.8,     1.5, 0, 1.2
      ]);
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.addGroup(0, 3, 0); // Front
      geom.addGroup(3, 3, 1); // Right Side
      geom.addGroup(6, 3, 2); // Left Side
      geom.addGroup(9, 3, 3); // Bottom
      geom.computeVertexNormals();
      return geom;
    } else if (this.currentShape === 'cylinder') {
      // Cylinder: radiusTop=2.0, radiusBottom=2.0, height=4.0, segments=36
      // Group 0: side, Group 1: top cap, Group 2: bottom cap
      return new THREE.CylinderGeometry(2.0, 2.0, 4.0, 36);
    }
  }

  createMeshes() {
    if (this.baseMesh) this.scene.remove(this.baseMesh);
    if (this.transMesh) this.scene.remove(this.transMesh);

    const geom = this.createGeometry();

    // 1. Base Materials (Emerald Green)
    let materialCount = 6;
    if (this.currentShape === 'pyramid') materialCount = 4;
    else if (this.currentShape === 'cylinder') materialCount = 3;

    this.baseMaterials = [];
    for (let i = 0; i < materialCount; i++) {
      this.baseMaterials.push(new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      }));
    }

    this.baseMesh = new THREE.Mesh(geom, this.baseMaterials);
    if (this.currentShape === 'pyramid') {
      this.baseMesh.position.set(-3.5, 0, 0);
    } else {
      this.baseMesh.position.set(-3.5, 2.0, 0);
    }
    this.baseMesh.castShadow = true;

    // Edges
    let edgesGeom = null;
    if (this.currentShape === 'cylinder') {
      edgesGeom = new THREE.EdgesGeometry(geom, 25);
    } else {
      edgesGeom = new THREE.EdgesGeometry(geom);
    }

    const baseEdges = new THREE.LineSegments(
      edgesGeom,
      new THREE.LineBasicMaterial({ color: 0x047857, linewidth: 2 })
    );
    this.baseMesh.add(baseEdges);
    this.scene.add(this.baseMesh);

    // 2. Transformed Mesh
    this.updateTransformedMesh();
  }

  updateTransformedMesh() {
    if (this.transMesh) {
      this.scene.remove(this.transMesh);
    }

    const geom = this.createGeometry();

    // Check similarity according to figure type
    let isSimilar = false;
    if (this.currentShape === 'cylinder') {
      isSimilar = Math.abs(this.scaleX - this.scaleY) < 0.01;
    } else {
      isSimilar = (Math.abs(this.scaleX - this.scaleY) < 0.01) && (Math.abs(this.scaleY - this.scaleZ) < 0.01);
    }

    const color = isSimilar ? 0x4f46e5 : 0xef4444;
    const edgeColor = isSimilar ? 0x312e81 : 0x991b1b;

    let materialCount = 6;
    if (this.currentShape === 'pyramid') materialCount = 4;
    else if (this.currentShape === 'cylinder') materialCount = 3;

    this.transMaterials = [];
    for (let i = 0; i < materialCount; i++) {
      this.transMaterials.push(new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      }));
    }

    this.transMesh = new THREE.Mesh(geom, this.transMaterials);

    if (this.currentShape === 'cuboid') {
      this.transMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);
      this.transMesh.position.set(3.5, (4.0 * this.scaleY) / 2, 0);
    } else if (this.currentShape === 'pyramid') {
      this.transMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);
      this.transMesh.position.set(3.5, 0, 0);
    } else if (this.currentShape === 'cylinder') {
      // Cylinder radius scale in X & Z is scaleX; height scale in Y is scaleY
      this.transMesh.scale.set(this.scaleX, this.scaleY, this.scaleX);
      this.transMesh.position.set(3.5, (4.0 * this.scaleY) / 2, 0);
    }

    this.transMesh.castShadow = true;

    let edgesGeom = null;
    if (this.currentShape === 'cylinder') {
      edgesGeom = new THREE.EdgesGeometry(geom, 25);
    } else {
      edgesGeom = new THREE.EdgesGeometry(geom);
    }

    const edges = new THREE.LineSegments(
      edgesGeom,
      new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 2 })
    );
    this.transMesh.add(edges);
    this.scene.add(this.transMesh);

    this.applyFaceHighlights();
    this.updateStatus(isSimilar);
    this.updateDimensionLabels();
    this.rebuildDetachedFaces();
    if (this.flatStageActive) {
      this.renderFlatFaceCanvas();
    }
  }

  /* ---------------- Camera Focus & Animation ---------------- */
  animateCameraTo(targetCamPos, targetLookAt, duration = 850) {
    this.startCamPos.copy(this.camera.position);
    this.targetCamPos.copy(targetCamPos);
    this.startLookAt.copy(this.controls ? this.controls.target : this.currentLookAt);
    this.targetLookAt.copy(targetLookAt);

    this.animDuration = duration;
    this.animStartTime = performance.now();
    this.isAnimating = true;
  }

  focusOnCorrespondingFaces(faceKey) {
    const curH = 4.0 * this.scaleY;
    const midY = (2.0 + curH / 2) / 2;

    this.startDetachAnimation(1.0);

    const lookAtX = 1.4;
    const camX = 3.2;

    if (this.currentShape === 'cuboid') {
      const curD = 3.0 * this.scaleZ;
      if (faceKey === 'front') {
        const maxZ = Math.max(1.5, curD / 2);
        this.animateCameraTo(new THREE.Vector3(camX, midY + 1.2, maxZ + 10.2), new THREE.Vector3(lookAtX, midY, maxZ + 1.2));
      } else if (faceKey === 'top') {
        const topY = Math.max(4.0, curH);
        this.animateCameraTo(new THREE.Vector3(camX, topY + 10.2, 3.8), new THREE.Vector3(lookAtX, topY + 1.2, 0));
      } else if (faceKey === 'side') {
        const maxZ = Math.max(1.5, curD / 2);
        this.animateCameraTo(new THREE.Vector3(camX + 1.2, midY + 1.2, maxZ + 10.2), new THREE.Vector3(lookAtX, midY, maxZ + 1.2));
      }
    } else if (this.currentShape === 'pyramid') {
      if (faceKey === 'front') {
        this.animateCameraTo(new THREE.Vector3(camX, midY + 1.0, 11.0), new THREE.Vector3(lookAtX, midY, 1.2));
      } else if (faceKey === 'bottom') {
        this.animateCameraTo(new THREE.Vector3(camX, 11.5, 4.0), new THREE.Vector3(lookAtX, 0.5, 0));
      } else if (faceKey === 'side') {
        this.animateCameraTo(new THREE.Vector3(camX + 1.8, midY + 1.2, 10.0), new THREE.Vector3(lookAtX, midY, 0));
      }
    } else if (this.currentShape === 'cylinder') {
      if (faceKey === 'circle') {
        const topY = Math.max(4.0, curH);
        this.animateCameraTo(new THREE.Vector3(camX, topY + 10.0, 3.5), new THREE.Vector3(lookAtX, topY + 0.8, 0));
      } else {
        const maxR = Math.max(2.0, 2.0 * this.scaleX);
        this.animateCameraTo(new THREE.Vector3(camX, midY + 1.0, maxR + 10.5), new THREE.Vector3(lookAtX, midY, maxR + 0.5));
      }
    }

    this.openFlatFaceStage(faceKey);
  }

  resetCameraView() {
    this.startDetachAnimation(0.0);
    this.closeFlatFaceStage();

    const camPos = new THREE.Vector3(7.5, 6.5, 10.5);
    const lookAt = new THREE.Vector3(0, 2.0, 0);
    this.animateCameraTo(camPos, lookAt, 800);
  }

  startDetachAnimation(targetVal) {
    this.isDetaching = true;
    this.startDetachVal = this.detachProgress;
    this.targetDetachProgress = targetVal;
    this.detachStartTime = performance.now();
  }

  /* ---------------- Detached Face Pop-Out in 3D ---------------- */
  rebuildDetachedFaces() {
    if (!this.detachedGroup) return;

    while (this.detachedGroup.children.length > 0) {
      const obj = this.detachedGroup.children[0];
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
      this.detachedGroup.remove(obj);
    }

    if (this.detachProgress <= 0.01) return;

    const p = this.detachProgress;
    let isFaceSimilar = true;
    if (this.currentShape === 'cylinder') {
      isFaceSimilar = Math.abs(this.scaleX - this.scaleY) < 0.01;
    } else {
      isFaceSimilar = (Math.abs(this.scaleX - this.scaleY) < 0.01) && (Math.abs(this.scaleY - this.scaleZ) < 0.01);
    }

    // Dim the parent solid figures so detached faces shine
    const bodyOpacity = 0.85 - p * 0.58;
    this.baseMaterials.forEach(m => m.opacity = bodyOpacity);
    this.transMaterials.forEach(m => m.opacity = bodyOpacity);

    if (this.currentShape === 'cuboid') {
      this.rebuildDetachedCuboid(p, isFaceSimilar);
    } else if (this.currentShape === 'pyramid') {
      this.rebuildDetachedPyramid(p, isFaceSimilar);
    } else if (this.currentShape === 'cylinder') {
      this.rebuildDetachedCylinder(p, isFaceSimilar);
    }
  }

  rebuildDetachedCuboid(p, isFaceSimilar) {
    const curW = 2.0 * this.scaleX;
    const curH = 4.0 * this.scaleY;
    const curD = 3.0 * this.scaleZ;

    let baseFaceW = 2.0, baseFaceH = 4.0;
    let transFaceW = curW, transFaceH = curH;

    let baseCurPos = new THREE.Vector3(-3.5, 2.0, 1.51 + 3.2 * p);
    let transCurPos = new THREE.Vector3(3.5, curH / 2, curD / 2 + 0.01 + 3.2 * p);
    let baseCurRot = new THREE.Euler(0, 0, 0);
    let transCurRot = new THREE.Euler(0, 0, 0);

    if (this.selectedFace === 'top') {
      baseFaceW = 2.0; baseFaceH = 3.0;
      transFaceW = curW; transFaceH = curD;
      baseCurPos.set(-3.5, 4.01 + 3.2 * p, 0);
      transCurPos.set(3.5, curH + 0.01 + 3.2 * p, 0);
      baseCurRot.set(-Math.PI / 2, 0, 0);
      transCurRot.set(-Math.PI / 2, 0, 0);
    } else if (this.selectedFace === 'side') {
      baseFaceW = 3.0; baseFaceH = 4.0;
      transFaceW = curD; transFaceH = curH;
      const targetZ = Math.max(1.5, curD / 2) + 2.8;
      baseCurPos.set(-2.49 + (-3.2 - (-2.49)) * p, 2.0, targetZ * p);
      transCurPos.set((3.5 + curW / 2 + 0.01) + (3.2 - (3.5 + curW / 2 + 0.01)) * p, curH / 2, targetZ * p);
      const angleY = (Math.PI / 2) * (1 - p);
      baseCurRot.set(0, angleY, 0);
      transCurRot.set(0, angleY, 0);
    }

    // Base Detached Rectangle
    const baseGeom = new THREE.PlaneGeometry(baseFaceW, baseFaceH);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x10b981, emissive: 0xd97706, emissiveIntensity: 0.35, side: THREE.DoubleSide, transparent: true, opacity: 0.94
    });
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.copy(baseCurPos);
    baseMesh.rotation.copy(baseCurRot);
    this.detachedGroup.add(baseMesh);

    // Trans Detached Rectangle
    const transGeom = new THREE.PlaneGeometry(transFaceW, transFaceH);
    const transColor = isFaceSimilar ? 0x4f46e5 : 0xef4444;
    const transMat = new THREE.MeshStandardMaterial({
      color: transColor, emissive: isFaceSimilar ? 0xd97706 : 0xb91c1c, emissiveIntensity: 0.35, side: THREE.DoubleSide, transparent: true, opacity: 0.94
    });
    const transMesh = new THREE.Mesh(transGeom, transMat);
    transMesh.position.copy(transCurPos);
    transMesh.rotation.copy(transCurRot);
    this.detachedGroup.add(transMesh);
  }

  rebuildDetachedPyramid(p, isFaceSimilar) {
    const curH = 4.0 * this.scaleY;
    const baseShiftZ = 3.2 * p;

    // Face 0 (Front Triangle): Apex, B(-1.5, 0, 1.2), C(1.5, 0, 1.2)
    // Base Triangle
    const baseGeom = new THREE.BufferGeometry();
    const basePos = new Float32Array([
      0, 4.0, 0,    -1.5, 0, 1.2,    1.5, 0, 1.2
    ]);
    baseGeom.setAttribute('position', new THREE.BufferAttribute(basePos, 3));
    baseGeom.computeVertexNormals();

    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x10b981, emissive: 0xd97706, emissiveIntensity: 0.35, side: THREE.DoubleSide, transparent: true, opacity: 0.95
    });
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.set(-3.5, 0, baseShiftZ);
    this.detachedGroup.add(baseMesh);

    // Trans Triangle
    const transGeom = new THREE.BufferGeometry();
    const transPos = new Float32Array([
      0, curH, 0,   -1.5 * this.scaleX, 0, 1.2 * this.scaleZ,   1.5 * this.scaleX, 0, 1.2 * this.scaleZ
    ]);
    transGeom.setAttribute('position', new THREE.BufferAttribute(transPos, 3));
    transGeom.computeVertexNormals();

    const transColor = isFaceSimilar ? 0x4f46e5 : 0xef4444;
    const transMat = new THREE.MeshStandardMaterial({
      color: transColor, emissive: isFaceSimilar ? 0xd97706 : 0xb91c1c, emissiveIntensity: 0.35, side: THREE.DoubleSide, transparent: true, opacity: 0.95
    });
    const transMesh = new THREE.Mesh(transGeom, transMat);
    transMesh.position.set(3.5, 0, baseShiftZ);
    this.detachedGroup.add(transMesh);
  }

  rebuildDetachedCylinder(p, isFaceSimilar) {
    const curH = 4.0 * this.scaleY;
    const curR = 2.0 * this.scaleX;

    if (this.selectedFace === 'circle') {
      // Detached Top Circle Disks floating upward
      const baseGeom = new THREE.CircleGeometry(2.0, 36);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x10b981, emissive: 0xd97706, emissiveIntensity: 0.35, side: THREE.DoubleSide, transparent: true, opacity: 0.94
      });
      const baseMesh = new THREE.Mesh(baseGeom, baseMat);
      baseMesh.rotation.x = -Math.PI / 2;
      baseMesh.position.set(-3.5, 4.01 + 3.2 * p, 0);
      this.detachedGroup.add(baseMesh);

      const transGeom = new THREE.CircleGeometry(curR, 36);
      const transColor = isFaceSimilar ? 0x4f46e5 : 0xef4444;
      const transMat = new THREE.MeshStandardMaterial({
        color: transColor, emissive: isFaceSimilar ? 0xd97706 : 0xb91c1c, emissiveIntensity: 0.35, side: THREE.DoubleSide, transparent: true, opacity: 0.94
      });
      const transMesh = new THREE.Mesh(transGeom, transMat);
      transMesh.rotation.x = -Math.PI / 2;
      transMesh.position.set(3.5, curH + 0.01 + 3.2 * p, 0);
      this.detachedGroup.add(transMesh);
    } else {
      // Lateral unrolled surface or cross-section rectangle
      const baseW = this.selectedFace === 'side' ? 2 * Math.PI * 2.0 : 4.0;
      const transW = this.selectedFace === 'side' ? 2 * Math.PI * curR : 2 * curR;

      const baseGeom = new THREE.PlaneGeometry(Math.min(5.5, baseW), 4.0);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x10b981, emissive: 0xd97706, emissiveIntensity: 0.35, side: THREE.DoubleSide, transparent: true, opacity: 0.94
      });
      const baseMesh = new THREE.Mesh(baseGeom, baseMat);
      baseMesh.position.set(-3.5, 2.0, 2.01 + 3.2 * p);
      this.detachedGroup.add(baseMesh);

      const transGeom = new THREE.PlaneGeometry(Math.min(7.5, transW), curH);
      const transColor = isFaceSimilar ? 0x4f46e5 : 0xef4444;
      const transMat = new THREE.MeshStandardMaterial({
        color: transColor, emissive: isFaceSimilar ? 0xd97706 : 0xb91c1c, emissiveIntensity: 0.35, side: THREE.DoubleSide, transparent: true, opacity: 0.94
      });
      const transMesh = new THREE.Mesh(transGeom, transMat);
      transMesh.position.set(3.5, curH / 2, curR + 0.01 + 3.2 * p);
      this.detachedGroup.add(transMesh);
    }
  }

  /* ---------------- 3D Sprites (Dimensions) ---------------- */
  createLabelSprite(text, bgColor = '#059669', textColor = '#ffffff', width = 1.4, height = 0.52) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgColor;
    const x = 8, y = 8, w = 240, h = 80, r = 20;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 48);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(width, height, 1);
    sprite.renderOrder = 999;
    return sprite;
  }

  updateDimensionLabels() {
    if (!this.labelsGroup) return;

    while (this.labelsGroup.children.length > 0) {
      const obj = this.labelsGroup.children[0];
      if (obj.material && obj.material.map) obj.material.map.dispose();
      if (obj.material) obj.material.dispose();
      this.labelsGroup.remove(obj);
    }

    if (!this.showDimensions) return;

    let isSimilar = false;
    if (this.currentShape === 'cylinder') {
      isSimilar = Math.abs(this.scaleX - this.scaleY) < 0.01;
    } else {
      isSimilar = (Math.abs(this.scaleX - this.scaleY) < 0.01) && (Math.abs(this.scaleY - this.scaleZ) < 0.01);
    }
    const badgeColor = isSimilar ? '#4f46e5' : '#dc2626';

    if (this.currentShape === 'cuboid') {
      // Base Cuboid
      const bw = this.createLabelSprite('가로: 2', '#059669');
      bw.position.set(-3.5, 0.28, 1.95);
      this.labelsGroup.add(bw);

      const bd = this.createLabelSprite('세로: 3', '#059669');
      bd.position.set(-2.05, 0.28, 0);
      this.labelsGroup.add(bd);

      const bh = this.createLabelSprite('높이: 4', '#059669');
      bh.position.set(-4.95, 2.0, 1.55);
      this.labelsGroup.add(bh);

      // Transformed Cuboid
      const curW = 2.0 * this.scaleX;
      const curD = 3.0 * this.scaleZ;
      const curH = 4.0 * this.scaleY;

      const tw = this.createLabelSprite(`가로: ${curW.toFixed(1)}`, badgeColor);
      tw.position.set(3.5, 0.28, curD / 2 + 0.45);
      this.labelsGroup.add(tw);

      const td = this.createLabelSprite(`세로: ${curD.toFixed(1)}`, badgeColor);
      td.position.set(3.5 + curW / 2 + 0.55, 0.28, 0);
      this.labelsGroup.add(td);

      const th = this.createLabelSprite(`높이: ${curH.toFixed(1)}`, badgeColor);
      th.position.set(3.5 - curW / 2 - 0.55, curH / 2, curD / 2);
      this.labelsGroup.add(th);

    } else if (this.currentShape === 'pyramid') {
      // Base Pyramid
      const bb = this.createLabelSprite('밑변: 3.0', '#059669');
      bb.position.set(-3.5, 0.28, 1.65);
      this.labelsGroup.add(bb);

      const bh = this.createLabelSprite('높이: 4.0', '#059669');
      bh.position.set(-4.8, 2.0, 0);
      this.labelsGroup.add(bh);

      // Transformed Pyramid
      const curBase = 3.0 * this.scaleX;
      const curH = 4.0 * this.scaleY;

      const tb = this.createLabelSprite(`밑변: ${curBase.toFixed(1)}`, badgeColor);
      tb.position.set(3.5, 0.28, 1.2 * this.scaleZ + 0.45);
      this.labelsGroup.add(tb);

      const th = this.createLabelSprite(`높이: ${curH.toFixed(1)}`, badgeColor);
      th.position.set(3.5 - 1.5 * this.scaleX - 0.75, curH / 2, 0);
      this.labelsGroup.add(th);

    } else if (this.currentShape === 'cylinder') {
      // Base Cylinder
      const br = this.createLabelSprite('반지름: 2', '#059669');
      br.position.set(-3.5, 4.35, 0);
      this.labelsGroup.add(br);

      const bh = this.createLabelSprite('높이: 4', '#059669');
      bh.position.set(-3.5 - 2.6, 2.0, 0);
      this.labelsGroup.add(bh);

      // Transformed Cylinder
      const curR = 2.0 * this.scaleX;
      const curH = 4.0 * this.scaleY;

      const tr = this.createLabelSprite(`반지름: ${curR.toFixed(1)}`, badgeColor);
      tr.position.set(3.5, curH + 0.35, 0);
      this.labelsGroup.add(tr);

      const th = this.createLabelSprite(`높이: ${curH.toFixed(1)}`, badgeColor);
      th.position.set(3.5 - curR - 0.75, curH / 2, 0);
      this.labelsGroup.add(th);
    }
  }

  /* ---------------- Raycasting for Face Clicking ---------------- */
  setupRaycasting() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects([this.baseMesh, this.transMesh], false);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const matIndex = hit.face.materialIndex;

        let clickedFace = this.selectedFace;
        if (this.currentShape === 'cuboid') {
          if (matIndex === 4 || matIndex === 5) clickedFace = 'front';
          else if (matIndex === 2 || matIndex === 3) clickedFace = 'top';
          else if (matIndex === 0 || matIndex === 1) clickedFace = 'side';
        } else if (this.currentShape === 'pyramid') {
          if (matIndex === 0) clickedFace = 'front';
          else if (matIndex === 3) clickedFace = 'bottom';
          else clickedFace = 'side';
        } else if (this.currentShape === 'cylinder') {
          if (matIndex === 1 || matIndex === 2) clickedFace = 'circle';
          else clickedFace = 'side';
        }

        this.selectFace(clickedFace, true);
      }
    });
  }

  selectFace(faceKey, animateMotion = true) {
    if (!faceKey) return;
    this.selectedFace = faceKey;

    document.querySelectorAll('.face-select-chip').forEach(chip => {
      if (chip.dataset.face === faceKey) {
        chip.classList.add('active');
        chip.style.background = '#fffbeb';
        chip.style.borderColor = '#f59e0b';
        chip.style.color = '#b45309';
      } else {
        chip.classList.remove('active');
        chip.style.background = 'white';
        chip.style.borderColor = '#e2e8f0';
        chip.style.color = 'var(--text-main)';
      }
    });

    this.applyFaceHighlights();

    let isSimilar = false;
    if (this.currentShape === 'cylinder') {
      isSimilar = Math.abs(this.scaleX - this.scaleY) < 0.01;
    } else {
      isSimilar = (Math.abs(this.scaleX - this.scaleY) < 0.01) && (Math.abs(this.scaleY - this.scaleZ) < 0.01);
    }

    this.updateStatus(isSimilar);
    this.updateDimensionLabels();

    if (animateMotion) {
      this.focusOnCorrespondingFaces(faceKey);
    } else {
      this.rebuildDetachedFaces();
    }
  }

  applyFaceHighlights() {
    if (!this.baseMaterials.length || !this.transMaterials.length) return;

    let isSimilar = false;
    if (this.currentShape === 'cylinder') {
      isSimilar = Math.abs(this.scaleX - this.scaleY) < 0.01;
    } else {
      isSimilar = (Math.abs(this.scaleX - this.scaleY) < 0.01) && (Math.abs(this.scaleY - this.scaleZ) < 0.01);
    }
    const transDefaultColor = isSimilar ? 0x4f46e5 : 0xef4444;

    const count = this.baseMaterials.length;
    for (let i = 0; i < count; i++) {
      this.baseMaterials[i].color.setHex(0x10b981);
      this.baseMaterials[i].emissive.setHex(0x000000);
      if (this.transMaterials[i]) {
        this.transMaterials[i].color.setHex(transDefaultColor);
        this.transMaterials[i].emissive.setHex(0x000000);
      }
    }

    let targetIndices = [4, 5];
    if (this.currentShape === 'cuboid') {
      if (this.selectedFace === 'top') targetIndices = [2, 3];
      else if (this.selectedFace === 'side') targetIndices = [0, 1];
    } else if (this.currentShape === 'pyramid') {
      if (this.selectedFace === 'front') targetIndices = [0];
      else if (this.selectedFace === 'bottom') targetIndices = [3];
      else targetIndices = [1, 2];
    } else if (this.currentShape === 'cylinder') {
      if (this.selectedFace === 'circle') targetIndices = [1, 2];
      else targetIndices = [0];
    }

    targetIndices.forEach(idx => {
      if (this.baseMaterials[idx]) {
        this.baseMaterials[idx].color.setHex(0xf59e0b);
        this.baseMaterials[idx].emissive.setHex(0xb45309);
        this.baseMaterials[idx].emissiveIntensity = 0.35;
      }
      if (this.transMaterials[idx]) {
        this.transMaterials[idx].color.setHex(0xf59e0b);
        this.transMaterials[idx].emissive.setHex(0xb45309);
        this.transMaterials[idx].emissiveIntensity = 0.35;
      }
    });
  }

  setupControls() {
    const scaleAllSlider = document.getElementById('solidScaleAll');
    const scaleAllVal = document.getElementById('solidScaleAllVal');
    const heightSlider = document.getElementById('solidHeightSlider');
    const heightVal = document.getElementById('solidHeightVal');
    const btnPreset15 = document.getElementById('btnPreset15');
    const btnPreset20 = document.getElementById('btnPreset20');
    const btnModeAxisSplit = document.getElementById('btnModeAxisSplit');
    const btnResetView = document.getElementById('btnResetSolidView');
    const toggle3DDimensions = document.getElementById('toggle3DDimensions');

    if (scaleAllSlider && scaleAllVal) {
      scaleAllSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        scaleAllVal.textContent = `${val.toFixed(1)}배`;
        this.scaleX = val;
        this.scaleY = val;
        this.scaleZ = val;
        if (heightSlider) heightSlider.value = val;
        if (heightVal) heightVal.textContent = `${val.toFixed(1)}배`;
        this.updateTransformedMesh();
      });
    }

    if (heightSlider && heightVal) {
      heightSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        heightVal.textContent = `${val.toFixed(1)}배`;
        this.scaleY = val;
        this.updateTransformedMesh();
      });
    }

    if (btnPreset15) {
      btnPreset15.addEventListener('click', () => {
        this.setScale(1.5, 1.5, 1.5);
      });
    }

    if (btnPreset20) {
      btnPreset20.addEventListener('click', () => {
        this.setScale(2.0, 2.0, 2.0);
      });
    }

    if (btnModeAxisSplit) {
      btnModeAxisSplit.addEventListener('click', () => {
        this.setScale(1.0, 3.0, 1.0);
      });
    }

    if (btnResetView) {
      btnResetView.addEventListener('click', () => {
        this.resetCameraView();
      });
    }

    if (toggle3DDimensions) {
      toggle3DDimensions.addEventListener('change', (e) => {
        this.showDimensions = e.target.checked;
        this.updateDimensionLabels();
      });
    }

    // Property Fill-in-the-Blank Quiz
    this.setupPropertyQuiz();
  }

  setScale(x, y, z) {
    this.scaleX = x;
    this.scaleY = y;
    this.scaleZ = z;

    const scaleAllSlider = document.getElementById('solidScaleAll');
    const scaleAllVal = document.getElementById('solidScaleAllVal');
    const heightSlider = document.getElementById('solidHeightSlider');
    const heightVal = document.getElementById('solidHeightVal');

    if (scaleAllSlider) scaleAllSlider.value = x;
    if (scaleAllVal) scaleAllVal.textContent = `${x.toFixed(1)}배`;
    if (heightSlider) heightSlider.value = y;
    if (heightVal) heightVal.textContent = `${y.toFixed(1)}배`;

    this.updateTransformedMesh();
  }

  updateStatus(isSimilar) {
    const badge = document.getElementById('solidSimilarityBadge');
    const detailBox = document.getElementById('solidAnalysisDetail');

    const shapeName = this.currentShape === 'cuboid' ? '직육면체' : (this.currentShape === 'pyramid' ? '삼각뿔' : '원기둥');

    if (badge) {
      if (isSimilar) {
        badge.className = 'badge-similarity yes';
        badge.innerHTML = `✓ ${shapeName} 닮음 성립 (균일 ${this.scaleX.toFixed(1)}배 확대)`;
      } else {
        badge.className = 'badge-similarity no';
        badge.innerHTML = `✗ 닮음 아님 (높이만 비대칭 확장되어 모양 왜곡)`;
      }
    }

    if (detailBox) {
      if (this.currentShape === 'cuboid') {
        const curW = (2.0 * this.scaleX).toFixed(1);
        const curD = (3.0 * this.scaleZ).toFixed(1);
        const curH = (4.0 * this.scaleY).toFixed(1);

        detailBox.innerHTML = `
          <div class="data-row"><span>기준 규격:</span> <b>가로 2 × 세로 3 × 높이 4</b></div>
          <div class="data-row"><span>확대 규격:</span> <b>가로 ${curW} × 세로 ${curD} × 높이 ${curH}</b></div>
          <div class="data-row" style="${isSimilar ? '' : 'color: #dc2626;'}"><span>대응 모서리 비:</span> <b>${isSimilar ? `1 : ${this.scaleX.toFixed(1)} (모든 모서리 일정)` : '높이 비율 불일치 (왜곡)'}</b></div>
          <div class="data-row"><span>입체 닮음비:</span> <b>${isSimilar ? `1 : ${this.scaleX.toFixed(1)}` : '없음 (비닮음)'}</b></div>
        `;
      } else if (this.currentShape === 'pyramid') {
        const curBase = (3.0 * this.scaleX).toFixed(1);
        const curDepth = (3.0 * this.scaleZ).toFixed(1);
        const curH = (4.0 * this.scaleY).toFixed(1);

        detailBox.innerHTML = `
          <div class="data-row"><span>기준 규격:</span> <b>밑변 3 × 깊이 3 × 높이 4</b></div>
          <div class="data-row"><span>확대 규격:</span> <b>밑변 ${curBase} × 깊이 ${curDepth} × 높이 ${curH}</b></div>
          <div class="data-row" style="${isSimilar ? '' : 'color: #dc2626;'}"><span>대응 모서리 비:</span> <b>${isSimilar ? `1 : ${this.scaleX.toFixed(1)} (모든 대응변 일정)` : '높이만 늘어나 각 모서리 비 불일치'}</b></div>
          <div class="data-row"><span>입체 닮음비:</span> <b>${isSimilar ? `1 : ${this.scaleX.toFixed(1)}` : '없음 (비닮음)'}</b></div>
        `;
      } else if (this.currentShape === 'cylinder') {
        const curR = (2.0 * this.scaleX).toFixed(1);
        const curH = (4.0 * this.scaleY).toFixed(1);

        detailBox.innerHTML = `
          <div class="data-row"><span>기준 규격:</span> <b>밑면 반지름 2 (지름 4) × 높이 4</b></div>
          <div class="data-row"><span>확대 규격:</span> <b>밑면 반지름 ${curR} (지름 ${(curR*2).toFixed(1)}) × 높이 ${curH}</b></div>
          <div class="data-row" style="${isSimilar ? '' : 'color: #dc2626;'}"><span>대응 치수 비:</span> <b>${isSimilar ? `반지름 1:${this.scaleX.toFixed(1)} / 높이 1:${this.scaleY.toFixed(1)} (일치)` : `반지름 1:${this.scaleX.toFixed(1)} ≠ 높이 1:${this.scaleY.toFixed(1)} (불일치)`}</b></div>
          <div class="data-row"><span>입체 닮음비:</span> <b>${isSimilar ? `1 : ${this.scaleX.toFixed(1)}` : '없음 (비닮음)'}</b></div>
        `;
      }
    }
  }

  /* ---------------- 2D Flat Face Separation Stage Methods ---------------- */
  initFlatFaceStage() {
    this.flatCanvas = document.getElementById('flatFaceCanvas');
    this.flatCtx = this.flatCanvas ? this.flatCanvas.getContext('2d') : null;
    this.flatStageEl = document.getElementById('flatFaceStage');

    const btnClose = document.getElementById('btnCloseFlatStage');
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        this.resetCameraView();
      });
    }

    const toggleOverlay = document.getElementById('toggleFlatOverlay');
    if (toggleOverlay) {
      toggleOverlay.addEventListener('change', (e) => {
        this.flatOverlayMode = e.target.checked;
        this.renderFlatFaceCanvas();
      });
    }
  }

  openFlatFaceStage(faceKey) {
    if (!this.flatStageEl) {
      this.flatStageEl = document.getElementById('flatFaceStage');
    }
    if (!this.flatStageEl) return;

    this.flatStageActive = true;
    this.flatStageEl.classList.add('active');

    const badge = document.getElementById('flatStageFaceBadge');
    if (badge) {
      if (this.currentShape === 'cuboid') {
        badge.textContent = faceKey === 'front' ? '앞면 (2×4)' : (faceKey === 'top' ? '윗면 (2×3)' : '옆면 (3×4)');
      } else if (this.currentShape === 'pyramid') {
        badge.textContent = faceKey === 'front' ? '앞쪽 옆면 (3×4)' : (faceKey === 'bottom' ? '밑면 (3×3)' : '옆면 (삼각형)');
      } else if (this.currentShape === 'cylinder') {
        badge.textContent = faceKey === 'circle' ? '밑면 (원, r=2)' : (faceKey === 'side' ? '옆면 전개도 (직사각형)' : '정면 단면 (4×4)');
      }
    }

    this.renderFlatFaceCanvas();
  }

  closeFlatFaceStage() {
    this.flatStageActive = false;
    if (this.flatStageEl) {
      this.flatStageEl.classList.remove('active');
    }
  }

  renderFlatFaceCanvas() {
    if (!this.flatCanvas || !this.flatCtx) {
      this.flatCanvas = document.getElementById('flatFaceCanvas');
      if (this.flatCanvas) this.flatCtx = this.flatCanvas.getContext('2d');
    }
    if (!this.flatCanvas || !this.flatCtx) return;

    const canvas = this.flatCanvas;
    const ctx = this.flatCtx;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const displayW = Math.max(380, Math.floor(rect.width || 440));
    const displayH = Math.max(200, Math.floor(rect.height || 230));

    if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
      canvas.width = displayW * dpr;
      canvas.height = displayH * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    const width = displayW;
    const height = displayH;

    ctx.clearRect(0, 0, width, height);

    // 1. Blueprint Grid Background (anchored to ground baseline groundY and originX)
    const groundY = height - 38;
    const gridOriginX = 50;
    const gridStep = 18;

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;

    for (let x = gridOriginX; x <= width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let x = gridOriginX - gridStep; x >= 0; x -= gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = groundY; y >= 0; y -= gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    for (let y = groundY + gridStep; y <= height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Check similarity
    let isSimilar = false;
    if (this.currentShape === 'cylinder') {
      isSimilar = Math.abs(this.scaleX - this.scaleY) < 0.01;
    } else {
      isSimilar = (Math.abs(this.scaleX - this.scaleY) < 0.01) && (Math.abs(this.scaleY - this.scaleZ) < 0.01);
    }

    // Branch rendering by shape & face type
    if (this.currentShape === 'cuboid') {
      this.render2DCuboidFace(ctx, width, height, isSimilar);
    } else if (this.currentShape === 'pyramid') {
      this.render2DPyramidFace(ctx, width, height, isSimilar);
    } else if (this.currentShape === 'cylinder') {
      if (this.selectedFace === 'circle') {
        this.render2DCylinderCircle(ctx, width, height, isSimilar);
      } else {
        this.render2DCylinderRect(ctx, width, height, isSimilar);
      }
    }

    ctx.restore();
  }

  /* --- 2D Renderer for Cuboid Faces (Rectangles) --- */
  render2DCuboidFace(ctx, width, height, isSimilar) {
    let faceKor = '앞면';
    let baseW = 2.0, baseH = 4.0;
    let transW = 2.0 * this.scaleX, transH = 4.0 * this.scaleY;
    let rW = this.scaleX, rH = this.scaleY;

    if (this.selectedFace === 'top') {
      faceKor = '윗면';
      baseW = 2.0; baseH = 3.0;
      transW = 2.0 * this.scaleX; transH = 3.0 * this.scaleZ;
      rW = this.scaleX; rH = this.scaleZ;
    } else if (this.selectedFace === 'side') {
      faceKor = '옆면';
      baseW = 3.0; baseH = 4.0;
      transW = 3.0 * this.scaleZ; transH = 4.0 * this.scaleY;
      rW = this.scaleZ; rH = this.scaleY;
    }

    const groundY = height - 38;

    if (!this.flatOverlayMode) {
      // Side-by-Side
      let unit = Math.min((width - 130) / (baseW + transW), (height - 70) / Math.max(baseH, transH));
      unit = Math.max(12, Math.min(26, unit));

      const rect1W = baseW * unit, rect1H = baseH * unit;
      const rect1X = 28, rect1Y = groundY - rect1H;

      const rect2W = transW * unit, rect2H = transH * unit;
      const rect2X = width - 28 - rect2W, rect2Y = groundY - rect2H;

      // Base
      ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
      ctx.fillRect(rect1X, rect1Y, rect1W, rect1H);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(rect1X, rect1Y, rect1W, rect1H);

      ctx.font = 'bold 11px Pretendard, sans-serif';
      ctx.fillStyle = '#065f46';
      ctx.textAlign = 'center';
      ctx.fillText(`가로 ${baseW}`, rect1X + rect1W / 2, groundY + 16);
      ctx.fillText(`기준 ${faceKor}`, rect1X + rect1W / 2, rect1Y - 8);

      // Transformed
      const transStroke = isSimilar ? '#4f46e5' : '#dc2626';
      ctx.fillStyle = isSimilar ? 'rgba(79, 70, 229, 0.16)' : 'rgba(239, 68, 68, 0.16)';
      ctx.fillRect(rect2X, rect2Y, rect2W, rect2H);
      ctx.strokeStyle = transStroke;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(rect2X, rect2Y, rect2W, rect2H);

      ctx.fillStyle = transStroke;
      ctx.fillText(`가로 ${transW.toFixed(1)}`, rect2X + rect2W / 2, groundY + 16);
      ctx.fillText(`확대 ${faceKor}`, rect2X + rect2W / 2, rect2Y - 8);

      // Center Badge
      this.drawSimilarityBadge(ctx, (rect1X + rect1W + rect2X) / 2, groundY - Math.max(rect1H, rect2H) / 2, isSimilar, rW);
    } else {
      // Overlay
      let unit = Math.min((width - 150) / transW, (height - 65) / transH);
      unit = Math.max(12, Math.min(30, unit));

      const originX = 50;
      const rect1W = baseW * unit, rect1H = baseH * unit;
      const rect2W = transW * unit, rect2H = transH * unit;
      const transStroke = isSimilar ? '#4f46e5' : '#dc2626';

      ctx.fillStyle = isSimilar ? 'rgba(79, 70, 229, 0.14)' : 'rgba(239, 68, 68, 0.14)';
      ctx.fillRect(originX, groundY - rect2H, rect2W, rect2H);
      ctx.strokeStyle = transStroke;
      ctx.lineWidth = 2.5;
      ctx.strokeRect(originX, groundY - rect2H, rect2W, rect2H);

      ctx.fillStyle = 'rgba(16, 185, 129, 0.28)';
      ctx.fillRect(originX, groundY - rect1H, rect1W, rect1H);
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(originX, groundY - rect1H, rect1W, rect1H);
      ctx.setLineDash([]);

      this.drawOverlayBanner(ctx, width, isSimilar, `가로 1:${rW.toFixed(1)}, 세로 1:${rH.toFixed(1)}`);
    }

    this.updateProofUI(
      isSimilar,
      `대응면 닮음비 1 : ${rW.toFixed(1)}`,
      `비율 왜곡 (가로 1:${rW.toFixed(1)} ≠ 세로 1:${rH.toFixed(1)})`,
      `✓ 평면도형의 닮음 판정 성공 (모든 대응변의 비 일정)<br>
       • 가로 대응변의 비 = ${baseW} : ${transW.toFixed(1)} = <b>1 : ${rW.toFixed(1)}</b><br>
       • 세로 대응변의 비 = ${baseH} : ${transH.toFixed(1)} = <b>1 : ${rH.toFixed(1)}</b><br>
       <span style="font-size: 0.74rem; color: #047857;"><b>성질 증명:</b> 직사각형의 대응변의 길이의 비가 <b>1 : ${rW.toFixed(1)}</b>로 일정하고 대응각(90°)이 같으므로 <b>두 직사각형은 닮음(∽)</b>입니다.</span>`,
      `✗ 평면도형의 닮음 불성립 (직사각형 모양 왜곡)<br>
       • 가로 배율 = 1 : ${rW.toFixed(1)} / 세로 배율 = 1 : ${rH.toFixed(1)}<br>
       <span style="font-size: 0.74rem; color: #b91c1c;"><b>성질 증명:</b> 가로와 세로의 확대 배율이 달라 직사각형 모양이 일그러졌습니다. 대응면이 닮음이 아니므로 입체도형도 닮음이 아닙니다.</span>`
    );
  }

  /* --- 2D Renderer for Triangular Pyramid Faces --- */
  render2DPyramidFace(ctx, width, height, isSimilar) {
    let baseW = 3.0, baseH = 4.0;
    let transW = 3.0 * this.scaleX, transH = 4.0 * this.scaleY;
    let rW = this.scaleX, rH = this.scaleY;

    if (this.selectedFace === 'bottom') {
      baseW = 3.0; baseH = 3.0;
      transW = 3.0 * this.scaleX; transH = 3.0 * this.scaleZ;
      rW = this.scaleX; rH = this.scaleZ;
    }

    const groundY = height - 38;

    if (!this.flatOverlayMode) {
      let unit = Math.min((width - 130) / (baseW + transW), (height - 70) / Math.max(baseH, transH));
      unit = Math.max(12, Math.min(26, unit));

      const tri1W = baseW * unit, tri1H = baseH * unit;
      const tri1X = 28;

      const tri2W = transW * unit, tri2H = transH * unit;
      const tri2X = width - 28 - tri2W;

      // Base Triangle
      ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(tri1X, groundY);
      ctx.lineTo(tri1X + tri1W, groundY);
      ctx.lineTo(tri1X + tri1W / 2, groundY - tri1H);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Altitude dashed line
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#047857';
      ctx.beginPath();
      ctx.moveTo(tri1X + tri1W / 2, groundY);
      ctx.lineTo(tri1X + tri1W / 2, groundY - tri1H);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = 'bold 11px Pretendard, sans-serif';
      ctx.fillStyle = '#065f46';
      ctx.textAlign = 'center';
      ctx.fillText(`밑변 ${baseW}`, tri1X + tri1W / 2, groundY + 16);
      ctx.fillText(`높이 ${baseH}`, tri1X + tri1W / 2 - 16, groundY - tri1H / 2);
      ctx.fillText(`기준 삼각형`, tri1X + tri1W / 2, groundY - tri1H - 8);

      // Trans Triangle
      const transStroke = isSimilar ? '#4f46e5' : '#dc2626';
      ctx.fillStyle = isSimilar ? 'rgba(79, 70, 229, 0.16)' : 'rgba(239, 68, 68, 0.16)';
      ctx.strokeStyle = transStroke;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(tri2X, groundY);
      ctx.lineTo(tri2X + tri2W, groundY);
      ctx.lineTo(tri2X + tri2W / 2, groundY - tri2H);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = transStroke;
      ctx.beginPath();
      ctx.moveTo(tri2X + tri2W / 2, groundY);
      ctx.lineTo(tri2X + tri2W / 2, groundY - tri2H);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = transStroke;
      ctx.fillText(`밑변 ${transW.toFixed(1)}`, tri2X + tri2W / 2, groundY + 16);
      ctx.fillText(`높이 ${transH.toFixed(1)}`, tri2X + tri2W / 2 - 16, groundY - tri2H / 2);
      ctx.fillText(`확대 삼각형`, tri2X + tri2W / 2, groundY - tri2H - 8);

      this.drawSimilarityBadge(ctx, (tri1X + tri1W + tri2X) / 2, groundY - Math.max(tri1H, tri2H) / 2, isSimilar, rW);

    } else {
      // Overlay
      let unit = Math.min((width - 150) / transW, (height - 65) / transH);
      unit = Math.max(12, Math.min(30, unit));

      const originX = 50;
      const tri1W = baseW * unit, tri1H = baseH * unit;
      const tri2W = transW * unit, tri2H = transH * unit;
      const transStroke = isSimilar ? '#4f46e5' : '#dc2626';

      // Trans
      ctx.fillStyle = isSimilar ? 'rgba(79, 70, 229, 0.14)' : 'rgba(239, 68, 68, 0.14)';
      ctx.strokeStyle = transStroke;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(originX, groundY);
      ctx.lineTo(originX + tri2W, groundY);
      ctx.lineTo(originX + tri2W / 2, groundY - tri2H);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Base dashed
      ctx.fillStyle = 'rgba(16, 185, 129, 0.28)';
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(originX, groundY);
      ctx.lineTo(originX + tri1W, groundY);
      ctx.lineTo(originX + tri1W / 2, groundY - tri1H);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      this.drawOverlayBanner(ctx, width, isSimilar, `밑변 1:${rW.toFixed(1)}, 높이 1:${rH.toFixed(1)}`);
    }

    this.updateProofUI(
      isSimilar,
      `대응면(삼각형) 닮음비 1 : ${rW.toFixed(1)}`,
      `비율 왜곡 (밑변 1:${rW.toFixed(1)} ≠ 높이 1:${rH.toFixed(1)})`,
      `✓ 평면도형의 닮음 판정 성공 (대응면 삼각형)<br>
       • 밑변 대응변의 비 = ${baseW} : ${transW.toFixed(1)} = <b>1 : ${rW.toFixed(1)}</b><br>
       • 높이 대응변의 비 = ${baseH} : ${transH.toFixed(1)} = <b>1 : ${rH.toFixed(1)}</b><br>
       <span style="font-size: 0.74rem; color: #047857;"><b>성질 증명:</b> 대응하는 세 변의 길이의 비가 <b>1 : ${rW.toFixed(1)}</b>로 일정하므로 대응면(삼각형)끼리 닮음입니다. 모든 대응면이 닮음이므로 삼각뿔의 닮음이 성립합니다.</span>`,
      `✗ 평면도형의 닮음 불성립 (삼각형 비율 왜곡)<br>
       • 밑변 배율 = 1 : ${rW.toFixed(1)} / 높이 배율 = 1 : ${rH.toFixed(1)}<br>
       <span style="font-size: 0.74rem; color: #b91c1c;"><b>성질 증명:</b> 밑변과 높이의 확대 비율이 달라 삼각형 모양이 찌그러졌습니다. 대응면이 닮음이 아니므로 삼각뿔도 닮음이 아닙니다.</span>`
    );
  }

  /* --- 2D Renderer for Cylinder Base Face (Circles) --- */
  render2DCylinderCircle(ctx, width, height, isSimilar) {
    const r1 = 2.0;
    const r2 = 2.0 * this.scaleX;
    const centerY = height / 2 + 10;

    if (!this.flatOverlayMode) {
      // Side-by-Side circles
      const unit = Math.min((width - 150) / (r1 * 2 + r2 * 2), (height - 80) / (r2 * 2));
      const u = Math.max(16, Math.min(32, unit));

      const c1X = 35 + r1 * u;
      const c2X = width - 35 - r2 * u;

      // Base Circle
      ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(c1X, centerY, r1 * u, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Radius line
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(c1X, centerY);
      ctx.lineTo(c1X + r1 * u, centerY);
      ctx.stroke();

      ctx.font = 'bold 11px Pretendard, sans-serif';
      ctx.fillStyle = '#065f46';
      ctx.textAlign = 'center';
      ctx.fillText(`반지름 r = 2`, c1X, centerY + r1 * u + 18);
      ctx.fillText(`기준 밑면 (원)`, c1X, centerY - r1 * u - 10);

      // Trans Circle
      const transStroke = isSimilar ? '#4f46e5' : '#dc2626';
      ctx.fillStyle = isSimilar ? 'rgba(79, 70, 229, 0.16)' : 'rgba(239, 68, 68, 0.16)';
      ctx.strokeStyle = transStroke;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(c2X, centerY, r2 * u, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = transStroke;
      ctx.beginPath();
      ctx.moveTo(c2X, centerY);
      ctx.lineTo(c2X + r2 * u, centerY);
      ctx.stroke();

      ctx.fillStyle = transStroke;
      ctx.fillText(`반지름 r' = ${r2.toFixed(1)}`, c2X, centerY + r2 * u + 18);
      ctx.fillText(`확대 밑면 (원)`, c2X, centerY - r2 * u - 10);

      this.drawSimilarityBadge(ctx, (c1X + c2X) / 2, centerY, true, this.scaleX);

    } else {
      // Concentric Circles Overlay
      const maxR = Math.max(r1, r2);
      const u = Math.min((width - 120) / (maxR * 2), (height - 80) / (maxR * 2));
      const midX = width / 2;

      // Outer / Trans circle
      const transStroke = isSimilar ? '#4f46e5' : '#dc2626';
      ctx.fillStyle = isSimilar ? 'rgba(79, 70, 229, 0.14)' : 'rgba(239, 68, 68, 0.14)';
      ctx.strokeStyle = transStroke;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(midX, centerY, r2 * u, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner / Base circle (dashed)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.28)';
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(midX, centerY, r1 * u, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      this.drawOverlayBanner(ctx, width, true, `모든 원은 중심각(360°)이 같으므로 항상 닮음! (반지름 비 1 : ${this.scaleX.toFixed(1)})`);
    }

    this.updateProofUI(
      isSimilar,
      `밑면(원) 닮음비 1 : ${this.scaleX.toFixed(1)}`,
      `원기둥 전체 비율 불일치 (반지름 1:${this.scaleX.toFixed(1)} ≠ 높이 1:${this.scaleY.toFixed(1)})`,
      `✓ 회전체의 밑면 닮음 판정 (원)<br>
       • 밑면의 반지름의 비 = 2 : ${r2.toFixed(1)} = <b>1 : ${this.scaleX.toFixed(1)}</b><br>
       • 원기둥의 높이의 비 = 4 : ${(4.0 * this.scaleY).toFixed(1)} = <b>1 : ${this.scaleY.toFixed(1)}</b><br>
       <span style="font-size: 0.74rem; color: #047857;"><b>성질 증명:</b> 모든 원은 모양이 완전히 같으므로 항상 닮음입니다. 밑면의 반지름의 비와 높이의 비가 <b>1 : ${this.scaleX.toFixed(1)}</b>로 같으므로 두 원기둥은 서로 닮음입니다.</span>`,
      `✗ 원기둥의 닮음 불성립 (높이만 비대칭 왜곡)<br>
       • 밑면 반지름의 비 = 1 : ${this.scaleX.toFixed(1)} / 높이의 비 = 1 : ${this.scaleY.toFixed(1)}<br>
       <span style="font-size: 0.74rem; color: #b91c1c;"><b>성질 증명:</b> 밑면인 원은 닮음이지만, 밑면 반지름의 비와 높이의 비가 일치하지 않아 원기둥의 닮음이 성립하지 않습니다.</span>`
    );
  }

  /* --- 2D Renderer for Cylinder Rectangles (Unrolled / Cross-section) --- */
  render2DCylinderRect(ctx, width, height, isSimilar) {
    const isUnrolled = this.selectedFace === 'side';
    const baseW = isUnrolled ? 2 * Math.PI * 2.0 : 4.0;
    const transW = isUnrolled ? 2 * Math.PI * (2.0 * this.scaleX) : 4.0 * this.scaleX;
    const baseH = 4.0;
    const transH = 4.0 * this.scaleY;
    const groundY = height - 38;

    let unit = Math.min((width - 130) / (baseW + transW), (height - 70) / Math.max(baseH, transH));
    unit = Math.max(8, Math.min(18, unit));

    const rect1W = baseW * unit, rect1H = baseH * unit;
    const rect1X = 25, rect1Y = groundY - rect1H;

    const rect2W = transW * unit, rect2H = transH * unit;
    const rect2X = width - 25 - rect2W, rect2Y = groundY - rect2H;

    // Base
    ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
    ctx.fillRect(rect1X, rect1Y, rect1W, rect1H);
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(rect1X, rect1Y, rect1W, rect1H);

    ctx.font = 'bold 10px Pretendard, sans-serif';
    ctx.fillStyle = '#065f46';
    ctx.textAlign = 'center';
    ctx.fillText(isUnrolled ? `둘레 4π (≈12.6)` : `지름 4`, rect1X + rect1W / 2, groundY + 16);
    ctx.fillText(`기준 ${isUnrolled ? '전개도' : '단면'}`, rect1X + rect1W / 2, rect1Y - 8);

    // Transformed
    const transStroke = isSimilar ? '#4f46e5' : '#dc2626';
    ctx.fillStyle = isSimilar ? 'rgba(79, 70, 229, 0.16)' : 'rgba(239, 68, 68, 0.16)';
    ctx.fillRect(rect2X, rect2Y, rect2W, rect2H);
    ctx.strokeStyle = transStroke;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(rect2X, rect2Y, rect2W, rect2H);

    ctx.fillStyle = transStroke;
    ctx.fillText(isUnrolled ? `둘레 ${(transW).toFixed(1)}` : `지름 ${transW.toFixed(1)}`, rect2X + rect2W / 2, groundY + 16);
    ctx.fillText(`확대 ${isUnrolled ? '전개도' : '단면'}`, rect2X + rect2W / 2, rect2Y - 8);

    this.drawSimilarityBadge(ctx, (rect1X + rect1W + rect2X) / 2, groundY - Math.max(rect1H, rect2H) / 2, isSimilar, this.scaleX);

    this.updateProofUI(
      isSimilar,
      `전개도 닮음비 1 : ${this.scaleX.toFixed(1)}`,
      `전개도 비율 불일치 (가로 1:${this.scaleX.toFixed(1)} ≠ 세로 1:${this.scaleY.toFixed(1)})`,
      `✓ 원기둥 옆면 전개도 닮음 판정 (직사각형)<br>
       • 가로(밑면 둘레 2πr)의 비 = <b>1 : ${this.scaleX.toFixed(1)}</b><br>
       • 세로(원기둥 높이 h)의 비 = <b>1 : ${this.scaleY.toFixed(1)}</b><br>
       <span style="font-size: 0.74rem; color: #047857;"><b>성질 증명:</b> 옆면 전개도인 직사각형의 가로와 세로의 비가 <b>1 : ${this.scaleX.toFixed(1)}</b>로 일정하므로 옆면 전개도도 서로 닮음입니다.</span>`,
      `✗ 원기둥 옆면 전개도 왜곡 (직사각형 비닮음)<br>
       • 가로(둘레) 배율 = 1 : ${this.scaleX.toFixed(1)} / 세로(높이) 배율 = 1 : ${this.scaleY.toFixed(1)}<br>
       <span style="font-size: 0.74rem; color: #b91c1c;"><b>성질 증명:</b> 전개도의 가로와 세로 비율이 일치하지 않아 옆면 직사각형이 왜곡되었습니다.</span>`
    );
  }

  /* --- Helper: Draw similarity badge on 2D stage --- */
  drawSimilarityBadge(ctx, x, y, isSimilar, ratio) {
    ctx.fillStyle = isSimilar ? '#ecfdf5' : '#fef2f2';
    ctx.strokeStyle = isSimilar ? '#10b981' : '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const bW = 68, bH = 44;
    ctx.roundRect ? ctx.roundRect(x - bW / 2, y - bH / 2, bW, bH, 8) : ctx.rect(x - bW / 2, y - bH / 2, bW, bH);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 20px Pretendard, sans-serif';
    ctx.fillStyle = isSimilar ? '#059669' : '#dc2626';
    ctx.textAlign = 'center';
    ctx.fillText(isSimilar ? '∽' : '≁', x, y + 1);

    ctx.font = 'bold 10px Pretendard, sans-serif';
    ctx.fillText(isSimilar ? `1 : ${ratio.toFixed(1)}` : '불일치', x, y + 15);
  }

  /* --- Helper: Draw top banner in overlay mode --- */
  drawOverlayBanner(ctx, width, isSimilar, desc) {
    ctx.fillStyle = isSimilar ? '#ecfdf5' : '#fef2f2';
    ctx.strokeStyle = isSimilar ? '#10b981' : '#ef4444';
    ctx.lineWidth = 1.2;
    const topBannerW = width - 40;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(20, 8, topBannerW, 26, 6) : ctx.rect(20, 8, topBannerW, 26);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px Pretendard, sans-serif';
    ctx.fillStyle = isSimilar ? '#065f46' : '#991b1b';
    ctx.textAlign = 'center';
    if (isSimilar) {
      ctx.fillText(`✓ 포개어보기: 한 점을 맞추어 겹쳤을 때, 모든 치수가 균일하게 늘어나 모양이 같습니다! (${desc})`, width / 2, 25);
    } else {
      ctx.fillText(`✗ 포개어보기: 배율이 서로 달라 모양이 일그러졌습니다! (${desc})`, width / 2, 25);
    }
  }

  /* --- Helper: Update Pill and Proof UI elements --- */
  updateProofUI(isSimilar, pillSimText, pillDistortText, proofSimHtml, proofDistortHtml) {
    const pill = document.getElementById('flatRatioPill');
    if (pill) {
      if (isSimilar) {
        pill.className = 'flat-ratio-pill';
        pill.textContent = pillSimText;
      } else {
        pill.className = 'flat-ratio-pill distorted';
        pill.textContent = pillDistortText;
      }
    }

    const proofEl = document.getElementById('flatMathProof');
    if (proofEl) {
      proofEl.innerHTML = isSimilar ? proofSimHtml : proofDistortHtml;
    }
  }

  onWindowResize() {
    if (!this.canvas || !this.camera || !this.renderer) return;
    const parent = this.canvas.parentElement;
    const width = parent.clientWidth || 800;
    const height = Math.max(260, parent.clientHeight || 420);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // 1. Camera Animation Loop
    if (this.isAnimating) {
      const elapsed = performance.now() - this.animStartTime;
      const t = Math.min(1.0, elapsed / this.animDuration);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      this.camera.position.lerpVectors(this.startCamPos, this.targetCamPos, ease);
      this.currentLookAt.lerpVectors(this.startLookAt, this.targetLookAt, ease);
      if (this.controls) {
        this.controls.target.copy(this.currentLookAt);
      }
      this.camera.lookAt(this.currentLookAt);

      if (t >= 1.0) {
        this.isAnimating = false;
      }
    } else if (this.controls) {
      this.controls.update();
    }

    // 2. Detached Face Animation Loop
    if (this.isDetaching) {
      const elapsed = performance.now() - this.detachStartTime;
      const t = Math.min(1.0, elapsed / 800);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      this.detachProgress = this.startDetachVal + (this.targetDetachProgress - this.startDetachVal) * ease;
      this.rebuildDetachedFaces();

      if (t >= 1.0) {
        this.isDetaching = false;
        this.detachProgress = this.targetDetachProgress;
        this.rebuildDetachedFaces();
      }
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /* ---------------- Property Quiz: 입체도형에서 닮음의 성질 빈칸넣기 ---------------- */
  setupPropertyQuiz() {
    const b1 = document.getElementById('quizSolidBlank1');
    const b2 = document.getElementById('quizSolidBlank2');
    const btnCheck = document.getElementById('btnCheckSolidQuiz');
    const btnClear = document.getElementById('btnClearSolidQuiz');
    const feedback = document.getElementById('solidQuizFeedback');

    if (!b1 || !b2 || !btnCheck) return;

    // Direct Typing & Keyboard Navigation (Enter moves to next blank or submits)
    b1.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (!b1.value.trim()) return;
        b2.focus();
      }
    });

    b2.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        checkAnswers();
      }
    });

    const checkAnswers = () => {
      const v1 = b1.value.trim().replace(/\s+/g, '');
      const v2 = b2.value.trim().replace(/\s+/g, '');

      if (!v1 && !v2) {
        if (feedback) {
          feedback.className = 'feedback-alert error';
          feedback.innerHTML = '⚠️ 빈칸에 알맞은 단어를 직접 타이핑하여 입력해주세요!';
          feedback.style.display = 'block';
        }
        b1.focus();
        return;
      }

      const c1 = (v1 === '모서리' || v1 === '모서리의');
      const c2 = (v2 === '면');

      const styleInput = (el, isCorrect) => {
        if (isCorrect) {
          el.style.borderColor = '#10b981';
          el.style.background = '#ecfdf5';
          el.style.color = '#047857';
        } else {
          el.style.borderColor = '#ef4444';
          el.style.background = '#fef2f2';
          el.style.color = '#b91c1c';
        }
      };

      styleInput(b1, c1);
      styleInput(b2, c2);

      if (!feedback) return;

      if (c1 && c2) {
        feedback.className = 'feedback-alert success';
        feedback.innerHTML = `
          🎉 <b>정답입니다! 참 잘했어요!</b><br>
          입체도형에서 닮음의 두 가지 핵심 성질을 완벽히 정리했습니다.<br>
          <div style="margin-top: 0.35rem; padding: 0.5rem; background: #ffffff; border-radius: 4px; border-left: 3px solid #10b981; line-height: 1.6;">
            <b>1</b> 대응하는 <b>모서리</b>의 길이의 비는 일정하다.<br>
            <b>2</b> 대응하는 <b>면</b>은 서로 닮은 도형이다.
          </div>
        `;
        feedback.style.display = 'block';
      } else {
        let hints = [];
        if (!c1) hints.push('• <b>1번 빈칸</b>: 입체도형의 선분(모서리)의 길이의 비가 일정해야 합니다. (예: <b>모서리</b>)');
        if (!c2) hints.push('• <b>2번 빈칸</b>: 2D 평면 분리에서 관찰했던 입체의 구성 요소입니다. (예: <b>면</b>)');

        feedback.className = 'feedback-alert error';
        feedback.innerHTML = `
          ❌ <b>틀린 빈칸이 있습니다! 다시 입력해보세요.</b><br>
          ${hints.join('<br>')}
        `;
        feedback.style.display = 'block';
      }
    };

    btnCheck.addEventListener('click', checkAnswers);

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        [b1, b2].forEach(b => {
          b.value = '';
          b.style.borderColor = '#cbd5e1';
          b.style.background = '#ffffff';
          b.style.color = 'var(--primary)';
        });
        if (feedback) feedback.style.display = 'none';
        b1.focus();
      });
    }
  }
}

// Export for app.js
window.SolidLab = SolidLab;
