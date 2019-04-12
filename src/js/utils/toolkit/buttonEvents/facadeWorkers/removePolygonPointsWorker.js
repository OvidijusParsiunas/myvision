import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import { setDefaultState, setRemovingPointsState, getRemovingPointsState } from '../facadeWorkersUtils/stateManager';
import { isDrawingInProgress } from '../../../../canvas/objects/polygon/polygon';
import setRemovePointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/removePointsOnExistingPolygonMode';
import setRemovePointsOnDrawNewPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/removePointsOnDrawNewPolygonMode';
import assignRemovePointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/removePointsEventHandlers';
import assignRemovePointsOnDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/removePointsOnDrawPolygonEventHandlers';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';
import assignDefaultEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import setDefaultCursorMode from '../../../../canvas/mouseInteractions/cursorModes/defaultMode';

function setRemovePointsCursorMode(canvas) {
  const drawing = isDrawingInProgress();
  if (drawing) {
    setRemovePointsOnDrawNewPolygonMode(canvas);
  } else if (!drawing) {
    setRemovePointsOnExistingPolygonMode(canvas);
  }
}

function assignRemovePointsEvents(canvas) {
  const drawing = isDrawingInProgress();
  if (drawing) {
    assignRemovePointsOnDrawPolygonEvents(canvas);
  } else if (!drawing) {
    assignRemovePointsOnExistingPolygonEvents(canvas);
  }
}

function discardRemovePointsEvents(canvas) {
  // is this still drawing after manually removing all polygon points
  const drawing = isDrawingInProgress();
  if (drawing) {
    assignDrawPolygonEvents(canvas, true);
    return false;
  }
  setDefaultCursorMode(canvas, true);
  assignDefaultEvents(canvas);
  return true;
}

function initiateRemovePolygonPointsEvents(canvas) {
  if (!getRemovingPointsState()) {
    purgeCanvasMouseEvents(canvas);
    assignRemovePointsEvents(canvas);
    setRemovePointsCursorMode(canvas);
    setDefaultState(false);
    setRemovingPointsState(true);
  } else {
    purgeCanvasMouseEvents(canvas);
    setDefaultState(discardRemovePointsEvents(canvas));
    setRemovingPointsState(false);
  }
}

export { initiateRemovePolygonPointsEvents as default };
