import {
  changePolygonPointsPropertiesToDefault, removePolygonPoints,
  cleanPolygonPointsArray, clearAllAddPointsData,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { resetNewPolygonData } from '../../../objects/polygon/polygon';
import { clearBoundingBoxData, deselectBoundingBox } from '../../../objects/boundingBox/boundingBox';
import { cancelLabellingProcess } from '../../../../tools/shapeLabellerModal/buttonEventHandlers';
import { removeEditedPolygonId } from '../eventWorkers/editPolygonEventsWorker';
import {
  getAddingPolygonPointsState, getRemovingPolygonPointsState, getAlteringPolygonPointsState,
  setAlteringPolygonPointsState, setReadyToDrawShapeState, setCancelledReadyToDrawState,
  getReadyToDrawShapeState,
} from '../../../../tools/toolkit/buttonClickEvents/facadeWorkersUtils/stateMachine';
import { removeHighlightOfListLabel } from '../../../../tools/labelList/labelListHighlightUtils';

function interruptCanvasEventsWithoutRemovingExistingPoints() {
  removeHighlightOfListLabel();
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
  deselectBoundingBox();
  interruptCanvasEventsWithoutRemovingExistingPoints();
}

function interruptCanvasToStartAddPoints() {
  if (!getAddingPolygonPointsState()) {
    interruptCanvasEventsWithoutRemovingExistingPoints();
  }
}

export { interruptCanvasToStartAddPoints, interruptAllCanvasEvents };
