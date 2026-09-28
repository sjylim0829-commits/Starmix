/**
 * Starmix Similarity Lab - Formative Assessment Missions Module
 */

class MissionsLab {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.missions = [
      {
        id: 1,
        tag: '개념 판별',
        title: '미션 1. 어떤 경우가 진짜 "닮음"일까요?',
        question: '스마트폰 사진을 편집할 때 원본 사진과 "도형의 닮음" 관계를 유지하는 경우는 어느 것일까요?',
        options: [
          { text: '① 얼굴을 갸름하게 만들기 위해 가로 폭만 0.8배로 축소했다.', correct: false, comment: '가로만 줄이면 각도와 비율이 왜곡되어 닮음이 아닙니다.' },
          { text: '② 키를 커 보이게 하기 위해 세로 높이만 1.2배로 늘렸다.', correct: false, comment: '세로만 늘리면 직사각형의 모양이 달라져 닮음이 아닙니다.' },
          { text: '③ 대각선 방향으로 당겨 가로와 세로를 모두 1.5배로 균일하게 확대했다.', correct: true, comment: '정답입니다! 모든 방향으로 일정한 비율로 확대해야 닮음입니다.' },
          { text: '④ 사진의 윗부분은 그대로 두고 아랫부분만 사다리꼴 모양으로 늘렸다.', correct: false, comment: '모양이 완전히 달라집니다.' }
        ]
      },
      {
        id: 2,
        tag: '평면도형 성질',
        title: '미션 2. 닮은 두 평면도형의 성질',
        question: '두 삼각형 △ABC와 △DEF가 서로 닮음(△ABC ∽ △DEF)이고 닮음비가 1 : 2일 때, 옳은 설명은?',
        options: [
          { text: '① 대응하는 세 각의 크기도 각각 2배가 된다.', correct: false, comment: '주의! 도형이 커져도 각도의 크기는 변하지 않고 항상 같습니다.' },
          { text: '② 대응하는 변의 길이의 비는 모두 1 : 2로 일정하다.', correct: true, comment: '정답입니다! 대응변의 길이의 비가 바로 닮음비입니다.' },
          { text: '③ 삼각형의 넓이는 정확히 2배가 된다.', correct: false, comment: '넓이는 나중에 배우겠지만 2²=4배가 됩니다.' },
          { text: '④ 기호로 표기할 때 꼭짓점 순서는 상관없이 써도 된다.', correct: false, comment: '대응하는 점의 순서를 반드시 일치시켜 적어야 합니다.' }
        ]
      },
      {
        id: 3,
        tag: '입체도형 탐구',
        title: '미션 3. 입체도형의 닮음 성질',
        question: '서로 닮은 두 직육면체 A와 B에 대한 설명으로 옳지 않은 것은?',
        options: [
          { text: '① 대응하는 모든 모서리의 길이의 비는 일정하다.', correct: false, comment: '이것은 옳은 설명입니다.' },
          { text: '② 대응하는 모든 면(직사각형)은 서로 닮은 도형이다.', correct: false, comment: '이것은 옳은 설명입니다.' },
          { text: '③ 밑면의 가로·세로만 2배로 늘리고 높이는 그대로 두어도 닮음이다.', correct: true, comment: '정답(옳지 않은 것)! 모든 방향의 모서리가 같은 비율로 커져야 입체도형의 닮음입니다.' },
          { text: '④ 두 직육면체는 한 입체를 일정한 비율로 확대 또는 축소하면 다른 입체와 포갤 수 있다.', correct: false, comment: '이것은 입체도형 닮음의 정의입니다.' }
        ]
      }
    ];

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 0.5rem;">🎯 수업 마무리 도전! 닮음 퀴즈 미션</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem;">오늘 웹 앱에서 직접 조작하며 발견한 평면·입체도형 닮음의 핵심 원리를 퀴즈로 점검해보세요.</p>
      </div>
      <div class="missions-grid">
        ${this.missions.map(m => this.renderCard(m)).join('')}
      </div>
    `;

    this.bindEvents();
  }

  renderCard(mission) {
    return `
      <div class="mission-card" data-mission-id="${mission.id}">
        <div>
          <div class="mission-header">
            <span class="mission-tag">${mission.tag}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">형성평가</span>
          </div>
          <div class="mission-title">${mission.title}</div>
          <div class="mission-body">${mission.question}</div>
          <div class="options-group">
            ${mission.options.map((opt, idx) => `
              <button class="quiz-option" data-idx="${idx}">
                ${opt.text}
              </button>
            `).join('')}
          </div>
        </div>
        <div class="feedback-msg" style="margin-top: 1rem; font-size: 0.85rem; display: none; padding: 0.75rem; border-radius: var(--radius-md);"></div>
      </div>
    `;
  }

  bindEvents() {
    this.container.querySelectorAll('.mission-card').forEach(card => {
      const missionId = parseInt(card.dataset.missionId);
      const mission = this.missions.find(m => m.id === missionId);
      const buttons = card.querySelectorAll('.quiz-option');
      const feedback = card.querySelector('.feedback-msg');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx);
          const opt = mission.options[idx];

          buttons.forEach(b => {
            b.classList.remove('correct', 'wrong');
            b.disabled = true;
          });

          if (opt.correct) {
            btn.classList.add('correct');
            feedback.style.display = 'block';
            feedback.style.background = 'var(--success-light)';
            feedback.style.color = '#065f46';
            feedback.innerHTML = `<b>🎉 정답입니다!</b> ${opt.comment}`;
          } else {
            btn.classList.add('wrong');
            // highlight the correct one
            const correctIdx = mission.options.findIndex(o => o.correct);
            if (buttons[correctIdx]) buttons[correctIdx].classList.add('correct');
            feedback.style.display = 'block';
            feedback.style.background = 'var(--danger-light)';
            feedback.style.color = '#991b1b';
            feedback.innerHTML = `<b>다시 생각해볼까요?</b> ${opt.comment}`;
          }
        });
      });
    });
  }
}

// Export
window.MissionsLab = MissionsLab;
