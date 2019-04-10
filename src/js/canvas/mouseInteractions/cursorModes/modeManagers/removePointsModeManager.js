// all of this logic should be implemented to facade workers
// draw modes should be re-set here

import { isDrawingInProgress } from '../../../objects/polygon/polygon';
import setRemovePointsOnExistingPolygonMode from '../removePointsOnExistingPolygonMode';
import setRemovePointsOnDrawPolygonMode from '../removePointsOnDrawPolygonMode';

// rename to cursor mode
function setRemovePointsMode(canvas) {
  const drawing = isDrawingInProgress();
  if (drawing) {
    setRemovePointsOnDrawPolygonMode(canvas);
  } else if (!drawing) {
    setRemovePointsOnExistingPolygonMode(canvas);
  }
}

export { setRemovePointsMode as default };
