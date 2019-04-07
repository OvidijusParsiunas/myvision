import { isDrawingInProgress } from '../../../canvas/canvasObjects/polygon/polygon';
import assignRemovePointsOnExistingPolygonEvents from './removePointsEvents';
import assignRemovePointsOnDrawPolygonEvents from './removePointsOnDrawPolygonEvents';
import assignDrawPolygonEvents from './drawPolygonEvents';
import assignDefaultEvents from './defaultEvents';
import setDefaultCursorMode from '../cursorModes/defaultMode';

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
