/**
 * Starmix Similarity Lab - Solid Geometry Module (3D Three.js 뷰어 + 대응면 클릭 분석)
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
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Meshes
    this.baseMesh = null;
    this.transMesh = null;
    this.gridHelper = null;
    this.baseHighlightPlane = null;
    this.transHighlightPlane = null;

    // Scale State
    this.scaleX = 1.5; // Width (가로 2)
    this.scaleZ = 1.5; // Depth (세로 3)
    this.scaleY = 1.5; // Height (높이 4)
    this.shapeType = 'box';

    // Face selection state: 'front', 'top', 'side'
    this.selectedFace = 'front';

    this.init();
  }

  init() {
    this.setupThree();
    this.createMeshes();
    this.setupControls();
    this.setupRaycasting();
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
    return new THREE.BoxGeometry(2.0, 4.0, 3.0);
  }

  createMeshes() {
    if (this.baseMesh) this.scene.remove(this.baseMesh);
    if (this.transMesh) this.scene.remove(this.transMesh);

    const geom = this.createGeometry();

    // 1. Base Mesh (Original - Emerald Green)
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

    this.updateFaceHighlights();
    this.updateStatus(isSimilar);
  }

  setupRaycasting() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects([this.baseMesh, this.transMesh], false);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const normal = hit.face.normal.clone();
        normal.applyQuaternion(hit.object.quaternion);

        // Determine which face was clicked based on dominant normal axis
        const absX = Math.abs(normal.x);
        const absY = Math.abs(normal.y);
        const absZ = Math.abs(normal.z);

        let clickedFace = 'front';
        if (absZ >= absX && absZ >= absY) {
          clickedFace = 'front'; // Front or Back face
        } else if (absY >= absX && absY >= absZ) {
          clickedFace = 'top'; // Top or Bottom face
        } else {
          clickedFace = 'side'; // Left or Right face
        }

        this.selectFace(clickedFace);
      }
    });
  }

  selectFace(faceKey) {
    this.selectedFace = faceKey;

    // Update face selector chips in UI
    document.querySelectorAll('.face-select-chip').forEach(chip => {
      if (chip.dataset.face === faceKey) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    this.updateFaceHighlights();
    const isSimilar = (Math.abs(this.scaleX - this.scaleY) < 0.01) && (Math.abs(this.scaleY - this.scaleZ) < 0.01);
    this.updateStatus(isSimilar);
  }

  updateFaceHighlights() {
    if (this.baseHighlightPlane) this.baseMesh.remove(this.baseHighlightPlane);
    if (this.transHighlightPlane) this.transMesh.remove(this.transHighlightPlane);

    // Create highlight planes on both meshes
    let w = 2.0, h = 4.0;
    let pos = new THREE.Vector3(0, 0, 1.51);
    let rot = new THREE.Euler(0, 0, 0);

    if (this.selectedFace === 'front') {
      w = 2.0; h = 4.0;
      pos = new THREE.Vector3(0, 0, 1.51);
      rot = new THREE.Euler(0, 0, 0);
    } else if (this.selectedFace === 'top') {
      w = 2.0; h = 3.0;
      pos = new THREE.Vector3(0, 2.01, 0);
      rot = new THREE.Euler(-Math.PI / 2, 0, 0);
    } else if (this.selectedFace === 'side') {
      w = 3.0; h = 4.0;
      pos = new THREE.Vector3(1.01, 0, 0);
      rot = new THREE.Euler(0, Math.PI / 2, 0);
    }

    const hlMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55
    });

    const geom = new THREE.PlaneGeometry(w, h);

    this.baseHighlightPlane = new THREE.Mesh(geom, hlMat);
    this.baseHighlightPlane.position.copy(pos);
    this.baseHighlightPlane.rotation.copy(rot);
    this.baseMesh.add(this.baseHighlightPlane);

    this.transHighlightPlane = new THREE.Mesh(geom, hlMat);
    this.transHighlightPlane.position.copy(pos);
    this.transHighlightPlane.rotation.copy(rot);
    this.transMesh.add(this.transHighlightPlane);
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

    // Face Selector Chips
    document.querySelectorAll('.face-select-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.selectFace(chip.dataset.face);
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
      let faceName = '앞면 (Front)';
      let baseDim = '가로 2 × 높이 4';
      let transDim = `가로 ${curW} × 높이 ${curH}`;
      let r1 = this.scaleX;
      let r2 = this.scaleY;

      if (this.selectedFace === 'top') {
        faceName = '윗면 (Top)';
        baseDim = '가로 2 × 세로 3';
        transDim = `가로 ${curW} × 세로 ${curD}`;
        r1 = this.scaleX;
        r2 = this.scaleZ;
      } else if (this.selectedFace === 'side') {
        faceName = '옆면 (Side)';
        baseDim = '세로 3 × 높이 4';
        transDim = `세로 ${curD} × 높이 ${curH}`;
        r1 = this.scaleZ;
        r2 = this.scaleY;
      }

      const isFaceSimilar = Math.abs(r1 - r2) < 0.01;

      faceDetailBox.innerHTML = `
        <div style="background: white; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem; margin-top: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <b style="color: #d97706;">🔍 선택된 대응면: ${faceName}</b>
            <span style="font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 4px; ${isFaceSimilar ? 'background: #ecfdf5; color: #059669;' : 'background: #fef2f2; color: #dc2626;'}">
              ${isFaceSimilar ? '대응면 닮음' : '대응면 왜곡'}
            </span>
          </div>
          <div class="data-row"><span>기준 직사각형:</span> <b>${baseDim}</b></div>
          <div class="data-row"><span>확대 직사각형:</span> <b>${transDim}</b></div>
          <div class="data-row"><span>가로/세로 배율:</span> <b>${r1.toFixed(1)}배 / ${r2.toFixed(1)}배</b></div>
          <div style="margin-top: 0.5rem; font-size: 0.8rem; line-height: 1.4; color: ${isFaceSimilar ? '#059669' : '#dc2626'};">
            ${isFaceSimilar 
              ? `✓ 두 직사각형의 가로와 세로가 모두 <b>${r1.toFixed(1)}배</b>로 늘어나 대응면끼리 닮음입니다!` 
              : `⚠ 직사각형의 가로와 세로 배율이 달라(가로 ${r1.toFixed(1)}배 ≠ 세로 ${r2.toFixed(1)}배) <b>대응면이 서로 닮음이 아닙니다</b>! 따라서 입체도형도 닮음이 될 수 없습니다.`}
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
    if (this.controls) this.controls.update();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// Export for app.js
window.SolidLab = SolidLab;
