let delta = 1;

// when setting delta to bigger than 1.1, will need to consider zoom,
// image thumbnail width and left side bar border

// delta uses screen width only
function calculateDesiredScreenSizeDelta() {
  const defaultScreenWidth = 1920;
  const currentScreenWidth = window.screen.width;
  const quotient = defaultScreenWidth / currentScreenWidth;
  return quotient > 1.1 ? 1.1 : quotient;
}

function getDelta() {
  return delta;
}

function applyElementDimensions() {
  delta = calculateDesiredScreenSizeDelta();
  document.documentElement.style.setProperty('--screen-size-delta', delta);
}

export { applyElementDimensions, getDelta };
