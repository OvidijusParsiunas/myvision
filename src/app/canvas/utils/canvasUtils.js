import IS_FIREFOX from '../../tools/utils/browserType.js';

let canvasElement1Displaying = true;
let oldCanvas = null;
let canvas = null;
let canvasContainerElement1 = null;
let canvasContainerElement2 = null;
let currentCanvasContainerElement = null;
let timeoutMilliseconds = 0;

function getCurrentCanvasContainerElement() {
  return currentCanvasContainerElement;
}

function switchCurrentCanvasContainerElement() {
  currentCanvasContainerElement = canvasElement1Displaying
    ? canvasContainerElement2 : canvasContainerElement1;
}

function switchCanvasContainerElementsStyle() {
  setTimeout(() => {
    if (canvasElement1Displaying) {
      canvasContainerElement1.style.display = 'none';
      canvasContainerElement2.style.display = '';
      canvasContainerElement1.style.left = '50%';
      canvasContainerElement1.style.top = '50%';
      canvasElement1Displaying = false;
    } else {
      canvasContainerElement1.style.display = '';
      canvasContainerElement2.style.display = 'none';
      canvasContainerElement2.style.left = '50%';
      canvasContainerElement2.style.top = '50%';
      canvasElement1Displaying = true;
    }
    oldCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    oldCanvas.clear();
  }, timeoutMilliseconds);
}

// if for some reason the performance of switching/uploading images slows down, can
// always switch back to the original implementation of setting canvas elements
// Apr 23, 2020 - c33d736b928b9590c28ebd48f882cb2a6fac51aa
function switchCanvasContainerElements() {
  switchCanvasContainerElementsStyle();
  switchCurrentCanvasContainerElement();
}

function enableActiveObjectsAppearInFront() {
  canvas.preserveObjectStacking = false;
}

function preventActiveObjectsAppearInFront() {
  if (canvas) { canvas.preserveObjectStacking = true; }
}

function assignNewCanvasForUtils(newCanvasObj) {
  oldCanvas = canvas;
  canvas = newCanvasObj;
}

function assignTimeoutMillisecondsDependingOnBrowser() {
  timeoutMilliseconds = IS_FIREFOX ? 12 : 0;
}

function assignCanvasForUtils(canvasObj) {
  canvas = canvasObj;
  canvas.randomProperty = 'test';
  canvasContainerElement1 = document.getElementById('canvas-absolute-container-1');
  canvasContainerElement2 = document.getElementById('canvas-absolute-container-2');
  currentCanvasContainerElement = canvasContainerElement1;
  assignTimeoutMillisecondsDependingOnBrowser();
}

export {
  assignCanvasForUtils, enableActiveObjectsAppearInFront, getCurrentCanvasContainerElement,
  preventActiveObjectsAppearInFront, switchCanvasContainerElements, assignNewCanvasForUtils,
};
