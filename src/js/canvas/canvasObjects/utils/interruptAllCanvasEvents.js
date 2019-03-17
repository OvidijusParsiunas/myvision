import { clearPolygonData } from '../polygon/polygon';
import { cancelLabellingProcess } from '../../labelPopUp/labelPopUpActions';
import { removePolygonPoints } from '../polygon/changePolygon';

function interruptAllCanvasEvents() {
  clearPolygonData();
  cancelLabellingProcess();
  removePolygonPoints();
}

export { interruptAllCanvasEvents as default };
