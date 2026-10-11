/**
 * Starmix Similarity Lab - Plane Geometry Module (2D 모눈 캔버스)
 * Youngseo Middle School Grade 2 Class 7 Customization
 */

class PlaneLab {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Grid configuration
    this.gridSize = 36; // pixels per unit
    this.origin = { x: 70, y: 420 };

    // Standard Reference Right Triangle ABC (Base 3, Height 4, Hypotenuse 5)
    // A: (1, 1), B: (4, 1), C: (1, 5) -> Angle A is 90 deg!
    this.basePoly = [
      { x: 1, y: 1, label: 'A' },
      { x: 4, y: 1, label: 'B' },
      { x: 1, y: 5, label: 'C' }
    ];

    // Transformed Poly offset in grid units
    this.transformedOffset = { x: 5, y: 0 };

    // Transformation State
    this.scaleX = 2.0;
    this.scaleY = 2.0;
    this.isOverlay = false;
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
    this.setupMouseEvents();
    this.render();
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const width = parent.clientWidth || 800;
    const height = Math.max(500, parent.clientHeight || 520);

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

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

    if (toggleOverlay) {
      toggleOverlay.addEventListener('change', (e) => {
        this.isOverlay = e.target.checked;
        this.render();
      });
    }

    // Scale Sliders & Distortion Presets
    const scaleSlider = document.getElementById('planeScaleSlider');
    const scaleVal = document.getElementById('planeScaleVal');
    const btnProp = document.getElementById('btnModeProportional');
    const btnWidthOnly = document.getElementById('btnModeWidthOnly');
    const btnHeightOnly = document.getElementById('btnModeHeightOnly');
    const btnResetPlane = document.getElementById('btnResetPlane');

