import { getMovableObjectsState } from '../../../tools/state';

/**
 * Sets all objects in the given canvas to uneditable, except for objects with shapeName 'tempPoint', 'firstPoint', or 'bndBox'.
 * This function also sets the 'perPixelTargetFind' property of non-exception objects to false.
 * @param {fabric.Canvas} canvas - The canvas object to modify.
 */
function setAllObjectsToUneditable(canvas) {
  canvas.forEachObject((iteratedObj) => {
    // If the shapeName is not 'tempPoint', 'firstPoint', or 'bndBox'
    if (iteratedObj.shapeName !== 'tempPoint' && iteratedObj.shapeName !== 'firstPoint') {
      if (iteratedObj.shapeName !== 'bndBox') {
        // Set 'perPixelTargetFind' to false
        iteratedObj.perPixelTargetFind = false;
      }

      // Set other properties to make the object uneditable
      iteratedObj.selectable = false;
      iteratedObj.hoverCursor = 'crosshair';
    }
  });
}

/**
 * Prepares the canvas for draw mode by discarding the active object, setting all objects to uneditable,
 * setting the default and hover cursors to 'crosshair', and rendering the canvas.
 * @param {fabric.Canvas} canvas - The canvas object to modify.
 */
function setDrawCursorMode(canvas) {
  canvas.discardActiveObject();
  setAllObjectsToUneditable(canvas);
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
  canvas.renderAll();
}

/**
 * Resets the hover cursors of all objects in the given canvas based on the movableObjectsState.
 * If movableObjectsState is true, hover cursors will be set to null, otherwise, they will be set to 'default'.
 * @param {fabric.Canvas} canvas - The canvas object to modify.
 */
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
