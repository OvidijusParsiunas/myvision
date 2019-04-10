import { isDrawingInProgress } from '../../../objects/polygon/polygon';
import assignRemovePointsOnExistingPolygonEvents from '../eventHandlers/removePointsEventHandlers';
import assignRemovePointsOnDrawPolygonEvents from '../eventHandlers/removePointsOnDrawPolygonEventHandlers';
import assignDrawPolygonEvents from '../eventHandlers/drawPolygonEventHandlers';
import assignDefaultEvents from '../eventHandlers/defaultEventHandlers';
import setDefaultCursorMode from '../../cursorModes/defaultMode';

// move to worker
function assignRemovePointsEvents(canvas) {
  const drawing = isDrawingInProgress();
  if (drawing) {
    assignRemovePointsOnDrawPolygonEvents(canvas);
  } else if (!drawing) {
    assignRemovePointsOnExistingPolygonEvents(canvas);
  }
}

function exitRemovePointsEvents(canvas) {
  // is this still drawing after manually removing all polygon points
  const drawing = isDrawingInProgress();
  if (drawing) {
    assignDrawPolygonEvents(canvas, true);
    return false;
  }
  setDefaultCursorMode(canvas, true);
  assignDefaultEvents(canvas);
  return true;
}

export { assignRemovePointsEvents, exitRemovePointsEvents };
