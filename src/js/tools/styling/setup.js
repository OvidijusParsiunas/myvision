import { rightSideBar, leftSideBar } from './styling';

let canvasWrapperParentElement = null;
let zoomOverflowWrapperParentElement = null;

function findElements() {
  canvasWrapperParentElement = document.getElementById('canvas-wrapper-parent');
  zoomOverflowWrapperParentElement = document.getElementById('zoom-overflow-wrapper-parent');
}

// this will be used to resize the side-bars later on
// function addPropertiesToElements() {
//   // remove this if the initial flashing will be too much to take in
//   canvasWrapperParentElement.style.width = `calc(100% - ${rightSideBar.width + leftSideBar.width}px)`;
//   // could be the reason for uneven results
//   zoomOverflowWrapperParentElement.style.width = `calc(100% - ${rightSideBar.width + leftSideBar.width + 1}px)`;
//   canvasWrapperParentElement.style.left = `${leftSideBar.width}px`;
//   zoomOverflowWrapperParentElement.style.left = `${leftSideBar.width}px`;
// }

function initialiseWindowLayoutSetup() {
  findElements();
  // addPropertiesToElements();
}

export { initialiseWindowLayoutSetup as default };
