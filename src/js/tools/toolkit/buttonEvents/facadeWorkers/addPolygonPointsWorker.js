import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import { setAddingPolygonPointsState, setDefaultState } from '../facadeWorkersUtils/stateManager';
import assignAddPointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/addPointsEventHandlers';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode';

function initiateAddPolygonPointsEvents(canvas) {
  purgeCanvasMouseEvents(canvas);
  assignAddPointsOnExistingPolygonEvents(canvas);
  setInitialStageOfAddPointsOnExistingPolygonMode(canvas);
  setDefaultState(false);
  setAddingPolygonPointsState(true);
}

export { initiateAddPolygonPointsEvents as default };
