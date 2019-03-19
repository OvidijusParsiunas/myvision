import { undoRemovePointsEventsObjectsProperties } from '../events/eventsManagers/removePointsEventsManager';

function setDefaultCursorMode(canvas, removingPoints) {
  if (removingPoints) {
    undoRemovePointsEventsObjectsProperties();
  } else {
    canvas.forEachObject((iteratedObj) => {
      iteratedObj.selectable = true;
    });
  }
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
  canvas.renderAll();
}

export { setDefaultCursorMode as default };
