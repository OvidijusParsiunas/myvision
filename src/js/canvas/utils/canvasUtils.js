let displaying = true;
let oldCanvas = null;
let canvas = null;
let canvasElement = null;
let canvasElement2 = null;

function assignCanvasForUtils(canvasObj) {
  canvas = canvasObj;
  canvas.randomProperty = 'test';
  canvasElement = document.getElementById('canvas-wrapper-inner');
  canvasElement2 = document.getElementById('canvas-wrapper-inner2');
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
    if (displaying) {
      canvasElement.style.left = '50%';
      canvasElement.style.top = '50%';
      canvasElement2.style.display = '';
      canvasElement.style.display = 'none';
      displaying = false;
    } else {
      canvasElement.style.display = '';
      canvasElement2.style.display = 'none';
      canvasElement2.style.left = '50%';
      canvasElement2.style.top = '50%';
      displaying = true;
    }
    oldCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    oldCanvas.clear();
  }, 0);
}

export {
  assignCanvasForUtils, enableActiveObjectsAppearInFront, assignNewCanvasForUtils,
  preventActiveObjectsAppearInFront, switchCanvasWrapperInnerElementsDisplay,
};
