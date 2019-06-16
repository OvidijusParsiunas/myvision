import {
  removePolygon, clearAllAddPointsData, isAddingPointsToPolygon, removePolygonPoints,
} from '../../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import {
  resetNewPolygonData, isPolygonDrawingInProgress, isPolygonDrawingFinished, resetDrawPolygonMode,
} from '../../../../canvas/objects/polygon/polygon';
import { clearBoundingBoxData, isBoundingBoxDrawingFinished, resetDrawBoundingBoxMode } from '../../../../canvas/objects/boundingBox/boundingBox';
import { removeEditedPolygonId } from '../../../../canvas/mouseInteractions/mouseEvents/eventWorkers/editPolygonEventsWorker';
import purgeCanvasMouseEvents from '../../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignAddPointsOnExistingPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/addPointsEventHandlers';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../../canvas/mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode';
import {
  getAddingPolygonPointsState, getContinuousDrawingState,
  getRemovingPolygonPointsState, setRemovingPolygonPointsState,
} from '../facadeWorkersUtils/stateManager';
import { isLabelling, removeTargetShape } from '../../../labellerPopUp/labellingProcess';
import { hideLabelPopUp } from '../../../labellerPopUp/style';
import assignDrawPolygonEvents from '../../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';

function removeBoundingBox(canvas) {
  const activeObect = canvas.getActiveObject();
  if (activeObect && activeObect.shapeName === 'bndBox') {
    canvas.remove(activeObect);
    clearBoundingBoxData();
    return true;
  }
  return false;
}

function removeIfContinuousDrawing(canvas) {
  if (getContinuousDrawingState()) {
    if (isLabelling()) {
      if (isPolygonDrawingFinished()) {
        hideLabelPopUp();
        removeTargetShape();
        resetDrawPolygonMode();
      } else if (isBoundingBoxDrawingFinished()) {
        hideLabelPopUp();
        removeTargetShape();
        resetDrawBoundingBoxMode();
      }
      return true;
    }
    if (isPolygonDrawingInProgress()) {
      if (getRemovingPolygonPointsState()) {
        setRemovingPolygonPointsState(false);
      }
      resetNewPolygonData();
      purgeCanvasMouseEvents(canvas);
      assignDrawPolygonEvents(canvas);
      return true;
    }
  }
  return false;
}

function removeActiveShapeEvent(canvas) {
  if (!removeIfContinuousDrawing(canvas) && !removeBoundingBox(canvas)) {
    if (isAddingPointsToPolygon()) {
      purgeCanvasMouseEvents(canvas);
      assignAddPointsOnExistingPolygonEvents(canvas);
      clearAllAddPointsData();
      setInitialStageOfAddPointsOnExistingPolygonMode(canvas);
    } else if (getAddingPolygonPointsState()) {
      clearAllAddPointsData();
    }
    removePolygon();
    removePolygonPoints();
    removeEditedPolygonId();
  }
}

export { removeActiveShapeEvent as default };
