import {
  setAddingPolygonPointsState, setDefaultState,
} from '../../../../tools/stateMachine';
import { resetAddPoints } from '../../../objects/polygon/alterPolygon/alterPolygon';
import { setDefaultCursorModeAfterAlteringPolygonPoints } from '../../cursorModes/defaultMode';
import assignDefaultEvents from '../eventHandlers/defaultEventHandlers';
import purgeCanvasMouseEvents from './purgeAllMouseHandlers';

let canvas = null;

function discardAddPointsEvents(id) {
  setDefaultCursorModeAfterAlteringPolygonPoints(canvas);
  assignDefaultEvents(canvas, id);
  setDefaultState(true);
}

function resetCanvasToDefaultAfterAddPoints(id) {
  resetAddPoints();
  setAddingPolygonPointsState(false);
  purgeCanvasMouseEvents(canvas);
  discardAddPointsEvents(id);
}

function assignCanvasForResettingToDefaultAfterAddPoints(canvasObj) {
  canvas = canvasObj;
}

export { resetCanvasToDefaultAfterAddPoints, assignCanvasForResettingToDefaultAfterAddPoints };
