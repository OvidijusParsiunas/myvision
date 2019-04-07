// all of this logic should be implemented to facade workers
// draw modes should be re-set here
import { isDrawingInProgress } from '../../../canvas/canvasObjects/polygon/polygon';
import setRemovePointsOnExistingPolygonMode from './removePointsMode';
import setRemovePointsOnDrawPolygonMode from './removePointsOnDrawPolygonMode';

function setRemovePointsMode(canvas) {
  const drawing = isDrawingInProgress();
  if (drawing) {
    setRemovePointsOnDrawPolygonMode(canvas);
  } else if (!drawing) {
    setRemovePointsOnExistingPolygonMode(canvas);
  }
}

export { setRemovePointsMode as default };
