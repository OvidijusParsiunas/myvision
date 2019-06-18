import { changePolygonPointsPropertiesToDefault } from '../../objects/polygon/alterPolygon/alterPolygon';
import { setObjectPropertiesToDefaultWhenReadyToDraw } from '../../objects/objectsProperties/changeProperties';

function setDfaultCanvasCursors(canvas) {
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
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
    iteratedObj.hoverCursor = 'move';
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
