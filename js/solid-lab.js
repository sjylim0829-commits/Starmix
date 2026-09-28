/**
 * Starmix Similarity Lab - Solid Geometry Module (3D Three.js 뷰어)
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

    // Scale state
    this.scaleX = 1.8;
    this.scaleY = 1.8;
    this.scaleZ = 1.8;
    this.shapeType = 'box'; // 'box', 'prism', 'pyramid'
    this.isUniform = true;

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
    const height = Math.max(480, parent.clientHeight || 520);

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8fafc);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(7, 6, 9);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 15, 10);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    // Ground Grid
    this.gridHelper = new THREE.GridHelper(20, 20, 0x94a3b8, 0xe2e8f0);
    this.gridHelper.position.y = -0.01;
    this.scene.add(this.gridHelper);

    // Controls (OrbitControls)
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't go below floor
    }
  }

  createGeometry() {
    if (this.shapeType === 'box') {
      return new THREE.BoxGeometry(1.5, 2.0, 1.0);
    } else if (this.shapeType === 'pyramid') {
      return new THREE.ConeGeometry(1.4, 2.2, 4);
    } else if (this.shapeType === 'prism') {
      return new THREE.CylinderGeometry(1.2, 1.2, 2.0, 3);
    }
    return new THREE.BoxGeometry(1.5, 2.0, 1.0);
  }

  createMeshes() {
    // Clean old meshes
    if (this.baseMesh) this.scene.remove(this.baseMesh);
    if (this.transMesh) this.scene.remove(this.transMesh);

    const geom = this.createGeometry();

    // 1. Base Mesh (Original - Green)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85
    });
    this.baseMesh = new THREE.Mesh(geom, baseMat);
    this.baseMesh.position.set(-2.5, 1.0, 0);
    this.baseMesh.castShadow = true;

    // Edges for Base
    const baseEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geom),
      new THREE.LineBasicMaterial({ color: 0x047857, linewidth: 2 })
    );
    this.baseMesh.add(baseEdges);
    this.scene.add(this.baseMesh);

    // 2. Transformed Mesh (Scale - Indigo / Red)
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
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85
    });

    this.transMesh = new THREE.Mesh(geom, transMat);
    this.transMesh.scale.set(this.scaleX, this.scaleY, this.scaleZ);
    this.transMesh.position.set(2.5, (2.0 * this.scaleY) / 2, 0);
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
    const shapeSelect = document.getElementById('solidShapeSelect');
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

    if (shapeSelect) {
      shapeSelect.addEventListener('change', (e) => {
        this.shapeType = e.target.value;
        this.createMeshes();
      });
    }

    if (btnResetView) {
      btnResetView.addEventListener('click', () => {
        this.camera.position.set(7, 6, 9);
        if (this.controls) this.controls.target.set(0, 1, 0);
      });
    }
  }

  updateStatus(isSimilar) {
    const badge = document.getElementById('solidSimilarityBadge');
    const detailBox = document.getElementById('solidAnalysisDetail');

    if (badge) {
      if (isSimilar) {
        badge.className = 'badge-similarity yes';
        badge.innerHTML = `✓ 입체도형 닮음 성립 (모든 모서리 ${this.scaleX.toFixed(1)}배)`;
      } else {
        badge.className = 'badge-similarity no';
        badge.innerHTML = `✗ 닮음 아님 (특정 축만 늘어나 왜곡됨)`;
      }
    }

    if (detailBox) {
      if (isSimilar) {
        detailBox.innerHTML = `
          <div class="data-row"><span>대응하는 모서리의 비:</span> <b>1 : ${this.scaleX.toFixed(1)} (균일)</b></div>
          <div class="data-row"><span>대응하는 면의 닮음:</span> <b>모든 면이 서로 닮은 평면도형</b></div>
          <div class="data-row"><span>입체 닮음비:</span> <b>1 : ${this.scaleX.toFixed(1)}</b></div>
        `;
      } else {
        detailBox.innerHTML = `
          <div class="data-row"><span>가로/깊이 배율:</span> <b>${this.scaleX.toFixed(1)}배</b></div>
          <div class="data-row"><span>높이 배율:</span> <b>${this.scaleY.toFixed(1)}배</b></div>
          <div class="data-row" style="color: #dc2626;"><span>면의 형태:</span> <b>옆면 직사각형의 가로세로 비율 붕괴!</b></div>
        `;
      }
    }
  }

  onWindowResize() {
    if (!this.canvas || !this.camera || !this.renderer) return;
    const parent = this.canvas.parentElement;
    const width = parent.clientWidth || 800;
    const height = Math.max(480, parent.clientHeight || 520);

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
