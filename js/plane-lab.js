/**
 * Starmix Similarity Lab - Plane Geometry Module (2D 모눈 캔버스)
 * Youngseo Middle School Grade 2 Class 7 Customization
 */

// Textbook "생각 넓히기" 6 Plane Shapes Configuration
const PLANE_SHAPES = {
  right_triangle: {
    key: 'right_triangle',
    name: '직각삼각형 (3, 4, 5)',
    shortName: '직각삼각형',
    type: 'polygon',
    baseTitle: '△ABC (밑변 3, 높이 4)',
    transTitle: '△DEF',
    refPoint: { x: 1, y: 1 },
    basePoly: [
      { x: 1, y: 1, label: 'A' },
      { x: 4, y: 1, label: 'B' },
      { x: 1, y: 5, label: 'C' }
    ],
    offset: { x: 6, y: 0 },
    transLabels: ['D', 'E', 'F'],
    angles: ['90°', '53°', '37°'],
    isAlwaysSimilar: false,
    reason: '한 각이 90°(직각)이더라도 나머지 두 예각의 크기(밑변과 높이의 비)가 다르면 닮음이 아닙니다.',
    hint: '가로/세로 배율 슬라이더를 다르게 조작해보세요! 예각의 크기가 달라지면서 직각삼각형 모양이 왜곡됩니다.',
    simPrompt: '△ABC와 △DEF가 닮음임을 <b>닮음 기호(∽)</b>를 사용하여 직접 적어보세요.',
    expectedSim: '△ABC ∽ △DEF'
  },
  isosceles: {
    key: 'isosceles',
    name: '이등변삼각형',
    shortName: '이등변삼각형',
    type: 'polygon',
    baseTitle: '이등변△ABC (밑변 4, 높이 4)',
    transTitle: '이등변△DEF',
    refPoint: { x: 1, y: 1 },
    basePoly: [
      { x: 1, y: 1, label: 'A' },
      { x: 5, y: 1, label: 'B' },
      { x: 3, y: 5, label: 'C' }
    ],
    offset: { x: 6, y: 0 },
    transLabels: ['D', 'E', 'F'],
    angles: ['63°', '63°', '53°'],
    isAlwaysSimilar: false,
    reason: '두 변의 길이가 같더라도 꼭지각(또는 두 밑각)의 크기가 다르면 대응각의 크기가 달라지므로 항상 닮음인 것은 아닙니다.',
    hint: '가로만 늘리거나 세로만 늘려보세요! 꼭지각이 뾰족해지거나 납작해지며 비닮음이 됩니다.',
    simPrompt: '이등변삼각형 △ABC와 △DEF가 닮음임을 <b>닮음 기호(∽)</b>를 사용하여 적어보세요.',
    expectedSim: '△ABC ∽ △DEF'
  },
  equilateral: {
    key: 'equilateral',
    name: '정삼각형',
    shortName: '정삼각형',
    type: 'polygon',
    baseTitle: '정△ABC (한 변 4, 60°)',
    transTitle: '정△DEF',
    refPoint: { x: 1, y: 1 },
    basePoly: [
      { x: 1, y: 1, label: 'A' },
      { x: 5, y: 1, label: 'B' },
      { x: 3, y: 1 + 2 * Math.sqrt(3), label: 'C' }
    ],
    offset: { x: 6, y: 0 },
    transLabels: ['D', 'E', 'F'],
    angles: ['60°', '60°', '60°'],
    isAlwaysSimilar: true,
    reason: '세 내각의 크기가 항상 60°로 모두 같고, 세 변의 길이의 비가 항상 일정하므로 어떤 두 정삼각형도 항상 서로 닮은 도형입니다.',
    hint: '한 변의 길이를 조절해보세요! 크기가 변해도 세 각은 항상 60°로 변함없어 정삼각형 모양이 그대로 유지됩니다!',
    simPrompt: '정삼각형 △ABC와 △DEF가 닮음임을 <b>닮음 기호(∽)</b>를 사용하여 적어보세요.',
    expectedSim: '△ABC ∽ △DEF'
  },
  rhombus: {
    key: 'rhombus',
    name: '마름모',
    shortName: '마름모',
    type: 'polygon',
    baseTitle: '마름모 ABCD (가로 대각선 4, 세로 대각선 3)',
    transTitle: '마름모 EFGH',
    refPoint: { x: 3, y: 3.5 },
    basePoly: [
      { x: 3, y: 2, label: 'A' },
      { x: 5, y: 3.5, label: 'B' },
      { x: 3, y: 5, label: 'C' },
      { x: 1, y: 3.5, label: 'D' }
    ],
    offset: { x: 7, y: 0 },
    transLabels: ['E', 'F', 'G', 'H'],
    angles: ['106°', '74°', '106°', '74°'],
    isAlwaysSimilar: false,
    reason: '네 변의 길이가 모두 같더라도 두 대각선의 길이의 비가 다르면 내각의 크기가 달라지므로 마름모는 항상 닮음인 것은 아닙니다.',
    hint: '가로 대각선과 세로 대각선의 길이를 각각 조작해보세요! 두 대각선의 비율이 달라지면 네 내각이 변하며 모양이 왜곡됩니다.',
    simPrompt: '마름모 ABCD와 EFGH가 닮음임을 <b>닮음 기호(∽)</b>를 사용하여 적어보세요.',
    expectedSim: '□ABCD ∽ □EFGH'
  },
  square: {
    key: 'square',
    name: '정사각형',
    shortName: '정사각형',
    type: 'polygon',
    baseTitle: '정사각형 ABCD (한 변 3, 90°)',
    transTitle: '정사각형 EFGH',
    refPoint: { x: 1, y: 1 },
    basePoly: [
      { x: 1, y: 1, label: 'A' },
      { x: 4, y: 1, label: 'B' },
      { x: 4, y: 4, label: 'C' },
      { x: 1, y: 4, label: 'D' }
    ],
    offset: { x: 6, y: 0 },
    transLabels: ['E', 'F', 'G', 'H'],
    angles: ['90°', '90°', '90°', '90°'],
    isAlwaysSimilar: true,
    reason: '네 내각의 크기가 항상 90°로 모두 같고, 세 변의 길이의 비가 항상 일정하므로 어떤 두 정사각형도 항상 서로 닮은 도형입니다.',
    hint: '한 변의 길이를 조절해보세요! 모든 정사각형은 네 각이 90°이고 네 변의 길이가 같아 크기에 상관없이 항상 닮음입니다!',
    simPrompt: '정사각형 ABCD와 EFGH가 닮음임을 <b>닮음 기호(∽)</b>를 사용하여 적어보세요.',
    expectedSim: '□ABCD ∽ □EFGH'
  },
  circle: {
    key: 'circle',
    name: '원',
    shortName: '원',
    type: 'circle',
    baseTitle: '원 O (반지름 r = 1.5)',
    transTitle: "원 O'",
    baseCenter: { x: 3.2, y: 3.5 },
    baseRadius: 1.5,
    offset: { x: 7.2, y: 0 },
    isAlwaysSimilar: true,
    reason: '모든 원은 모양이 중심각 360°인 완전한 원형이며, 오직 반지름의 비에 의해서만 크기가 결정되므로 어떤 두 원도 항상 서로 닮은 도형입니다.',
    hint: '반지름의 길이를 조절해보세요! 원은 항상 완전한 원형이 유지되므로 모든 원은 항상 서로 닮음입니다!',
    simPrompt: "원 O와 원 O'의 닮음 관계를 확인해보세요. (모든 원은 항상 닮음)",
    expectedSim: "원 O ∽ 원 O'"
  }
};

class PlaneLab {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Current Shape Selection ('right_triangle', 'isosceles', 'equilateral', 'rhombus', 'square', 'circle')
    this.currentShape = 'right_triangle';

    // Grid configuration
    this.gridSize = 36; // pixels per unit
    this.origin = { x: 70, y: 420 };

    // Standard Reference Base Geometry
    this.basePoly = PLANE_SHAPES.right_triangle.basePoly;
    this.transformedOffset = PLANE_SHAPES.right_triangle.offset;

    // Transformation State
    this.scaleX = 2.0;
    this.scaleY = 2.0;
    this.isOverlay = false;
    this.overlayProgress = 0.0; // 0.0 (separated) -> 1.0 (smoothly overlaid)
    this.overlayAnimId = null;
    this.showLabels = true;
    this.showAngles = true;   // 각도 측정기 토글
    this.showLengths = true;  // 길이 눈금 토글
    this.currentTabMode = 'explore'; // 'explore' (관찰) or 'draw' (직접 작도)

    // Student Interactive Drawing State
    this.drawnPoints = []; // [{x, y, label}]
    this.hoverGridPt = null;

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.setupControls();
    this.setupShapeSwitcher();
    this.setupMouseEvents();
    this.setShape(this.currentShape);
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const width = parent.clientWidth || 800;
    const height = Math.max(260, parent.clientHeight || 420);

    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.logicalWidth = width;
    this.logicalHeight = height;

