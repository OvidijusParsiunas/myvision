import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';
import {
  setDefaultState, setAlteringPolygonPointsState,
  setLastDrawingModeState, setHasDrawnShapeState,
} from '../../../stateMachine';

function initiateCreateNewPolygonEvents(canvas) {
  purgeCanvasMouseEvents(canvas);
  assignDrawPolygonEvents(canvas);
  setDefaultState(false);
  setAlteringPolygonPointsState(false);
  setLastDrawingModeState('polygon');
  setHasDrawnShapeState(false);
}

export { initiateCreateNewPolygonEvents as default };