    if (scaleSlider && scaleVal) {
      scaleSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        scaleVal.textContent = `${val.toFixed(1)}배`;
        this.scaleX = val;
        this.scaleY = val;
        this.render();
      });
    }

    if (btnProp) {
      btnProp.addEventListener('click', () => {
        const val = scaleSlider ? parseFloat(scaleSlider.value) : 2.0;
        this.scaleX = val;
        this.scaleY = val;
        this.updateButtonsStyle([btnProp, btnWidthOnly, btnHeightOnly], btnProp);
        this.render();
      });
    }

    if (btnWidthOnly) {
      btnWidthOnly.addEventListener('click', () => {
        const val = scaleSlider ? parseFloat(scaleSlider.value) : 2.0;
        this.scaleX = val;
        this.scaleY = 1.0;
        this.updateButtonsStyle([btnProp, btnWidthOnly, btnHeightOnly], btnWidthOnly);
        this.render();
      });
    }

    if (btnHeightOnly) {
      btnHeightOnly.addEventListener('click', () => {
        const val = scaleSlider ? parseFloat(scaleSlider.value) : 2.0;
        this.scaleX = 1.0;
        this.scaleY = val;
        this.updateButtonsStyle([btnProp, btnWidthOnly, btnHeightOnly], btnHeightOnly);
        this.render();
      });
    }

    if (btnResetPlane) {
      btnResetPlane.addEventListener('click', () => {
        if (scaleSlider) scaleSlider.value = 2.0;
        if (scaleVal) scaleVal.textContent = '2.0배';
        this.scaleX = 2.0;
        this.scaleY = 2.0;
        this.isOverlay = false;
        if (toggleOverlay) toggleOverlay.checked = false;
        if (btnProp) this.updateButtonsStyle([btnProp, btnWidthOnly, btnHeightOnly], btnProp);
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
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Snap to closest grid coordinate
      const gridX = Math.round((mouseX - this.origin.x) / this.gridSize);
      const gridY = Math.round((this.origin.y - mouseY) / this.gridSize);

      if (gridX >= 0 && gridY >= 0 && gridX <= 25 && gridY <= 15) {
        this.hoverGridPt = { x: gridX, y: gridY };
      } else {
        this.hoverGridPt = null;
      }

      if (this.currentTabMode === 'draw') {
        this.render();
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverGridPt = null;
      if (this.currentTabMode === 'draw') this.render();
    });

    this.canvas.addEventListener('click', () => {
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
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;

    this.ctx.strokeStyle = '#f1f5f9';
    this.ctx.lineWidth = 1;

    // Grid lines
    for (let x = 0; x < w; x += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }

    for (let y = 0; y < h; y += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    // Bold Axis Lines
    this.ctx.strokeStyle = '#cbd5e1';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.origin.y);
    this.ctx.lineTo(w, this.origin.y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.origin.x, 0);
    this.ctx.lineTo(this.origin.x, h);
    this.ctx.stroke();

    // Axis coordinate numbers
    this.ctx.font = '11px sans-serif';
    this.ctx.fillStyle = '#94a3b8';
    for (let i = 1; i <= 20; i++) {
      const ptX = this.toScreen({ x: i, y: 0 });
      if (ptX.x < w) this.ctx.fillText(i, ptX.x - 3, ptX.y + 15);

      const ptY = this.toScreen({ x: 0, y: i });
      if (ptY.y > 0) this.ctx.fillText(i, ptY.x - 18, ptY.y + 4);
    }
  }

  renderPolygon(poly, color, fillColor, labelPrefix = '', angles = null) {
    if (poly.length < 2) return;

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
        this.ctx.font = 'bold 14px sans-serif';
        this.ctx.fillStyle = '#0f172a';
        const label = labelPrefix ? `${labelPrefix}${idx + 1}` : pt.label;
        this.ctx.fillText(label, screenPt.x + 8, screenPt.y - 8);
      }
    });
  }

  drawSideLengths(poly, color) {
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.fillStyle = color;

    for (let i = 0; i < poly.length; i++) {
      const p1 = poly[i];
      const p2 = poly[(i + 1) % poly.length];
      const dist = this.getDist(p1, p2).toFixed(1);

      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      const sMid = this.toScreen({ x: midX, y: midY });

      // Badge for distance
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      this.ctx.fillRect(sMid.x - 14, sMid.y - 9, 28, 16);
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(sMid.x - 14, sMid.y - 9, 28, 16);

      this.ctx.fillStyle = color;
      this.ctx.fillText(dist, sMid.x - 10, sMid.y + 4);
    }
  }

  drawAngles(poly, color, presetAngles) {
    // If it's a right triangle at vertex 0:
    poly.forEach((pt, idx) => {
      const sPt = this.toScreen(pt);
      let angleText = '';

      if (presetAngles && presetAngles[idx]) {
        angleText = presetAngles[idx];
      } else {
        // Compute angle from adjacent vertices
        const prev = poly[(idx - 1 + poly.length) % poly.length];
        const next = poly[(idx + 1) % poly.length];
        const v1 = { x: prev.x - pt.x, y: prev.y - pt.y };
        const v2 = { x: next.x - pt.x, y: next.y - pt.y };
        const dot = v1.x * v2.x + v1.y * v2.y;
        const mag1 = Math.hypot(v1.x, v1.y);
        const mag2 = Math.hypot(v2.x, v2.y);
        const deg = (Math.acos(Math.max(-1, Math.min(1, dot / (mag1 * mag2)))) * 180 / Math.PI).toFixed(0);
        angleText = `${deg}°`;
      }

      this.ctx.font = '11px sans-serif';
      this.ctx.fillStyle = '#475569';
      this.ctx.fillText(angleText, sPt.x - 22, sPt.y + 18);
    });
  }

  getTransformedPoly() {
    const originPt = this.basePoly[0]; // A(1, 1)
    const offX = this.isOverlay ? 0 : this.transformedOffset.x;
    const offY = this.isOverlay ? 0 : this.transformedOffset.y;

    return this.basePoly.map((pt, idx) => {
      const dx = (pt.x - originPt.x) * this.scaleX;
      const dy = (pt.y - originPt.y) * this.scaleY;
      const labels = ['D', 'E', 'F'];
      return {
        x: (this.isOverlay ? originPt.x : originPt.x + offX) + dx,
        y: (this.isOverlay ? originPt.y : originPt.y + offY) + dy,
        label: labels[idx]
      };
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    this.drawGrid();

    // 1. Draw Reference Base Polygon ABC (Green)
    const baseAngles = ['90°', '53°', '37°'];
    this.renderPolygon(this.basePoly, '#059669', 'rgba(16, 185, 129, 0.2)', '', baseAngles);

    if (this.currentTabMode === 'explore') {
      // 2. Explore Mode: Draw Transformed Polygon DEF
      const transformedPoly = this.getTransformedPoly();
      const isSimilar = Math.abs(this.scaleX - this.scaleY) < 0.001;
      const transColor = isSimilar ? '#4f46e5' : '#ef4444';
      const transFill = isSimilar ? 'rgba(79, 70, 229, 0.15)' : 'rgba(239, 68, 68, 0.12)';

      const transAngles = isSimilar ? ['90°', '53°', '37°'] : null;
      this.renderPolygon(transformedPoly, transColor, transFill, '', transAngles);
      this.updateAnalysisPanel(isSimilar);
    } else {
      // 3. Draw Mode: Draw Student's Polygon
      if (this.drawnPoints.length > 0) {
        this.renderPolygon(this.drawnPoints, '#4f46e5', 'rgba(79, 70, 229, 0.2)', '');
      }

      // Draw hover snap circle indicator
      if (this.hoverGridPt && this.drawnPoints.length < 3) {
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

  updateAnalysisPanel(isSimilar) {
    const badge = document.getElementById('planeSimilarityBadge');
    const detailBox = document.getElementById('planeAnalysisDetail');
    const scaleRatioText = document.getElementById('planeScaleRatioText');

    if (scaleRatioText) {
      scaleRatioText.textContent = `가로: ${this.scaleX.toFixed(1)}배, 세로: ${this.scaleY.toFixed(1)}배`;
    }

    if (badge) {
      if (isSimilar) {
        badge.className = 'badge-similarity yes';
        badge.innerHTML = `✓ 닮음 관계 성립 (△ABC ∽ △DEF)`;
      } else {
        badge.className = 'badge-similarity no';
        badge.innerHTML = `✗ 닮음 아님 (가로·세로 비율 왜곡)`;
      }
    }

    if (detailBox) {
      if (isSimilar) {
        detailBox.innerHTML = `
          <div class="data-row"><span>대응변의 비:</span> <b>1 : ${this.scaleX.toFixed(1)} (모두 일정)</b></div>
          <div class="data-row"><span>대응각의 크기:</span> <b>90°, 53°, 37° (불변)</b></div>
          <div class="data-row"><span>닮음비:</span> <b>1 : ${this.scaleX.toFixed(1)}</b></div>
        `;
      } else {
        detailBox.innerHTML = `
          <div class="data-row"><span>가로(밑변) 배율:</span> <b>${this.scaleX.toFixed(1)}배</b></div>
          <div class="data-row"><span>세로(높이) 배율:</span> <b>${this.scaleY.toFixed(1)}배</b></div>
          <div class="data-row" style="color: #dc2626;"><span>각도 변화:</span> <b>예각의 크기가 달라짐!</b></div>
        `;
      }
    }
  }
}

// Export for app.js
window.PlaneLab = PlaneLab;
