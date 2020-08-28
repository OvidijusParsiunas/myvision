import fabric from 'fabric';
import { getIsMouseOnCanvasStatus, executeFunctionOnceOnMouseOver, executeFunctionOnMouseOut } from '../../../keyEvents/mouse/mouseOverOut';
import { getLastMouseMoveEvent } from '../../../keyEvents/mouse/mouseMove';

let canvasRef = null;
let canvasCrosshairLineX = null;
let canvasCrosshairLineY = null;
let outsideCrosshairLineXElement = null;
let outsideCrosshairLineYElement = null;
let canvasAbsolutelContainer1Element = null;
let canvasAbsolutelContainer2Element = null;

const HORIZONTAL_DELTA = 0.3;
const VERTICAL_DELTA = 0.7;

function moveCanvasCrosshair(event, canvas) {
  // the following check is used in the scenario where the mousemove event has been dispatched
  if (!event.pointer.x) return;
  canvasCrosshairLineX.set({
    x1: event.pointer.x + VERTICAL_DELTA,
    x2: event.pointer.x + VERTICAL_DELTA,
  });
  canvasCrosshairLineY.set({
    y1: event.pointer.y - HORIZONTAL_DELTA,
    y2: event.pointer.y - HORIZONTAL_DELTA,
  });
  canvas.renderAll();
}

function hideCanvasCrosshair(canvas) {
  if (!canvasCrosshairLineX || !canvasCrosshairLineY) return;
  canvasCrosshairLineX.set({ x1: -10, x2: -10, y2: canvas.height });
  canvasCrosshairLineY.set({ y1: -10, y2: -10, x2: canvas.width });
  canvas.renderAll();
}

function hideOutsideCrosshair() {
  if (!outsideCrosshairLineXElement || !outsideCrosshairLineYElement) return;
  outsideCrosshairLineXElement.style.top = '-10px';
  outsideCrosshairLineYElement.style.left = '-10px';
}

function hideCrosshair(canvas) {
  hideCanvasCrosshair(canvas || canvasRef);
  hideOutsideCrosshair();
}

function newCanvasCrosshairLine() {
  return new fabric.Line([0, 0, 0, 0], {
    fill: 'white',
    shapeName: 'crosshairLine',
    stroke: 'white',
    strokeWidth: 1,
    selectable: false,
    evented: false,
  });
}

function addCanvasCrosshairLines(canvas) {
  canvasCrosshairLineX = newCanvasCrosshairLine();
  canvasCrosshairLineY = newCanvasCrosshairLine();
  canvasCrosshairLineX.set({ orientation: 'x', y2: canvas.height });
  canvasCrosshairLineY.set({ orientation: 'y', x2: canvas.width });
  canvas.add(canvasCrosshairLineX);
  canvas.add(canvasCrosshairLineY);
  hideCanvasCrosshair(canvas);
}

function mouseMoveEventHandler(event) {
  // the following check is used in the scenario where the mousemove event has been dispatched
  if (!event.pageY) {
    event = getLastMouseMoveEvent();
  }
  outsideCrosshairLineXElement.style.top = `${event.pageY - HORIZONTAL_DELTA}px`;
  outsideCrosshairLineYElement.style.left = `${event.pageX + VERTICAL_DELTA}px`;
}

function removeMouseMoveEventListener(element) {
  if (element) element.removeEventListener('mousemove', mouseMoveEventHandler);
}

function removeOutsideCrosshairEventListeners() {
  removeMouseMoveEventListener(canvasAbsolutelContainer1Element);
  removeMouseMoveEventListener(canvasAbsolutelContainer2Element);
}

function addMouseMoveEventHandlerToElement(element) {
  element.addEventListener('mousemove', mouseMoveEventHandler);
}

// need to remove these event listeners later on
function addCrosshairOutsideOfCanvas() {
  addMouseMoveEventHandlerToElement(canvasAbsolutelContainer1Element);
  addMouseMoveEventHandlerToElement(canvasAbsolutelContainer2Element);
  // document.getElementById('zoom-overflow-wrapper-parent')
  // .addEventListener('mousemove', (event) => {
  //   // crosshair deltas
  //   const top = `${event.pageY}px`;
  //   outsideCrossshairLineX.style.top = top;
  //   const left = `${event.pageX}px`;
  //   outsideCrosshairLineYElement.style.left = left;
  // });
  // get UX help: one of the two, full crosshair in grey space or no crosshair in greenspace
  // with the crosshair being only in the canvas area
  // document.getElementById('zoom-overflow-wrapper-parent').style.cursor = 'none';
}

function removeCrosshairLinesIfExisting(canvas) {
  if (canvasCrosshairLineX) canvas.remove(canvasCrosshairLineX);
  if (canvasCrosshairLineY) canvas.remove(canvasCrosshairLineY);
}

function removeCrosshair(canvas) {
  removeCrosshairLinesIfExisting(canvas);
  hideOutsideCrosshair();
  removeOutsideCrosshairEventListeners();
}

function setAllObjectsToUneditable(canvas) {
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = false;
    iteratedObj.hoverCursor = 'none';
  });
}

function moveCanvasCrosshairViaLastCanvasPosition(canvas) {
  const lastMouseMoveEvent = getLastMouseMoveEvent();
  if (!lastMouseMoveEvent) return;
  const lastCanvasPointer = canvas.getPointer(lastMouseMoveEvent);
  const pointerEvent = { pointer: lastCanvasPointer };
  moveCanvasCrosshair(pointerEvent, canvas);
}

function moveCanvasCrosshairViaLastCanvasPositionAsync(canvas) {
  setTimeout(() => {
    moveCanvasCrosshairViaLastCanvasPosition(canvas || canvasRef);
  });
}

function moveCrosshair(canvas) {
  moveCanvasCrosshairViaLastCanvasPosition(canvas || canvasRef);
  if (!canvasAbsolutelContainer1Element) return;
  canvasAbsolutelContainer1Element.dispatchEvent(new Event('mousemove'));
  canvasAbsolutelContainer2Element.dispatchEvent(new Event('mousemove'));
}

function assignLocalVariables() {
  outsideCrosshairLineXElement = document.getElementById('crosshair-line-x');
  outsideCrosshairLineYElement = document.getElementById('crosshair-line-y');
  canvasAbsolutelContainer1Element = document.getElementById('canvas-absolute-container-1');
  canvasAbsolutelContainer2Element = document.getElementById('canvas-absolute-container-2');
}

function setDrawWithCrosshairMode(canvas, resetting) {
  canvasRef = canvas;
  assignLocalVariables();
  canvas.discardActiveObject();
  canvas.defaultCursor = 'none';
  canvas.hoverCursor = 'none';
  setAllObjectsToUneditable(canvas);
  // upon attempting to draw after labelling a shape, wait for the onmouseenter event
  // to be emitted by the canvas wrapper element
  if (resetting) {
    executeFunctionOnceOnMouseOver(moveCrosshair);
  } else {
    removeCrosshairLinesIfExisting(canvas);
    addCanvasCrosshairLines(canvas);
    addCrosshairOutsideOfCanvas();
    if (getIsMouseOnCanvasStatus()) moveCrosshair(canvas);
    executeFunctionOnMouseOut(hideCrosshair);
    canvas.renderAll();
  }
}

export {
  removeCrosshairLinesIfExisting, addCanvasCrosshairLines,
  moveCanvasCrosshairViaLastCanvasPositionAsync, moveCrosshair,
  setDrawWithCrosshairMode, removeOutsideCrosshairEventListeners,
  setAllObjectsToUneditable, moveCanvasCrosshair, removeCrosshair,
};
