import fabric from 'fabric';
import { resetObjectCursors, waitingForLabelCursorMode } from '../../canvas/mouseInteractions/cursorModes/drawMode';
import { getShapeLabellerModalInputText, hideShapeLabellerModal, resetShapeLabellerModalOptions } from './style';
import { generateLabelShapeGroup } from '../../canvas/objects/allShapes/labelAndShapeBuilder';
import { setDefaultCursorMode } from '../../canvas/mouseInteractions/cursorModes/defaultMode';
import polygonProperties from '../../canvas/objects/polygon/properties';
// import { getCanvasElement } from '../toolkit/buttonClickEvents/facadeWorkers/zoomWorker';

let labellingState = false;
let targetShape = null;
let canvas = null;
let mousePosition;

function setMousePosition(event) {
  mousePosition = event;
}

function prepareLabelShape(shape, canvasObj) {
  document.getElementsByTagName('BODY')[0].addEventListener('mousemove', setMousePosition);
  setDefaultCursorMode(canvasObj);
  waitingForLabelCursorMode(canvasObj);
  targetShape = shape;
  canvas = canvasObj;
  labellingState = true;
}

window.mousePosition = setMousePosition;

function removeTargetShape() {
  canvas.remove(targetShape);
  labellingState = false;
}

function createLabelShape() {
  const pointer = { x: mousePosition.clientX, y: mousePosition.clientY };
  const point = new fabric.Circle(polygonProperties.newPoint(0, pointer));
  canvas.add(point);
  document.getElementsByTagName('BODY')[0].removeEventListener('mousemove', setMousePosition);
  hideShapeLabellerModal();
  generateLabelShapeGroup(targetShape, getShapeLabellerModalInputText());
  resetObjectCursors(canvas);
  resetShapeLabellerModalOptions();
  labellingState = false;
}

function isLabelling() {
  return labellingState;
}

export {
  prepareLabelShape, createLabelShape, removeTargetShape, isLabelling,
};
