import { clearPolygonData } from '../polygon';
import { cancelLabellingProcess } from '../../labelPopUp/labelPopUpActions';

// this will need to be exported
function interruptAllCanvasEvents() {
  clearPolygonData();
  cancelLabellingProcess();
}

export { interruptAllCanvasEvents as default };
