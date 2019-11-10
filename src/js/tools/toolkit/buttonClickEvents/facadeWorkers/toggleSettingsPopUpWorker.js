import { getSettingsPopUpOpenState, setSettingsPopUpOpenState } from '../facadeWorkersUtils/stateManager';

function windowHasScrollbar() {
  // For most browsers
  if (typeof window.innerWidth === 'number') {
    return window.innerWidth > document.documentElement.clientWidth;
  }
  const rootElem = document.documentElement || document.body;
  let overflowStyle = null;
  if (typeof rootElem.currentStyle !== 'undefined') {
    overflowStyle = rootElem.currentStyle.overflow;
  }
  overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow;
  let overflowYStyle = null;
  if (typeof rootElem.currentStyle !== 'undefined') {
    overflowYStyle = rootElem.currentStyle.overflowY;
  }
  overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY;
  const contentOverflows = rootElem.scrollHeight > rootElem.clientHeight;
  const overflowShown = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle);
  const alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll';

  return (contentOverflows && overflowShown) || (alwaysShowScroll);
}

function validateFullPopUpVisible(popupLabelParentElement) {
  if (windowHasScrollbar()) {
    popupLabelParentElement.style.top = '';
    popupLabelParentElement.style.bottom = '5px';
  } else {
    popupLabelParentElement.style.bottom = '';
  }
}

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
    validateFullPopUpVisible(settingsPopupElement);
    setSettingsPopUpOpenState(true);
  } else {
    settingsPopupElement.style.display = 'none';
    setSettingsPopUpOpenState(false);
  }
}

export { toggleSettingsPopUp as default };
