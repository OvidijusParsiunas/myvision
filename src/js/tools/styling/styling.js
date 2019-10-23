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

function initialiseWindowLayoutSetup() {
  findWindowElements();
}

export {
  initialiseWindowLayoutSetup, changeCanvasElementsWidth, getLeftSideBarWidth, getRightSideBarWidth,
};