    this.gridSize = Math.max(24, Math.min(36, Math.floor((height - 70) / 11)));
    this.origin = { x: 55, y: Math.round(height - 38) };

    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
    this.render();
  }

  setupControls() {
    // Mode Switch (Explore vs Draw)
    const btnExplore = document.getElementById('btnSubmodeExplore');
    const btnDraw = document.getElementById('btnSubmodeDraw');
    const exploreControls = document.getElementById('exploreControls');
    const drawControls = document.getElementById('drawControls');

    if (btnExplore && btnDraw) {
      btnExplore.addEventListener('click', () => {
        this.currentTabMode = 'explore';
        btnExplore.classList.add('active');
        btnDraw.classList.remove('active');
        if (exploreControls) exploreControls.style.display = 'block';
        if (drawControls) drawControls.style.display = 'none';
        this.render();
      });

      btnDraw.addEventListener('click', () => {
        this.currentTabMode = 'draw';
        btnDraw.classList.add('active');
        btnExplore.classList.remove('active');
        if (exploreControls) exploreControls.style.display = 'none';
        if (drawControls) drawControls.style.display = 'block';
        this.render();
      });
    }

    // Tools Toggles (각도 측정기 & 길이 눈금)
    const toggleAngles = document.getElementById('toggleAngles');
    const toggleLengths = document.getElementById('toggleLengths');
    const toggleOverlay = document.getElementById('toggleOverlay');

    if (toggleAngles) {
      toggleAngles.addEventListener('change', (e) => {
        this.showAngles = e.target.checked;
        this.render();
      });
    }

    if (toggleLengths) {
      toggleLengths.addEventListener('change', (e) => {
        this.showLengths = e.target.checked;
        this.render();
      });
    }

    const btnTriggerOverlay = document.getElementById('btnTriggerOverlay');

    const updateOverlayUI = (isActive) => {
      if (toggleOverlay) toggleOverlay.checked = isActive;
      if (btnTriggerOverlay) {
        btnTriggerOverlay.textContent = isActive ? '↺ 포개어보기 해제' : '✨ △ABC 확대하여 △DEF에 포개어보기 (합동 확인)';
        if (isActive) {
          btnTriggerOverlay.classList.remove('btn-secondary');
          btnTriggerOverlay.classList.add('btn-primary');
        } else {
          btnTriggerOverlay.classList.remove('btn-primary');
          btnTriggerOverlay.classList.add('btn-secondary');
        }
      }
    };

    if (toggleOverlay) {
      toggleOverlay.addEventListener('change', (e) => {
        updateOverlayUI(e.target.checked);
        this.animateOverlay(e.target.checked ? 1.0 : 0.0);
      });
    }

    if (btnTriggerOverlay) {
      btnTriggerOverlay.addEventListener('click', () => {
        const nextState = this.overlayProgress < 0.5;
        updateOverlayUI(nextState);
        this.animateOverlay(nextState ? 1.0 : 0.0);
      });
    }

    // Scale Sliders
    const scaleAllSlider = document.getElementById('planeScaleSlider');
    const scaleAllVal = document.getElementById('planeScaleVal');
    const scaleXSlider = document.getElementById('planeScaleXSlider');
    const scaleXVal = document.getElementById('planeScaleXVal');
    const scaleYSlider = document.getElementById('planeScaleYSlider');
    const scaleYVal = document.getElementById('planeScaleYVal');
    const btnProp = document.getElementById('btnModeProportional');
    const btnResetPlane = document.getElementById('btnResetPlane');

    this.updateSliderUI = () => {
      if (this.currentShape === 'equilateral') {
        const sideLen = (4.0 * this.scaleX).toFixed(1);
        if (scaleAllSlider) scaleAllSlider.value = this.scaleX;
        if (scaleAllVal) scaleAllVal.textContent = `${this.scaleX.toFixed(1)}배 (한 변: ${sideLen})`;
      } else if (this.currentShape === 'square') {
        const sideLen = (3.0 * this.scaleX).toFixed(1);
        if (scaleAllSlider) scaleAllSlider.value = this.scaleX;
        if (scaleAllVal) scaleAllVal.textContent = `${this.scaleX.toFixed(1)}배 (한 변: ${sideLen})`;
      } else if (this.currentShape === 'circle') {
        const radiusLen = (1.5 * this.scaleX).toFixed(1);
        if (scaleAllSlider) scaleAllSlider.value = this.scaleX;
        if (scaleAllVal) scaleAllVal.textContent = `${this.scaleX.toFixed(1)}배 (반지름 r: ${radiusLen})`;
      } else if (this.currentShape === 'rhombus') {
        const horizDiag = (4.0 * this.scaleX).toFixed(1);
        const vertDiag = (3.0 * this.scaleY).toFixed(1);
        if (scaleXSlider) scaleXSlider.value = this.scaleX;
        if (scaleXVal) scaleXVal.textContent = `${this.scaleX.toFixed(1)}배 (길이: ${horizDiag})`;
        if (scaleYSlider) scaleYSlider.value = this.scaleY;
        if (scaleYVal) scaleYVal.textContent = `${this.scaleY.toFixed(1)}배 (길이: ${vertDiag})`;

        if (Math.abs(this.scaleX - this.scaleY) < 0.01) {
          if (scaleAllSlider) scaleAllSlider.value = this.scaleX;
          if (scaleAllVal) scaleAllVal.textContent = `${this.scaleX.toFixed(1)}배 (대각선 비율 일치)`;
        } else {
          if (scaleAllVal) scaleAllVal.textContent = '대각선 비율 다름';
        }
      } else {
        // right_triangle, isosceles
        const baseSide = this.currentShape === 'right_triangle' ? 3.0 : 4.0;
        const heightSide = 4.0;
        if (scaleXSlider) scaleXSlider.value = this.scaleX;
        if (scaleXVal) scaleXVal.textContent = `${this.scaleX.toFixed(1)}배 (밑변: ${(baseSide * this.scaleX).toFixed(1)})`;
        if (scaleYSlider) scaleYSlider.value = this.scaleY;
        if (scaleYVal) scaleYVal.textContent = `${this.scaleY.toFixed(1)}배 (높이: ${(heightSide * this.scaleY).toFixed(1)})`;

        if (Math.abs(this.scaleX - this.scaleY) < 0.01) {
          if (scaleAllSlider) scaleAllSlider.value = this.scaleX;
          if (scaleAllVal) scaleAllVal.textContent = `${this.scaleX.toFixed(1)}배`;
        } else {
          if (scaleAllVal) scaleAllVal.textContent = '비율 왜곡';
        }
      }
    };

    if (scaleAllSlider) {
      scaleAllSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.scaleX = val;
        this.scaleY = val;
        this.updateSliderUI();
        this.render();
      });
    }

    if (scaleXSlider) {
      scaleXSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (this.currentShape === 'equilateral' || this.currentShape === 'square' || this.currentShape === 'circle') {
          this.scaleX = val;
          this.scaleY = val;
        } else {
          this.scaleX = val;
        }
        this.updateSliderUI();
        this.render();
      });
    }

    if (scaleYSlider) {
      scaleYSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (this.currentShape === 'equilateral' || this.currentShape === 'square' || this.currentShape === 'circle') {
          this.scaleX = val;
          this.scaleY = val;
        } else {
          this.scaleY = val;
        }
        this.updateSliderUI();
        this.render();
      });
    }

    if (btnProp) {
      btnProp.addEventListener('click', () => {
        this.scaleY = this.scaleX;
        this.updateSliderUI();
        this.render();
      });
    }

    if (btnResetPlane) {
      btnResetPlane.addEventListener('click', () => {
        this.scaleX = 2.0;
        this.scaleY = 2.0;
        this.updateSliderUI();
        updateOverlayUI(false);
        this.animateOverlay(0.0);
        const simInput = document.getElementById('inputSimSymbol');
        const simFeedback = document.getElementById('simSymbolFeedback');
        if (simInput) simInput.value = '';
        if (simFeedback) simFeedback.style.display = 'none';
        this.render();
      });
    }

    // Student Drawing Controls
    const btnClearDrawing = document.getElementById('btnClearDrawing');
    const btnCheckDrawing = document.getElementById('btnCheckDrawing');

    if (btnClearDrawing) {
      btnClearDrawing.addEventListener('click', () => {
        this.drawnPoints = [];
        this.updateDrawingStatus('모눈 위의 점을 클릭하여 첫 번째 꼭짓점(D)을 찍으세요.');
        this.render();
      });
    }

    if (btnCheckDrawing) {
      btnCheckDrawing.addEventListener('click', () => {
        this.evaluateStudentDrawing();
      });
    }

    // Similarity Notation Typing Activity
    this.setupSimilarityTypingActivity();

    // Property Fill-in-the-Blank Quiz
    this.setupPropertyQuiz();
  }

  setupShapeSwitcher() {
    const shapeBtns = document.querySelectorAll('.plane-shape-btn');
    shapeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const shapeKey = btn.dataset.shape;
        if (shapeKey) this.setShape(shapeKey);
      });
    });
  }

  setShape(shapeKey) {
    if (!PLANE_SHAPES[shapeKey]) return;
    this.currentShape = shapeKey;
    const shape = PLANE_SHAPES[shapeKey];

    // Update button active state
    document.querySelectorAll('.plane-shape-btn').forEach(btn => {
      if (btn.dataset.shape === shapeKey) {
        btn.classList.add('btn-primary', 'active');
        btn.classList.remove('btn-secondary');
      } else {
        btn.classList.remove('btn-primary', 'active');
        btn.classList.add('btn-secondary');
      }
    });

    // Update Toolbar labels
    const baseLabel = document.getElementById('planeBaseShapeName');
    const transLabel = document.getElementById('planeTransShapeName');
    if (baseLabel) baseLabel.textContent = shape.baseTitle;
    if (transLabel) transLabel.textContent = shape.transTitle;

    // Update basePoly and offset if polygon
    if (shape.type === 'polygon') {
      this.basePoly = shape.basePoly;
      this.transformedOffset = shape.offset;
    }

    // Configure shape-specific sliders and controls
    const scaleXGroup = document.getElementById('planeScaleXGroup');
    const scaleYGroup = document.getElementById('planeScaleYGroup');
    const scaleXLabel = document.getElementById('planeScaleXLabel');
    const scaleYLabel = document.getElementById('planeScaleYLabel');
    const scaleAllLabel = document.getElementById('planeScaleAllLabel');
    const btnProp = document.getElementById('btnModeProportional');
    const hintEl = document.getElementById('planeCanvasHint');

    if (shapeKey === 'equilateral') {
      if (scaleXGroup) scaleXGroup.style.display = 'none';
      if (scaleYGroup) scaleYGroup.style.display = 'none';
      if (btnProp) btnProp.style.display = 'none';
      if (scaleAllLabel) scaleAllLabel.textContent = '한 변의 길이 조절 (정삼각형 유지)';
      if (hintEl) hintEl.textContent = '💡 정삼각형: 한 변의 길이를 조절해도 세 각은 항상 60°로 변함없어 항상 서로 닮음입니다.';
    } else if (shapeKey === 'square') {
      if (scaleXGroup) scaleXGroup.style.display = 'none';
      if (scaleYGroup) scaleYGroup.style.display = 'none';
      if (btnProp) btnProp.style.display = 'none';
      if (scaleAllLabel) scaleAllLabel.textContent = '한 변의 길이 조절 (정사각형 유지)';
      if (hintEl) hintEl.textContent = '💡 정사각형: 한 변의 길이를 조절해도 네 각은 항상 90°로 변함없어 항상 서로 닮음입니다.';
    } else if (shapeKey === 'circle') {
      if (scaleXGroup) scaleXGroup.style.display = 'none';
      if (scaleYGroup) scaleYGroup.style.display = 'none';
      if (btnProp) btnProp.style.display = 'none';
      if (scaleAllLabel) scaleAllLabel.textContent = '반지름의 길이 조절 (원형 유지)';
      if (hintEl) hintEl.textContent = '💡 원: 반지름의 길이를 조절해도 항상 완전한 원형이 유지되므로 모든 원은 항상 서로 닮음입니다.';
    } else if (shapeKey === 'rhombus') {
      if (scaleXGroup) scaleXGroup.style.display = 'block';
      if (scaleYGroup) scaleYGroup.style.display = 'block';
      if (btnProp) {
        btnProp.style.display = 'block';
        btnProp.textContent = '✓ 대각선 비율 일치';
      }
      if (scaleXLabel) scaleXLabel.textContent = '가로 대각선 길이 조절';
      if (scaleYLabel) scaleYLabel.textContent = '세로 대각선 길이 조절';
      if (scaleAllLabel) scaleAllLabel.textContent = '두 대각선 정비율 확대 (k배)';
      if (hintEl) hintEl.textContent = '💡 마름모: 가로 대각선과 세로 대각선의 길이를 각각 조작하여 대각선 비율과 각도 변화를 관찰해보세요.';
    } else {
      // right_triangle, isosceles
      if (scaleXGroup) scaleXGroup.style.display = 'block';
      if (scaleYGroup) scaleYGroup.style.display = 'block';
      if (btnProp) {
        btnProp.style.display = 'block';
        btnProp.textContent = '✓ 정비율 맞추기';
      }
      if (scaleXLabel) scaleXLabel.textContent = '가로(밑변) 배율 조절';
      if (scaleYLabel) scaleYLabel.textContent = '세로(높이) 배율 조절';
      if (scaleAllLabel) scaleAllLabel.textContent = '전체 정비율 확대 (k배)';
      if (hintEl) {
        hintEl.textContent = shapeKey === 'isosceles'
          ? '💡 이등변삼각형: 밑변과 높이를 다르게 늘려 꼭지각이 뾰족해지거나 납작해지는 왜곡을 관찰해보세요.'
          : '💡 직각삼각형: 가로(밑변)와 세로(높이) 배율을 다르게 조작하여 직각삼각형이 왜곡되는지 관찰해보세요.';
      }
    }

    // Update Overlay Button text
    const btnOverlay = document.getElementById('btnTriggerOverlay');
    if (btnOverlay) {
      if (shape.type === 'circle') {
        btnOverlay.textContent = "✨ 원 O 확대하여 원 O'에 포개어보기 (합동 확인)";
      } else if (shape.basePoly && shape.basePoly.length === 4) {
        btnOverlay.textContent = `✨ □ABCD 확대하여 □${shape.transLabels.join('')}에 포개어보기 (합동 확인)`;
      } else {
        btnOverlay.textContent = "✨ △ABC 확대하여 △DEF에 포개어보기 (합동 확인)";
      }
      btnOverlay.classList.remove('btn-primary');
      btnOverlay.classList.add('btn-secondary');
    }

    // Update Typing instruction & reset typing input
    const simInst = document.getElementById('planeSimInstruction');
    if (simInst) {
      simInst.innerHTML = shape.simPrompt;
    }
    const simInput = document.getElementById('inputSimSymbol');
    const simFeedback = document.getElementById('simSymbolFeedback');
    if (simInput) simInput.value = '';
    if (simFeedback) simFeedback.style.display = 'none';

    // Cancel any overlay animation
    if (this.overlayAnimId) {
      cancelAnimationFrame(this.overlayAnimId);
      this.overlayAnimId = null;
    }
    this.overlayProgress = 0.0;
    this.isOverlay = false;
    const toggleOverlay = document.getElementById('toggleOverlay');
    if (toggleOverlay) toggleOverlay.checked = false;

    // Reset scales to 2.0 and update UI
    this.scaleX = 2.0;
    this.scaleY = 2.0;
    if (this.updateSliderUI) this.updateSliderUI();

    // Clear student drawing if in draw mode
    this.drawnPoints = [];
    if (this.currentTabMode === 'draw') {
      this.updateDrawingStatus(shape.type === 'circle' 
        ? '원은 상단 [🔍 탐구 & 왜곡 실험] 모드에서 슬라이더를 조작하여 탐구해보세요!'
        : '모눈 위의 점을 클릭하여 첫 번째 꼭짓점을 찍으세요.');
    }

    this.render();
  }

  updateButtonsStyle(buttons, activeBtn) {
    buttons.forEach(btn => {
      if (!btn) return;
      if (btn === activeBtn) {
        btn.classList.add('btn-primary');
        btn.classList.remove('btn-secondary');
      } else {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
      }
    });
  }

  setupMouseEvents() {
    const getCanvasCoords = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const logicalW = this.logicalWidth || this.canvas.clientWidth || rect.width;
      const logicalH = this.logicalHeight || this.canvas.clientHeight || rect.height;
      const scaleX = logicalW / rect.width;
      const scaleY = logicalH / rect.height;

      let clientX = e.clientX;
      let clientY = e.clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    };

    const updateHoverCoord = (pos) => {
      // Snap to closest grid coordinate
      const gridX = Math.round((pos.x - this.origin.x) / this.gridSize);
      const gridY = Math.round((this.origin.y - pos.y) / this.gridSize);

      if (gridX >= 0 && gridY >= 0 && gridX <= 25 && gridY <= 15) {
        this.hoverGridPt = { x: gridX, y: gridY };
      } else {
        this.hoverGridPt = null;
      }
    };

    const addPointAtHover = () => {
      if (this.currentTabMode !== 'draw' || !this.hoverGridPt) return;

      if (this.drawnPoints.length < 3) {
        const labels = ['D', 'E', 'F'];
        const label = labels[this.drawnPoints.length];
        this.drawnPoints.push({
          x: this.hoverGridPt.x,
          y: this.hoverGridPt.y,
          label: label
        });

        if (this.drawnPoints.length === 1) {
          this.updateDrawingStatus('두 번째 점(E)을 모눈에서 클릭하세요 (밑변 완성)');
        } else if (this.drawnPoints.length === 2) {
          this.updateDrawingStatus('세 번째 점(F)을 모눈에서 클릭하세요 (높이 완성)');
        } else if (this.drawnPoints.length === 3) {
          this.updateDrawingStatus('3개의 꼭짓점이 완성되었습니다! [작도 검증하기]를 눌러보세요.');
          this.evaluateStudentDrawing();
        }
        this.render();
      }
    };

    // 1. Mouse Events
    this.canvas.addEventListener('mousemove', (e) => {
      updateHoverCoord(getCanvasCoords(e));
      if (this.currentTabMode === 'draw') {
        this.render();
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverGridPt = null;
      if (this.currentTabMode === 'draw') this.render();
    });

    this.canvas.addEventListener('click', (e) => {
      updateHoverCoord(getCanvasCoords(e));
      addPointAtHover();
    });

    // 2. Touch Events for Tablets (iPad, Galaxy Tab)
    this.canvas.addEventListener('touchstart', (e) => {
      if (this.currentTabMode !== 'draw') return;
      if (e.touches && e.touches.length > 0) {
        e.preventDefault();
        updateHoverCoord(getCanvasCoords(e));
        this.render();
      }
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.currentTabMode !== 'draw') return;
      if (e.touches && e.touches.length > 0) {
        e.preventDefault();
        updateHoverCoord(getCanvasCoords(e));
        this.render();
      }
    }, { passive: false });

    this.canvas.addEventListener('touchend', (e) => {
      if (this.currentTabMode !== 'draw') return;
      e.preventDefault();
      addPointAtHover();
    });
  }

  updateDrawingStatus(msg) {
    const statusEl = document.getElementById('drawingStatusText');
    if (statusEl) statusEl.textContent = msg;
  }

  evaluateStudentDrawing() {
    if (this.drawnPoints.length < 3) {
      alert('삼각형을 완성하려면 모눈 위에 꼭짓점 3개를 먼저 찍어주세요!');
      return;
    }

    // Evaluate side lengths of student triangle
    const d1 = this.getDist(this.drawnPoints[0], this.drawnPoints[1]); // DE
    const d2 = this.getDist(this.drawnPoints[0], this.drawnPoints[2]); // DF
    const d3 = this.getDist(this.drawnPoints[1], this.drawnPoints[2]); // EF

    const baseSides = [3, 4, 5];
    const userSides = [d1, d2, d3].sort((a, b) => a - b);

    const ratio1 = userSides[0] / baseSides[0];
    const ratio2 = userSides[1] / baseSides[1];
    const ratio3 = userSides[2] / baseSides[2];

    const isScale2 = Math.abs(ratio1 - 2.0) < 0.1 && Math.abs(ratio2 - 2.0) < 0.1 && Math.abs(ratio3 - 2.0) < 0.1;
    const isProportional = Math.abs(ratio1 - ratio2) < 0.1 && Math.abs(ratio2 - ratio3) < 0.1;

    const resultBox = document.getElementById('drawEvaluationResult');
    if (!resultBox) return;

    if (isScale2) {
      resultBox.className = 'feedback-alert success';
      resultBox.innerHTML = `
        <b>🎉 완벽한 2배 닮은 삼각형 작도 성공!</b><br>
        • 세 변의 길이: ${userSides[0].toFixed(1)}, ${userSides[1].toFixed(1)}, ${userSides[2].toFixed(1)} (모두 정확히 2배)<br>
        • 각도: 직각($90^\\circ$)과 두 예각이 원래 삼각형과 완벽히 일치합니다!<br>
        <b>수학적 표현: △ABC ∽ △DEF (닮음비 1 : 2)</b>
      `;
    } else if (isProportional) {
      const k = ratio1.toFixed(1);
      resultBox.className = 'feedback-alert info';
      resultBox.innerHTML = `
        <b>👍 닮은 삼각형 작도 성공! (배율: ${k}배)</b><br>
        닮음은 맞지만, 목표인 <b>2배 확대</b>를 만족하는지 확인해보세요!<br>
        (밑변 6칸, 높이 8칸이 되도록 다시 작도해보세요)
      `;
    } else {
      resultBox.className = 'feedback-alert error';
      resultBox.innerHTML = `
        <b>⚠ 모양이 왜곡되어 닮음이 아닙니다!</b><br>
        한쪽 변만 늘어났거나 각도가 달라졌습니다.<br>
        💡 <b>힌트:</b> 밑변은 $3 \\times 2 = 6$칸, 높이는 $4 \\times 2 = 8$칸이 되어야 합니다.
      `;
    }
  }

  getDist(p1, p2) {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
  }

  toScreen(gridPt) {
    return {
      x: this.origin.x + gridPt.x * this.gridSize,
      y: this.origin.y - gridPt.y * this.gridSize
    };
  }

  drawGrid() {
    this.ctx.save();
    const w = this.logicalWidth || this.canvas.clientWidth;
    const h = this.logicalHeight || this.canvas.clientHeight;

    this.ctx.strokeStyle = '#f1f5f9';
    this.ctx.lineWidth = 1;

    // Vertical grid lines: anchored to this.origin.x
    // Positive direction (right)
    for (let x = this.origin.x; x <= w; x += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    // Negative direction (left)
    for (let x = this.origin.x - this.gridSize; x >= 0; x -= this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }

    // Horizontal grid lines: anchored to this.origin.y
    // Positive direction (upwards)
    for (let y = this.origin.y; y >= 0; y -= this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }
    // Negative direction (downwards)
    for (let y = this.origin.y + this.gridSize; y <= h; y += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    // Bold Axis Lines
    this.ctx.strokeStyle = '#cbd5e1';
    this.ctx.lineWidth = 2;
    // X-axis (y = origin.y)
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.origin.y);
    this.ctx.lineTo(w, this.origin.y);
    this.ctx.stroke();

    // Y-axis (x = origin.x)
    this.ctx.beginPath();
    this.ctx.moveTo(this.origin.x, 0);
    this.ctx.lineTo(this.origin.x, h);
    this.ctx.stroke();

    // Axis coordinate numbers
    this.ctx.font = 'bold 11px Pretendard, sans-serif';
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // X-axis numbers
    for (let i = 1; i <= 25; i++) {
      const ptX = this.toScreen({ x: i, y: 0 });
      if (ptX.x < w - 10) {
        this.ctx.fillText(i, ptX.x, ptX.y + 15);
      }
    }

    // Y-axis numbers
    this.ctx.textAlign = 'right';
    for (let i = 1; i <= 15; i++) {
      const ptY = this.toScreen({ x: 0, y: i });
      if (ptY.y > 10) {
        this.ctx.fillText(i, ptY.x - 8, ptY.y);
      }
    }

    // Origin "0" label
    this.ctx.fillText('0', this.origin.x - 8, this.origin.y + 15);
    this.ctx.restore();
  }

  drawPillBadge(text, cx, cy, color, bgColor = 'rgba(255, 255, 255, 0.95)', textColor = null) {
    this.ctx.save();
    this.ctx.font = 'bold 11px Pretendard, -apple-system, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const textMetrics = this.ctx.measureText(text);
    const badgeW = Math.max(30, textMetrics.width + 14);
    const badgeH = 18;
    const badgeX = cx - badgeW / 2;
    const badgeY = cy - badgeH / 2;

    this.ctx.fillStyle = bgColor;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1.2;

    if (this.ctx.roundRect) {
      this.ctx.beginPath();
      this.ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
      this.ctx.fill();
      this.ctx.stroke();
    } else {
      this.ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
      this.ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);
    }

    this.ctx.fillStyle = textColor || color;
    this.ctx.fillText(text, cx, cy);
    this.ctx.restore();
  }

  renderPolygon(poly, color, fillColor, labelPrefix = '', angles = null) {
    if (!poly || poly.length < 2) return;

    this.ctx.beginPath();
    const first = this.toScreen(poly[0]);
    this.ctx.moveTo(first.x, first.y);

    for (let i = 1; i < poly.length; i++) {
      const pt = this.toScreen(poly[i]);
      this.ctx.lineTo(pt.x, pt.y);
    }

    if (poly.length >= 3) {
      this.ctx.closePath();
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
    }

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    // Side length measurement tool
    if (this.showLengths && poly.length >= 3) {
      this.drawSideLengths(poly, color);
      if (this.currentShape === 'rhombus' && poly.length === 4) {
        this.drawRhombusDiagonals(poly, color);
      }
    }

    // Angle protractor measurement tool
    if (this.showAngles && poly.length >= 3) {
      this.drawAngles(poly, color, angles);
    }

    // Vertices & Labels
    poly.forEach((pt, idx) => {
      const screenPt = this.toScreen(pt);
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(screenPt.x, screenPt.y, 5, 0, Math.PI * 2);
      this.ctx.fill();

      if (this.showLabels) {
        this.ctx.save();
        this.ctx.font = 'bold 13px Pretendard, -apple-system, sans-serif';
        this.ctx.fillStyle = '#0f172a';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        const label = labelPrefix ? `${labelPrefix}${idx + 1}` : pt.label;
        
        // Place vertex letter label cleanly outside polygon corner
        let offX = 10;
        let offY = -10;
        if (poly.length === 3) {
          if (idx === 0) { offX = -12; offY = 12; }
          else if (idx === 1) { offX = 12; offY = 12; }
          else if (idx === 2) { offX = 0; offY = -14; }
        } else if (poly.length === 4) {
          if (this.currentShape === 'rhombus') {
            if (idx === 0) { offX = 0; offY = 14; }
            else if (idx === 1) { offX = 14; offY = 0; }
            else if (idx === 2) { offX = 0; offY = -14; }
            else if (idx === 3) { offX = -14; offY = 0; }
          } else {
            if (idx === 0) { offX = -12; offY = 12; }
            else if (idx === 1) { offX = 12; offY = 12; }
            else if (idx === 2) { offX = 12; offY = -12; }
            else if (idx === 3) { offX = -12; offY = -12; }
          }
        }
        this.ctx.fillText(label, screenPt.x + offX, screenPt.y + offY);
        this.ctx.restore();
      }
    });
  }

  drawSideLengths(poly, color) {
    this.ctx.save();
    this.ctx.font = 'bold 11px Pretendard, -apple-system, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    for (let i = 0; i < poly.length; i++) {
      const p1 = poly[i];
      const p2 = poly[(i + 1) % poly.length];
      const dist = this.getDist(p1, p2).toFixed(1);

      const s1 = this.toScreen(p1);
      const s2 = this.toScreen(p2);
      const sMid = { x: (s1.x + s2.x) / 2, y: (s1.y + s2.y) / 2 };

      // Draw clean white pill badge
      this.drawPillBadge(dist, sMid.x, sMid.y, color);
    }
    this.ctx.restore();
  }

  drawRhombusDiagonals(poly, color) {
    if (!poly || poly.length !== 4) return;
    this.ctx.save();

    // poly vertices:
    // 0: A/E (bottom)
    // 1: B/F (right)
    // 2: C/G (top)
    // 3: D/H (left)
    const sBottom = this.toScreen(poly[0]);
    const sRight = this.toScreen(poly[1]);
    const sTop = this.toScreen(poly[2]);
    const sLeft = this.toScreen(poly[3]);

    const sCenter = {
      x: (sLeft.x + sRight.x) / 2,
      y: (sTop.y + sBottom.y) / 2
    };

    const horizDist = this.getDist(poly[3], poly[1]);
    const vertDist = this.getDist(poly[0], poly[2]);

    // Draw dashed lines for both diagonals
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1.6;
    this.ctx.setLineDash([4, 3]);

    // Horizontal diagonal (left to right)
    this.ctx.beginPath();
    this.ctx.moveTo(sLeft.x, sLeft.y);
    this.ctx.lineTo(sRight.x, sRight.y);
    this.ctx.stroke();

    // Vertical diagonal (bottom to top)
    this.ctx.beginPath();
    this.ctx.moveTo(sBottom.x, sBottom.y);
    this.ctx.lineTo(sTop.x, sTop.y);
    this.ctx.stroke();

    this.ctx.setLineDash([]);

    // Right-angle symbol at intersection of diagonals
    const s = 9;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1.2;
    this.ctx.beginPath();
    this.ctx.moveTo(sCenter.x + s, sCenter.y);
    this.ctx.lineTo(sCenter.x + s, sCenter.y - s);
    this.ctx.lineTo(sCenter.x, sCenter.y - s);
    this.ctx.stroke();

    // Badges for diagonal lengths
    // Horizontal diagonal badge (placed slightly above center)
    const hBadgeY = sCenter.y - 13;
    this.drawPillBadge(`가로 대각선: ${horizDist.toFixed(1)}`, sCenter.x, hBadgeY, color, 'rgba(255, 255, 255, 0.95)', color);

    // Vertical diagonal badge (placed slightly below center)
    const vBadgeY = sCenter.y + 13;
    this.drawPillBadge(`세로 대각선: ${vertDist.toFixed(1)}`, sCenter.x, vBadgeY, color, 'rgba(255, 255, 255, 0.95)', color);

    this.ctx.restore();
  }

  drawAngles(poly, color, presetAngles) {
    if (poly.length < 3) return;
    this.ctx.save();
    const N = poly.length;

    poly.forEach((pt, idx) => {
      const sPt = this.toScreen(pt);
      const prev = poly[(idx - 1 + N) % N];
      const next = poly[(idx + 1) % N];
      const sPrev = this.toScreen(prev);
      const sNext = this.toScreen(next);

      // Vectors along adjacent edges in screen coordinates
      const d1 = { x: sPrev.x - sPt.x, y: sPrev.y - sPt.y };
      const d2 = { x: sNext.x - sPt.x, y: sNext.y - sPt.y };
      const mag1 = Math.hypot(d1.x, d1.y);
      const mag2 = Math.hypot(d2.x, d2.y);
      if (mag1 < 1e-3 || mag2 < 1e-3) return;

      const v1 = { x: d1.x / mag1, y: d1.y / mag1 };
      const v2 = { x: d2.x / mag2, y: d2.y / mag2 };

      // Interior angle
      const dot = Math.max(-1, Math.min(1, v1.x * v2.x + v1.y * v2.y));
      const rad = Math.acos(dot);
      const deg = rad * 180 / Math.PI;

      // Inward bisector vector
      const bx = v1.x + v2.x;
      const by = v1.y + v2.y;
      const bMag = Math.hypot(bx, by);
      const bisector = bMag > 1e-3 ? { x: bx / bMag, y: by / bMag } : { x: 0, y: -1 };

      // Determine angle text
      let angleText = '';
      if (presetAngles && presetAngles[idx] && Math.abs(this.scaleX - this.scaleY) < 0.001) {
        angleText = presetAngles[idx];
      } else {
        angleText = `${Math.round(deg)}°`;
      }

      const isRightAngle = Math.abs(deg - 90) < 1.5;

      if (isRightAngle) {
        // Draw standard right-angle marker
        const s = 14;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1.6;
        this.ctx.beginPath();
        this.ctx.moveTo(sPt.x + v1.x * s, sPt.y + v1.y * s);
        this.ctx.lineTo(sPt.x + v1.x * s + v2.x * s, sPt.y + v1.y * s + v2.y * s);
        this.ctx.lineTo(sPt.x + v2.x * s, sPt.y + v2.y * s);
        this.ctx.stroke();

        const labelDist = 26;
        const lx = sPt.x + bisector.x * labelDist;
        const ly = sPt.y + bisector.y * labelDist;
        this.drawPillBadge(angleText, lx, ly, color, 'rgba(255, 255, 255, 0.9)', '#334155');
      } else {
        // Draw interior angle arc
        const arcR = 18;
        const ang1 = Math.atan2(v1.y, v1.x);
        const ang2 = Math.atan2(v2.y, v2.x);
        const cross = v1.x * v2.y - v1.y * v2.x;
        const counterClockwise = cross < 0;

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1.4;
        this.ctx.beginPath();
        this.ctx.arc(sPt.x, sPt.y, arcR, ang1, ang2, counterClockwise);
        this.ctx.stroke();

        const labelDist = (this.currentShape === 'rhombus') ? 22 : 30;
        const lx = sPt.x + bisector.x * labelDist;
        const ly = sPt.y + bisector.y * labelDist;
        this.drawPillBadge(angleText, lx, ly, color, 'rgba(255, 255, 255, 0.9)', '#334155');
      }
    });
    this.ctx.restore();
  }

  renderCircle(center, radiusX, radiusY, color, fillColor, label, isTransformed = false) {
    const sCenter = this.toScreen(center);
    const sRx = radiusX * this.gridSize;
    const sRy = radiusY * this.gridSize;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.ellipse(sCenter.x, sCenter.y, Math.max(1, sRx), Math.max(1, sRy), 0, 0, Math.PI * 2);
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    // Center point
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(sCenter.x, sCenter.y, 5, 0, Math.PI * 2);
    this.ctx.fill();

    // Center label
    if (this.showLabels) {
      this.ctx.font = 'bold 13px Pretendard, sans-serif';
      this.ctx.fillStyle = '#0f172a';
      this.ctx.textAlign = 'right';
      this.ctx.fillText(label, sCenter.x - 8, sCenter.y - 8);
    }

    // Radius measurement tool
    if (this.showLengths) {
      const isEllipse = Math.abs(radiusX - radiusY) > 0.01;
      // Horizontal radius line
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 1.6;
      this.ctx.setLineDash([3, 3]);
      this.ctx.beginPath();
      this.ctx.moveTo(sCenter.x, sCenter.y);
      this.ctx.lineTo(sCenter.x + sRx, sCenter.y);
      this.ctx.stroke();

      const badgeX = sCenter.x + sRx / 2;
      const badgeY = sCenter.y - 12;
      const rText = isEllipse ? `가로 r_x=${radiusX.toFixed(1)}` : `반지름 r=${radiusX.toFixed(1)}`;
      this.drawPillBadge(rText, badgeX, badgeY, color);

      if (isEllipse) {
        // Vertical radius line for ellipse
        this.ctx.beginPath();
        this.ctx.moveTo(sCenter.x, sCenter.y);
        this.ctx.lineTo(sCenter.x, sCenter.y - sRy);
        this.ctx.stroke();
        this.drawPillBadge(`세로 r_y=${radiusY.toFixed(1)}`, sCenter.x, sCenter.y - sRy / 2, color);
      }
      this.ctx.setLineDash([]);
    }

    this.ctx.restore();
  }

  renderCircleOverlayMotion(curCenter, curRadius, isSimilar, targetScale, currentScale) {
    const shape = PLANE_SHAPES.circle;
    const t = this.overlayProgress;
    const sCenter = this.toScreen(curCenter);
    const sR = curRadius * this.gridSize;

    this.ctx.save();

    // 1. Motion Trail Line from start O to current center
    if (t > 0.05 && t < 0.98) {
      const sStart = this.toScreen(shape.baseCenter);
      this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      this.ctx.moveTo(sStart.x, sStart.y);
      this.ctx.lineTo(sCenter.x, sCenter.y);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // 2. Draw expanding circle
    this.ctx.beginPath();
    this.ctx.arc(sCenter.x, sCenter.y, Math.max(1, sR), 0, Math.PI * 2);

    if (t >= 0.99) {
      if (isSimilar) {
        this.ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
        this.ctx.fill();
        this.ctx.strokeStyle = '#059669';
        this.ctx.lineWidth = 3.5;
        this.ctx.stroke();

        this.ctx.strokeStyle = '#34d399';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();

        const txt = `✨ 완전히 포개어짐 (원 O ${targetScale.toFixed(1)}배 확대 ≡ 원 O')`;
        this.drawPillBadge(txt, sCenter.x, sCenter.y, '#059669', '#ecfdf5', '#065f46');
      } else {
        this.ctx.fillStyle = 'rgba(2, 132, 199, 0.18)';
        this.ctx.fill();
        this.ctx.strokeStyle = '#0284c7';
        this.ctx.lineWidth = 2.5;
        this.ctx.setLineDash([6, 4]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        const txt = `✗ 완전히 포개어지지 않음 (합동 불성립: 타원으로 왜곡)`;
        this.drawPillBadge(txt, sCenter.x, sCenter.y, '#ef4444', '#fef2f2', '#991b1b');
      }
    } else {
      // In flight
      this.ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      this.ctx.fill();
      this.ctx.strokeStyle = '#059669';
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();

      const txt = `원 O 확대 중: ${currentScale.toFixed(1)}배 🚀`;
      this.drawPillBadge(txt, sCenter.x, sCenter.y, '#059669', 'rgba(255, 255, 255, 0.95)', '#065f46');
    }

    this.ctx.restore();
  }

  animateOverlay(target) {
    if (this.overlayAnimId) cancelAnimationFrame(this.overlayAnimId);
    const startVal = this.overlayProgress;
    const startTime = performance.now();
    const duration = 850; // ms: smooth observation of expansion and glide

    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1.0, elapsed / duration);
      // easeInOutCubic curve
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      this.overlayProgress = startVal + (target - startVal) * ease;
      this.isOverlay = this.overlayProgress > 0.001;
      this.render();

      if (t < 1.0) {
        this.overlayAnimId = requestAnimationFrame(step);
      } else {
        this.overlayProgress = target;
        this.isOverlay = target > 0.5;
        this.overlayAnimId = null;
        this.render();
      }
    };
    this.overlayAnimId = requestAnimationFrame(step);
  }

  getTransformedPoly() {
    const shape = PLANE_SHAPES[this.currentShape];
    if (!shape || shape.type === 'circle') return [];

    const refPt = shape.refPoint || shape.basePoly[0];
    const offset = shape.offset;

    return shape.basePoly.map((pt, idx) => {
      const dx = (pt.x - refPt.x) * this.scaleX;
      const dy = (pt.y - refPt.y) * this.scaleY;
      const label = shape.transLabels[idx] || `P${idx+1}`;
      return {
        x: refPt.x + offset.x + dx,
        y: refPt.y + offset.y + dy,
        label: label
      };
    });
  }

  getExpandingPoly() {
    if (this.overlayProgress < 0.001) return null;
    const shape = PLANE_SHAPES[this.currentShape];
    if (!shape || shape.type === 'circle') return null;

    const t = this.overlayProgress;
    const isSimilar = Math.abs(this.scaleX - this.scaleY) < 0.001;
    const targetScale = isSimilar ? this.scaleX : ((Math.abs(this.scaleX - 1.0) > 0.01) ? this.scaleX : this.scaleY);
    const currentScale = 1.0 + (targetScale - 1.0) * t;

    const refPt = shape.refPoint || shape.basePoly[0];
    const targetRef = { x: refPt.x + shape.offset.x, y: refPt.y + shape.offset.y };

    const curRef = {
      x: refPt.x + (targetRef.x - refPt.x) * t,
      y: refPt.y + (targetRef.y - refPt.y) * t
    };

    return shape.basePoly.map((pt, idx) => {
      const dx = (pt.x - refPt.x) * currentScale;
      const dy = (pt.y - refPt.y) * currentScale;
      return {
        x: curRef.x + dx,
        y: curRef.y + dy,
        label: `${pt.label}'`
      };
    });
  }

  renderOverlayMotion(expandingPoly, isSimilar, targetScale, currentScale) {
    if (!expandingPoly || expandingPoly.length === 0) return;
    const shape = PLANE_SHAPES[this.currentShape];
    const t = this.overlayProgress;
    this.ctx.save();

    // 1. Motion Trail Line from start refPoint to current refPoint
    if (t > 0.05 && t < 0.98) {
      const sStart = this.toScreen(shape.basePoly[0]);
      const sCur = this.toScreen(expandingPoly[0]);
      this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      this.ctx.moveTo(sStart.x, sStart.y);
      this.ctx.lineTo(sCur.x, sCur.y);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // 2. Draw expanding polygon
    this.ctx.beginPath();
    const first = this.toScreen(expandingPoly[0]);
    this.ctx.moveTo(first.x, first.y);
    for (let i = 1; i < expandingPoly.length; i++) {
      const pt = this.toScreen(expandingPoly[i]);
      this.ctx.lineTo(pt.x, pt.y);
    }
    this.ctx.closePath();

    // Centroid for badge
    let sumX = 0, sumY = 0;
    expandingPoly.forEach(p => { sumX += p.x; sumY += p.y; });
    const midP = { x: sumX / expandingPoly.length, y: sumY / expandingPoly.length };
    const sMid = this.toScreen(midP);

    const prefix = expandingPoly.length === 4 ? '□' : '△';
    const baseSym = prefix + shape.basePoly.map(p => p.label).join('');
    const transSym = prefix + shape.transLabels.join('');

    if (t >= 0.99) {
      if (isSimilar) {
        this.ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
        this.ctx.fill();

        this.ctx.strokeStyle = '#059669';
        this.ctx.lineWidth = 3.5;
        this.ctx.stroke();

        this.ctx.strokeStyle = '#34d399';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();

        const txt = `✨ 완전히 포개어짐 (합동: ${baseSym} ${targetScale.toFixed(1)}배 확대 ≡ ${transSym})`;
        this.drawPillBadge(txt, sMid.x, sMid.y, '#059669', '#ecfdf5', '#065f46');

        // Matching vertex badges
        expandingPoly.forEach((pt, idx) => {
          const s = this.toScreen(pt);
          this.ctx.fillStyle = '#059669';
          this.ctx.beginPath();
          this.ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
          this.ctx.fill();

          this.ctx.font = 'bold 12px Pretendard, sans-serif';
          this.ctx.fillStyle = '#065f46';
          const matchLabel = `${pt.label} ≡ ${shape.transLabels[idx]}`;
          this.ctx.fillText(matchLabel, s.x + (idx % 2 === 0 ? -22 : 22), s.y + (idx < 2 ? 16 : -16));
        });
      } else {
        this.ctx.fillStyle = 'rgba(2, 132, 199, 0.18)';
        this.ctx.fill();

        this.ctx.strokeStyle = '#0284c7';
        this.ctx.lineWidth = 2.5;
        this.ctx.setLineDash([6, 4]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        const txt = `✗ 완전히 포개어지지 않음 (합동 불성립: 왜곡)`;
        this.drawPillBadge(txt, sMid.x, sMid.y, '#ef4444', '#fef2f2', '#991b1b');

        expandingPoly.forEach((pt) => {
          const s = this.toScreen(pt);
          this.ctx.fillStyle = '#0284c7';
          this.ctx.beginPath();
          this.ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
          this.ctx.fill();
        });
      }
    } else {
      // In flight
      this.ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      this.ctx.fill();
      this.ctx.strokeStyle = '#059669';
      this.ctx.lineWidth = 2.5;
      this.ctx.stroke();

      const txt = `${baseSym} 확대 중: ${currentScale.toFixed(1)}배 🚀`;
      this.drawPillBadge(txt, sMid.x, sMid.y, '#059669', 'rgba(255, 255, 255, 0.95)', '#065f46');

      expandingPoly.forEach((pt) => {
        const s = this.toScreen(pt);
        this.ctx.fillStyle = '#059669';
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, 4.5, 0, Math.PI * 2);
        this.ctx.fill();
      });
    }

    this.ctx.restore();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    this.drawGrid();

    const shape = PLANE_SHAPES[this.currentShape] || PLANE_SHAPES.right_triangle;
    const isSimilar = Math.abs(this.scaleX - this.scaleY) < 0.001;
    const targetScale = isSimilar ? this.scaleX : ((Math.abs(this.scaleX - 1.0) > 0.01) ? this.scaleX : this.scaleY);
    const currentScale = 1.0 + (targetScale - 1.0) * this.overlayProgress;

    const prefix = shape.type === 'circle' ? '' : (shape.basePoly.length === 4 ? '□' : '△');
    const baseName = shape.type === 'circle' ? '원 O' : (prefix + shape.basePoly.map(p => p.label).join(''));
    const transName = shape.type === 'circle' ? "원 O'" : (prefix + shape.transLabels.join(''));

    // Top Status Banner during Overlay
    if (this.overlayProgress > 0.01) {
      this.ctx.save();
      if (this.overlayProgress >= 0.99) {
        if (isSimilar) {
          this.ctx.fillStyle = '#ecfdf5';
          this.ctx.strokeStyle = '#10b981';
          this.ctx.lineWidth = 1.2;
          this.ctx.beginPath();
          this.ctx.roundRect ? this.ctx.roundRect(15, 12, 530, 30, 6) : this.ctx.rect(15, 12, 530, 30);
          this.ctx.fill();
          this.ctx.stroke();

          this.ctx.font = 'bold 12px Pretendard, sans-serif';
          this.ctx.fillStyle = '#065f46';
          this.ctx.textAlign = 'left';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(`🎉 [합동 확인 완료] ${baseName}를 ${targetScale.toFixed(1)}배 확대했더니 ${transName}와 완전히 포개어집니다! (합동 성립 ➜ 닮음)`, 25, 27);
        } else {
          this.ctx.fillStyle = '#fef2f2';
          this.ctx.strokeStyle = '#ef4444';
          this.ctx.lineWidth = 1.2;
          this.ctx.beginPath();
          this.ctx.roundRect ? this.ctx.roundRect(15, 12, 550, 30, 6) : this.ctx.rect(15, 12, 550, 30);
          this.ctx.fill();
          this.ctx.stroke();

          this.ctx.font = 'bold 12px Pretendard, sans-serif';
          this.ctx.fillStyle = '#991b1b';
          this.ctx.textAlign = 'left';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(`⚠️ [합동 불성립] ${baseName}를 ${targetScale.toFixed(1)}배 확대해도 ${transName}와 완전히 포개어지지 않습니다! (비율 왜곡 ➜ 닮음 아님)`, 25, 27);
        }
      } else {
        this.ctx.fillStyle = '#eff6ff';
        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();
        this.ctx.roundRect ? this.ctx.roundRect(15, 12, 480, 30, 6) : this.ctx.rect(15, 12, 480, 30);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.font = 'bold 12px Pretendard, sans-serif';
        this.ctx.fillStyle = '#1d4ed8';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`🚀 ${baseName}가 ${targetScale.toFixed(1)}배로 점차 확대되면서 ${transName}로 이동 중...`, 25, 27);
      }
      this.ctx.restore();
    }

    if (shape.type === 'circle') {
      // ---------------- Circle Rendering ----------------
      const baseCenter = shape.baseCenter;
      const baseR = shape.baseRadius;
      const transCenter = { x: baseCenter.x + shape.offset.x, y: baseCenter.y + shape.offset.y };
      const transRx = baseR * this.scaleX;
      const transRy = baseR * this.scaleY;

      // 1. Base Circle
      if (this.overlayProgress > 0.01) {
        this.renderCircle(baseCenter, baseR, baseR, 'rgba(5, 150, 105, 0.45)', 'rgba(16, 185, 129, 0.08)', 'O');
      } else {
        this.renderCircle(baseCenter, baseR, baseR, '#059669', 'rgba(16, 185, 129, 0.2)', 'O');
      }

      if (this.currentTabMode === 'explore') {
        // 2. Transformed Circle / Ellipse
        const transColor = isSimilar ? '#4f46e5' : '#ef4444';
        const transFill = isSimilar ? 'rgba(79, 70, 229, 0.15)' : 'rgba(239, 68, 68, 0.12)';
        this.renderCircle(transCenter, transRx, transRy, transColor, transFill, "O'", true);
        this.updateAnalysisPanel(isSimilar);

        // 3. Circle Overlay Motion
        if (this.overlayProgress > 0.001) {
          const curCenter = {
            x: baseCenter.x + (transCenter.x - baseCenter.x) * this.overlayProgress,
            y: baseCenter.y + (transCenter.y - baseCenter.y) * this.overlayProgress
          };
          const curR = baseR + (baseR * targetScale - baseR) * this.overlayProgress;
          this.renderCircleOverlayMotion(curCenter, curR, isSimilar, targetScale, currentScale);
        }
      }
    } else {
      // ---------------- Polygon Rendering ----------------
      const baseAngles = shape.angles || null;
      if (this.overlayProgress > 0.01) {
        this.ctx.save();
        this.renderPolygon(shape.basePoly, 'rgba(5, 150, 105, 0.45)', 'rgba(16, 185, 129, 0.08)', '', baseAngles);
        const sA = this.toScreen(shape.basePoly[0]);
        this.ctx.font = 'bold 10px Pretendard, sans-serif';
        this.ctx.fillStyle = '#059669';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`기준 ${baseName} (1.0배)`, sA.x + 35, sA.y + 22);
        this.ctx.restore();
      } else {
        this.renderPolygon(shape.basePoly, '#059669', 'rgba(16, 185, 129, 0.2)', '', baseAngles);
      }

      if (this.currentTabMode === 'explore') {
        // 2. Transformed Polygon
        const transformedPoly = this.getTransformedPoly();
        const transColor = isSimilar ? '#4f46e5' : '#ef4444';
        const transFill = isSimilar ? 'rgba(79, 70, 229, 0.15)' : 'rgba(239, 68, 68, 0.12)';
        const transAngles = isSimilar ? baseAngles : null;
        this.renderPolygon(transformedPoly, transColor, transFill, '', transAngles);
        this.updateAnalysisPanel(isSimilar);

        // 3. Overlay Motion
        if (this.overlayProgress > 0.001) {
          const expandingPoly = this.getExpandingPoly();
          this.renderOverlayMotion(expandingPoly, isSimilar, targetScale, currentScale);
        }
      } else {
        // Draw Mode
        if (this.drawnPoints.length > 0) {
          this.renderPolygon(this.drawnPoints, '#4f46e5', 'rgba(79, 70, 229, 0.2)', '');
        }

        if (this.hoverGridPt && this.drawnPoints.length < (shape.basePoly ? shape.basePoly.length : 3)) {
          const sPt = this.toScreen(this.hoverGridPt);
          this.ctx.beginPath();
          this.ctx.arc(sPt.x, sPt.y, 7, 0, Math.PI * 2);
          this.ctx.fillStyle = 'rgba(79, 70, 229, 0.5)';
          this.ctx.fill();
          this.ctx.strokeStyle = '#4f46e5';
          this.ctx.stroke();

          this.ctx.font = '11px sans-serif';
          this.ctx.fillStyle = '#4f46e5';
          this.ctx.fillText(`(${this.hoverGridPt.x}, ${this.hoverGridPt.y})`, sPt.x + 10, sPt.y - 10);
        }
      }
    }
  }

  updateAnalysisPanel(isSimilar) {
    const shape = PLANE_SHAPES[this.currentShape] || PLANE_SHAPES.right_triangle;
    const badge = document.getElementById('planeSimilarityBadge');
    const detailBox = document.getElementById('planeAnalysisDetail');
    const scaleRatioText = document.getElementById('planeScaleRatioText');
    const badgeAlways = document.getElementById('badgeAlwaysSimilarTag');
    const explainAlways = document.getElementById('alwaysSimilarExplanation');

    if (scaleRatioText) {
      if (this.currentShape === 'equilateral') {
        const sideLen = (4.0 * this.scaleX).toFixed(1);
        scaleRatioText.textContent = `한 변의 길이: ${sideLen} (${this.scaleX.toFixed(1)}배)`;
      } else if (this.currentShape === 'square') {
        const sideLen = (3.0 * this.scaleX).toFixed(1);
        scaleRatioText.textContent = `한 변의 길이: ${sideLen} (${this.scaleX.toFixed(1)}배)`;
      } else if (this.currentShape === 'circle') {
        const rLen = (1.5 * this.scaleX).toFixed(1);
        scaleRatioText.textContent = `반지름 r: ${rLen} (${this.scaleX.toFixed(1)}배)`;
      } else if (this.currentShape === 'rhombus') {
        const hDiag = (4.0 * this.scaleX).toFixed(1);
        const vDiag = (3.0 * this.scaleY).toFixed(1);
        scaleRatioText.textContent = `가로 대각선: ${hDiag} (${this.scaleX.toFixed(1)}배), 세로 대각선: ${vDiag} (${this.scaleY.toFixed(1)}배)`;
      } else {
        scaleRatioText.textContent = `가로: ${this.scaleX.toFixed(1)}배, 세로: ${this.scaleY.toFixed(1)}배`;
      }
    }

    const prefix = shape.type === 'circle' ? '' : (shape.basePoly.length === 4 ? '□' : '△');
    const baseName = shape.type === 'circle' ? '원 O' : (prefix + shape.basePoly.map(p => p.label).join(''));
    const transName = shape.type === 'circle' ? "원 O'" : (prefix + shape.transLabels.join(''));

    if (badge) {
      if (isSimilar) {
        badge.className = 'badge-similarity yes';
        badge.innerHTML = `✓ 닮음 관계 성립 (${baseName} ∽ ${transName})`;
      } else {
        badge.className = 'badge-similarity no';
        if (this.currentShape === 'rhombus') {
          badge.innerHTML = `✗ 닮음 아님 (두 대각선 비율 왜곡으로 각도 변화)`;
        } else {
          badge.innerHTML = `✗ 닮음 아님 (가로·세로 비율 왜곡)`;
        }
      }
    }

    if (detailBox) {
      if (shape.type === 'circle') {
        detailBox.innerHTML = `
          <div class="data-row"><span>대응 반지름의 비:</span> <b>1 : ${this.scaleX.toFixed(1)} (일정)</b></div>
          <div class="data-row"><span>반지름 길이:</span> <b>기준 r=1.5 ➜ 확대 r'=${(1.5 * this.scaleX).toFixed(1)}</b></div>
          <div class="data-row"><span>도형 형태:</span> <b>항상 완전한 원형 유지 (중심각 360°)</b></div>
          <div class="data-row"><span>닮음비:</span> <b>1 : ${this.scaleX.toFixed(1)}</b></div>
        `;
      } else if (this.currentShape === 'equilateral') {
        detailBox.innerHTML = `
          <div class="data-row"><span>대응변의 비:</span> <b>1 : ${this.scaleX.toFixed(1)} (세 변 모두 일정)</b></div>
          <div class="data-row"><span>한 변의 길이:</span> <b>기준 4.0 ➜ 확대 ${(4.0 * this.scaleX).toFixed(1)}</b></div>
          <div class="data-row"><span>대응각의 크기:</span> <b>60°, 60°, 60° (항상 일정)</b></div>
          <div class="data-row"><span>닮음비:</span> <b>1 : ${this.scaleX.toFixed(1)}</b></div>
        `;
      } else if (this.currentShape === 'square') {
        detailBox.innerHTML = `
          <div class="data-row"><span>대응변의 비:</span> <b>1 : ${this.scaleX.toFixed(1)} (네 변 모두 일정)</b></div>
          <div class="data-row"><span>한 변의 길이:</span> <b>기준 3.0 ➜ 확대 ${(3.0 * this.scaleX).toFixed(1)}</b></div>
          <div class="data-row"><span>대응각의 크기:</span> <b>90°, 90°, 90°, 90° (항상 일정)</b></div>
          <div class="data-row"><span>닮음비:</span> <b>1 : ${this.scaleX.toFixed(1)}</b></div>
        `;
      } else if (this.currentShape === 'rhombus') {
        if (isSimilar) {
          detailBox.innerHTML = `
            <div class="data-row"><span>대각선 길이의 비:</span> <b>1 : ${this.scaleX.toFixed(1)} (두 대각선 비율 일치)</b></div>
            <div class="data-row"><span>대각선 길이:</span> <b>가로 ${(4.0 * this.scaleX).toFixed(1)}, 세로 ${(3.0 * this.scaleY).toFixed(1)}</b></div>
            <div class="data-row"><span>대응각의 크기:</span> <b>106°, 74°, 106°, 74° (보존됨)</b></div>
            <div class="data-row"><span>닮음비:</span> <b>1 : ${this.scaleX.toFixed(1)}</b></div>
          `;
        } else {
          detailBox.innerHTML = `
            <div class="data-row"><span>가로 대각선:</span> <b>기준 4.0 ➜ ${(4.0 * this.scaleX).toFixed(1)} (${this.scaleX.toFixed(1)}배)</b></div>
            <div class="data-row"><span>세로 대각선:</span> <b>기준 3.0 ➜ ${(3.0 * this.scaleY).toFixed(1)} (${this.scaleY.toFixed(1)}배)</b></div>
            <div class="data-row" style="color: #dc2626;"><span>대각선 비 불일치:</span> <b>두 대각선 비율이 달라져 내각이 왜곡됨!</b></div>
            <div class="data-row" style="color: #dc2626;"><span>각도 변화:</span> <b>네 변은 같지만 대응각이 달라져 닮음 아님</b></div>
          `;
        }
      } else {
        // right_triangle, isosceles
        if (isSimilar) {
          const anglesStr = shape.angles ? shape.angles.join(', ') : '불변';
          detailBox.innerHTML = `
            <div class="data-row"><span>대응변의 비:</span> <b>1 : ${this.scaleX.toFixed(1)} (모두 일정)</b></div>
            <div class="data-row"><span>대응각의 크기:</span> <b>${anglesStr} (각각 같음)</b></div>
            <div class="data-row"><span>닮음비:</span> <b>1 : ${this.scaleX.toFixed(1)}</b></div>
          `;
        } else {
          detailBox.innerHTML = `
            <div class="data-row"><span>가로 배율:</span> <b>${this.scaleX.toFixed(1)}배</b></div>
            <div class="data-row"><span>세로 배율:</span> <b>${this.scaleY.toFixed(1)}배</b></div>
            <div class="data-row" style="color: #dc2626;"><span>각도 변화:</span> <b>대응각의 크기가 달라짐! (왜곡)</b></div>
          `;
        }
      }
    }

    // Update 생각 넓히기 교과서 판정 및 핵심 이유
    if (badgeAlways) {
      if (shape.isAlwaysSimilar) {
        badgeAlways.textContent = '★ 항상 서로 닮은 도형: O (항상 닮음)';
        badgeAlways.style.background = '#ecfdf5';
        badgeAlways.style.color = '#047857';
        badgeAlways.style.borderColor = '#a7f3d0';
      } else {
        badgeAlways.textContent = '⚠️ 항상 서로 닮은 도형: X (항상 닮음은 아님)';
        badgeAlways.style.background = '#fef2f2';
        badgeAlways.style.color = '#dc2626';
        badgeAlways.style.borderColor = '#fecaca';
      }
    }

    if (explainAlways) {
      explainAlways.innerHTML = `
        <b>[교과서 핵심 이유]</b> ${shape.reason}<br>
        <span style="color:#4f46e5; font-size:0.75rem; display:inline-block; margin-top:0.3rem;">🔍 <b>탐구 팁:</b> ${shape.hint}</span>
      `;
    }
  }

  /* ---------------- Similarity Symbol Direct Typing Activity ---------------- */
  setupSimilarityTypingActivity() {
    const input = document.getElementById('inputSimSymbol');
    const btnInsert = document.getElementById('btnInsertSim');
    const btnCheck = document.getElementById('btnCheckSim');
    const btnClear = document.getElementById('btnClearSimInput');
    const feedback = document.getElementById('simSymbolFeedback');
    const helperChips = document.querySelectorAll('.chip-sim-helper');

    if (!input || !btnCheck) return;

    if (btnInsert) {
      btnInsert.addEventListener('click', () => {
        input.value += '∽';
        input.focus();
      });
    }

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        input.value = '';
        if (feedback) feedback.style.display = 'none';
        input.focus();
      });
    }

    helperChips.forEach(chip => {
      chip.addEventListener('click', () => {
        input.value += chip.dataset.val;
        input.focus();
      });
    });

    const checkInput = () => {
      const raw = input.value.trim();
      const shape = PLANE_SHAPES[this.currentShape] || PLANE_SHAPES.right_triangle;

      if (!raw) {
        this.showSimFeedback('error', '⚠️ 닮음 기호(∽)를 사용하여 두 도형의 기호 표현을 입력해주세요.');
        return;
      }

      if (raw.includes('=') || raw.includes('≡')) {
        this.showSimFeedback('info', '💡 기호 <b>=</b> 나 <b>≡</b> 은 크기까지 모두 같은 \'합동\'에 가깝습니다. 닮음에는 <b>닮음 기호(∽)</b>를 사용해야 합니다.');
        return;
      }

      const standardized = raw.replace(/[~∼∿sS]/g, '∽');

      if (!standardized.includes('∽')) {
        this.showSimFeedback('error', '⚠️ 닮음 기호 <b>∽</b> 가 빠졌습니다! [∽] 버튼을 눌러 기호를 넣어보세요.');
        return;
      }

      const parts = standardized.split('∽').map(s => s.trim());
      if (parts.length !== 2) {
        this.showSimFeedback('error', '⚠️ 닮음 기호 <b>∽</b> 는 두 도형 사이에 하나만 넣어주세요.');
        return;
      }

      // Handle circle
      if (shape.type === 'circle') {
        if (standardized.includes('O') && standardized.includes("O'")) {
          this.showSimFeedback('success', `
            🎉 <b>정답입니다! 참 잘했어요!</b><br>
            원 O와 원 O'의 닮음 관계를 올바르게 나타냈습니다.<br>
            <span style="display:inline-block; margin-top:0.25rem; font-weight:800; color:#059669; font-size:0.95rem;">
              ✓ 원 O ∽ 원 O'
            </span><br>
            모든 원은 모양이 일정하고 반지름의 비에 의해서만 크기가 결정되므로 <b>항상 서로 닮은 도형</b>입니다!
          `);
        } else {
          this.showSimFeedback('info', "💡 원의 기호는 <b>원 O ∽ 원 O'</b> 또는 <b>⊙O ∽ ⊙O'</b> 와 같이 적어보세요!");
        }
        return;
      }

      // Handle polygons (3 or 4 vertices)
      const cleanLetters = (str) => str.replace(/[^A-Za-z]/g, '').toUpperCase();
      const leftLetters = cleanLetters(parts[0]);
      const rightLetters = cleanLetters(parts[1]);
      const targetLen = shape.basePoly.length;

      if (leftLetters.length !== targetLen || rightLetters.length !== targetLen) {
        this.showSimFeedback('error', `⚠️ 도형의 꼭짓점 ${targetLen}개를 각각 정확히 적어주세요. (입력됨: ${leftLetters || '없음'} ∽ ${rightLetters || '없음'})`);
        return;
      }

      // Correspondence mapping
      let corrMap = {};
      if (targetLen === 3) {
        corrMap = { 'A': 'D', 'B': 'E', 'C': 'F' };
      } else if (targetLen === 4) {
        corrMap = { 'A': 'E', 'B': 'F', 'C': 'G', 'D': 'H' };
      }

      const expectedRight = leftLetters.split('').map(ch => corrMap[ch]).join('');
      const prefix = targetLen === 4 ? '□' : '△';

      if (rightLetters === expectedRight) {
        this.showSimFeedback('success', `
          🎉 <b>정답입니다! 참 잘했어요!</b><br>
          대응하는 꼭짓점의 순서를 완벽히 맞추어 표현했습니다.<br>
          <span style="display:inline-block; margin-top:0.25rem; font-weight:800; color:#059669; font-size:0.95rem;">
            ✓ ${prefix}${leftLetters} ∽ ${prefix}${rightLetters}
          </span>
        `);
      } else {
        const corrPairs = leftLetters.split('').map(ch => `<b>${ch} ↔ ${corrMap[ch] || '?'}</b>`).join(', ');
        this.showSimFeedback('error', `
          ❌ <b>대응점의 순서가 맞지 않습니다!</b><br>
          대응점 쌍: ${corrPairs} 입니다.<br>
          👉 올바른 표현: <b>${prefix}${leftLetters} ∽ ${prefix}${expectedRight}</b> 로 고쳐 써보세요!
        `);
      }
    };

    btnCheck.addEventListener('click', checkInput);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkInput();
    });
  }

  showSimFeedback(type, html) {
    const feedback = document.getElementById('simSymbolFeedback');
    if (!feedback) return;
    feedback.className = `feedback-alert ${type}`;
    feedback.innerHTML = html;
    feedback.style.display = 'block';
  }

  /* ---------------- Property Quiz: 평면도형에서 닮음의 성질 빈칸넣기 ---------------- */
  setupPropertyQuiz() {
    const b1 = document.getElementById('quizPlaneBlank1');
    const b2 = document.getElementById('quizPlaneBlank2');
    const b3 = document.getElementById('quizPlaneBlank3');
    const btnCheck = document.getElementById('btnCheckPlaneQuiz');
    const btnClear = document.getElementById('btnClearPlaneQuiz');
    const feedback = document.getElementById('planeQuizFeedback');

    if (!b1 || !b2 || !b3 || !btnCheck) return;

    // Direct Typing & Keyboard Navigation (Enter moves to next blank or submits)
    b1.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (!b1.value.trim()) return;
        b2.focus();
      }
    });

    b2.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        if (!b2.value.trim()) return;
        b3.focus();
      }
    });

    b3.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        checkAnswers();
      }
    });

    const checkAnswers = () => {
      const v1 = b1.value.trim().replace(/\s+/g, '');
      const v2 = b2.value.trim().replace(/\s+/g, '');
      const v3 = b3.value.trim().replace(/\s+/g, '');

      if (!v1 && !v2 && !v3) {
        if (feedback) {
          feedback.className = 'feedback-alert error';
          feedback.innerHTML = '⚠️ 빈칸에 알맞은 단어를 직접 타이핑하여 입력해주세요!';
          feedback.style.display = 'block';
        }
        b1.focus();
        return;
      }

      // Check correctness:
      // Blank 1: '대응변' (or '대응하는변')
      // Blank 2: '비' (or '비율')
      // Blank 3: '대응각' (or '대응하는각')
      const c1 = (v1 === '대응변' || v1 === '대응하는변');
      const c2 = (v2 === '비' || v2 === '비율');
      const c3 = (v3 === '대응각' || v3 === '대응하는각');

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
      styleInput(b3, c3);

      if (!feedback) return;

      if (c1 && c2 && c3) {
        feedback.className = 'feedback-alert success';
        feedback.innerHTML = `
          🎉 <b>정답입니다! 참 잘했어요!</b><br>
          평면도형에서 닮음의 두 가지 핵심 성질을 완벽히 정리했습니다.<br>
          <div style="margin-top: 0.35rem; padding: 0.5rem; background: #ffffff; border-radius: 4px; border-left: 3px solid #10b981; line-height: 1.6;">
            <b>1</b> <b>대응변</b>의 길이의 <b>비</b>는 일정하다.<br>
            <b>2</b> <b>대응각</b>의 크기는 각각 같다.
          </div>
        `;
        feedback.style.display = 'block';
      } else {
        let hints = [];
        if (!c1) hints.push('• <b>1번 첫 번째 빈칸</b>: 마주보는 변의 쌍을 뜻하는 수학 용어입니다. (예: <b>대응변</b>)');
        if (!c2) hints.push('• <b>1번 두 번째 빈칸</b>: 길이의 비율 관계를 뜻하는 한 글자 낱말입니다. (예: <b>비</b>)');
        if (!c3) hints.push('• <b>2번 빈칸</b>: 크기가 변하지 않고 서로 같은 각의 쌍입니다. (예: <b>대응각</b>)');

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
        [b1, b2, b3].forEach(b => {
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
window.PlaneLab = PlaneLab;
