/**
 * Starmix Similarity Lab - Main Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Modules
  let introLab = null;
  let planeLab = null;
  let solidLab = null;
  let missionsLab = null;

  try {
    introLab = new window.IntroLab();
  } catch (e) {
    console.error('IntroLab init error:', e);
  }

  try {
    planeLab = new window.PlaneLab('planeCanvas');
  } catch (e) {
    console.error('PlaneLab init error:', e);
  }

  try {
    solidLab = new window.SolidLab('threeCanvas');
  } catch (e) {
    console.error('SolidLab init error:', e);
  }

  try {
    missionsLab = new window.MissionsLab('missionsContainer', 'textbookQuizContainer');
  } catch (e) {
    console.error('MissionsLab init error:', e);
  }

  // Tab Switching
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');

        // Refresh canvas geometry on tab change
        if (targetId === 'tab-intro' && introLab) {
          setTimeout(() => introLab.updateAvatar(), 50);
        } else if (targetId === 'tab-plane' && planeLab) {
          setTimeout(() => planeLab.resizeCanvas(), 50);
        } else if (targetId === 'tab-solid' && solidLab) {
          setTimeout(() => {
            solidLab.onWindowResize();
            solidLab.selectFace(solidLab.selectedFace || 'front');
          }, 50);
        } else if (targetId === 'tab-missions' && missionsLab) {
          setTimeout(() => missionsLab.initMission1Canvas(), 50);
        }
      }
    });
  });

  // Fullscreen Toggle
  const fullscreenBtn = document.getElementById('btnFullscreen');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.warn(`Fullscreen error: ${err.message}`);
        });
        fullscreenBtn.innerHTML = '⛶ 전체화면 종료';
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          fullscreenBtn.innerHTML = '⛶ 전체화면';
        }
      }
    });
  }

  // Help Modal Toggle
  const helpBtn = document.getElementById('btnHelp');
  const helpModal = document.getElementById('helpModal');
  const closeHelpBtn = document.getElementById('btnCloseHelp');

  if (helpBtn && helpModal) {
    helpBtn.addEventListener('click', () => {
      helpModal.classList.add('open');
    });
  }

  if (closeHelpBtn && helpModal) {
    closeHelpBtn.addEventListener('click', () => {
      helpModal.classList.remove('open');
    });
  }

  if (helpModal) {
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        helpModal.classList.remove('open');
      }
    });
  }
});
