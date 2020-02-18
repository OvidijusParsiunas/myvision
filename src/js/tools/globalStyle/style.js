import downloadFonts from './fonts';

let canvasWrapperParentElement = null;
let zoomOverflowWrapperParentElement = null;
let leftSideBar = null;
let rightSideBar = null;

// this will be used to resize the side-bars later on
function changeCanvasElementsWidth() {
  canvasWrapperParentElement.style.width = `calc(100% - ${rightSideBar.width + leftSideBar.width}px)`;
  // could be the reason for uneven results
  zoomOverflowWrapperParentElement.style.width = `calc(100% - ${rightSideBar.width + leftSideBar.width + 1}px)`;
}

function getLeftSideBarWidth() {
  return leftSideBar.offsetWidth;
}

function getRightSideBarWidth() {
  return rightSideBar.offsetWidth;
}

function findWindowElements() {
  canvasWrapperParentElement = document.getElementById('canvas-wrapper-parent');
  zoomOverflowWrapperParentElement = document.getElementById('zoom-overflow-wrapper-parent');
  leftSideBar = document.getElementById('right-side-bar');
  rightSideBar = document.getElementById('left-side-bar');
}

function initialiseGlobalStyleSetup() {
  findWindowElements();
  downloadFonts();
}

function getFirefoxScrollBarWidth() {
  // create a div with the scroll
  const div = document.createElement('div');
  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';
  document.body.append(div);
  const browserScrollWidth = div.offsetWidth - div.clientWidth;
  div.remove();
  return browserScrollWidth / 2;
}

function getChromiumScrollBarWidth() {
  return 6;
}

function isFirefox() {
  return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

function getScrollbarWidth() {
  if (isFirefox()) {
    return getFirefoxScrollBarWidth();
  }
  return getChromiumScrollBarWidth();
}

export {
  initialiseGlobalStyleSetup, changeCanvasElementsWidth,
  getLeftSideBarWidth, getRightSideBarWidth, getScrollbarWidth,
};
