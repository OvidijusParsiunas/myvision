import polygonProperties from '../../objects/polygon/properties.js';
import { getDefaultState, getAddingPolygonPointsState } from '../../../tools/state.js';

// change - objectsProperties
// follow pattern used in remove points
function changeOjectPropertiesForChoosingInitialPoint(canvas, isDrawing) {
  canvas.forEachObject((iteratedObj) => {
    if (isDrawing) {
      if (iteratedObj.shapeName !== 'bndBox') {
        iteratedObj.perPixelTargetFind = true;
      }
    }
    if (iteratedObj.shapeName === 'bndBox') {
      iteratedObj.selectable = false;
    } else {
      iteratedObj.lockMovementX = true;
      iteratedObj.lockMovementY = true;
    }
    if (iteratedObj.shapeName === 'point') {
      iteratedObj.set(polygonProperties.additionalPoint());
    }
    iteratedObj.hoverCursor = 'default';
  });
  canvas.renderAll();
}

function setInitialStageOfAddPointsOnExistingPolygonMode(canvas) {
  const isDrawing = !(getDefaultState() || getAddingPolygonPointsState());
  changeOjectPropertiesForChoosingInitialPoint(canvas, isDrawing);
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
}

export { setInitialStageOfAddPointsOnExistingPolygonMode as default };
