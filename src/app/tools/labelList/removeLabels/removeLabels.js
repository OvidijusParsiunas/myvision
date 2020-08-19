import {
  removePolygon, clearAllAddPointsData, isAddingPointsToPolygon, removePolygonPoints,
} from '../../../canvas/objects/polygon/alterPolygon/alterPolygon';
import { resetNewPolygonData, isPolygonDrawingFinished, resetDrawPolygonMode } from '../../../canvas/objects/polygon/polygon';
import { clearBoundingBoxData, isBoundingBoxDrawingFinished, resetDrawBoundingBoxMode } from '../../../canvas/objects/boundingBox/boundingBox';
import { removeEditedPolygonId, removeActiveLabelObject } from '../../../canvas/mouseInteractions/mouseEvents/eventWorkers/defaultEventsWorker';
import purgeCanvasMouseEvents from '../../../canvas/mouseInteractions/mouseEvents/resetCanvasUtils/purgeAllMouseHandlers';
import assignAddPointsOnExistingPolygonEvents from '../../../canvas/mouseInteractions/mouseEvents/eventHandlers/addPointsEventHandlers';
import setInitialStageOfAddPointsOnExistingPolygonMode from '../../../canvas/mouseInteractions/cursorModes/initialiseAddPointsOnExistingPolygonMode';
import {
  getRemovingPolygonPointsState, setRemovingPolygonPointsState,
  getBoundingBoxDrawingInProgressState, getPolygonDrawingInProgressState,
  getAddingPolygonPointsState, getContinuousDrawingState, getCurrentImageId,
} from '../../state';
import { isLabelling, removeTargetShape } from '../../labellerModal/labellingProcess';
import { hideLabellerModal } from '../../labellerModal/style';
import assignDrawPolygonEvents from '../../../canvas/mouseInteractions/mouseEvents/eventHandlers/drawPolygonEventHandlers';
import { removeLabel } from '../../../canvas/objects/label/label';
import { removeLabelFromListOnShapeDelete, getCurrentlySelectedLabelShape } from '../labelList';
import { removeShape, getNumberOfShapes } from '../../../canvas/objects/allShapes/allShapes';
import { removeTickSVGOverImageThumbnail, getAllImageData } from '../../imageList/imageList';
import {
  setRemovePointsButtonToDefault,
  setRemoveLabelsButtonToDisabled,
  setPolygonEditingButtonsToDisabled,
} from '../../toolkit/styling/state';

let canvas = null;

function removeBoundingBox(mLGeneratedObject) {
  const activeObject = mLGeneratedObject || canvas.getActiveObject()
    || getCurrentlySelectedLabelShape();
  if (activeObject && activeObject.shapeName === 'bndBox') {
    removeShape(activeObject.id);
    removeLabel(activeObject.id, canvas);
    removeActiveLabelObject();
    removeLabelFromListOnShapeDelete(activeObject.id);
    clearBoundingBoxData();
    return true;
  }
  if (getBoundingBoxDrawingInProgressState()) {
    clearBoundingBoxData();
    return true;
  }
  return false;
}

function removeIfContinuousDrawing() {
  if (getContinuousDrawingState()) {
    if (isLabelling()) {
      if (isPolygonDrawingFinished()) {
        hideLabellerModal();
        removeTargetShape();
        resetDrawPolygonMode();
      } else if (isBoundingBoxDrawingFinished()) {
        hideLabellerModal();
        removeTargetShape();
        resetDrawBoundingBoxMode();
      }
      return true;
    }
    if (getPolygonDrawingInProgressState()) {
      if (getRemovingPolygonPointsState()) {
        setRemovePointsButtonToDefault();
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

function removeActiveLabel() {
  if (!removeIfContinuousDrawing() && !removeBoundingBox()) {
    if (isAddingPointsToPolygon()) {
      purgeCanvasMouseEvents(canvas);
      assignAddPointsOnExistingPolygonEvents(canvas);
      clearAllAddPointsData();
      setInitialStageOfAddPointsOnExistingPolygonMode(canvas);
    } else if (getAddingPolygonPointsState()) {
      clearAllAddPointsData();
    }
    const polygonId = removePolygon(getCurrentlySelectedLabelShape());
    removeLabelFromListOnShapeDelete(polygonId);
    removePolygonPoints();
    removeEditedPolygonId();
    if (setPolygonEditingButtonsToDisabled()) window.editShapes();
  }
  if (getAllImageData().length > 0 && getNumberOfShapes() === 0) {
    removeTickSVGOverImageThumbnail(getCurrentImageId());
  }
  setRemoveLabelsButtonToDisabled();
}

function assignCanvasForRemovingLabels(canvasObj) {
  canvas = canvasObj;
}

export { assignCanvasForRemovingLabels, removeActiveLabel, removeBoundingBox };
