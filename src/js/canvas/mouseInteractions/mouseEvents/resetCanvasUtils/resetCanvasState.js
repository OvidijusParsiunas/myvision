import {
  changePolygonPointsPropertiesToDefault, removePolygonPoints,
  cleanPolygonPointsArray, clearAllAddPointsData,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { resetNewPolygonData } from '../../../objects/polygon/polygon';
import { clearBoundingBoxData } from '../../../objects/boundingBox/boundingBox';
import { cancelLabellingProcess } from '../../../../tools/labellerPopUp/buttonsEvents';
import { removeEditedPolygonId } from '../eventWorkers/editPolygonEventsWorker';
import {
  getAddingPolygonPointsState, getRemovingPolygonPointsState, getAlteringPolygonPointsState,
  setAlteringPolygonPointsState, setReadyToDrawShapeState, setCancelledReadyToDrawState,
  getReadyToDrawShapeState,
} from '../../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

function interruptCanvasEventsNoPolygonPointRemoval() {
  resetNewPolygonData();
  clearBoundingBoxData();
  cancelLabellingProcess();
  removeEditedPolygonId();
  if (getReadyToDrawShapeState()) {
    setCancelledReadyToDrawState(true);
  } else {
    setCancelledReadyToDrawState(false);
  }
  setReadyToDrawShapeState(false);
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
