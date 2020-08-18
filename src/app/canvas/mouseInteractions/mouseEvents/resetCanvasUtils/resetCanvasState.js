import {
  changePolygonPointsPropertiesToDefault, removePolygonPoints,
  cleanPolygonPointsArray, clearAllAddPointsData,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { resetNewPolygonData } from '../../../objects/polygon/polygon';
import { clearBoundingBoxData, deselectBoundingBox } from '../../../objects/boundingBox/boundingBox';
import { cancelLabellingProcess } from '../../../../tools/labellerModal/buttonEventHandlers';
import { removeEditedPolygonId } from '../eventWorkers/defaultEventsWorker';
import {
  getAddingPolygonPointsState, getRemovingPolygonPointsState, getAlteringPolygonPointsState,
  setAlteringPolygonPointsState, setReadyToDrawShapeState, setCancelledReadyToDrawState,
  getReadyToDrawShapeState,
} from '../../../../tools/state';
import { removeHighlightOfListLabel } from '../../../../tools/labelList/labelListHighlightUtils';
import { setPolygonEditingButtonsToDefault, setRemoveLabelsButtonToDisabled } from '../../../../tools/toolkit/styling/state';

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
    setPolygonEditingButtonsToDefault();
    setAlteringPolygonPointsState(false);
  }
  setRemoveLabelsButtonToDisabled();
  setPolygonEditingButtonsToDefault();
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
