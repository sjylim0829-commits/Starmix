/**
 * Starmix Similarity Lab - Solid Geometry Module (3D Three.js 뷰어 + 대응면 클릭 분석 v2.2)
 * Standard Cuboid: Width 2, Depth 3, Height 4
 * Using Multi-Material for Bulletproof Face Highlighting & Raycasting
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

    // Scale State
    this.scaleX = 1.5; // Width (가로 2)
    this.scaleZ = 1.5; // Depth (세로 3)
    this.scaleY = 1.5; // Height (높이 4)

    // Face selection: 'front' (+Z/idx 4), 'top' (+Y/idx 2), 'side' (+X/idx 0)
    this.selectedFace = 'front';

    this.init();
  }

  init() {
    this.setupThree();
    this.createMeshes();
    this.setupControls();
    this.setupRaycasting();
    this.selectFace('front'); // Initial face selection
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(12, 22, 12);
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

    // 1. Base Materials: 6 faces (+X, -X, +Y, -Y, +Z, -Z)
    // 0: Right (+X), 1: Left (-X), 2: Top (+Y), 3: Bottom (-Y), 4: Front (+Z), 5: Back (-Z)
    this.baseMaterials = [];
    for (let i = 0; i < 6; i++) {
      this.baseMaterials.push(new THREE.MeshStandardMaterial({
        color: 0x10b981, // Emerald Green
        roughness: 0.3,
        metalness: 0.1
      }));
    }

    this.baseMesh = new THREE.Mesh(geom, this.baseMaterials);
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
    const color = isSimilar ? 0x4f46e5 : 0xef4444; // Indigo if similar, Red if distorted
    const edgeColor = isSimilar ? 0x312e81 : 0x991b1b;

    this.transMaterials = [];
    for (let i = 0; i < 6; i++) {
      this.transMaterials.push(new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.1
      }));
    }

    this.transMesh = new THREE.Mesh(geom, this.transMaterials);
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

    this.applyFaceHighlights();
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
        const matIndex = hit.face.materialIndex;

        // 0, 1: Side (+X, -X) | 2, 3: Top/Bottom (+Y, -Y) | 4, 5: Front/Back (+Z, -Z)
        let clickedFace = 'front';
        if (matIndex === 4 || matIndex === 5) {
          clickedFace = 'front';
        } else if (matIndex === 2 || matIndex === 3) {
          clickedFace = 'top';
        } else if (matIndex === 0 || matIndex === 1) {
          clickedFace = 'side';
        }

        this.selectFace(clickedFace);
      }
    });
  }

  selectFace(faceKey) {
    if (!faceKey) return;
    this.selectedFace = faceKey;

    // Update active button chip styles
    document.querySelectorAll('.face-select-chip').forEach(chip => {
      if (chip.dataset.face === faceKey) {
        chip.classList.add('active');
        chip.style.background = '#fffbeb';
        chip.style.borderColor = '#f59e0b';
        chip.style.color = '#b45309';
      } else {
        chip.classList.remove('active');
        chip.style.background = 'white';
        chip.style.borderColor = 'var(--border-color)';
        chip.style.color = 'var(--text-main)';
      }
    });

    this.applyFaceHighlights();
    const isSimilar = (Math.abs(this.scaleX - this.scaleY) < 0.01) && (Math.abs(this.scaleY - this.scaleZ) < 0.01);
    this.updateStatus(isSimilar);
  }

  applyFaceHighlights() {
    if (!this.baseMaterials.length || !this.transMaterials.length) return;

    const isSimilar = (Math.abs(this.scaleX - this.scaleY) < 0.01) && (Math.abs(this.scaleY - this.scaleZ) < 0.01);
    const transDefaultColor = isSimilar ? 0x4f46e5 : 0xef4444;

    // Reset base materials to green
    for (let i = 0; i < 6; i++) {
      this.baseMaterials[i].color.setHex(0x10b981);
      this.baseMaterials[i].emissive.setHex(0x000000);
      this.transMaterials[i].color.setHex(transDefaultColor);
      this.transMaterials[i].emissive.setHex(0x000000);
    }

    // Highlight target indices in glowing Amber (0xf59e0b)
    let targetIndices = [4]; // default front (+Z)
    if (this.selectedFace === 'front') {
      targetIndices = [4, 5]; // Front and Back
    } else if (this.selectedFace === 'top') {
      targetIndices = [2, 3]; // Top and Bottom
    } else if (this.selectedFace === 'side') {
      targetIndices = [0, 1]; // Right and Left
    }

    targetIndices.forEach(idx => {
      // Highlight base
      this.baseMaterials[idx].color.setHex(0xf59e0b);
      this.baseMaterials[idx].emissive.setHex(0xb45309);
      this.baseMaterials[idx].emissiveIntensity = 0.35;

      // Highlight transformed
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
        this.camera.position.set(7.5, 6.5, 10.5);
        if (this.controls) this.controls.target.set(0, 2, 0);
      });
    }

    // Face Selector Chips
    document.querySelectorAll('.face-select-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
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
            <b style="color: #b45309; font-size: 0.92rem;">🔍 선택된 대응면: ${faceName}</b>
            <span style="font-size: 0.78rem; font-weight: 800; padding: 0.2rem 0.5rem; border-radius: 4px; ${isFaceSimilar ? 'background: #ecfdf5; color: #059669;' : 'background: #fef2f2; color: #dc2626;'}">
              ${isFaceSimilar ? '✓ 대응면 닮음' : '✗ 대응면 왜곡 (비닮음)'}
            </span>
          </div>

          <div class="data-row"><span>기준 직사각형:</span> <b>${baseW.toFixed(1)} × ${baseH.toFixed(1)} (가로세로비 ${(baseW/baseH).toFixed(2)})</b></div>
          <div class="data-row"><span>확대 직사각형:</span> <b>${transW.toFixed(1)} × ${transH.toFixed(1)} (가로세로비 ${(transW/transH).toFixed(2)})</b></div>
          <div class="data-row"><span>가로 배율 / 세로 배율:</span> <b>${rW.toFixed(1)}배 / ${rH.toFixed(1)}배</b></div>
          
          <div style="margin-top: 0.6rem; font-size: 0.84rem; line-height: 1.45; padding: 0.5rem 0.65rem; border-radius: 6px; background: ${isFaceSimilar ? '#f0fdf4' : '#fff1f2'}; color: ${isFaceSimilar ? '#065f46' : '#991b1b'};">
            ${isFaceSimilar 
              ? `<b>대응면 성질 발견:</b> 두 직사각형의 가로와 세로가 모두 <b>${rW.toFixed(1)}배</b>로 늘어나 대응면끼리 닮음입니다! 이처럼 <b>모든 대응면이 닮음이어야 입체도형의 닮음이 성립</b>합니다.` 
              : `<b>대응면 성질 발견:</b> 가로 배율(${rW.toFixed(1)}배)과 세로 배율(${rH.toFixed(1)}배)이 서로 달라 <b>직사각형 모양이 찌그러졌습니다!</b> 대응면이 닮음이 아니므로 <b>전체 입체도형도 닮음이 될 수 없습니다.</b>`}
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
