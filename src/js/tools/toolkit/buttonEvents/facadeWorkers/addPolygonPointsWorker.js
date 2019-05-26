import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import {
  setAddingPolygonPointsState, getAlteringPolygonPointsState, getAddingPolygonPointsState,
  getRemovingPolygonPointsState, setRemovingPolygonPointsState, setDefaultState,
} from '../facadeWorkersUtils/stateManager';
import assignAddPointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/addPointsEventHandlers';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode';
import { cleanPolygonPointsArray, resetAddPoints } from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';

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
