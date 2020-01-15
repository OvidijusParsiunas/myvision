import { getSettingsPopUpOpenState, setSettingsPopUpOpenState } from '../facadeWorkersUtils/stateManager';

function windowHasScrollbar() {
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

function displayPopUp(settingsPopupElement) {
  settingsPopupElement.style.display = '';
}

function hidePopUp(settingsPopupElement) {
  settingsPopupElement.style.display = 'none';
}

function calculateElementOffset(el) {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

function setPopUpPosition(settingsButton, settingsPopupElement) {
  const divOffset = calculateElementOffset(settingsButton);
  settingsPopupElement.style.top = `${divOffset.top}px`;
  settingsPopupElement.style.left = '65px';
}

function toggleSettingsPopUp() {
  const settingsPopupElement = document.getElementById('settings-popup');
  const settingsButton = document.getElementById('settingsButton');
  if (!getSettingsPopUpOpenState()) {
    setPopUpPosition(settingsButton, settingsPopupElement);
    displayPopUp(settingsPopupElement);
    validateFullPopUpVisible(settingsPopupElement);
    setSettingsPopUpOpenState(true);
  } else {
    hidePopUp(settingsPopupElement);
    setSettingsPopUpOpenState(false);
  }
}

export { toggleSettingsPopUp as default };
