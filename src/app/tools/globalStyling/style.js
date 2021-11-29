import downloadFonts from './fonts.js';
import IS_FIREFOX from '../utils/browserType.js';
import { setScreenSizeDelta } from './screenSizeDelta.js';
import { setKeyDownEventTimeOut } from './timeouts.js';
import setButtonsStyle from './buttons/style.js';
import validateClientBrowserDimensions from './inadequateResourcesOverlay.js';

let canvasWrapperParentElement = null;
let zoomOverflowWrapperParentElement = null;
let leftSideBar = null;
let rightSideBar = null;

function windowHasScrollbar() {
  return document.body.scrollHeight < document.documentElement.scrollHeight;
}

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
  leftSideBar = document.getElementById('left-side-bar');
  rightSideBar = document.getElementById('right-side-bar');
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

function getScrollbarWidth() {
  if (IS_FIREFOX) {
    return getFirefoxScrollBarWidth();
  }
  return getChromiumScrollBarWidth();
}

function applyStyling() {
  validateClientBrowserDimensions();
  findWindowElements();
  downloadFonts();
  const screenSizeDelta = setScreenSizeDelta();
  setButtonsStyle(screenSizeDelta);
  setKeyDownEventTimeOut(IS_FIREFOX);
}

export {
  applyStyling, changeCanvasElementsWidth, windowHasScrollbar,
  getLeftSideBarWidth, getRightSideBarWidth, getScrollbarWidth,
};
