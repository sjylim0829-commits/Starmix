/**
 * Starmix Similarity Lab - Formative Assessment Missions Module (v2.0)
 * Exact mapping to Youngseo Middle School Lesson Plan:
 * Mission 1: [결손 꼭짓점 찾기] 웹 모눈에 점 C 위치 직접 찍기
 * Mission 2: [닮음 판정 및 닮음비 구하기] 주관식 m:n 입력 및 자동 채점
 */

class MissionsLab {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.m1Canvas = null;
    this.m1Ctx = null;
    this.m1GridSize = 24;
    this.m1Origin = { x: 35, y: 260 };
    this.m1Completed = false;
    this.m1ClickedPt = null;

    this.init();
  }

  init() {
    this.render();
    this.initMission1Canvas();
    this.bindMission2Events();
  }

  render() {
    this.container.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.35rem;">
          🎯 [3단계 활동] 도전! 인터랙티브 형성평가 미션
        </h2>
        <p style="color: var(--text-muted); font-size: 0.9rem;">
          지도안 수업 내용에 맞춰 제작된 실전 미션입니다. 모눈에 직접 점을 찍고 닮음비를 입력해보세요.
        </p>
      </div>

      <div class="missions-container-layout">
        
        <!-- MISSION 1: 결손 꼭짓점 찾기 -->
        <div class="mission-panel">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span class="mission-tag">미션 1 · 작도 미션</span>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">[결손 꼭짓점 찾기]</span>
            </div>
            <div class="mission-title">2배 닮은 삼각형의 마지막 꼭짓점(F)을 찾아 찍으세요!</div>
            <div class="mission-desc">
              기준 삼각형 <b>△ABC(초록)</b>는 밑변 3, 높이 4입니다. 
              오른쪽의 2배 닮은 삼각형 <b>△DEF</b>에 두 점 <b>D(6, 1), E(12, 1)</b>가 주어져 있습니다. 
              닮음이 되도록 <b>모눈에서 점 F의 위치를 찾아 클릭</b>하세요.
            </div>
          </div>

          <div class="mission-canvas-box">
            <canvas id="mission1Canvas"></canvas>
          </div>

          <div id="mission1Feedback" class="feedback-alert info">
            💡 모눈 위의 격자 교점을 클릭하여 점 F의 위치를 완성해보세요.
          </div>
          <button id="btnResetMission1" class="btn btn-secondary btn-sm" style="margin-top: 0.5rem; align-self: flex-start;">
            ↺ 다시 시도하기
          </button>
        </div>

        <!-- MISSION 2: 닮음 판정 및 닮음비 구하기 -->
        <div class="mission-panel">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span class="mission-tag">미션 2 · 판정 & 계산</span>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">[닮음 판정 및 닮음비]</span>
            </div>
            <div class="mission-title">두 사각형의 닮음 여부와 닮음비를 판정하세요!</div>
            <div class="mission-desc">
              아래 그림에 주어진 두 직사각형을 관찰하고 물음에 답하세요.
            </div>
          </div>

          <!-- Visual Illustration of 2 Rectangles -->
          <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: 1.25rem; display: flex; justify-content: space-around; align-items: center; min-height: 160px;">
            <div style="text-align: center;">
              <div style="width: 72px; height: 48px; border: 2.5px solid #059669; background: rgba(16, 185, 129, 0.2); border-radius: 4px; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.8rem; font-weight: bold; margin: 0 auto;">
                직사각형 A
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem;">
                가로 6 cm / 세로 4 cm
              </div>
            </div>

            <div style="font-size: 1.5rem; color: var(--text-light); font-weight: 300;">vs</div>

            <div style="text-align: center;">
              <div style="width: 135px; height: 90px; border: 2.5px solid #4f46e5; background: rgba(79, 70, 229, 0.15); border-radius: 4px; display: flex; flex-direction: column; justify-content: center; align-items: center; font-size: 0.85rem; font-weight: bold; margin: 0 auto;">
                직사각형 B
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.35rem;">
                가로 15 cm / 세로 10 cm
              </div>
            </div>
          </div>

          <!-- Question 1: 닮음 판정 -->
          <div style="margin-top: 1rem;">
            <div style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem;">
              Q1. 두 직사각형 A와 B는 닮은 도형인가요?
            </div>
            <div style="display: flex; gap: 1rem;">
              <label style="font-size: 0.9rem; display: flex; align-items: center; gap: 0.3rem; cursor: pointer;">
                <input type="radio" name="m2Similar" value="yes"> 예 (닮음이다)
              </label>
              <label style="font-size: 0.9rem; display: flex; align-items: center; gap: 0.3rem; cursor: pointer;">
                <input type="radio" name="m2Similar" value="no"> 아니오 (닮음이 아니다)
              </label>
            </div>
          </div>

          <!-- Question 2: 닮음비 입력 -->
          <div style="margin-top: 1rem;">
            <div style="font-size: 0.9rem; font-weight: 600; margin-bottom: 0.4rem;">
              Q2. 직사각형 A와 B의 닮음비를 가장 간단한 자연수의 비(m : n)로 나타내세요:
            </div>
            <div class="ratio-input-group">
              <input type="number" id="inputRatioM" class="ratio-num-input" placeholder="m">
              <span style="font-size: 1.3rem; font-weight: 800; color: var(--text-muted);">:</span>
              <input type="number" id="inputRatioN" class="ratio-num-input" placeholder="n">
            </div>
          </div>

          <button id="btnCheckMission2" class="btn btn-primary btn-block">
            ✓ 정답 제출 및 채점하기
          </button>

          <div id="mission2Feedback" class="feedback-alert" style="display: none;"></div>
        </div>

      </div>
    `;
  }

  /* ---------------- Mission 1 Interactive Canvas ---------------- */
  initMission1Canvas() {
    this.m1Canvas = document.getElementById('mission1Canvas');
    if (!this.m1Canvas) return;
    this.m1Ctx = this.m1Canvas.getContext('2d');

    const parent = this.m1Canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const width = parent.clientWidth || 360;
    const height = parent.clientHeight || 280;

    this.m1Canvas.width = width * dpr;
    this.m1Canvas.height = height * dpr;
    this.m1Canvas.style.width = `${width}px`;
    this.m1Canvas.style.height = `${height}px`;

    this.m1Ctx.resetTransform();
    this.m1Ctx.scale(dpr, dpr);

    this.renderMission1();

    if (this.m1EventsBound) return;
    this.m1EventsBound = true;

    // Mouse move & click
    this.m1Canvas.addEventListener('click', (e) => {
      if (this.m1Completed) return;

      const rect = this.m1Canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const gridX = Math.round((mouseX - this.m1Origin.x) / this.m1GridSize);
      const gridY = Math.round((this.m1Origin.y - mouseY) / this.m1GridSize);

      this.m1ClickedPt = { x: gridX, y: gridY };

      // Target point is F(6, 9)
      const feedback = document.getElementById('mission1Feedback');
      if (gridX === 6 && gridY === 9) {
        this.m1Completed = true;
        feedback.className = 'feedback-alert success';
        feedback.innerHTML = `
          <b>🎉 완벽한 정답입니다!</b><br>
          밑변이 $3 \\rightarrow 6$(2배)으로 늘어났으므로, 높이도 $4 \\rightarrow 8$(2배)이 되어야 합니다.<br>
          점 D(6, 1)에서 위로 8칸 올라간 <b>점 F(6, 9)</b>를 정확히 찾았습니다!
        `;
      } else {
        feedback.className = 'feedback-alert error';
        if (gridX !== 6) {
          feedback.innerHTML = `
            <b>아쉬워요!</b> 점 F는 직각을 유지하기 위해 점 D(6, 1)의 바로 수직 위(x=6)에 있어야 합니다.
          `;
        } else {
          feedback.innerHTML = `
            <b>높이를 다시 계산해볼까요?</b><br>
            원래 높이가 4칸이었으니 2배 확대하면 <b>8칸</b>이어야 합니다.<br>
            점 D의 y좌표가 1이므로, $1 + 8 = 9$ 위치를 클릭해보세요! (현재 클릭: y=${gridY})
          `;
        }
      }

      this.renderMission1();
    });

    const resetBtn = document.getElementById('btnResetMission1');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.m1Completed = false;
        this.m1ClickedPt = null;
        const feedback = document.getElementById('mission1Feedback');
        feedback.className = 'feedback-alert info';
        feedback.textContent = '💡 모눈 위의 격자 교점을 클릭하여 점 F의 위치를 완성해보세요.';
        this.renderMission1();
      });
    }
  }

  m1ToScreen(gridPt) {
    return {
      x: this.m1Origin.x + gridPt.x * this.m1GridSize,
      y: this.m1Origin.y - gridPt.y * this.m1GridSize
    };
  }

  renderMission1() {
    const w = this.m1Canvas.clientWidth;
    const h = this.m1Canvas.clientHeight;
    this.m1Ctx.clearRect(0, 0, w, h);

    // Draw grid
    this.m1Ctx.strokeStyle = '#f1f5f9';
    this.m1Ctx.lineWidth = 1;
    for (let x = 0; x < w; x += this.m1GridSize) {
      this.m1Ctx.beginPath();
      this.m1Ctx.moveTo(x, 0);
      this.m1Ctx.lineTo(x, h);
      this.m1Ctx.stroke();
    }
    for (let y = 0; y < h; y += this.m1GridSize) {
      this.m1Ctx.beginPath();
      this.m1Ctx.moveTo(0, y);
      this.m1Ctx.lineTo(w, y);
      this.m1Ctx.stroke();
    }

    // Base Triangle ABC: A(1, 1), B(4, 1), C(1, 5)
    const polyABC = [
      { x: 1, y: 1, label: 'A' },
      { x: 4, y: 1, label: 'B' },
      { x: 1, y: 5, label: 'C' }
    ];
    this.drawMissionPoly(polyABC, '#059669', 'rgba(16, 185, 129, 0.25)', true);

    // Points D(6, 1), E(12, 1)
    const ptD = { x: 6, y: 1, label: 'D' };
    const ptE = { x: 12, y: 1, label: 'E' };

    // Draw baseline DE
    const sD = this.m1ToScreen(ptD);
    const sE = this.m1ToScreen(ptE);
    this.m1Ctx.beginPath();
    this.m1Ctx.moveTo(sD.x, sD.y);
    this.m1Ctx.lineTo(sE.x, sE.y);
    this.m1Ctx.strokeStyle = '#4f46e5';
    this.m1Ctx.lineWidth = 2.5;
    this.m1Ctx.stroke();

    this.drawPoint(ptD, '#4f46e5', 'D');
    this.drawPoint(ptE, '#4f46e5', 'E');

    // If completed or clicked
    if (this.m1Completed) {
      const ptF = { x: 6, y: 9, label: 'F' };
      const polyDEF = [ptD, ptE, ptF];
      this.drawMissionPoly(polyDEF, '#4f46e5', 'rgba(79, 70, 229, 0.25)', true);
    } else if (this.m1ClickedPt) {
      this.drawPoint(this.m1ClickedPt, '#ef4444', '?');
      const sClick = this.m1ToScreen(this.m1ClickedPt);
      this.m1Ctx.beginPath();
      this.m1Ctx.moveTo(sD.x, sD.y);
      this.m1Ctx.lineTo(sClick.x, sClick.y);
      this.m1Ctx.lineTo(sE.x, sE.y);
      this.m1Ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      this.m1Ctx.setLineDash([4, 4]);
      this.m1Ctx.stroke();
      this.m1Ctx.setLineDash([]);
    }
  }

  drawPoint(pt, color, label) {
    const s = this.m1ToScreen(pt);
    this.m1Ctx.fillStyle = color;
    this.m1Ctx.beginPath();
    this.m1Ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
    this.m1Ctx.fill();

    this.m1Ctx.font = 'bold 12px sans-serif';
    this.m1Ctx.fillStyle = '#0f172a';
    this.m1Ctx.fillText(`${label}(${pt.x},${pt.y})`, s.x + 7, s.y - 7);
  }

  drawMissionPoly(poly, strokeColor, fillColor, drawLabels = true) {
    if (poly.length < 3) return;
    this.m1Ctx.beginPath();
    const first = this.m1ToScreen(poly[0]);
    this.m1Ctx.moveTo(first.x, first.y);
    for (let i = 1; i < poly.length; i++) {
      const pt = this.m1ToScreen(poly[i]);
      this.m1Ctx.lineTo(pt.x, pt.y);
    }
    this.m1Ctx.closePath();
    this.m1Ctx.fillStyle = fillColor;
    this.m1Ctx.fill();
    this.m1Ctx.strokeStyle = strokeColor;
    this.m1Ctx.lineWidth = 2.5;
    this.m1Ctx.stroke();

    if (drawLabels) {
      poly.forEach(pt => this.drawPoint(pt, strokeColor, pt.label));
    }
  }

  /* ---------------- Mission 2 Events & Grading ---------------- */
  bindMission2Events() {
    const btnCheck = document.getElementById('btnCheckMission2');
    const feedback = document.getElementById('mission2Feedback');

    if (btnCheck && feedback) {
      btnCheck.addEventListener('click', () => {
        const simRadio = document.querySelector('input[name="m2Similar"]:checked');
        const mInput = document.getElementById('inputRatioM');
        const nInput = document.getElementById('inputRatioN');

        if (!simRadio) {
          alert('Q1. 두 직사각형이 닮음인지 먼저 선택해주세요!');
          return;
        }

        const isSimilarSelected = simRadio.value === 'yes';
        const m = parseInt(mInput.value);
        const n = parseInt(nInput.value);

        feedback.style.display = 'block';

        if (!isSimilarSelected) {
          feedback.className = 'feedback-alert error';
          feedback.innerHTML = `
            <b>오답입니다!</b><br>
            • 가로의 길이비: $6 : 15 = 2 : 5$<br>
            • 세로의 길이비: $4 : 10 = 2 : 5$<br>
            대응하는 변의 길이의 비가 일정하고 네 각이 모두 $90^\\circ$로 같으므로 <b>두 직사각형은 서로 닮음</b>입니다.
          `;
          return;
        }

        if (isNaN(m) || isNaN(n)) {
          feedback.className = 'feedback-alert error';
          feedback.innerHTML = 'Q2. 닮음비 m과 n에 숫자를 바르게 입력해주세요.';
          return;
        }

        // Correct ratio: 2 : 5
        if (m === 2 && n === 5) {
          feedback.className = 'feedback-alert success';
          feedback.innerHTML = `
            <b>🎉 완벽한 정답입니다!</b><br>
            1. 대응변의 길이의 비가 $6 : 15 = 2 : 5$ 이고 $4 : 10 = 2 : 5$ 로 모두 같습니다.<br>
            2. 네 각의 크기가 모두 $90^\\circ$로 일치합니다.<br>
            따라서 두 직사각형은 닮음이며, 가장 간단한 자연수의 비로 나타낸 닮음비는 <b>2 : 5</b> 입니다!
          `;
        } else if (m === 6 && n === 15 || m === 4 && n === 10) {
          feedback.className = 'feedback-alert info';
          feedback.innerHTML = `
            <b>💡 비의 값은 맞았어요!</b><br>
            하지만 문제에서 <b>'가장 간단한 자연수의 비'</b>를 요구했습니다.<br>
            $${m} : ${n}$를 공약수로 나누어 더 간단한 정수로 약분해보세요! (힌트: 2 : 5)
          `;
        } else {
          feedback.className = 'feedback-alert error';
          feedback.innerHTML = `
            <b>닮음비 계산을 다시 해볼까요?</b><br>
            대응하는 가로의 길이는 6cm와 15cm입니다. $6 : 15$를 가장 간단한 자연수의 비로 나타내면 몇 대 몇일까요?
          `;
        }
      });
    }
  }
}

// Export for app.js
window.MissionsLab = MissionsLab;
