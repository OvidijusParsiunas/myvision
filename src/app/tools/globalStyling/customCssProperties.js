import { getActiveLanguage } from '../text/languages/language';

let screenSizeDelta = 1;

// when setting delta to bigger than 1.1, will need to consider zoom,
// image thumbnail width, left side bar border,
// labeller modal options width and modal buttons height

// delta uses screen width only
function calculateDesiredScreenSizeDelta() {
  const defaultScreenWidth = 1920;
  const currentScreenWidth = window.screen.width;
  const quotient = defaultScreenWidth / currentScreenWidth;
  return quotient > 1.1 ? 1.1 : quotient;
}

function getScreenSizeDelta() {
  return screenSizeDelta;
}

function setScreenSizeDelta() {
  screenSizeDelta = calculateDesiredScreenSizeDelta();
  document.documentElement.style.setProperty('--screen-size-delta', screenSizeDelta);
  return screenSizeDelta;
}

function setLanguageFontDelta() {
  const modalButtonFontDelta = screenSizeDelta > 1 && getActiveLanguage() === 'EN' ? 0 : 1;
  const popupButtonFontDelta = screenSizeDelta > 1 && getActiveLanguage() === 'EN' ? 0 : 1.5;
  document.documentElement.style.setProperty('--modal-button-font-delta', `${modalButtonFontDelta}px`);
  document.documentElement.style.setProperty('--popup-button-font-delta', `${popupButtonFontDelta}px`);
}

export { setScreenSizeDelta, getScreenSizeDelta, setLanguageFontDelta };
