import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers.js';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers.js';
import {
  setDefaultState, setAlteringPolygonPointsState,
  setLastDrawingModeState, setHasDrawnShapeState,
} from '../../../state.js';
import { setEditShapesButtonToDefault, setCreatePolygonButtonToActive } from '../../styling/state.js';

function initiateCreateNewPolygonEvents(canvas) {
  if (canvas.backgroundImage) {
    purgeCanvasMouseEvents(canvas);
    assignDrawPolygonEvents(canvas);
    setCreatePolygonButtonToActive();
    setEditShapesButtonToDefault();
    setDefaultState(false);
    setAlteringPolygonPointsState(false);
    setLastDrawingModeState('polygon');
    setHasDrawnShapeState(false);
  }
}

export { initiateCreateNewPolygonEvents as default };
