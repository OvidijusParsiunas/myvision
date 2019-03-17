import { clearPolygonData } from '../polygon/polygon';
import { cancelLabellingProcess } from '../../labelPopUp/labelPopUpActions';
import { removePolygonPoints } from '../polygon/changePolygon';
import { removeSelectedPolygonId } from '../../../mouseEvents/canvas/events/eventsManagers/editPolygonEventsManager';

function interruptAllCanvasEvents() {
  clearPolygonData();
  cancelLabellingProcess();
  removePolygonPoints();
  removeSelectedPolygonId();
}

export { interruptAllCanvasEvents as default };
