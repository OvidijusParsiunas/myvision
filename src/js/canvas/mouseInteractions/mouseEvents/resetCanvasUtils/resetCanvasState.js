import { changePolygonPointsPropertiesToDefault, removePolygonPoints } from '../../../objects/polygon/alterPolygon/alterPolygon';
import { clearPolygonData } from '../../../objects/polygon/polygon';
import { cancelLabellingProcess } from '../../../../windowUtils/labellerPopUp/buttonsEvents';
import { removeEditedPolygonId } from '../eventWorkers/editPolygonEventsWorker';
import {
  getAlteringPolygonPointsState, setAlteringPolygonPointsState,
} from '../../../../windowUtils/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

function interruptAllCanvasEvents() {
  clearPolygonData();
  cancelLabellingProcess();
  removePolygonPoints();
  removeEditedPolygonId();
  if (getAlteringPolygonPointsState()) {
    changePolygonPointsPropertiesToDefault();
    setAlteringPolygonPointsState(false);
  }
}

export { interruptAllCanvasEvents as default };
