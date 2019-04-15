import { undoRemovePointsEventsObjectsProperties } from '../mouseEvents/eventWorkers/removePointsEventsWorker';

function setDefaultCursorMode(canvas, alteringPolygonPoints) {
  if (alteringPolygonPoints) {
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
