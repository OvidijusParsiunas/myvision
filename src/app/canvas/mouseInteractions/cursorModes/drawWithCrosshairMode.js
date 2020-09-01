import fabric from 'fabric';
import crosshairProps from '../../objects/crosshair/properties';
import { getIsMouseOnCanvasStatus, executeFunctionOnceOnMouseOver, executeFunctionOnMouseOut } from '../../../keyEvents/mouse/mouseOverOut';
import { getLastMouseMoveEvent } from '../../../keyEvents/mouse/mouseMove';
import { getCurrentZoomState } from '../../../tools/state';
import IS_FIREFOX from '../../../tools/utils/browserType';
import { getCurrentCanvasContainerElement } from '../../utils/canvasUtils';

let canvasRef = null;
let canvasCrosshairLineX = null;
let canvasCrosshairLineY = null;
let outsideCrosshairLineXElement = null;
let outsideCrosshairLineYElement = null;
let canvasAbsolutelContainer1Element = null;
let canvasAbsolutelContainer2Element = null;
let moveCanvasCrosshairFunc = null;
let moveOutsideCrosshairFunc = null;
let horizontalDelta = null;
let verticalDelta = null;

function setCanvasCrosshairCoordinates() {
  canvasCrosshairLineX.setCoords();
  canvasCrosshairLineY.setCoords();
}

function moveCanvasCrosshairDefault(event, canvas) {
  if (!event.pointer.x) return;
  canvasCrosshairLineX.set({
    x1: event.pointer.x + verticalDelta,
    x2: event.pointer.x + verticalDelta,
  });
  canvasCrosshairLineY.set({
    y1: event.pointer.y - horizontalDelta,
    y2: event.pointer.y - horizontalDelta,
  });
  setCanvasCrosshairCoordinates();
  canvas.renderAll();
}

function moveCanvasCrosshairOnZoom(event, canvas) {
  if (!event.pointer.x) return;
  const pointer = canvas.getPointer(event.e);
  canvasCrosshairLineX.set({
    x1: pointer.x + verticalDelta,
    x2: pointer.x + verticalDelta,
  });
  canvasCrosshairLineY.set({
    y1: pointer.y - horizontalDelta - 1.2,
    y2: pointer.y - horizontalDelta - 1.2,
  });
  setCanvasCrosshairCoordinates();
  canvas.renderAll();
}

function moveOutsideCrosshairDefault(event) {
  // the following check is used in the scenario where the mousemove event has been dispatched
  if (!event.pageY) { event = getLastMouseMoveEvent(); }
  outsideCrosshairLineXElement.style.top = `${event.pageY - horizontalDelta}px`;
  outsideCrosshairLineYElement.style.left = `${event.pageX + verticalDelta}px`;
}

function moveOutsideCrosshairZoom(event) {
  // the following check is used in the scenario where the mousemove event has been dispatched
  if (!event.pageY) { event = getLastMouseMoveEvent(); }
  outsideCrosshairLineXElement.style.top = `${event.pageY - horizontalDelta - 2.25}px`;
  outsideCrosshairLineYElement.style.left = `${event.pageX + verticalDelta}px`;
}

function setCrosshairAfterZoom() {
  moveCanvasCrosshairFunc = moveCanvasCrosshairOnZoom;
  moveOutsideCrosshairFunc = moveOutsideCrosshairZoom;
  verticalDelta = crosshairProps.verticalDelta();
  horizontalDelta = crosshairProps.horizontalDelta();
}

