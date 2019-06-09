import { getMovableObjectsState } from '../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

function prepareObjectsForEditablePolygonPoints(object) {
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
  } else if (object.shapeName !== 'bndBox' && object.shapeName !== 'polygon') {
    object.lockMovementX = false;
    object.lockMovementY = false;
  }
  object.selectable = true;
}

export { prepareObjectsForEditablePolygonPoints, setObjectPropertiesToDefault };
