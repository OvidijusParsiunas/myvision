import {
  getRemovingPointsState, setRemovingPointsStateToFalse, undoRemovePointsEventsObjectsProperties,
} from '../eventWorkers/removePointsEventsWorker';
import { clearPolygonData } from '../../../objects/polygon/polygon';
import { cancelLabellingProcess } from '../../../../utils/labellerPopUp/buttonsEvents';
import { removePolygonPoints } from '../../../objects/polygon/alterPolygon/alterPolygon';
import { removeEditedPolygonId } from '../eventWorkers/editPolygonEventsWorker';

function interruptAllCanvasEvents() {
  clearPolygonData();
  cancelLabellingProcess();
  removePolygonPoints();
  removeEditedPolygonId();
  if (getRemovingPointsState()) {
    undoRemovePointsEventsObjectsProperties();
    setRemovingPointsStateToFalse();
  }
}

export { interruptAllCanvasEvents as default };
