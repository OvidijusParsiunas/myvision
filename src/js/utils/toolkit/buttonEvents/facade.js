import setDefaultCursorMode from '../../../canvas/mouseInteractions/cursorModes/defaultMode';
import setRemovePointsMode from '../../../canvas/mouseInteractions/cursorModes/modeManagers/removePointsModeManager';
import assignDrawBoundingBoxEvents from '../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawBndBoxEventHandlers';
import assignDrawPolygonEvents from '../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';
import { assignRemovePointsEvents, exitRemovePointsEvents } from '../../../canvas/mouseInteractions/mouseEvents/eventManagers/removePointsEventsManager';
import assignDefaultEvents from '../../../canvas/mouseInteractions/mouseEvents/eventHandlers/defaultEventHandlers';
import purgeCanvasMouseEvents from '../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import { removePolygon } from '../../../canvas/objects/polygon/alterPolygon/alterPolygon';

let canvas = null;
let defaultState = false;
let removingPoints = false;

// create toolkitFacadeWorkers
// implement downloadFile and uploadFile as workers
function createNewBndBoxBtnClick() {
  purgeCanvasMouseEvents(canvas);
  assignDrawBoundingBoxEvents(canvas);
  defaultState = false;
  removingPoints = false;
}

function createNewPolygonBtnClick() {
  purgeCanvasMouseEvents(canvas);
  assignDrawPolygonEvents(canvas);
  defaultState = false;
  removingPoints = false;
}

function removeActiveShapeBtnClick() {
  if (canvas.getActiveObject()) {
    canvas.remove(canvas.getActiveObject());
  } else {
    removePolygon();
  }
  removingPoints = false;
}

function resetCanvasEventsToDefault() {
  if (!defaultState) {
    purgeCanvasMouseEvents(canvas);
    setDefaultCursorMode(canvas, removingPoints);
    assignDefaultEvents(canvas);
    if (removingPoints) {
      removingPoints = false;
    }
    defaultState = true;
  }
}

function removePolygonPointBtnClick() {
  if (!removingPoints) {
    purgeCanvasMouseEvents(canvas);
    assignRemovePointsEvents(canvas);
    setRemovePointsMode(canvas);
    defaultState = false;
    removingPoints = true;
  } else {
    purgeCanvasMouseEvents(canvas);
    defaultState = exitRemovePointsEvents(canvas);
    removingPoints = false;
  }
}

function assignCanvasMouseEvents(canvasObj) {
  canvas = canvasObj;
}

export {
  assignCanvasMouseEvents,
  createNewBndBoxBtnClick,
  createNewPolygonBtnClick,
  resetCanvasEventsToDefault,
  removeActiveShapeBtnClick,
  removePolygonPointBtnClick,
};
