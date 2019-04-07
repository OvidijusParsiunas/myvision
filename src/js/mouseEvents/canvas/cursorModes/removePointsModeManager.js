// all of this logic should be implemented to facade workers
// draw modes should be re-set here
// move interruptAllCanvasEvents to events folder
// create utils folder in canvas folder
// put labelPopUp, downloadFile and uploadFile into utils folder
// rename canvasObjects to objects

import { isDrawingInProgress } from '../../../canvas/canvasObjects/polygon/polygon';
import setRemovePointsOnExistingPolygonMode from './removePointsMode';
import setRemovePointsOnDrawPolygonMode from './removePointsOnDrawPolygonMode';

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
