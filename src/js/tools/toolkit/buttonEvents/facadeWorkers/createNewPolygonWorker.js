import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';
import { setDefaultState, setAlteringPolygonPointsState } from '../facadeWorkersUtils/stateManager';

function initiateCreateNewPolygonEvents(canvas) {
  purgeCanvasMouseEvents(canvas);
  assignDrawPolygonEvents(canvas);
  setDefaultState(false);
  setAlteringPolygonPointsState(false);
}

export { initiateCreateNewPolygonEvents as default };
