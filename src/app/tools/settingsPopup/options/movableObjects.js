import { getDefaultState, getMovableObjectsState, setMovableObjectsState } from '../../state.js';
import { getAllExistingShapes } from '../../../canvas/objects/allShapes/allShapes.js';

function changeExistingImagesMovability(shapes) {
  if (getMovableObjectsState()) {
    Object.keys(shapes).forEach((key) => {
      const object = shapes[key].shapeRef;
      if (object.shapeName === 'polygon' || object.shapeName === 'bndBox') {
        object.lockMovementX = false;
        object.lockMovementY = false;
        if (getDefaultState()) object.hoverCursor = 'move';
      }
    });
  } else {
    Object.keys(shapes).forEach((key) => {
      const object = shapes[key].shapeRef;
      if (object.shapeName === 'polygon' || object.shapeName === 'bndBox') {
        object.lockMovementX = true;
        object.lockMovementY = true;
        if (getDefaultState()) object.hoverCursor = 'default';
      }
    });
  }
}

function changeMovaleObjectsSetting() {
  if (getMovableObjectsState()) {
    setMovableObjectsState(false);
  } else {
    setMovableObjectsState(true);
  }
  const currentCanvasShapes = getAllExistingShapes();
  changeExistingImagesMovability(currentCanvasShapes);
}

export { changeMovaleObjectsSetting, changeExistingImagesMovability };
