import { changePolygonPointsPropertiesToDefault } from '../../objects/polygon/alterPolygon/alterPolygon';
import { setObjectPropertiesToDefaultWhenReadyToDraw } from '../../objects/objectsProperties/changeProperties';
import { getMovableObjectsState } from '../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

function setDfaultCanvasCursors(canvas) {
  canvas.defaultCursor = 'default';
  if (getMovableObjectsState()) {
    canvas.hoverCursor = 'move';
  } else {
    canvas.hoverCursor = 'default';
  }
  canvas.renderAll();
}

// important to remember that this will reset perPixelTargetFind to true
// only when the mode is being reset to default
function setDefaultCursorMode(canvas) {
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName !== 'bndBox') {
      iteratedObj.perPixelTargetFind = true;
    }
    iteratedObj.selectable = true;
    if (getMovableObjectsState()) {
      iteratedObj.hoverCursor = 'move';
    } else {
      iteratedObj.hoverCursor = 'default';
    }
  });
  setDfaultCanvasCursors(canvas);
}

function setDefaultCursorModeAfterAlteringPolygonPoints(canvas) {
  changePolygonPointsPropertiesToDefault(canvas);
  setDfaultCanvasCursors(canvas);
}

function setDefaultCursorModeWhenReadyToDrawShapes(canvas) {
  setObjectPropertiesToDefaultWhenReadyToDraw(canvas);
  setDfaultCanvasCursors(canvas);
}

export {
  setDefaultCursorMode,
  setDefaultCursorModeWhenReadyToDrawShapes,
  setDefaultCursorModeAfterAlteringPolygonPoints,
};
