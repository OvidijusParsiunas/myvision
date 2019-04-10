import {
  getRemovingPointsState, setRemovingPointsStateToFalse, undoRemovePointsEventsObjectsProperties,
} from '../eventWorkers/removePointsEventsWorker';
import { clearPolygonData } from '../../../objects/polygon/polygon';
import { cancelLabellingProcess } from '../../../../utils/labellerPopUp/buttonEvents';
import { removePolygonPoints } from '../../../objects/polygon/alterPolygon/alterPolygon';
import { removeSelectedPolygonId } from '../eventWorkers/editPolygonEventsWorker';

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
