import { changePolygonPointsPropertiesToDefault } from '../../objects/polygon/alterPolygon/alterPolygon.js';
import { setObjectPropertiesToDefaultWhenReadyToDraw } from '../../objects/objectsProperties/changeProperties.js';
import { getMovableObjectsState } from '../../../tools/state.js';

function setDefaultCanvasCursors(canvas) {
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
  setDefaultCanvasCursors(canvas);
}

function setDefaultCursorModeAfterAlteringPolygonPoints(canvas) {
  changePolygonPointsPropertiesToDefault(canvas);
  setDefaultCanvasCursors(canvas);
}

function setDefaultCursorModeWhenReadyToDrawShapes(canvas) {
  setObjectPropertiesToDefaultWhenReadyToDraw(canvas);
  setDefaultCanvasCursors(canvas);
}

export {
  setDefaultCursorMode,
  setDefaultCursorModeWhenReadyToDrawShapes,
  setDefaultCursorModeAfterAlteringPolygonPoints,
};
