import {
  setAddingPolygonPointsState, setDefaultState,
} from '../../../../tools/state';
import { resetAddPoints } from '../../../objects/polygon/alterPolygon/alterPolygon';
import { setDefaultCursorModeAfterAlteringPolygonPoints } from '../../cursorModes/defaultMode';
import assignDefaultEvents from '../eventHandlers/defaultEventHandlers';
import purgeCanvasMouseEvents from './purgeAllMouseHandlers';
import { setAddPointsButtonToDefault, setEditShapesButtonToActive } from '../../../../tools/toolkit/styling/state';

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
