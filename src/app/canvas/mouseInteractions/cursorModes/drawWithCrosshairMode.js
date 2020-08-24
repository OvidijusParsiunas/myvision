import fabric from 'fabric';
import { getMovableObjectsState } from '../../../tools/state';

let canvasCrosshairLineX = null;
let canvasCrosshairLineY = null;
const crosshairXDelta = 0.3;
const crosshairYDelta = 0.7;

function setAllObjectsToUneditable(canvas) {
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = false;
    iteratedObj.hoverCursor = 'none';
  });
}

function resetObjectCrosshairCursors(canvas) {
  if (getMovableObjectsState()) {
    canvas.forEachObject((iteratedObj) => {
      iteratedObj.hoverCursor = null;
    });
  } else {
    canvas.forEachObject((iteratedObj) => {
      iteratedObj.hoverCursor = 'none';
    });
  }
  canvas.renderAll();
}

function drawFullCanvasCrosshair(event, canvas) {
  canvasCrosshairLineX.set({
    x1: event.pointer.x + crosshairYDelta,
    x2: event.pointer.x + crosshairYDelta,
  });
  canvasCrosshairLineY.set({
    y1: event.pointer.y - crosshairXDelta,
    y2: event.pointer.y - crosshairXDelta,
  });
  canvas.renderAll();
}

function removeCanvasCrosshair(canvas) {
  canvasCrosshairLineX.set({ x1: -10, x2: -10, y2: canvas.height });
  canvasCrosshairLineY.set({ y1: -10, y2: -10, x2: canvas.width });
  canvas.renderAll();
}

function newCrosshairLine() {
  return new fabric.Line([0, 0, 0, 0], {
    fill: 'white',
    stroke: 'white',
    strokeWidth: 1,
    selectable: false,
    evented: false,
  });
}

function addCanvasCrosshairLines(canvas) {
  canvasCrosshairLineX = newCrosshairLine();
  canvasCrosshairLineY = newCrosshairLine();
  canvas.add(canvasCrosshairLineX);
  canvas.add(canvasCrosshairLineY);
  removeCanvasCrosshair(canvas);
}

function addmouseMoveEventHandler(element, crosshairX, crosshairY) {
  element.addEventListener('mousemove', (event) => {
    const top = `${event.pageY - crosshairXDelta}px`;
    crosshairX.style.top = top;
    const left = `${event.pageX + crosshairYDelta}px`;
    crosshairY.style.left = left;
  });
}

// need to remove these event listeners later on
function addCrosshairOutsideOfCanvas() {
  const outsideCrossshairLineX = document.getElementById('crosshair-line-x');
  const outsideCrosshairLineV = document.getElementById('crosshair-line-v');
  addmouseMoveEventHandler(document.getElementById('canvas-absolute-container-2'), outsideCrossshairLineX, outsideCrosshairLineV);
  addmouseMoveEventHandler(document.getElementById('canvas-absolute-container-1'), outsideCrossshairLineX, outsideCrosshairLineV);
  // document.getElementById('zoom-overflow-wrapper-parent')
  // .addEventListener('mousemove', (event) => {
  //   // crosshair deltas
  //   const top = `${event.pageY}px`;
  //   outsideCrossshairLineX.style.top = top;
  //   const left = `${event.pageX}px`;
  //   outsideCrosshairLineV.style.left = left;
  // });
  // get UX help: one of the two, full crosshair in grey space or no crosshair in greenspace
  // with the crosshair being only in the canvas area
  // document.getElementById('zoom-overflow-wrapper-parent').style.cursor = 'none';
}

function removeCrosshairLinesIfExisting(canvas) {
  if (canvasCrosshairLineX) canvas.remove(canvasCrosshairLineX);
  if (canvasCrosshairLineY) canvas.remove(canvasCrosshairLineY);
}

function setDrawWithCrosshairMode(canvas) {
  canvas.discardActiveObject();
  setAllObjectsToUneditable(canvas);
  canvas.defaultCursor = 'none';
  canvas.hoverCursor = 'none';
  removeCrosshairLinesIfExisting(canvas);
  addCanvasCrosshairLines(canvas);
  addCrosshairOutsideOfCanvas();
  canvas.renderAll();
}

export {
  drawFullCanvasCrosshair, removeCanvasCrosshair,
  resetObjectCrosshairCursors, setDrawWithCrosshairMode,
};