function hideCanvasCrosshair(canvas) {
  if (!canvasCrosshairLineX || !canvasCrosshairLineY) return;
  canvasCrosshairLineX.set({ x1: -10, x2: -10 });
  canvasCrosshairLineY.set({ y1: -10, y2: -10 });
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

function resetMoveCrosshairFuncs() {
  if (getCurrentZoomState() > 1.000001) {
    moveCanvasCrosshairFunc = moveCanvasCrosshairOnZoom;
    moveOutsideCrosshairFunc = moveOutsideCrosshairZoom;
  } else {
    moveCanvasCrosshairFunc = moveCanvasCrosshairDefault;
    moveOutsideCrosshairFunc = moveOutsideCrosshairDefault;
  }
}

function moveCanvasCrosshair(event, canvas) {
  moveCanvasCrosshairFunc(event, canvas);
}

function moveOutsideCrosshair(event) {
  moveOutsideCrosshairFunc(event);
}

function removeMouseMoveEventListener(element) {
  if (element) element.removeEventListener('mousemove', moveOutsideCrosshair);
}

function removeOutsideCrosshairEventListeners() {
  removeMouseMoveEventListener(canvasAbsolutelContainer1Element);
  removeMouseMoveEventListener(canvasAbsolutelContainer2Element);
}

function addMouseMoveEventHandlerToElement(element) {
  element.addEventListener('mousemove', moveOutsideCrosshair);
}

function addCrosshairOutsideOfCanvas() {
  addMouseMoveEventHandlerToElement(canvasAbsolutelContainer1Element);
  addMouseMoveEventHandlerToElement(canvasAbsolutelContainer2Element);
}

function removeCrosshairLinesIfExisting(canvas) {
  if (canvasCrosshairLineX) canvas.remove(canvasCrosshairLineX);
  if (canvasCrosshairLineY) canvas.remove(canvasCrosshairLineY);
  removeOutsideCrosshairEventListeners();
}

function removeCrosshair(canvas) {
  removeCrosshairLinesIfExisting(canvas);
  hideOutsideCrosshair();
  removeOutsideCrosshairEventListeners();
}

function moveCanvasCrosshairViaLastCanvasPosition(canvas, func) {
  const lastMouseMoveEvent = getLastMouseMoveEvent();
  if (!lastMouseMoveEvent) return;
  const lastCanvasPointer = canvas.getPointer(lastMouseMoveEvent);
  const pointerEvent = { pointer: lastCanvasPointer };
  if (func) {
    func(pointerEvent, canvas);
  } else {
    moveCanvasCrosshair(pointerEvent, canvas);
  }
}

function moveCanvasCrosshairViaLastCanvasPositionAsync(canvas, func) {
  setTimeout(() => {
    const {
      left, top, right, bottom,
    } = getCurrentCanvasContainerElement().getBoundingClientRect();
    const { clientX, clientY } = getLastMouseMoveEvent();
    if (clientX <= right && clientX >= left && clientY >= top && clientY <= bottom) {
      moveCanvasCrosshairViaLastCanvasPosition(canvas || canvasRef, func);
    } else {
      hideCrosshair(canvas);
    }
  }, 15);
}

function moveCrosshair(canvas, func) {
  moveCanvasCrosshairViaLastCanvasPosition(canvas || canvasRef, func);
  if (!canvasAbsolutelContainer1Element) return;
  canvasAbsolutelContainer1Element.dispatchEvent(new Event('mousemove'));
  canvasAbsolutelContainer2Element.dispatchEvent(new Event('mousemove'));
}

function resetCanvasCrosshairStrokeWidth(canvas) {
  canvasCrosshairLineX.set({ strokeWidth: crosshairProps.strokeWidth() });
  canvasCrosshairLineY.set({ strokeWidth: crosshairProps.strokeWidth() });
  canvas.renderAll();
}

function updateLinesWithNewCanvasDimensions(canvas) {
  canvasCrosshairLineX.set({ y2: canvas.height });
  canvasCrosshairLineY.set({ x2: canvas.width });
  canvas.renderAll();
}

function newCanvasCrosshairLine() {
  return new fabric.Line([0, 0, 0, 0], crosshairProps.crosshairProps());
}

function addCanvasCrosshairLines(canvas) {
  canvasCrosshairLineX = newCanvasCrosshairLine();
  canvasCrosshairLineY = newCanvasCrosshairLine();
  canvasCrosshairLineX.set({ orientation: 'x' });
  canvasCrosshairLineY.set({ orientation: 'y' });
  updateLinesWithNewCanvasDimensions(canvas);
  canvas.add(canvasCrosshairLineX);
  canvas.add(canvasCrosshairLineY);
  hideCanvasCrosshair(canvas);
}

// crosshair is not redrawn directly upon uploading an image because js cannot track mouse movements
// during the time when the user is selecting an image from their personal machine
function updateCrosshairDimensionsAndHideAsync(canvas) {
  setTimeout(() => {
    hideCrosshair(canvas);
    updateLinesWithNewCanvasDimensions(canvas || canvasRef);
  }, IS_FIREFOX ? 10 : 0);
}

function setAllObjectsToUneditable(canvas) {
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = false;
    iteratedObj.hoverCursor = 'none';
  });
}

function assignLocalVariables() {
  verticalDelta = crosshairProps.verticalDelta();
  horizontalDelta = crosshairProps.horizontalDelta();
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
  resetMoveCrosshairFuncs();
  if (resetting) {
    // upon attempting to draw after labelling a shape, wait for the onmouseenter event
    // to be emitted by the canvas wrapper element
    executeFunctionOnceOnMouseOver(moveCrosshair);
  } else {
    removeCrosshairLinesIfExisting(canvas);
    addCanvasCrosshairLines(canvas);
    addCrosshairOutsideOfCanvas();
    if (getIsMouseOnCanvasStatus()) moveCrosshair(canvas, moveCanvasCrosshairDefault);
    if (getCurrentZoomState() > 1.00001) setCanvasCrosshairCoordinates();
    executeFunctionOnMouseOut(hideCrosshair);
    canvas.renderAll();
  }
}

export {
  resetCanvasCrosshairStrokeWidth, addCanvasCrosshairLines,
  moveCanvasCrosshairOnZoom, moveCanvasCrosshair, moveCrosshair,
  setDrawWithCrosshairMode, removeOutsideCrosshairEventListeners,
  setAllObjectsToUneditable, removeCrosshair, setCrosshairAfterZoom,
  updateCrosshairDimensionsAndHideAsync, removeCrosshairLinesIfExisting,
  moveCanvasCrosshairViaLastCanvasPositionAsync, moveCanvasCrosshairDefault,
};
