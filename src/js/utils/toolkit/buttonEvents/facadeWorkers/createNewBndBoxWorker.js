import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignDrawBoundingBoxEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawBndBoxEventHandlers';
import { setDefaultState, setAlteringPolygonPointsState } from '../facadeWorkersUtils/stateManager';

function initiateCreateNewBndBoxEvents(canvas) {
  purgeCanvasMouseEvents(canvas);
  assignDrawBoundingBoxEvents(canvas);
  setDefaultState(false);
  setAlteringPolygonPointsState(false);
}

export { initiateCreateNewBndBoxEvents as default };
