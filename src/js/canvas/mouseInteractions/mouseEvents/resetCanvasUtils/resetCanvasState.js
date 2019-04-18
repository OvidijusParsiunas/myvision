import { changePolygonPointsPropertiesToDefault, removePolygonPoints } from '../../../objects/polygon/alterPolygon/alterPolygon';
import { clearPolygonData } from '../../../objects/polygon/polygon';
import { cancelLabellingProcess } from '../../../../tools/labellerPopUp/buttonsEvents';
import { removeEditedPolygonId } from '../eventWorkers/editPolygonEventsWorker';
import {
  getAlteringPolygonPointsState, setAlteringPolygonPointsState,
} from '../../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

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
