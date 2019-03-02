import { clearPolygonData } from '../polygon';
import { cancelLabellingProcess } from '../../labelPopUp/labelPopUpActions';
import { hidePolygonPoints } from '../polygon/changePolygon';

function interruptAllCanvasEvents() {
  clearPolygonData();
  cancelLabellingProcess();
  hidePolygonPoints();
}

export { interruptAllCanvasEvents as default };
