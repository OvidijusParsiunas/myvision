import fabric from 'fabric';
import { getMovableObjectsState } from '../../../tools/state';

let canvasCrosshairLineX = null;
let canvasCrosshairLineY = null;
const horizontalDelta = 0.3;
const verticalDelta = 0.7;

function resetObjectCursors(canvas) {
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

function moveCanvasCrosshair(event, canvas) {
  canvasCrosshairLineX.set({
    x1: event.pointer.x + verticalDelta,
    x2: event.pointer.x + verticalDelta,
  });
  canvasCrosshairLineY.set({
    y1: event.pointer.y - horizontalDelta,
    y2: event.pointer.y - horizontalDelta,
  });
  canvas.renderAll();
}

function removeCanvasCrosshair(canvas) {
  canvasCrosshairLineX.set({ x1: -10, x2: -10, y2: canvas.height });
  canvasCrosshairLineY.set({ y1: -10, y2: -10, x2: canvas.width });
  canvas.renderAll();
}

function newCanvasCrosshairLine() {
  return new fabric.Line([0, 0, 0, 0], {
    fill: 'white',
    stroke: 'white',
    strokeWidth: 1,
    selectable: false,
    evented: false,
  });
}

function addCanvasCrosshairLines(canvas) {
  canvasCrosshairLineX = newCanvasCrosshairLine();
  canvasCrosshairLineY = newCanvasCrosshairLine();
  canvas.add(canvasCrosshairLineX);
  canvas.add(canvasCrosshairLineY);
  removeCanvasCrosshair(canvas);
}

function addMouseMoveEventHandlerToElement(element, crosshairX, crosshairY) {
  element.addEventListener('mousemove', (event) => {
    const top = `${event.pageY - horizontalDelta}px`;
    crosshairX.style.top = top;
    const left = `${event.pageX + verticalDelta}px`;
    crosshairY.style.left = left;
  });
}

// need to remove these event listeners later on
function addCrosshairOutsideOfCanvas() {
  const outsideCrossshairLineX = document.getElementById('crosshair-line-x');
  const outsideCrosshairLineV = document.getElementById('crosshair-line-v');
  addMouseMoveEventHandlerToElement(document.getElementById('canvas-absolute-container-2'), outsideCrossshairLineX, outsideCrosshairLineV);
  addMouseMoveEventHandlerToElement(document.getElementById('canvas-absolute-container-1'), outsideCrossshairLineX, outsideCrosshairLineV);
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

function setAllObjectsToUneditable(canvas) {
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = false;
    iteratedObj.hoverCursor = 'none';
  });
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
  moveCanvasCrosshair, removeCanvasCrosshair,
  setDrawWithCrosshairMode, resetObjectCursors,
};
