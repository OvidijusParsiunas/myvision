import { getSettingsPopUpOpenState, setSettingsPopUpOpenState } from '../facadeWorkersUtils/stateManager';

function calculateElementOffset(el) {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

function toggleSettingsPopUp() {
  const settingsPopupElement = document.getElementById('settings-popup');
  const settingsButton = document.getElementById('settingsButton');
  if (!getSettingsPopUpOpenState()) {
    const divOffset = calculateElementOffset(settingsButton);
    settingsPopupElement.style.top = `${divOffset.top}px`;
    settingsPopupElement.style.left = '65px';
    settingsPopupElement.style.display = '';
    setSettingsPopUpOpenState(true);
  } else {
    settingsPopupElement.style.display = 'none';
    setSettingsPopUpOpenState(false);
  }
}

export { toggleSettingsPopUp as default };
