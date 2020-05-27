import applyElementDimensionsToLeftSideBar from './components/leftSideBar';
import applyElementDimensionsToRightSideBar from './components/rightSideBar/rightSideBar';
import applyElementDimensionsToImageSwitchPanel from './components/imageSwitchPanel';

let delta = 1;

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
  applyElementDimensionsToLeftSideBar(delta);
  applyElementDimensionsToRightSideBar(delta);
  applyElementDimensionsToImageSwitchPanel(delta);
}

export { applyElementDimensions, getDelta };
