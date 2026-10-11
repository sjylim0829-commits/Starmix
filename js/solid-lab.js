/**
 * Starmix Similarity Lab - Solid Geometry Module (3D Three.js 뷰어)
 * Standard Cuboid: Width 2, Depth 3, Height 4
 */

class SolidLab {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    // Meshes
    this.baseMesh = null;
    this.transMesh = null;
    this.gridHelper = null;

    // Scale State
    this.scaleX = 1.5; // Width (가로 2)
    this.scaleZ = 1.5; // Depth (세로 3)
    this.scaleY = 1.5; // Height (높이 4)
    this.shapeType = 'box';

    this.init();
  }

  init() {
    this.setupThree();
    this.createMeshes();
    this.setupControls();
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
    this.camera.position.set(8, 7, 11);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    // Ground Grid
    this.gridHelper = new THREE.GridHelper(24, 24, 0x94a3b8, 0xe2e8f0);
    this.gridHelper.position.y = -0.01;
    this.scene.add(this.gridHelper);

    // Controls
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
    }
  }

  createGeometry() {
    // Standard Cuboid: Width 2 (X), Height 4 (Y), Depth 3 (Z)
    if (this.shapeType === 'box') {
      return new THREE.BoxGeometry(2.0, 4.0, 3.0);
    } else if (this.shapeType === 'pyramid') {
      return new THREE.ConeGeometry(2.0, 4.0, 4);
    } else if (this.shapeType === 'prism') {
      return new THREE.CylinderGeometry(1.8, 1.8, 4.0, 3);
    }
    return new THREE.BoxGeometry(2.0, 4.0, 3.0);
  }

  createMeshes() {
    if (this.baseMesh) this.scene.remove(this.baseMesh);
    if (this.transMesh) this.scene.remove(this.transMesh);

    const geom = this.createGeometry();

    // 1. Base Mesh (Original - Green)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85
    });
    this.baseMesh = new THREE.Mesh(geom, baseMat);
    this.baseMesh.position.set(-3.5, 2.0, 0); // half height = 2.0
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

    const transMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85
    });

    this.transMesh = new THREE.Mesh(geom, transMat);
    this.transMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);

    // Dynamic ground alignment: position Y = (4.0 * scaleY) / 2
    this.transMesh.position.set(3.5, (4.0 * this.scaleY) / 2, 0);
    this.transMesh.castShadow = true;

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geom),
      new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 2 })
    );
    this.transMesh.add(edges);
    this.scene.add(this.transMesh);

    this.updateStatus(isSimilar);
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

    // [축 분리 모드] 지도안 내용: "높이만 3배로 늘려본 뒤 원래 모양과 비교"
    if (btnModeAxisSplit) {
      btnModeAxisSplit.addEventListener('click', () => {
        this.setScale(1.0, 3.0, 1.0);
      });
    }

    if (btnResetView) {
      btnResetView.addEventListener('click', () => {
        this.camera.position.set(8, 7, 11);
        if (this.controls) this.controls.target.set(0, 2, 0);
      });
    }
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
          <div class="data-row"><span>대응면(직사각형):</span> <b>앞면·윗면·옆면 모두 닮은 평면도형</b></div>
          <div class="data-row"><span>입체 닮음비:</span> <b>1 : ${this.scaleX.toFixed(1)}</b></div>
        `;
      } else {
        detailBox.innerHTML = `
          <div class="data-row"><span>기준 규격:</span> <b>가로 2 × 세로 3 × 높이 4</b></div>
          <div class="data-row"><span>확대 규격:</span> <b>가로 ${curW} × 세로 ${curD} × 높이 ${curH}</b></div>
          <div class="data-row" style="color: #dc2626;"><span>대응면 변화:</span> <b>앞면(2×${curH})의 가로:세로 비가 깨짐!</b></div>
          <div class="data-row" style="color: #dc2626;"><span>결론:</span> <b>입체도형의 닮음이 성립하지 않음</b></div>
        `;
      }
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
    if (this.controls) this.controls.update();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// Export for app.js
window.SolidLab = SolidLab;
