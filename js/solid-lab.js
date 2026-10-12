/**
 * Starmix Similarity Lab - Solid Geometry Module (v2.5)
 * - Multi-Material Face Highlighting
 * - Real-Time 3D Edge Dimension Labels (Sprites)
 * - Smooth Camera Focus Animation & Close-Up
 * - Detached Face Pop-Out & Exploded Comparison (대응면 분리 추출 및 평면 1:1 비교)
 * - Direct 3D & 2D Corresponding Face Similarity Ratio (대응면 닮음비) Visualizer
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

    // Meshes & Materials
    this.baseMesh = null;
    this.transMesh = null;
    this.baseMaterials = [];
    this.transMaterials = [];
    this.gridHelper = null;
    this.labelsGroup = null;
    this.detachedGroup = null; // Group for pop-out detached comparison faces

    // Scale State
    this.scaleX = 1.5; // Width (가로 2)
    this.scaleZ = 1.5; // Depth (세로 3)
    this.scaleY = 1.5; // Height (높이 4)

    // Face selection: 'front' (+Z), 'top' (+Y), 'side' (+X)
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
    this.detachProgress = 0.0; // 0.0 (docked in solid) -> 1.0 (popped out forward)
    this.targetDetachProgress = 0.0;
    this.detachStartTime = 0;
    this.startDetachVal = 0.0;

    this.init();
  }

  init() {
    this.setupThree();
    this.createMeshes();
    this.setupControls();
    this.setupRaycasting();
    this.selectFace('front', false); // Initial selection without camera jump
    this.updateDimensionLabels();
    this.animate();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupThree() {
    const parent = this.canvas.parentElement;
    const width = parent.clientWidth || 800;
    const height = Math.max(500, parent.clientHeight || 520);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
    dirLight.position.set(12, 22, 12);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    // Ground Grid
    this.gridHelper = new THREE.GridHelper(24, 24, 0x94a3b8, 0xe2e8f0);
    this.gridHelper.position.y = -0.01;
    this.scene.add(this.gridHelper);

    // Labels & Banners Group
    this.labelsGroup = new THREE.Group();
    this.scene.add(this.labelsGroup);

    // Detached Comparison Faces Group
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

  createGeometry() {
    // Standard Cuboid: Width 2 (X), Height 4 (Y), Depth 3 (Z)
    return new THREE.BoxGeometry(2.0, 4.0, 3.0);
  }

  createMeshes() {
    if (this.baseMesh) this.scene.remove(this.baseMesh);
    if (this.transMesh) this.scene.remove(this.transMesh);

    const geom = this.createGeometry();

    // 1. Base Materials (Emerald Green)
    this.baseMaterials = [];
    for (let i = 0; i < 6; i++) {
      this.baseMaterials.push(new THREE.MeshStandardMaterial({
        color: 0x10b981,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85
      }));
    }

    this.baseMesh = new THREE.Mesh(geom, this.baseMaterials);
    this.baseMesh.position.set(-3.5, 2.0, 0);
    this.baseMesh.castShadow = true;

    const baseEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geom),
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
    const isSimilar = (Math.abs(this.scaleX - this.scaleY) < 0.01) && (Math.abs(this.scaleY - this.scaleZ) < 0.01);
    const color = isSimilar ? 0x4f46e5 : 0xef4444;
    const edgeColor = isSimilar ? 0x312e81 : 0x991b1b;

    this.transMaterials = [];
    for (let i = 0; i < 6; i++) {
      this.transMaterials.push(new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85
      }));
    }

    this.transMesh = new THREE.Mesh(geom, this.transMaterials);
    this.transMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);

    // Ground alignment: Y = (4.0 * scaleY) / 2
    this.transMesh.position.set(3.5, (4.0 * this.scaleY) / 2, 0);
    this.transMesh.castShadow = true;

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geom),
      new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 2 })
    );
    this.transMesh.add(edges);
    this.scene.add(this.transMesh);

    this.applyFaceHighlights();
    this.updateStatus(isSimilar);
    this.updateDimensionLabels();
    this.rebuildDetachedFaces();
  }

  /* ---------------- Camera Focus & Close-Up Animation ---------------- */
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
    const curW = 2.0 * this.scaleX;
    const curH = 4.0 * this.scaleY;
    const curD = 3.0 * this.scaleZ;
    const midY = (2.0 + curH / 2) / 2;

    // Trigger Detached Face Pop-Out Animation (0.0 -> 1.0)
    this.startDetachAnimation(1.0);

    if (faceKey === 'front') {
      const maxZ = Math.max(1.5, curD / 2);
      const camPos = new THREE.Vector3(0, midY, maxZ + 9.5);
      const lookAt = new THREE.Vector3(0, midY, maxZ + 2.5);
      this.animateCameraTo(camPos, lookAt, 850);
    } else if (faceKey === 'top') {
      const topY = Math.max(4.0, curH);
      const camPos = new THREE.Vector3(0, topY + 9.5, 3.2);
      const lookAt = new THREE.Vector3(0, topY + 2.2, 0);
      this.animateCameraTo(camPos, lookAt, 850);
    } else if (faceKey === 'side') {
      const maxZ = Math.max(1.5, curD / 2);
      const camPos = new THREE.Vector3(0, midY, maxZ + 9.8);
      const lookAt = new THREE.Vector3(0, midY, maxZ + 2.6);
      this.animateCameraTo(camPos, lookAt, 850);
    }
  }

  resetCameraView() {
    // Dock detached faces back into solid bodies (1.0 -> 0.0)
    this.startDetachAnimation(0.0);

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

  /* ---------------- Detached Face Geometry & Exploded View ---------------- */
  rebuildDetachedFaces() {
    if (!this.detachedGroup) return;

    // Clear previous detached meshes
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

    const curW = 2.0 * this.scaleX;
    const curH = 4.0 * this.scaleY;
    const curD = 3.0 * this.scaleZ;
    const p = this.detachProgress;

    // Determine face dimensions and similarity for selected face
    let baseFaceW = 2.0, baseFaceH = 4.0;
    let transFaceW = curW, transFaceH = curH;
    let r1 = this.scaleX, r2 = this.scaleY;

    let baseDockedPos = new THREE.Vector3(-3.5, 2.0, 1.51);
    let transDockedPos = new THREE.Vector3(3.5, curH / 2, curD / 2 + 0.01);
    let baseDockedRot = new THREE.Euler(0, 0, 0);
    let transDockedRot = new THREE.Euler(0, 0, 0);

    let baseCurPos = baseDockedPos.clone();
    let transCurPos = transDockedPos.clone();
    let baseCurRot = baseDockedRot.clone();
    let transCurRot = transDockedRot.clone();

    if (this.selectedFace === 'front') {
      baseFaceW = 2.0; baseFaceH = 4.0;
      transFaceW = curW; transFaceH = curH;
      r1 = this.scaleX; r2 = this.scaleY;

      baseDockedPos.set(-3.5, 2.0, 1.51);
      transDockedPos.set(3.5, curH / 2, curD / 2 + 0.01);
      baseDockedRot.set(0, 0, 0);
      transDockedRot.set(0, 0, 0);

      // Slide forward along +Z towards viewer
      const maxZ = Math.max(1.5, curD / 2);
      baseCurPos.set(-3.5, 2.0, 1.51 + 3.2 * p);
      transCurPos.set(3.5, curH / 2, curD / 2 + 0.01 + 3.2 * p);
      baseCurRot.set(0, 0, 0);
      transCurRot.set(0, 0, 0);

    } else if (this.selectedFace === 'top') {
      baseFaceW = 2.0; baseFaceH = 3.0; // Width X=2, Depth Z=3
      transFaceW = curW; transFaceH = curD;
      r1 = this.scaleX; r2 = this.scaleZ;

      baseDockedPos.set(-3.5, 4.01, 0);
      transDockedPos.set(3.5, curH + 0.01, 0);
      baseDockedRot.set(-Math.PI / 2, 0, 0);
      transDockedRot.set(-Math.PI / 2, 0, 0);

      // Slide upward along +Y
      baseCurPos.set(-3.5, 4.01 + 3.2 * p, 0);
      transCurPos.set(3.5, curH + 0.01 + 3.2 * p, 0);
      baseCurRot.set(-Math.PI / 2, 0, 0);
      transCurRot.set(-Math.PI / 2, 0, 0);

    } else if (this.selectedFace === 'side') {
      baseFaceW = 3.0; baseFaceH = 4.0; // Depth Z=3, Height Y=4
      transFaceW = curD; transFaceH = curH;
      r1 = this.scaleZ; r2 = this.scaleY;

      baseDockedPos.set(-2.49, 2.0, 0);
      transDockedPos.set(3.5 + curW / 2 + 0.01, curH / 2, 0);
      baseDockedRot.set(0, Math.PI / 2, 0);
      transDockedRot.set(0, Math.PI / 2, 0);

      // Smoothly swing out from the right side towards the front (+Z) for direct 1:1 frontal comparison
      const maxZ = Math.max(1.5, curD / 2);
      const targetBaseZ = maxZ + 2.8;
      const targetTransZ = maxZ + 2.8;

      baseCurPos.set(
        -2.49 + (-3.2 - (-2.49)) * p,
        2.0,
        0 + targetBaseZ * p
      );
      transCurPos.set(
        (3.5 + curW / 2 + 0.01) + (3.2 - (3.5 + curW / 2 + 0.01)) * p,
        curH / 2,
        0 + targetTransZ * p
      );

      // Smooth rotation from side (PI/2) to frontal (0)
      const currentAngleY = (Math.PI / 2) * (1 - p);
      baseCurRot.set(0, currentAngleY, 0);
      transCurRot.set(0, currentAngleY, 0);
    }

    const isFaceSimilar = Math.abs(r1 - r2) < 0.01;

    // Dim the parent cuboid bodies so detached faces shine in the foreground
    const bodyOpacity = 0.85 - p * 0.58; // 0.85 -> 0.27
    this.baseMaterials.forEach(m => m.opacity = bodyOpacity);
    this.transMaterials.forEach(m => m.opacity = bodyOpacity);

    // 1. Base Detached Face (Emerald Green Plane with Golden Glow)
    const baseGeom = new THREE.PlaneGeometry(baseFaceW, baseFaceH);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.94
    });
    const baseFaceMesh = new THREE.Mesh(baseGeom, baseMat);
    baseFaceMesh.position.copy(baseCurPos);
    baseFaceMesh.rotation.copy(baseCurRot);
    baseFaceMesh.renderOrder = 900;

    // Glowing border outline
    const baseEdgeLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(baseGeom),
      new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 3 })
    );
    baseFaceMesh.add(baseEdgeLines);
    this.detachedGroup.add(baseFaceMesh);

    // 2. Transformed Detached Face (Indigo if similar, Red if distorted)
    const transGeom = new THREE.PlaneGeometry(transFaceW, transFaceH);
    const transColor = isFaceSimilar ? 0x4f46e5 : 0xef4444;
    const transEmissive = isFaceSimilar ? 0xd97706 : 0xb91c1c;
    const transMat = new THREE.MeshStandardMaterial({
      color: transColor,
      emissive: transEmissive,
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.94
    });
    const transFaceMesh = new THREE.Mesh(transGeom, transMat);
    transFaceMesh.position.copy(transCurPos);
    transFaceMesh.rotation.copy(transCurRot);
    transFaceMesh.renderOrder = 900;

    const transEdgeLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(transGeom),
      new THREE.LineBasicMaterial({ color: isFaceSimilar ? 0xf59e0b : 0xf87171, linewidth: 3 })
    );
    transFaceMesh.add(transEdgeLines);
    this.detachedGroup.add(transFaceMesh);

    // 3. Four Corner Connector Guide Lines (Dotted projection from cuboid body to detached face)
    if (p > 0.05) {
      this.createCornerConnectorLines(baseDockedPos, baseCurPos, baseFaceW, baseFaceH, baseDockedRot, baseCurRot, 0x10b981);
      this.createCornerConnectorLines(transDockedPos, transCurPos, transFaceW, transFaceH, transDockedRot, transCurRot, isFaceSimilar ? 0x4f46e5 : 0xef4444);
    }

    // 4. Detached Face Title Tags & Dimensions (Sprites)
    if (p > 0.35) {
      const faceKor = (this.selectedFace === 'front' ? '앞면' : (this.selectedFace === 'top' ? '윗면' : '옆면'));

      let tagOffset = new THREE.Vector3(0, baseFaceH / 2 + 0.5, 0.15);
      let transTagOffset = new THREE.Vector3(0, transFaceH / 2 + 0.5, 0.15);
      let centerBannerOffset = new THREE.Vector3(0, Math.max(baseFaceH, transFaceH) / 2 + 1.15, 0.15);

      if (this.selectedFace === 'top') {
        tagOffset = new THREE.Vector3(0, 0.35, -baseFaceH / 2 - 0.55);
        transTagOffset = new THREE.Vector3(0, 0.35, -transFaceH / 2 - 0.55);
        centerBannerOffset = new THREE.Vector3(0, 0.45, -Math.max(baseFaceH, transFaceH) / 2 - 1.25);
      }

      const baseTag = this.createLabelSprite(`기준 ${faceKor} (${baseFaceW}×${baseFaceH})`, '#059669', '#ffffff', 1.8, 0.55);
      baseTag.position.copy(baseCurPos).add(tagOffset);
      this.detachedGroup.add(baseTag);

      const transTag = this.createLabelSprite(`확대 ${faceKor} (${transFaceW.toFixed(1)}×${transFaceH.toFixed(1)})`, isFaceSimilar ? '#4f46e5' : '#dc2626', '#ffffff', 1.9, 0.55);
      transTag.position.copy(transCurPos).add(transTagOffset);
      this.detachedGroup.add(transTag);

      // Central Exploded Comparison Banner
      const midPoint = new THREE.Vector3().addVectors(baseCurPos, transCurPos).multiplyScalar(0.5);
      const compareText = isFaceSimilar 
        ? `✨ 대응면 닮음 ∽ (닮음비 1 : ${r1.toFixed(1)})` 
        : `⚠ 대응면 비율 왜곡 (가로 1:${r1.toFixed(1)} ≠ 세로 1:${r2.toFixed(1)})`;
      const compareColor = isFaceSimilar ? '#059669' : '#dc2626';

      const centerCompareSprite = this.createBannerSprite(compareText, compareColor, '#ffffff', 4.2, 0.85);
      centerCompareSprite.position.copy(midPoint).add(centerBannerOffset);
      this.detachedGroup.add(centerCompareSprite);
    }
  }

  createCornerConnectorLines(dockedPos, curPos, w, h, dockedRot, curRot, color = 0xf59e0b) {
    const hw = w / 2;
    const hh = h / 2;
    const localCorners = [
      new THREE.Vector3(-hw, -hh, 0),
      new THREE.Vector3(hw, -hh, 0),
      new THREE.Vector3(hw, hh, 0),
      new THREE.Vector3(-hw, hh, 0)
    ];

    const points = [];
    localCorners.forEach(c => {
      const c1 = c.clone().applyEuler(dockedRot).add(dockedPos);
      const c2 = c.clone().applyEuler(curRot).add(curPos);
      points.push(c1);
      points.push(c2);
    });

    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.65
    });
    const lineSeg = new THREE.LineSegments(geom, mat);
    this.detachedGroup.add(lineSeg);
  }

  /* ---------------- 3D Sprites (Dimensions & Similarity Ratio Banner) ---------------- */
  createLabelSprite(text, bgColor = '#059669', textColor = '#ffffff', width = 1.35, height = 0.52) {
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

    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
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

  createBannerSprite(text, bgColor = '#d97706', textColor = '#ffffff', width = 3.6, height = 0.75) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 110;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgColor;
    const x = 8, y = 8, w = 496, h = 94, r = 24;
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
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 55);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(width, height, 1);
    sprite.renderOrder = 1000;
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

    // 1. Labels for Base Cuboid
    const baseWidthSprite = this.createLabelSprite('가로: 2', '#059669');
    baseWidthSprite.position.set(-3.5, 0.28, 1.95);
    this.labelsGroup.add(baseWidthSprite);

    const baseDepthSprite = this.createLabelSprite('세로: 3', '#059669');
    baseDepthSprite.position.set(-2.05, 0.28, 0);
    this.labelsGroup.add(baseDepthSprite);

    const baseHeightSprite = this.createLabelSprite('높이: 4', '#059669');
    baseHeightSprite.position.set(-4.95, 2.0, 1.55);
    this.labelsGroup.add(baseHeightSprite);

    // 2. Labels for Transformed Cuboid
    const curW = 2.0 * this.scaleX;
    const curH = 4.0 * this.scaleY;
    const curD = 3.0 * this.scaleZ;
    const isSimilar = (Math.abs(this.scaleX - this.scaleY) < 0.01) && (Math.abs(this.scaleY - this.scaleZ) < 0.01);
    const badgeColor = isSimilar ? '#4f46e5' : '#dc2626';

    const transWidthSprite = this.createLabelSprite(`가로: ${curW.toFixed(1)}`, badgeColor);
    transWidthSprite.position.set(3.5, 0.28, curD / 2 + 0.45);
    this.labelsGroup.add(transWidthSprite);

    const transDepthSprite = this.createLabelSprite(`세로: ${curD.toFixed(1)}`, badgeColor);
    transDepthSprite.position.set(3.5 + curW / 2 + 0.55, 0.28, 0);
    this.labelsGroup.add(transDepthSprite);

    const transHeightSprite = this.createLabelSprite(`높이: ${curH.toFixed(1)}`, badgeColor);
    transHeightSprite.position.set(3.5 - curW / 2 - 0.55, curH / 2, curD / 2);
    this.labelsGroup.add(transHeightSprite);
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

        let clickedFace = 'front';
        if (matIndex === 4 || matIndex === 5) {
          clickedFace = 'front';
        } else if (matIndex === 2 || matIndex === 3) {
          clickedFace = 'top';
        } else if (matIndex === 0 || matIndex === 1) {
          clickedFace = 'side';
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
    const isSimilar = (Math.abs(this.scaleX - this.scaleY) < 0.01) && (Math.abs(this.scaleY - this.scaleZ) < 0.01);
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

    const isSimilar = (Math.abs(this.scaleX - this.scaleY) < 0.01) && (Math.abs(this.scaleY - this.scaleZ) < 0.01);
    const transDefaultColor = isSimilar ? 0x4f46e5 : 0xef4444;

    for (let i = 0; i < 6; i++) {
      this.baseMaterials[i].color.setHex(0x10b981);
      this.baseMaterials[i].emissive.setHex(0x000000);
      this.transMaterials[i].color.setHex(transDefaultColor);
      this.transMaterials[i].emissive.setHex(0x000000);
    }

    let targetIndices = [4, 5]; // Front and Back
    if (this.selectedFace === 'top') {
      targetIndices = [2, 3]; // Top and Bottom
    } else if (this.selectedFace === 'side') {
      targetIndices = [0, 1]; // Right and Left
    }

    targetIndices.forEach(idx => {
      this.baseMaterials[idx].color.setHex(0xf59e0b);
      this.baseMaterials[idx].emissive.setHex(0xb45309);
      this.baseMaterials[idx].emissiveIntensity = 0.35;

      this.transMaterials[idx].color.setHex(0xf59e0b);
      this.transMaterials[idx].emissive.setHex(0xb45309);
      this.transMaterials[idx].emissiveIntensity = 0.35;
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

    // Face Selector Chips
    document.querySelectorAll('.face-select-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectFace(chip.dataset.face, true);
      });
    });
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
    const faceDetailBox = document.getElementById('solidFaceDetail');

    const curW = (2.0 * this.scaleX).toFixed(1);
    const curD = (3.0 * this.scaleZ).toFixed(1);
    const curH = (4.0 * this.scaleY).toFixed(1);

    if (badge) {
      if (isSimilar) {
        badge.className = 'badge-similarity yes';
        badge.innerHTML = `✓ 입체도형 닮음 성립 (모든 모서리 ${this.scaleX.toFixed(1)}배)`;
      } else {
        badge.className = 'badge-similarity no';
        badge.innerHTML = `✗ 닮음 아님 (높이만 비대칭 확장되어 왜곡됨)`;
      }
    }

    if (detailBox) {
      if (isSimilar) {
        detailBox.innerHTML = `
          <div class="data-row"><span>기준 규격:</span> <b>가로 2 × 세로 3 × 높이 4</b></div>
          <div class="data-row"><span>확대 규격:</span> <b>가로 ${curW} × 세로 ${curD} × 높이 ${curH}</b></div>
          <div class="data-row"><span>대응 모서리 비:</span> <b>1 : ${this.scaleX.toFixed(1)} (모든 모서리 일정)</b></div>
          <div class="data-row"><span>입체 닮음비:</span> <b>1 : ${this.scaleX.toFixed(1)}</b></div>
        `;
      } else {
        detailBox.innerHTML = `
          <div class="data-row"><span>기준 규격:</span> <b>가로 2 × 세로 3 × 높이 4</b></div>
          <div class="data-row"><span>확대 규격:</span> <b>가로 ${curW} × 세로 ${curD} × 높이 ${curH}</b></div>
          <div class="data-row" style="color: #dc2626;"><span>대응 모서리:</span> <b>높이만 3배로 늘어나 비율 불일치!</b></div>
          <div class="data-row" style="color: #dc2626;"><span>결론:</span> <b>입체도형 닮음이 성립하지 않음</b></div>
        `;
      }
    }

    // Detailed Face Similarity Analysis
    if (faceDetailBox) {
      let faceName = '앞면 (Front Face)';
      let baseW = 2.0, baseH = 4.0;
      let transW = 2.0 * this.scaleX, transH = 4.0 * this.scaleY;
      let rW = this.scaleX;
      let rH = this.scaleY;

      if (this.selectedFace === 'top') {
        faceName = '윗면 (Top Face)';
        baseW = 2.0; baseH = 3.0;
        transW = 2.0 * this.scaleX; transH = 3.0 * this.scaleZ;
        rW = this.scaleX;
        rH = this.scaleZ;
      } else if (this.selectedFace === 'side') {
        faceName = '옆면 (Side Face)';
        baseW = 3.0; baseH = 4.0;
        transW = 3.0 * this.scaleZ; transH = 4.0 * this.scaleY;
        rW = this.scaleZ;
        rH = this.scaleY;
      }

      const isFaceSimilar = Math.abs(rW - rH) < 0.01;

      faceDetailBox.innerHTML = `
        <div style="background: #ffffff; border: 2px solid ${isFaceSimilar ? '#10b981' : '#f59e0b'}; border-radius: var(--radius-md); padding: 1rem; margin-top: 0.85rem; box-shadow: var(--shadow-sm);">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <b style="color: #b45309; font-size: 0.95rem;">🎯 면 분리 비교: ${faceName}</b>
            <span style="font-size: 0.78rem; font-weight: 800; padding: 0.2rem 0.5rem; border-radius: 4px; ${isFaceSimilar ? 'background: #ecfdf5; color: #059669;' : 'background: #fef2f2; color: #dc2626;'}">
              ${isFaceSimilar ? '✓ 대응면 닮음' : '✗ 대응면 왜곡'}
            </span>
          </div>

          <!-- Highlighted Similarity Ratio for the Face -->
          <div style="font-size: 1.05rem; font-weight: 800; text-align: center; padding: 0.55rem; background: ${isFaceSimilar ? '#ecfdf5' : '#fef2f2'}; color: ${isFaceSimilar ? '#065f46' : '#991b1b'}; border-radius: 8px; margin: 0.5rem 0;">
            ${isFaceSimilar 
              ? `✨ [${faceName}] 닮음비 = 1 : ${rW.toFixed(1)}` 
              : `⚠ [${faceName}] 비율 불일치 (닮음비 없음)`}
          </div>

          <div class="data-row"><span>기준 직사각형:</span> <b>${baseW.toFixed(1)} × ${baseH.toFixed(1)} (가로:세로 비 1 : ${(baseH/baseW).toFixed(2)})</b></div>
          <div class="data-row"><span>확대 직사각형:</span> <b>${transW.toFixed(1)} × ${transH.toFixed(1)} (가로:세로 비 1 : ${(transH/transW).toFixed(2)})</b></div>
          <div class="data-row"><span>대응변의 비:</span> <b>가로 1 : ${rW.toFixed(1)} / 세로 1 : ${rH.toFixed(1)}</b></div>
          
          <div style="margin-top: 0.6rem; font-size: 0.84rem; line-height: 1.45; padding: 0.5rem 0.65rem; border-radius: 6px; background: ${isFaceSimilar ? '#f0fdf4' : '#fff1f2'}; color: ${isFaceSimilar ? '#065f46' : '#991b1b'};">
            ${isFaceSimilar 
              ? `<b>대응면 성질 증명:</b> 입체에서 분리된 두 직사각형의 가로와 세로가 모두 <b>1 : ${rW.toFixed(1)}</b>로 늘어나 대응면끼리 닮음입니다! 이처럼 <b>모든 대응면이 닮음이어야 입체도형의 닮음이 성립</b>합니다.` 
              : `<b>대응면 성질 증명:</b> 분리된 직사각형의 가로 배율(${rW.toFixed(1)}배)과 세로 배율(${rH.toFixed(1)}배)이 달라 <b>직사각형 모양이 일그러졌습니다!</b> 대응면이 닮음이 아니므로 <b>입체도형도 닮음이 아닙니다.</b>`}
          </div>
        </div>
      `;
    }
  }

  onWindowResize() {
    if (!this.canvas || !this.camera || !this.renderer) return;
    const parent = this.canvas.parentElement;
    const width = parent.clientWidth || 800;
    const height = Math.max(500, parent.clientHeight || 520);

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
}

// Export for app.js
window.SolidLab = SolidLab;
