import { getMovableObjectsState } from '../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

function setAllObjectsUneditable(canvas) {
  canvas.forEachObject((iteratedObj) => {
    iteratedObj.selectable = false;
    iteratedObj.hoverCursor = 'crosshair';
  });
}

function setDrawCursorMode(canvas, afterEditingPolygon) {
  canvas.discardActiveObject();
  if (!afterEditingPolygon) {
    setAllObjectsUneditable(canvas);
  }
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
