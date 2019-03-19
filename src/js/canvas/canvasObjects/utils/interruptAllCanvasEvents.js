import {
  getRemovingPointsState, setRemovingPointsStateToFalse, undoRemovePointsEventsObjectsProperties,
} from '../../../mouseEvents/canvas/events/eventsManagers/removePointsEventsManager';
import { clearPolygonData } from '../polygon/polygon';
import { cancelLabellingProcess } from '../../labelPopUp/labelPopUpActions';
import { removePolygonPoints } from '../polygon/changePolygon';
import { removeSelectedPolygonId } from '../../../mouseEvents/canvas/events/eventsManagers/editPolygonEventsManager';

function interruptAllCanvasEvents() {
  clearPolygonData();
  cancelLabellingProcess();
  removePolygonPoints();
  removeSelectedPolygonId();
  if (getRemovingPointsState()) {
    undoRemovePointsEventsObjectsProperties();
    setRemovingPointsStateToFalse();
  }
}

export { interruptAllCanvasEvents as default };
