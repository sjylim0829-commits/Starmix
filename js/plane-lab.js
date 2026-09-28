/**
 * Starmix Similarity Lab - Plane Geometry Module (2D 모눈 캔버스)
 */

class PlaneLab {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Grid config
    this.gridSize = 35; // pixels per unit
    this.origin = { x: 80, y: 380 };

    // Transformation State
    this.scaleX = 2.0;
    this.scaleY = 2.0;
    this.isOverlay = false;
    this.showLabels = true;
    this.showAngles = true;
    this.mode = 'proportional'; // 'proportional', 'width-only', 'height-only', 'custom'

    // Base Triangle ABC coordinates (in grid units)
    this.basePoly = [
      { x: 1, y: 1, label: 'A' },
      { x: 5, y: 1, label: 'B' },
      { x: 3, y: 5, label: 'C' }
    ];

    // Transformed Poly offset
    this.transformedOffset = { x: 7, y: 0 };

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.setupControls();
    this.render();
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const width = parent.clientWidth || 800;
    const height = Math.max(480, parent.clientHeight || 520);

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);
    this.render();
  }

  setupControls() {
    const scaleSlider = document.getElementById('planeScaleSlider');
    const scaleVal = document.getElementById('planeScaleVal');
    const btnProp = document.getElementById('btnModeProportional');
    const btnWidthOnly = document.getElementById('btnModeWidthOnly');
    const btnHeightOnly = document.getElementById('btnModeHeightOnly');
    const overlayToggle = document.getElementById('toggleOverlay');
    const resetBtn = document.getElementById('btnResetPlane');

    if (scaleSlider && scaleVal) {
      scaleSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        scaleVal.textContent = `${val.toFixed(1)}배`;
        if (this.mode === 'proportional') {
          this.scaleX = val;
          this.scaleY = val;
        } else if (this.mode === 'width-only') {
          this.scaleX = val;
          this.scaleY = 1.0;
        } else if (this.mode === 'height-only') {
          this.scaleX = 1.0;
          this.scaleY = val;
        }
        this.render();
      });
    }

    if (btnProp) {
      btnProp.addEventListener('click', () => {
        this.setMode('proportional');
        this.updateModeButtons([btnProp, btnWidthOnly, btnHeightOnly], btnProp);
      });
    }

    if (btnWidthOnly) {
      btnWidthOnly.addEventListener('click', () => {
        this.setMode('width-only');
        this.updateModeButtons([btnProp, btnWidthOnly, btnHeightOnly], btnWidthOnly);
      });
    }

    if (btnHeightOnly) {
      btnHeightOnly.addEventListener('click', () => {
        this.setMode('height-only');
        this.updateModeButtons([btnProp, btnWidthOnly, btnHeightOnly], btnHeightOnly);
      });
    }

    if (overlayToggle) {
      overlayToggle.addEventListener('change', (e) => {
        this.isOverlay = e.target.checked;
        this.render();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (scaleSlider) scaleSlider.value = 2.0;
        if (scaleVal) scaleVal.textContent = '2.0배';
        this.setMode('proportional');
        this.isOverlay = false;
        if (overlayToggle) overlayToggle.checked = false;
        if (btnProp) this.updateModeButtons([btnProp, btnWidthOnly, btnHeightOnly], btnProp);
        this.render();
      });
    }
  }

  updateModeButtons(buttons, activeBtn) {
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

  setMode(mode) {
    this.mode = mode;
    const scaleSlider = document.getElementById('planeScaleSlider');
    const val = scaleSlider ? parseFloat(scaleSlider.value) : 2.0;

    if (mode === 'proportional') {
      this.scaleX = val;
      this.scaleY = val;
    } else if (mode === 'width-only') {
      this.scaleX = val;
      this.scaleY = 1.0;
    } else if (mode === 'height-only') {
      this.scaleX = 1.0;
      this.scaleY = val;
    }
    this.render();
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

    this.ctx.strokeStyle = '#e2e8f0';
    this.ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x < w; x += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y < h; y += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    // Base axis line
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
  }

  renderPolygon(poly, color, fillColor, labelPrefix = '') {
    if (poly.length < 3) return;

    this.ctx.beginPath();
    const first = this.toScreen(poly[0]);
    this.ctx.moveTo(first.x, first.y);

    for (let i = 1; i < poly.length; i++) {
      const pt = this.toScreen(poly[i]);
      this.ctx.lineTo(pt.x, pt.y);
    }
    this.ctx.closePath();

    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    // Draw vertices and labels
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

  getTransformedPoly() {
    const originPt = this.basePoly[0];
    const offX = this.isOverlay ? 0 : this.transformedOffset.x;
    const offY = this.isOverlay ? 0 : this.transformedOffset.y;

    return this.basePoly.map((pt, idx) => {
      const dx = (pt.x - originPt.x) * this.scaleX;
      const dy = (pt.y - originPt.y) * this.scaleY;
      const labels = ['D', 'E', 'F'];
      return {
        x: (this.isOverlay ? originPt.x : originPt.x + offX) + dx,
        y: (this.isOverlay ? originPt.y : originPt.y + offY) + dy,
        label: labels[idx] || `P${idx + 1}`
      };
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    this.drawGrid();

    // 1. Draw Transformed Polygon first (DEF)
    const transformedPoly = this.getTransformedPoly();
    const isSimilar = Math.abs(this.scaleX - this.scaleY) < 0.001;
    const transColor = isSimilar ? '#4f46e5' : '#ef4444';
    const transFill = isSimilar ? 'rgba(79, 70, 229, 0.15)' : 'rgba(239, 68, 68, 0.12)';

    this.renderPolygon(transformedPoly, transColor, transFill);

    // 2. Draw Base Polygon (ABC)
    this.renderPolygon(this.basePoly, '#059669', 'rgba(16, 185, 129, 0.25)');

    // 3. Update Analysis UI panel
    this.updateAnalysisPanel(isSimilar);
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
          <div class="data-row"><span>대응각의 크기:</span> <b>모두 일치 (불변)</b></div>
          <div class="data-row"><span>닮음비:</span> <b>1 : ${this.scaleX.toFixed(1)}</b></div>
        `;
      } else {
        detailBox.innerHTML = `
          <div class="data-row"><span>가로 확대율:</span> <b>${this.scaleX.toFixed(1)}배</b></div>
          <div class="data-row"><span>세로 확대율:</span> <b>${this.scaleY.toFixed(1)}배</b></div>
          <div class="data-row" style="color: #dc2626;"><span>각도 변화:</span> <b>왜곡되어 각이 변함!</b></div>
        `;
      }
    }
  }
}

// Export for app.js
window.PlaneLab = PlaneLab;
