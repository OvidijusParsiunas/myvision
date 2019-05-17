import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import {
  setAddingPolygonPointsState, getAlteringPolygonPointsState, getAddingPolygonPointsState,
  getRemovingPolygonPointsState, setRemovingPolygonPointsState, setDefaultState,
} from '../facadeWorkersUtils/stateManager';
import assignAddPointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/addPointsEventHandlers';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode';
import { cleanPolygonPointsArray, resetAddPoints } from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
// import { getSelectedPolygonIdForRemovingPoints } from '../../../../canvas/
// mouseInteractions/mouseEvents/eventWorkers/removePointsEventsWorker';

// function setRemovePointsCursorMode(canvas) {
//   const drawing = isDrawingInProgress();
//   if (drawing) {
//     setRemovePointsOnDrawNewPolygonMode(canvas);
//   } else if (!drawing) {
//     setRemovePointsOnExistingPolygonMode(canvas);
//   }
// }
//
// function assignRemovePointsEvents(canvas) {
//   const drawing = isDrawingInProgress();
//   if (drawing) {
//     assignRemovePointsOnDrawPolygonEvents(canvas);
//   } else if (!drawing) {
//     assignRemovePointsOnExistingPolygonEvents(canvas);
//   }
// }
//
// function discardRemovePointsEvents(canvas) {
//   // is this still drawing after manually removing all polygon points
//   const drawing = isDrawingInProgress();
//   if (drawing) {
//     assignDrawPolygonEvents(canvas, true);
//     setDefaultState(false);
//   } else {
//     setDefaultCursorMode(canvas, true);
//     const currentlySelectedPolygonId = getSelectedPolygonIdForRemovingPoints();
//     assignDefaultEvents(canvas, currentlySelectedPolygonId);
//     setDefaultState(true);
//   }
// }

function initiateAddPolygonPointsEvents(canvas) {
  if (getAlteringPolygonPointsState()) {
    if (getRemovingPolygonPointsState()) {
      cleanPolygonPointsArray();
      setRemovingPolygonPointsState(false);
    }
    if (getAddingPolygonPointsState()) {
      resetAddPoints();
      setAddingPolygonPointsState(false);
    }
  }
  purgeCanvasMouseEvents(canvas);
  assignAddPointsOnExistingPolygonEvents(canvas);
  setInitialStageOfAddPointsOnExistingPolygonMode(canvas);
  setDefaultState(false);
  setAddingPolygonPointsState(true);
}

export { initiateAddPolygonPointsEvents as default };
