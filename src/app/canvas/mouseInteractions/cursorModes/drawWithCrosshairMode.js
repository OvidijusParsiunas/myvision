import fabric from 'fabric';
import { getMovableObjectsState } from '../../../tools/state';

let crosshairLineX = null;
let crosshairLineY = null;

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
  const crosshairPixelDelta = 0.3;
  const crosshairPixelDelta2 = 0.7;
  crosshairLineX.set({
    x1: event.pointer.x + crosshairPixelDelta2,
    x2: event.pointer.x + crosshairPixelDelta2,
  });
  crosshairLineY.set({
    y1: event.pointer.y - crosshairPixelDelta,
    y2: event.pointer.y - crosshairPixelDelta,
  });
  canvas.renderAll();
}

function removeCanvasCrosshair(canvas) {
  crosshairLineX.set({ x1: -10, x2: -10, y2: canvas.height });
  crosshairLineY.set({ y1: -10, y2: -10, x2: canvas.width });
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
  crosshairLineX = newCrosshairLine();
  crosshairLineY = newCrosshairLine();
  canvas.add(crosshairLineX);
  canvas.add(crosshairLineY);
  removeCanvasCrosshair(canvas);
}

// need to remove these event listeners later on
function addCrosshairOutsideOfCanvas() {
  const corsshairLineX = document.getElementById('crosshair-line-x');
  const corsshairLineV = document.getElementById('crosshair-line-v');
  document.getElementById('zoom-overflow-wrapper-parent').addEventListener('mousemove', (event) => {
    const top = `${event.pageY}px`;
    corsshairLineX.style.top = top;
    const left = `${event.pageX}px`;
    corsshairLineV.style.left = left;
  });
  document.getElementById('canvas-absolute-container-2').addEventListener('mousemove', (event) => {
    const top = `${event.pageY - 0.3}px`;
    corsshairLineX.style.top = top;
    const left = `${event.pageX + 0.7}px`;
    corsshairLineV.style.left = left;
  });
  document.getElementById('canvas-absolute-container-1').addEventListener('mousemove', (event) => {
    const top = `${event.pageY - 0.3}px`;
    corsshairLineX.style.top = top;
    const left = `${event.pageX + 0.7}px`;
    corsshairLineV.style.left = left;
  });
}

function removeCrosshairLinesIfExisting(canvas) {
  if (crosshairLineX) canvas.remove(crosshairLineX);
  if (crosshairLineY) canvas.remove(crosshairLineY);
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
