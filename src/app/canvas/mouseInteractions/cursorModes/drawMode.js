import { getMovableObjectsState } from '../../../tools/state.js';

function setAllObjectsToUneditable(canvas) {
  canvas.forEachObject((iteratedObj) => {
    if (iteratedObj.shapeName !== 'tempPoint' && iteratedObj.shapeName !== 'firstPoint') {
      if (iteratedObj.shapeName !== 'bndBox') {
        iteratedObj.perPixelTargetFind = false;
      }
      iteratedObj.selectable = false;
      iteratedObj.hoverCursor = 'crosshair';
    }
  });
}

function setDrawCursorMode(canvas) {
  canvas.discardActiveObject();
  setAllObjectsToUneditable(canvas);
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
  canvas.renderAll();
}

function resetObjectCursors(canvas) {
  if (getMovableObjectsState()) {
    canvas.forEachObject((iteratedObj) => {
      iteratedObj.hoverCursor = null;
    });
  } else {
    canvas.forEachObject((iteratedObj) => {
      iteratedObj.hoverCursor = 'default';
    });
  }
  canvas.renderAll();
}

export { setDrawCursorMode, resetObjectCursors };
