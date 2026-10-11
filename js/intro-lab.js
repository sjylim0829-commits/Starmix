/**
 * Starmix Similarity Lab - Smartphone Photo Lab (도입 활동 모듈)
 * Youngseo Middle School Grade 2 Class 7 Lesson Plan Alignment
 */

class IntroLab {
  constructor() {
    this.container = document.getElementById('tab-intro');
    if (!this.container) return;

    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.currentMode = 'custom'; // 'widthOnly', 'uniform', 'custom'

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
        this.scaleX = 2.2;
        this.scaleY = 1.0;
        if (sliderX) sliderX.value = 2.2;
        if (sliderY) sliderY.value = 1.0;
        if (valX) valX.textContent = '2.2배';
        if (valY) valY.textContent = '1.0배';
        this.updateAvatar();
      });
    }

    if (btnUniformZoom) {
      btnUniformZoom.addEventListener('click', () => {
        this.scaleX = 1.6;
        this.scaleY = 1.6;
        if (sliderX) sliderX.value = 1.6;
        if (sliderY) sliderY.value = 1.6;
        if (valX) valX.textContent = '1.6배';
        if (valY) valY.textContent = '1.6배';
        this.updateAvatar();
      });
    }

    if (btnResetPhoto) {
      btnResetPhoto.addEventListener('click', () => {
        this.scaleX = 1.0;
        this.scaleY = 1.0;
        if (sliderX) sliderX.value = 1.0;
        if (sliderY) sliderY.value = 1.0;
        if (valX) valX.textContent = '1.0배';
        if (valY) valY.textContent = '1.0배';
        this.updateAvatar();
      });
    }

    // Quiz Options (사진 A vs 사진 B)
    if (photoOptionA && photoOptionB && quizFeedback) {
      photoOptionA.addEventListener('click', () => {
        photoOptionA.classList.add('wrong');
        photoOptionB.classList.remove('wrong', 'correct');
        quizFeedback.style.display = 'block';
        quizFeedback.className = 'feedback-alert error';
        quizFeedback.innerHTML = `
          <b>❌ 아쉬워요! 사진 A는 모양이 왜곡되었어요.</b><br>
          가로로만 2배 늘어나 얼굴이 넙데데해졌고, 원래 얼굴의 비율과 각도가 깨졌습니다. 이것은 수학에서 <b>닮음이 아닙니다</b>!
        `;
      });

      photoOptionB.addEventListener('click', () => {
        photoOptionB.classList.add('correct');
        photoOptionA.classList.remove('wrong', 'correct');
        quizFeedback.style.display = 'block';
        quizFeedback.className = 'feedback-alert success';
        quizFeedback.innerHTML = `
          <b>🎉 정답입니다! 사진 B가 진짜 "도형의 닮음"입니다!</b><br>
          대각선 방향으로 가로와 세로를 <b>모두 같은 비율</b>로 키웠기 때문에, 크기만 커졌을 뿐 원래 얼굴의 모양과 각도가 그대로 유지되었습니다.<br>
          👉 <b>"한 도형을 일정한 비율로 확대하거나 축소하여 모양이 변하지 않는 것"</b>, 이것이 바로 오늘 배울 <b>닮음</b>입니다!
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

  updateAvatar() {
    const avatar = document.getElementById('interactiveAvatar');
    const statusText = document.getElementById('photoRatioStatus');
    const descText = document.getElementById('photoStatusDesc');

    if (avatar) {
      avatar.style.transform = `scale(${this.scaleX}, ${this.scaleY})`;
    }

    const isUniform = Math.abs(this.scaleX - this.scaleY) < 0.05;

    if (statusText && descText) {
      if (Math.abs(this.scaleX - 1.0) < 0.05 && Math.abs(this.scaleY - 1.0) < 0.05) {
        statusText.className = 'badge-similarity yes';
        statusText.innerHTML = `★ 원본 사진 (비율 1 : 1)`;
        descText.textContent = '스마트폰 사진의 가로 또는 세로를 늘려보며 얼굴 모양이 어떻게 변하는지 확인해보세요!';
      } else if (isUniform) {
        statusText.className = 'badge-similarity yes';
        statusText.innerHTML = `✓ 정비율 확대 (가로 ${this.scaleX.toFixed(1)}배, 세로 ${this.scaleY.toFixed(1)}배)`;
        descText.innerHTML = '<b>😊 편안함!</b> 가로와 세로가 똑같이 늘어나 원래 얼굴 모양과 비율이 완벽히 유지됩니다. (수학적 <b>닮음</b>)';
      } else if (this.scaleX > this.scaleY) {
        statusText.className = 'badge-similarity no';
        statusText.innerHTML = `✗ 가로 왜곡 발생! (가로 ${this.scaleX.toFixed(1)}배 > 세로 ${this.scaleY.toFixed(1)}배)`;
        descText.innerHTML = '<b>😱 넙데데!</b> 가로로만 늘어나 얼굴이 옆으로 펑퍼짐해졌습니다. 비율이 깨져 닮음이 아닙니다!';
      } else {
        statusText.className = 'badge-similarity no';
        statusText.innerHTML = `✗ 세로 왜곡 발생! (세로 ${this.scaleY.toFixed(1)}배 > 가로 ${this.scaleX.toFixed(1)}배)`;
        descText.innerHTML = '<b>😲 길쭉길쭉!</b> 세로로만 늘어나 얼굴이 과도하게 길어졌습니다. 닮음이 아닙니다!';
      }
    }
  }
}

// Export
window.IntroLab = IntroLab;
