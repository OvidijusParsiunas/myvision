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

export { setScreenSizeDelta, getScreenSizeDelta };
