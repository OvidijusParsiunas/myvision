import {
  changePolygonPointsPropertiesToDefault, removePolygonPoints,
  cleanPolygonPointsArray, clearAllAddPointsData,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { resetNewPolygonData } from '../../../objects/polygon/polygon';
import { cancelLabellingProcess } from '../../../../tools/labellerPopUp/buttonsEvents';
import { removeEditedPolygonId } from '../eventWorkers/editPolygonEventsWorker';
import {
  getAlteringPolygonPointsState, setAlteringPolygonPointsState,
  getRemovingPolygonPointsState, getAddingPolygonPointsState,
} from '../../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

function interruptCanvasEventsNoPolygonPointRemoval() {
  resetNewPolygonData();
  cancelLabellingProcess();
  removeEditedPolygonId();
  if (getAlteringPolygonPointsState()) {
    if (getRemovingPolygonPointsState()) {
      cleanPolygonPointsArray();
    }
    if (getAddingPolygonPointsState()) {
      clearAllAddPointsData();
    }
    changePolygonPointsPropertiesToDefault();
    setAlteringPolygonPointsState(false);
  }
}

function interruptAllCanvasEvents() {
  removePolygonPoints();
  interruptCanvasEventsNoPolygonPointRemoval();
}

function interruptCanvasToStartAddPoints() {
  if (!getAddingPolygonPointsState()) {
    interruptCanvasEventsNoPolygonPointRemoval();
  }
}

export { interruptCanvasToStartAddPoints, interruptAllCanvasEvents };
