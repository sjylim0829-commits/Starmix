/**
 * Starmix Similarity Lab - Formative Assessment Missions Module (v2.0)
 * Exact mapping to Youngseo Middle School Lesson Plan:
 * Mission 1: [결손 꼭짓점 찾기] 웹 모눈에 점 C 위치 직접 찍기
 * Mission 2: [닮음 판정 및 닮음비 구하기] 주관식 m:n 입력 및 자동 채점
 */

class MissionsLab {
  constructor(containerId = 'missionsContainer', quizContainerId = 'textbookQuizContainer') {
    this.container = document.getElementById(containerId);
    this.quizContainer = document.getElementById(quizContainerId);
    if (!this.container && !this.quizContainer) return;

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
    this.renderTextbookQuiz();
    this.initMission1Canvas();
    this.bindMission2Events();
    this.bindMission3Events();
    this.bindTabJumpButtons();
  }

  bindTabJumpButtons() {
    const btnGoToTab4 = document.getElementById('btnGoToTab4');
    if (btnGoToTab4) {
      btnGoToTab4.addEventListener('click', () => {
        const tab4Btn = document.querySelector('.tab-btn[data-tab="tab-textbook-quiz"]');
        if (tab4Btn) {
          tab4Btn.click();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const quizTab = document.getElementById('tab-textbook-quiz');
          if (quizTab) quizTab.scrollTop = 0;
        }
      });
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.35rem;">
          🎯 [3단계 활동] 평면도형 형성평가 미션
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
              <input type="number" id="inputRatioM" class="ratio-num-input" placeholder="">
              <span style="font-size: 1.3rem; font-weight: 800; color: var(--text-muted);">:</span>
              <input type="number" id="inputRatioN" class="ratio-num-input" placeholder="">
            </div>
          </div>

          <button id="btnCheckMission2" class="btn btn-primary btn-block">
            ✓ 정답 제출 및 채점하기
          </button>

          <div id="mission2Feedback" class="feedback-alert" style="display: none;"></div>
        </div>

      </div>

      <!-- Navigation Banner to Tab 4 -->
      <div style="margin-top: 1.5rem; background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); border: 1.5px solid #d8b4fe; border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; box-shadow: var(--shadow-sm);">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span style="background: #7c3aed; color: white; font-size: 0.75rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 9999px;">다음 단계</span>
            <h3 style="font-size: 1.05rem; font-weight: 800; color: #581c87; margin: 0;">4. 교과서 실전 문제 (입체)</h3>
          </div>
          <p style="font-size: 0.85rem; color: #6b21a8; margin: 0;">
            평면 미션을 완료하셨나요? 닮은 두 사각뿔대의 모서리 길이와 대응면을 찾는 실전 문제 3번에 도전해보세요!
          </p>
        </div>
        <button id="btnGoToTab4" class="btn btn-primary" style="background: #7c3aed; border-color: #6d28d9; padding: 0.6rem 1.25rem; font-weight: 700; box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.3);">
          📝 4. 교과서 실전 문제 풀러가기 ➔
        </button>
      </div>
    `;
  }

  renderTextbookQuiz() {
    if (!this.quizContainer) return;
    this.quizContainer.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.35rem;">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0;">
            📝 [4단계 활동] 교과서 실전 문제 3 (입체도형의 닮음)
          </h2>
          <span class="mission-tag" style="background: #f3e8ff; color: #7c3aed; border: 1px solid #d8b4fe;">교과서 문제 3 · 실전 역량 평가</span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0;">
          중학교 2학년 수학 교과서 [도형의 닮음] 실전 문제입니다. 닮은 두 사각뿔대 (가)와 (나)의 성질을 분석하고 물음에 답해보세요.
        </p>
      </div>

      <!-- MISSION 3: 입체도형 사각뿔대의 닮음비와 대응요소 -->
      <div class="mission-panel" style="width: 100%;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span class="mission-tag" style="background: #f3e8ff; color: #7c3aed; border: 1px solid #d8b4fe;">문제 3 · 입체도형 실전 문제</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">[교과서 문제 3]</span>
          </div>
          <div class="mission-title" style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <span>두 사각뿔대의 닮음비와 모서리의 길이, 대응면을 구하세요!</span>
            <span class="grade-badge" style="background: #faf5ff; color: #9333ea; border-color: #e9d5ff;">입체도형 닮음비</span>
          </div>
          <div class="mission-desc" style="margin-bottom: 1rem;">
            오른쪽 두 사각뿔대 <b>(가)</b>와 <b>(나)</b>는 서로 닮은 도형이고, 
            <b>□BFGC</b>와 <b>□JNOK</b>가 서로 대응하는 면입니다.
            다음을 구하시오.
          </div>
        </div>

        <!-- Two-Column Layout: Left = SVG Diagram, Right = 3 Questions -->
        <div class="mission-m3-grid">
          
          <!-- Left Column: Textbook Diagram (SVG) -->
          <div style="background: #ffffff; border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <svg viewBox="0 0 510 235" width="100%" height="auto" style="max-height: 250px; overflow: visible;">
              <!-- ====== FRUSTUM (가) ====== -->
              <!-- Hidden dashed edges for (가) -->
              <line x1="85" y1="42" x2="60" y2="142" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4,4" />
              <line x1="60" y1="142" x2="25" y2="186" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4,4" />
              <line x1="60" y1="142" x2="215" y2="142" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="4,4" />

              <!-- Right side face CDHG (가) -->
              <polygon points="150,78 175,42 215,142 180,186" fill="#faf5ff" stroke="#334155" stroke-width="1.8" />

              <!-- Front face BFGC (가) -->
              <polygon points="60,78 150,78 180,186 25,186" fill="rgba(192, 132, 252, 0.3)" stroke="#334155" stroke-width="2.0" />

              <!-- Top face ABCD (가) -->
              <polygon points="85,42 175,42 150,78 60,78" fill="#ffffff" stroke="#334155" stroke-width="1.8" />

              <!-- Outer visible edges (가) -->
              <line x1="60" y1="78" x2="25" y2="186" stroke="#334155" stroke-width="2.2" />
              <line x1="150" y1="78" x2="180" y2="186" stroke="#334155" stroke-width="2.2" />
              <line x1="175" y1="42" x2="215" y2="142" stroke="#334155" stroke-width="2.2" />
              <line x1="25" y1="186" x2="180" y2="186" stroke="#334155" stroke-width="2.2" />
              <line x1="180" y1="186" x2="215" y2="142" stroke="#334155" stroke-width="2" />

              <!-- Dimension AD = 8 cm -->
              <path d="M 85,38 Q 130,26 175,38" fill="none" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3,3" />
              <text x="130" y="24" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">8 cm</text>

              <!-- Dimension FG = 12 cm -->
              <path d="M 25,192 Q 102,204 180,192" fill="none" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3,3" />
              <text x="102" y="214" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">12 cm</text>

              <!-- Vertices (가) -->
              <circle cx="85" cy="42" r="3" fill="#334155" />
              <text x="76" y="38" text-anchor="end" font-size="12" font-weight="800" fill="#1e293b">A</text>
              <circle cx="60" cy="78" r="3" fill="#334155" />
              <text x="50" y="78" text-anchor="end" font-size="12" font-weight="800" fill="#1e293b">B</text>
              <circle cx="150" cy="78" r="3" fill="#334155" />
              <text x="142" y="72" text-anchor="end" font-size="12" font-weight="800" fill="#1e293b">C</text>
              <circle cx="175" cy="42" r="3" fill="#334155" />
              <text x="185" y="38" text-anchor="start" font-size="12" font-weight="800" fill="#1e293b">D</text>
              <text x="68" y="138" text-anchor="start" font-size="11" font-weight="700" fill="#94a3b8">E</text>
              <circle cx="25" cy="186" r="3" fill="#334155" />
              <text x="16" y="190" text-anchor="end" font-size="12" font-weight="800" fill="#1e293b">F</text>
              <circle cx="180" cy="186" r="3" fill="#334155" />
              <text x="190" y="190" text-anchor="start" font-size="12" font-weight="800" fill="#1e293b">G</text>
              <circle cx="215" cy="142" r="3" fill="#334155" />
              <text x="225" y="144" text-anchor="start" font-size="12" font-weight="800" fill="#1e293b">H</text>

              <!-- Label (가) -->
              <text x="102" y="228" text-anchor="middle" font-size="14" font-weight="800" fill="#1e293b">(가)</text>

              <!-- ====== FRUSTUM (나) ====== -->
              <!-- Hidden dashed edges for (나) -->
              <line x1="345" y1="52" x2="326" y2="127" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3" />
              <line x1="326" y1="127" x2="300" y2="160" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3" />
              <line x1="326" y1="127" x2="443" y2="127" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3" />

              <!-- Right side face KLPO (나) -->
              <polygon points="394,79 413,52 443,127 416,160" fill="#faf5ff" stroke="#334155" stroke-width="1.8" />

              <!-- Front face JNOK (나) -->
              <polygon points="326,79 394,79 416,160 300,160" fill="rgba(192, 132, 252, 0.3)" stroke="#334155" stroke-width="2.0" />

              <!-- Top face IJKL (나) -->
              <polygon points="345,52 413,52 394,79 326,79" fill="#ffffff" stroke="#334155" stroke-width="1.8" />

              <!-- Outer visible edges (나) -->
              <line x1="326" y1="79" x2="300" y2="160" stroke="#334155" stroke-width="2.2" />
              <line x1="394" y1="79" x2="416" y2="160" stroke="#334155" stroke-width="2.2" />
              <line x1="413" y1="52" x2="443" y2="127" stroke="#334155" stroke-width="2.2" />
              <line x1="300" y1="160" x2="416" y2="160" stroke="#334155" stroke-width="2.2" />
              <line x1="416" y1="160" x2="443" y2="127" stroke="#334155" stroke-width="1.8" />

              <!-- Dimension IL = 6 cm -->
              <path d="M 345,48 Q 379,38 413,48" fill="none" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3,3" />
              <text x="379" y="34" text-anchor="middle" font-size="12" font-weight="700" fill="#1e293b">6 cm</text>

              <!-- Dimension LP = 9 cm -->
              <path d="M 420,53 Q 448,87 450,127" fill="none" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3,3" />
              <text x="466" y="94" text-anchor="start" font-size="12" font-weight="700" fill="#1e293b">9 cm</text>

              <!-- Vertices (나) -->
              <circle cx="345" cy="52" r="3" fill="#334155" />
              <text x="336" y="48" text-anchor="end" font-size="12" font-weight="800" fill="#1e293b">I</text>
              <circle cx="326" cy="79" r="3" fill="#334155" />
              <text x="316" y="78" text-anchor="end" font-size="12" font-weight="800" fill="#1e293b">J</text>
              <circle cx="394" cy="79" r="3" fill="#334155" />
              <text x="385" y="73" text-anchor="end" font-size="12" font-weight="800" fill="#1e293b">K</text>
              <circle cx="413" cy="52" r="3" fill="#334155" />
              <text x="423" y="48" text-anchor="start" font-size="12" font-weight="800" fill="#1e293b">L</text>
              <text x="334" y="123" text-anchor="start" font-size="11" font-weight="700" fill="#94a3b8">M</text>
              <circle cx="300" cy="160" r="3" fill="#334155" />
              <text x="290" y="166" text-anchor="end" font-size="12" font-weight="800" fill="#1e293b">N</text>
              <circle cx="416" cy="160" r="3" fill="#334155" />
              <text x="426" y="166" text-anchor="start" font-size="12" font-weight="800" fill="#1e293b">O</text>
              <circle cx="443" cy="127" r="3" fill="#334155" />
              <text x="452" y="132" text-anchor="start" font-size="12" font-weight="800" fill="#1e293b">P</text>

              <!-- Label (나) -->
              <text x="360" y="200" text-anchor="middle" font-size="14" font-weight="800" fill="#1e293b">(나)</text>
            </svg>

            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.5rem; text-align: center; line-height: 1.45;">
              💡 두 사각뿔대 (가)와 (나)의 대응하는 꼭짓점의 위치와 모서리의 길이를 관찰해보세요.
            </div>
          </div>

          <!-- Right Column: 3 Sub-questions -->
          <div>
            <!-- Sub-question (1) -->
            <div class="mission-subquest-box">
              <div class="mission-subquest-title">
                <span style="background: #7c3aed; color: white; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem;">1</span>
                <span>두 사각뿔대 (가)와 (나)의 닮음비</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">
                가장 간단한 자연수의 비($m : n$)로 입력하세요:
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="number" id="inputM3RatioM" class="ratio-num-input" placeholder="" style="width: 60px; padding: 0.45rem;">
                <b style="font-size: 1.1rem; color: var(--text-muted);">:</b>
                <input type="number" id="inputM3RatioN" class="ratio-num-input" placeholder="" style="width: 60px; padding: 0.45rem;">
              </div>
            </div>

            <!-- Sub-question (2) -->
            <div class="mission-subquest-box">
              <div class="mission-subquest-title">
                <span style="background: #7c3aed; color: white; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem;">2</span>
                <span>선분 DH (<span style="text-decoration: overline;">DH</span>)의 길이</span>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="number" id="inputM3DH" class="ratio-num-input" placeholder="" style="width: 80px; padding: 0.45rem;">
                <span style="font-size: 0.95rem; font-weight: 700; color: var(--text-main);">cm</span>
              </div>
            </div>

            <!-- Sub-question (3) -->
            <div class="mission-subquest-box">
              <div class="mission-subquest-title">
                <span style="background: #7c3aed; color: white; width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem;">3</span>
                <span>면 ABCD에 대응하는 면</span>
              </div>
              <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap;">
                <input type="text" id="inputM3Face" placeholder="" style="flex: 1; min-width: 140px; padding: 0.45rem 0.6rem; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.9rem; font-weight: 700; color: var(--primary);">
              </div>
              <!-- Helper Chips for Tablet / Mobile -->
              <div style="display: flex; gap: 0.3rem; margin-top: 0.4rem; flex-wrap: wrap; align-items: center;">
                <span style="font-size: 0.74rem; color: var(--text-muted); align-self: center;">기호 입력:</span>
                <button type="button" class="m3-chip-btn" data-char="면 ">면</button>
                <button type="button" class="m3-chip-btn" data-char="□">□</button>
                <button type="button" id="btnClearM3Face" class="m3-chip-btn" style="margin-left: auto;">↺ 지우기</button>
              </div>
            </div>

            <!-- Buttons -->
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
              <button type="button" id="btnCheckMission3" class="btn btn-primary" style="flex: 2; font-weight: 700;">
                ✓ 문제 3 정답 제출 및 채점하기
              </button>
              <button type="button" id="btnClearMission3" class="btn btn-secondary" style="flex: 1;">
                ↺ 다시 풀기
              </button>
            </div>

            <!-- Feedback box -->
            <div id="mission3Feedback" class="feedback-alert" style="display: none; margin-top: 0.85rem;"></div>
          </div>

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

    this.m1Canvas.width = Math.round(width * dpr);
    this.m1Canvas.height = Math.round(height * dpr);
    this.m1Canvas.style.width = `${width}px`;
    this.m1Canvas.style.height = `${height}px`;

    this.m1LogicalWidth = width;
    this.m1LogicalHeight = height;

    this.m1GridSize = Math.max(18, Math.min(26, Math.floor((height - 55) / 11)));
    this.m1Origin = { x: 45, y: Math.round(height - 35) };

    this.m1Ctx.resetTransform();
    this.m1Ctx.scale(dpr, dpr);

    this.renderMission1();

    if (this.m1EventsBound) return;
    this.m1EventsBound = true;

    const getM1Coords = (e) => {
      const rect = this.m1Canvas.getBoundingClientRect();
      const logicalW = this.m1LogicalWidth || this.m1Canvas.clientWidth || rect.width;
      const logicalH = this.m1LogicalHeight || this.m1Canvas.clientHeight || rect.height;
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

    const handleM1Click = (coords) => {
      if (this.m1Completed) return;

      const gridX = Math.round((coords.x - this.m1Origin.x) / this.m1GridSize);
      const gridY = Math.round((this.m1Origin.y - coords.y) / this.m1GridSize);

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
    };

    // Mouse & Touch
    this.m1Canvas.addEventListener('click', (e) => {
      handleM1Click(getM1Coords(e));
    });

    this.m1Canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleM1Click(getM1Coords(e));
    }, { passive: false });

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
    const w = this.m1LogicalWidth || this.m1Canvas.clientWidth;
    const h = this.m1LogicalHeight || this.m1Canvas.clientHeight;
    this.m1Ctx.clearRect(0, 0, w, h);

    // Draw grid anchored strictly to m1Origin
    this.m1Ctx.strokeStyle = '#f1f5f9';
    this.m1Ctx.lineWidth = 1;

    // Vertical lines from m1Origin.x
    for (let x = this.m1Origin.x; x <= w; x += this.m1GridSize) {
      this.m1Ctx.beginPath();
      this.m1Ctx.moveTo(x, 0);
      this.m1Ctx.lineTo(x, h);
      this.m1Ctx.stroke();
    }
    for (let x = this.m1Origin.x - this.m1GridSize; x >= 0; x -= this.m1GridSize) {
      this.m1Ctx.beginPath();
      this.m1Ctx.moveTo(x, 0);
      this.m1Ctx.lineTo(x, h);
      this.m1Ctx.stroke();
    }

    // Horizontal lines from m1Origin.y
    for (let y = this.m1Origin.y; y >= 0; y -= this.m1GridSize) {
      this.m1Ctx.beginPath();
      this.m1Ctx.moveTo(0, y);
      this.m1Ctx.lineTo(w, y);
      this.m1Ctx.stroke();
    }
    for (let y = this.m1Origin.y + this.m1GridSize; y <= h; y += this.m1GridSize) {
      this.m1Ctx.beginPath();
      this.m1Ctx.moveTo(0, y);
      this.m1Ctx.lineTo(w, y);
      this.m1Ctx.stroke();
    }

    // Axes
    this.m1Ctx.strokeStyle = '#cbd5e1';
    this.m1Ctx.lineWidth = 2;
    this.m1Ctx.beginPath();
    this.m1Ctx.moveTo(0, this.m1Origin.y);
    this.m1Ctx.lineTo(w, this.m1Origin.y);
    this.m1Ctx.stroke();

    this.m1Ctx.beginPath();
    this.m1Ctx.moveTo(this.m1Origin.x, 0);
    this.m1Ctx.lineTo(this.m1Origin.x, h);
    this.m1Ctx.stroke();

    // Axis coordinate numbers
    this.m1Ctx.font = 'bold 10px Pretendard, sans-serif';
    this.m1Ctx.fillStyle = '#94a3b8';
    this.m1Ctx.textAlign = 'center';
    this.m1Ctx.textBaseline = 'middle';

    for (let i = 1; i <= 20; i++) {
      const ptX = this.m1ToScreen({ x: i, y: 0 });
      if (ptX.x < w - 10) {
        this.m1Ctx.fillText(i, ptX.x, ptX.y + 14);
      }
    }

    this.m1Ctx.textAlign = 'right';
    for (let i = 1; i <= 15; i++) {
      const ptY = this.m1ToScreen({ x: 0, y: i });
      if (ptY.y > 10) {
        this.m1Ctx.fillText(i, ptY.x - 6, ptY.y);
      }
    }

    this.m1Ctx.fillText('0', this.m1Origin.x - 6, this.m1Origin.y + 14);

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

  /* ---------------- Mission 3 Events & Grading (사각뿔대 닮음비와 대응요소) ---------------- */
  bindMission3Events() {
    const btnCheck = document.getElementById('btnCheckMission3');
    const btnClear = document.getElementById('btnClearMission3');
    const feedback = document.getElementById('mission3Feedback');
    const inputM = document.getElementById('inputM3RatioM');
    const inputN = document.getElementById('inputM3RatioN');
    const inputDH = document.getElementById('inputM3DH');
    const inputFace = document.getElementById('inputM3Face');
    const chips = document.querySelectorAll('.m3-chip-btn');

    if (!btnCheck || !feedback) return;

    // Helper Chips for Question 3
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const char = chip.dataset.char;
        if (inputFace && char) {
          inputFace.value += char;
          inputFace.focus();
        }
      });
    });

    const btnClearFace = document.getElementById('btnClearM3Face');
    if (btnClearFace && inputFace) {
      btnClearFace.addEventListener('click', () => {
        inputFace.value = '';
        inputFace.focus();
      });
    }

    // Enter Key Navigation
    if (inputM) {
      inputM.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (inputN) inputN.focus();
        }
      });
    }
    if (inputN) {
      inputN.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (inputDH) inputDH.focus();
        }
      });
    }
    if (inputDH) {
      inputDH.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (inputFace) inputFace.focus();
        }
      });
    }
    if (inputFace) {
      inputFace.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          btnCheck.click();
        }
      });
    }

    // Reset button
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (inputM) inputM.value = '';
        if (inputN) inputN.value = '';
        if (inputDH) inputDH.value = '';
        if (inputFace) inputFace.value = '';
        feedback.style.display = 'none';
        if (inputM) inputM.focus();
      });
    }

    // Check & Grade
    btnCheck.addEventListener('click', () => {
      const valM = parseInt(inputM ? inputM.value : '');
      const valN = parseInt(inputN ? inputN.value : '');
      const valDH = parseFloat(inputDH ? inputDH.value : '');
      const rawFace = inputFace ? inputFace.value.trim().toUpperCase().replace(/[\s□사각형면\-]/g, '') : '';

      if (isNaN(valM) && isNaN(valN) && isNaN(valDH) && !rawFace) {
        feedback.className = 'feedback-alert error';
        feedback.innerHTML = '⚠️ 문제 3의 답안을 먼저 입력해주세요!';
        feedback.style.display = 'block';
        return;
      }

      // 1. Check Similarity Ratio (4 : 3)
      let q1Correct = (valM === 4 && valN === 3);
      let q1Note = '';
      if (q1Correct) {
        q1Note = '✓ <b>(1) 닮음비:</b> 정답! $\\overline{\\text{AD}} : \\overline{\\text{IL}} = 8 : 6 = $ <b>4 : 3</b>';
      } else if ((valM === 8 && valN === 6) || (valM === 12 && valN === 9)) {
        q1Note = `❌ <b>(1) 닮음비:</b> 비의 값은 맞았으나, <b>가장 간단한 자연수의 비(4 : 3)</b>로 약분해야 합니다.`;
      } else if (valM === 3 && valN === 4) {
        q1Note = `❌ <b>(1) 닮음비:</b> (가)와 (나)의 순서가 바뀌었습니다. (가) : (나) 순서로 <b>4 : 3</b> 입니다.`;
      } else {
        q1Note = `❌ <b>(1) 닮음비:</b> 대응하는 두 모서리의 길이 $8\\text{ cm}$와 $6\\text{ cm}$의 비 $8 : 6$을 간단한 자연수의 비로 나타내보세요. (정답: <b>4 : 3</b>)`;
      }

      // 2. Check Edge DH Length (12 cm)
      let q2Correct = Math.abs(valDH - 12) < 0.1;
      let q2Note = '';
      if (q2Correct) {
        q2Note = '✓ <b>(2) $\\overline{\\text{DH}}$의 길이:</b> 정답! $\\overline{\\text{DH}} : \\overline{\\text{LP}} = 4 : 3 \\implies \\overline{\\text{DH}} = $ <b>12 cm</b>';
      } else {
        q2Note = '❌ <b>(2) $\\overline{\\text{DH}}$의 길이:</b> $\\overline{\\text{DH}} : \\overline{\\text{LP}} = 4 : 3$ 이고 $\\overline{\\text{LP}} = 9\\text{ cm}$ 입니다. 비례식 $\\overline{\\text{DH}} : 9 = 4 : 3$을 풀면 <b>12 cm</b>가 됩니다.';
      }

      // 3. Check Corresponding Face (면 IJKL)
      let q3Correct = (rawFace === 'IJKL' || rawFace === 'JKLI' || rawFace === 'KLIJ' || rawFace === 'LIJK');
      let q3Note = '';
      if (q3Correct) {
        q3Note = '✓ <b>(3) 대응하는 면:</b> 정답! 꼭짓점 A ↔ I, B ↔ J, C ↔ K, D ↔ L 순서에 맞춘 <b>면 IJKL</b>';
      } else {
        q3Note = '❌ <b>(3) 대응하는 면:</b> $\\square\\text{BFGC} \\leftrightarrow \\square\\text{JNOK}$이므로 A ↔ I, B ↔ J, C ↔ K, D ↔ L에 대응합니다. 대응점 순서대로 <b>면 IJKL</b> 입니다.';
      }

      const score = (q1Correct ? 1 : 0) + (q2Correct ? 1 : 0) + (q3Correct ? 1 : 0);

      feedback.style.display = 'block';

      if (score === 3) {
        feedback.className = 'feedback-alert success';
        feedback.innerHTML = `
          <div style="font-size: 1rem; font-weight: 800; color: #047857; margin-bottom: 0.5rem;">
            🎉 완벽한 만점입니다! 참 잘했어요! (3 / 3 정답)
          </div>
          <div style="font-size: 0.86rem; line-height: 1.7; background: white; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border-left: 4px solid #10b981;">
            • ${q1Note}<br>
            • ${q2Note}<br>
            • ${q3Note}
          </div>
          <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #065f46;">
            💡 <b>교과서 개념 정리:</b> 서로 닮은 두 입체도형에서 <b>대응하는 모서리의 길이의 비는 일정</b>하며, 이 비가 곧 <b>닮음비</b>가 됩니다!
          </div>
        `;
      } else if (score > 0) {
        feedback.className = 'feedback-alert info';
        feedback.innerHTML = `
          <div style="font-size: 0.95rem; font-weight: 800; color: #92400e; margin-bottom: 0.5rem;">
            👍 아쉬워요! ${score}문제를 맞혔습니다. (3문제 중 ${score}문제 정답)
          </div>
          <div style="font-size: 0.84rem; line-height: 1.65; background: white; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border-left: 4px solid #f59e0b;">
            • ${q1Note}<br>
            • ${q2Note}<br>
            • ${q3Note}
          </div>
          <div style="margin-top: 0.4rem; font-size: 0.8rem; color: #b45309;">
            💡 오답이 있는 항목의 풀이를 확인하고 다시 입력해보세요!
          </div>
        `;
      } else {
        feedback.className = 'feedback-alert error';
        feedback.innerHTML = `
          <div style="font-size: 0.95rem; font-weight: 800; color: #991b1b; margin-bottom: 0.5rem;">
            ⚠️ 다시 한 번 도전해볼까요? (0 / 3)
          </div>
          <div style="font-size: 0.84rem; line-height: 1.65; background: white; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border-left: 4px solid #ef4444;">
            • ${q1Note}<br>
            • ${q2Note}<br>
            • ${q3Note}
          </div>
        `;
      }
    });
  }
}

// Export for app.js
window.MissionsLab = MissionsLab;
