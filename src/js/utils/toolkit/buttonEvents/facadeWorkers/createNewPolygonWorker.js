import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';
import { setDefaultState, setRemovingPointsState } from '../facadeWorkersUtils/stateManager';

function initiateCreateNewPolygonEvents(canvas) {
  purgeCanvasMouseEvents(canvas);
  assignDrawPolygonEvents(canvas);
  setDefaultState(false);
  setRemovingPointsState(false);
}

export { initiateCreateNewPolygonEvents as default };
