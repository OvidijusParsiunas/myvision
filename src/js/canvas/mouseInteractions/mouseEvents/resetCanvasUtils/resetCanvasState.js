import {
  changePolygonPointsPropertiesToDefault, removePolygonPoints, cleanPolygonPointsArray,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { clearPolygonData } from '../../../objects/polygon/polygon';
import { cancelLabellingProcess } from '../../../../tools/labellerPopUp/buttonsEvents';
import { removeEditedPolygonId } from '../eventWorkers/editPolygonEventsWorker';
import {
  getAlteringPolygonPointsState, setAlteringPolygonPointsState, getRemovingPolygonPointsState,
} from '../../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

function interruptAllCanvasEventsNoPolygonPointRemoval() {
  clearPolygonData();
  cancelLabellingProcess();
  removeEditedPolygonId();
  if (getAlteringPolygonPointsState()) {
    if (getRemovingPolygonPointsState()) {
      cleanPolygonPointsArray();
    }
    changePolygonPointsPropertiesToDefault();
    setAlteringPolygonPointsState(false);
  }
}

function interruptAllCanvasEvents() {
  removePolygonPoints();
  interruptAllCanvasEventsNoPolygonPointRemoval();
}

export { interruptAllCanvasEventsNoPolygonPointRemoval, interruptAllCanvasEvents };
