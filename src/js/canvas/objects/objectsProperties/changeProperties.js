import { getMovableObjectsState } from '../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

function prepareObjectsForEditablePolygonPoints(object, isDrawing) {
  if (isDrawing) {
    object.perPixelTargetFind = true;
  }
  if (object.shapeName === 'bndBox') {
    object.selectable = false;
  } else {
    object.lockMovementX = true;
    object.lockMovementY = true;
  }
}

function setObjectPropertiesToDefault(object) {
  if (getMovableObjectsState()) {
    if (object.shapeName !== 'bndBox') {
      object.lockMovementX = false;
      object.lockMovementY = false;
    }
    object.hoverCursor = 'move';
  } else if (object.shapeName !== 'bndBox' && object.shapeName !== 'polygon') {
    object.lockMovementX = false;
    object.lockMovementY = false;
  }
  object.selectable = true;
}

function setObjectPropertiesToDefaultWhenReadyToDraw(canvas) {
  canvas.forEachObject((iteratedObj) => {
    if (getMovableObjectsState()) {
      iteratedObj.lockMovementX = false;
      iteratedObj.lockMovementY = false;
      iteratedObj.hoverCursor = 'move';
    } else {
      iteratedObj.lockMovementX = true;
      iteratedObj.lockMovementY = true;
      iteratedObj.hoverCursor = 'default';
    }
    iteratedObj.selectable = true;
  });
}

function setObjectsHoverCursorToDefault(canvas) {
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.hoverCursor = 'default';
  });
}

export {
  setObjectPropertiesToDefault,
  setObjectsHoverCursorToDefault,
  prepareObjectsForEditablePolygonPoints,
  setObjectPropertiesToDefaultWhenReadyToDraw,
};
