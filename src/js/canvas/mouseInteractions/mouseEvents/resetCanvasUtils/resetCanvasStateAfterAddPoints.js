import {
  setAddingPolygonPointsState, setDefaultState,
} from '../../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';
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

function reset(id) {
  resetAddPoints();
  setAddingPolygonPointsState(false);
  purgeCanvasMouseEvents(canvas);
  discardAddPointsEvents(id);
}

function setCanvas(canvasObj) {
  canvas = canvasObj;
}

export { reset, setCanvas };
