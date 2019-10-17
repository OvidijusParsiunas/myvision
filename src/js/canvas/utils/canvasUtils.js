let canvasElement1Displaying = true;
let oldCanvas = null;
let canvas = null;
let canvasElement1 = null;
let canvasElement2 = null;
let timeoutMilliseconds = 0;

function isFirefox() {
  if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    return true;
  }
  return false;
}

function assignTimeoutMillisecondsDependingOnBrowser() {
  timeoutMilliseconds = isFirefox() ? 12 : 0;
}

function assignCanvasForUtils(canvasObj) {
  canvas = canvasObj;
  canvas.randomProperty = 'test';
  canvasElement1 = document.getElementById('canvas-wrapper-inner');
  canvasElement2 = document.getElementById('canvas-wrapper-inner2');
  assignTimeoutMillisecondsDependingOnBrowser();
}

function enableActiveObjectsAppearInFront(canvas) {
  canvas.preserveObjectStacking = false;
}

function assignNewCanvasForUtils(newCanvasObj) {
  oldCanvas = canvas;
  canvas = newCanvasObj;
}

function preventActiveObjectsAppearInFront(canvas) {
  if (canvas) {
    canvas.preserveObjectStacking = true;
  }
}

function switchCanvasWrapperInnerElementsDisplay() {
  setTimeout(() => {
    if (canvasElement1Displaying) {
      canvasElement1.style.display = 'none';
      canvasElement2.style.display = '';
      canvasElement1.style.left = '50%';
      canvasElement1.style.top = '50%';
      canvasElement1Displaying = false;
    } else {
      canvasElement1.style.display = '';
      canvasElement2.style.display = 'none';
      canvasElement2.style.left = '50%';
      canvasElement2.style.top = '50%';
      canvasElement1Displaying = true;
    }
    oldCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    oldCanvas.clear();
  }, timeoutMilliseconds);
}

export {
  assignCanvasForUtils, enableActiveObjectsAppearInFront, assignNewCanvasForUtils,
  preventActiveObjectsAppearInFront, switchCanvasWrapperInnerElementsDisplay,
};
