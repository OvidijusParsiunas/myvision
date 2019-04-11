// all of this logic should be implemented to facade workers
// draw modes should be re-set here

import { isDrawingInProgress } from '../../../objects/polygon/polygon';
import setRemovePointsOnExistingPolygonMode from '../removePointsOnExistingPolygonMode';
import setRemovePointsOnDrawNewPolygonMode from '../removePointsOnDrawNewPolygonMode';

function setRemovePointsCursorMode(canvas) {
  const drawing = isDrawingInProgress();
  if (drawing) {
    setRemovePointsOnDrawNewPolygonMode(canvas);
  } else if (!drawing) {
    setRemovePointsOnExistingPolygonMode(canvas);
  }
}

export { setRemovePointsCursorMode as default };
