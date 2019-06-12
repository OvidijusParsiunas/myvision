import { changePolygonPointsPropertiesToDefault } from '../../objects/polygon/alterPolygon/alterPolygon';
import { setObjectPropertiesToDefaultWhenReadyToDraw } from '../../objects/objectsProperties/changeProperties';

function setDfaultCanvasCursors(canvas) {
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
  canvas.renderAll();
}

function setDefaultCursorMode(canvas) {
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = true;
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
