/**
 * Starmix Similarity Lab - Smartphone Photo Lab (도입 활동 모듈 v2.2)
 * Robust drag-handle, slider controls, hilarious avatar facial expressions,
 * and clear side-by-side Polaroid comparison cards.
 */

class IntroLab {
  constructor() {
    this.container = document.getElementById('tab-intro');
    if (!this.container) return;

    this.scaleX = 1.0;
    this.scaleY = 1.0;

    this.init();
  }

  init() {
    this.setupControls();
    this.updateAvatar();
  }

  setupControls() {
    const sliderX = document.getElementById('photoScaleX');
    const sliderY = document.getElementById('photoScaleY');
    const valX = document.getElementById('photoScaleXVal');
    const valY = document.getElementById('photoScaleYVal');

    const btnWidthStretch = document.getElementById('btnPhotoWidthStretch');
    const btnUniformZoom = document.getElementById('btnPhotoUniformZoom');
    const btnResetPhoto = document.getElementById('btnResetPhoto');

    const photoOptionA = document.getElementById('photoOptionA');
    const photoOptionB = document.getElementById('photoOptionB');
    const quizFeedback = document.getElementById('photoQuizFeedback');
    const btnGoToPlane = document.getElementById('btnGoToPlane');

    if (sliderX && sliderY) {
      sliderX.addEventListener('input', (e) => {
        this.scaleX = parseFloat(e.target.value);
        if (valX) valX.textContent = `${this.scaleX.toFixed(1)}배`;
        this.updateAvatar();
      });

      sliderY.addEventListener('input', (e) => {
        this.scaleY = parseFloat(e.target.value);
        if (valY) valY.textContent = `${this.scaleY.toFixed(1)}배`;
        this.updateAvatar();
      });
    }

    if (btnWidthStretch) {
      btnWidthStretch.addEventListener('click', () => {
        this.setScale(2.2, 1.0);
      });
    }

    if (btnUniformZoom) {
      btnUniformZoom.addEventListener('click', () => {
        this.setScale(1.6, 1.6);
      });
    }

    if (btnResetPhoto) {
      btnResetPhoto.addEventListener('click', () => {
        this.setScale(1.0, 1.0);
      });
    }

    // Photo Option Click Handlers
    if (photoOptionA && photoOptionB && quizFeedback) {
      photoOptionA.addEventListener('click', () => {
        photoOptionA.style.borderColor = '#ef4444';
        photoOptionA.style.background = '#fef2f2';
        photoOptionB.style.borderColor = 'var(--border-color)';
        photoOptionB.style.background = '#ffffff';

        quizFeedback.style.display = 'block';
        quizFeedback.className = 'feedback-alert error';
        quizFeedback.innerHTML = `
          <b>❌ 아쉬워요! 사진 A는 원래 모양이 왜곡되었어요.</b><br>
          가로로만 2배 이상 늘어나 얼굴이 넙데데해졌고 원래의 각도와 비율이 깨졌습니다.<br>
          이것은 수학에서 <b>"닮음이 아닙니다"</b>!
        `;
      });

      photoOptionB.addEventListener('click', () => {
        photoOptionB.style.borderColor = '#10b981';
        photoOptionB.style.background = '#f0fdf4';
        photoOptionA.style.borderColor = 'var(--border-color)';
        photoOptionA.style.background = '#ffffff';

        quizFeedback.style.display = 'block';
        quizFeedback.className = 'feedback-alert success';
        quizFeedback.innerHTML = `
          <b>🎉 완벽한 정답입니다! 사진 B가 바로 수학의 "닮음"입니다!</b><br>
          대각선 방향으로 가로와 세로를 <b>모두 똑같은 비율</b>로 키웠기 때문에, 크기만 커졌을 뿐 원래 얼굴의 모양과 각도가 완벽히 보존되었습니다.<br>
          👉 <b>"한 도형을 일정한 비율로 확대하거나 축소하여 모양이 변하지 않는 관계"</b>, 이것이 바로 오늘 배울 <b>도형의 닮음</b>입니다!
        `;
        if (btnGoToPlane) btnGoToPlane.style.display = 'inline-flex';
      });
    }

    if (btnGoToPlane) {
      btnGoToPlane.addEventListener('click', () => {
        const planeTabBtn = document.querySelector('.tab-btn[data-tab="tab-plane"]');
        if (planeTabBtn) planeTabBtn.click();
      });
    }
  }

  setScale(x, y) {
    this.scaleX = x;
    this.scaleY = y;

    const sliderX = document.getElementById('photoScaleX');
    const sliderY = document.getElementById('photoScaleY');
    const valX = document.getElementById('photoScaleXVal');
    const valY = document.getElementById('photoScaleYVal');

    if (sliderX) sliderX.value = x;
    if (sliderY) sliderY.value = y;
    if (valX) valX.textContent = `${x.toFixed(1)}배`;
    if (valY) valY.textContent = `${y.toFixed(1)}배`;

    this.updateAvatar();
  }

  updateAvatar() {
    const avatar = document.getElementById('interactiveAvatar');
    const statusBadge = document.getElementById('photoRatioStatus');
    const descText = document.getElementById('photoStatusDesc');
    const liveScaleTag = document.getElementById('photoLiveScaleTag');

    if (avatar) {
      avatar.style.transform = `scale(${this.scaleX}, ${this.scaleY})`;
    }

    if (liveScaleTag) {
      liveScaleTag.textContent = `가로 ${this.scaleX.toFixed(1)}배 × 세로 ${this.scaleY.toFixed(1)}배`;
    }

    const isUniform = Math.abs(this.scaleX - this.scaleY) < 0.05;
    const isOriginal = Math.abs(this.scaleX - 1.0) < 0.05 && Math.abs(this.scaleY - 1.0) < 0.05;

    if (statusBadge && descText) {
      if (isOriginal) {
        statusBadge.className = 'badge-similarity yes';
        statusBadge.innerHTML = `★ 원본 사진 (비율 1 : 1)`;
        descText.textContent = '스마트폰 사진의 가로 또는 세로를 늘려보며 얼굴 모양이 어떻게 변하는지 확인해보세요!';
      } else if (isUniform) {
        statusBadge.className = 'badge-similarity yes';
        statusBadge.innerHTML = `✓ 정비율 확대 (가로 ${this.scaleX.toFixed(1)}배 = 세로 ${this.scaleY.toFixed(1)}배)`;
        descText.innerHTML = '<b>😊 편안함!</b> 가로와 세로가 똑같이 늘어나 원래 얼굴 모양과 비율이 완벽히 유지됩니다. (수학적 <b>닮음</b>)';
      } else if (this.scaleX > this.scaleY) {
        statusBadge.className = 'badge-similarity no';
        statusBadge.innerHTML = `✗ 가로 왜곡 발생! (가로 ${this.scaleX.toFixed(1)}배 > 세로 ${this.scaleY.toFixed(1)}배)`;
        descText.innerHTML = '<b>😱 넙데데!</b> 가로로만 늘어나 얼굴이 옆으로 펑퍼짐해졌습니다. 비율이 깨져 닮음이 아닙니다!';
      } else {
        statusBadge.className = 'badge-similarity no';
        statusBadge.innerHTML = `✗ 세로 왜곡 발생! (세로 ${this.scaleY.toFixed(1)}배 > 가로 ${this.scaleX.toFixed(1)}배)`;
        descText.innerHTML = '<b>😲 길쭉길쭉!</b> 세로로만 늘어나 얼굴이 과도하게 길어졌습니다. 닮음이 아닙니다!';
      }
    }
  }
}

// Export
window.IntroLab = IntroLab;
