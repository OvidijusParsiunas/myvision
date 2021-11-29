import {
  setAddingPolygonPointsState, setDefaultState,
} from '../../../../tools/state.js';
import { resetAddPoints } from '../../../objects/polygon/alterPolygon/alterPolygon.js';
import { setDefaultCursorModeAfterAlteringPolygonPoints } from '../../cursorModes/defaultMode.js';
import assignDefaultEvents from '../eventHandlers/defaultEventHandlers.js';
import purgeCanvasMouseEvents from './purgeAllMouseHandlers.js';
import { setAddPointsButtonToDefault, setEditShapesButtonToActive } from '../../../../tools/toolkit/styling/state.js';

let canvas = null;

function discardAddPointsEvents(id) {
  setDefaultCursorModeAfterAlteringPolygonPoints(canvas);
  assignDefaultEvents(canvas, id);
  setEditShapesButtonToActive();
  setDefaultState(true);
}

function resetCanvasToDefaultAfterAddPoints(id) {
  resetAddPoints();
  setAddPointsButtonToDefault();
  setAddingPolygonPointsState(false);
  purgeCanvasMouseEvents(canvas);
  discardAddPointsEvents(id);
}

function assignCanvasForResettingToDefaultAfterAddPoints(canvasObj) {
  canvas = canvasObj;
}

export { resetCanvasToDefaultAfterAddPoints, assignCanvasForResettingToDefaultAfterAddPoints };
