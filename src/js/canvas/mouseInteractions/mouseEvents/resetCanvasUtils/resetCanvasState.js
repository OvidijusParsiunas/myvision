import { undoRemovePointsEventsObjectsProperties } from '../eventWorkers/removePointsEventsWorker';
import { clearPolygonData } from '../../../objects/polygon/polygon';
import { cancelLabellingProcess } from '../../../../utils/labellerPopUp/buttonsEvents';
import { removePolygonPoints } from '../../../objects/polygon/alterPolygon/alterPolygon';
import { removeEditedPolygonId } from '../eventWorkers/editPolygonEventsWorker';
import {
  getAlteringPolygonPointsState, setAlteringPolygonPointsState,
} from '../../../../utils/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

function interruptAllCanvasEvents() {
  clearPolygonData();
  cancelLabellingProcess();
  removePolygonPoints();
  removeEditedPolygonId();
  if (getAlteringPolygonPointsState()) {
    undoRemovePointsEventsObjectsProperties();
    setAlteringPolygonPointsState();
  }
}

export { interruptAllCanvasEvents as default };
