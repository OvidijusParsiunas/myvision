import {
  removePolygonPoints, displayPolygonPointsAfterMove,
  setEditablePolygonAfterMoving, resetPolygonSelectableArea,
  setEditablePolygon, movePolygonPoint, highlightSelectedPolygonViaPoint,
  sendPolygonPointsToFront, getPolygonEditingStatus, defaultFillSelectedPolygonViaPoint,
} from '../../../objects/polygon/alterPolygon/alterPolygon.js';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils.js';
import { getLabelById } from '../../../objects/label/label.js';
import labelProperies from '../../../objects/label/properties.js';
import {
  getRemovingPointsAfterCancelDrawState, getCurrentZoomState,
  getShapeMovingState, setShapeMovingState, setSessionDirtyState,
  setRemovingPointsAfterCancelDrawState, setLastPolygonActionWasMoveState,
  getBoundingBoxScalingState, setBoundingBoxScalingState, getDoubleScrollCanvasState,
} from '../../../../tools/state.js';
import { highlightLabelInTheList, removeHighlightOfListLabel } from '../../../../tools/labelList/labelListHighlightUtils.js';
import { highlightShapeFill, defaultShapeFill } from '../../../objects/allShapes/allShapes.js';
import { updateNumberOfUncheckedMLImages } from '../../../../tools/imageList/imageListML.js';
import { getImageProperties } from '../../../../tools/imageList/uploadImages/drawImageOnCanvas.js';
import { setInitialBoundingBoxCoordinates, handleBoundingBoxScalingEvents, clearControlSelectedObject } from '../../../objects/boundingBox/scaling.js';
import { preventOutOfBoundsPointsOnMove, preventOutOfBoundsShapesOnMove, validateAndFixOutOfBoundsPolygonShapePointsAfterMove } from '../../../objects/sharedUtils/moveBlockers.js';
import { setRemoveLabelsButtonToDefault, setRemoveLabelsButtonToDisabled } from '../../../../tools/toolkit/styling/state.js';

let canvas = null;
let labelObject = null;
let polygonMoved = false;
let boundingBoxMoved = false;
let polygonPointMoved = false;
let selectedShapeId = null;
let shapeSetToInvisible = false;
let newPolygonSelected = false;
let setEditablePolygonOnClick = null;
let finishedAddingNewPoints = false;
let lastShapeSelectedIsBoundingBox = false;
let removeBoundingBoxFillWhenScaling = false;
let mouseIsDown = false;
let zoomOverflowElement = null;

function programaticallySelectBoundingBox(boundingBoxObj) {
  canvas.setActiveObject(boundingBoxObj);
}

function programaticallyDeselectBoundingBox() {
  canvas.discardActiveObject();
  canvas.renderAll();
}

function selectShape(shape) {
  highlightLabelInTheList(shape);
  setRemoveLabelsButtonToDefault();
}

function deselectShape() {
  removeHighlightOfListLabel();
  setRemoveLabelsButtonToDisabled();
}

function setEditablePolygonOnClickFunc(event) {
  if (getPolygonEditingStatus()) {
    // selecting another polygon without moving the first one
    removePolygonPoints();
  }
  setEditablePolygon(canvas, event.target);
  selectedShapeId = event.target.id;
}

function setEditablePolygonWhenPolygonMoved(event) {
  if (newPolygonSelected) {
    setEditablePolygonAfterMoving(canvas, event.target);
    selectedShapeId = event.target.id;
  } else {
    displayPolygonPointsAfterMove();
  }
}

function resetPolygonSelectableAreaAfterPointMoved() {
  resetPolygonSelectableArea();
  polygonPointMoved = false;
}

function setPolygonNotEditableOnClick() {
  removePolygonPoints();
  selectedShapeId = null;
}

// smart system where label would readjust upon mouse up if it's edges are outside of canvas
// stop shapes from being able to move outside of canvas

// validation for label (not empty string etc.)

// upon selecting-dragging a polygon does not remove the active label of the previous shape on list
// whereas rectangle is immediate, only way this can be mitigated is by removing rectangle controls
// on moving it in order to have delay the label change too, or you can display polygon points
// on mouse down click and upon moving the polygon

// use different colours for different labels
// investigate the potential of having a rightclick menu to manipulate shapes
// in add or remove points modes, send all objects to the front

// think about adding a screen wide scrosshair and show coordinates to the user

function setMLGeneratedPalletteToOriginal(shape) {
  updateNumberOfUncheckedMLImages();
  shape.fill = shape.trueFill;
  shape.stroke = shape.trueStroke;
  shape.MLPallette = false;
}

// reduce nested if statements in code
function polygonMouseDownEvents(event) {
  mouseIsDown = true;
  if (event.target) {
    enableActiveObjectsAppearInFront(canvas);
    if (event.target.shapeName === 'bndBox') {
      deselectShape();
      if (event.target.MLPallette) {
        setMLGeneratedPalletteToOriginal(event.target);
        highlightShapeFill(event.target.id);
      }
      if (event.transform && event.transform.corner) {
        setInitialBoundingBoxCoordinates(event);
      }
      selectShape(event.target.id);
      if (getPolygonEditingStatus()) {
        setPolygonNotEditableOnClick();
        newPolygonSelected = false;
      }
      labelObject = getLabelById(event.target.id);
      selectedShapeId = event.target.id;
      lastShapeSelectedIsBoundingBox = true;
      preventActiveObjectsAppearInFront(canvas);
    } else {
      if (event.target.shapeName === 'polygon' && event.target.id !== selectedShapeId) {
        if (lastShapeSelectedIsBoundingBox) {
          deselectShape();
          lastShapeSelectedIsBoundingBox = false;
        }
        labelObject = getLabelById(event.target.id);
        newPolygonSelected = true;
      } else {
        newPolygonSelected = false;
      }
      preventActiveObjectsAppearInFront(canvas);
    }
  } else {
    newPolygonSelected = false;
  }
  if ((newPolygonSelected || lastShapeSelectedIsBoundingBox)
    && getRemovingPointsAfterCancelDrawState()) {
    setRemovingPointsAfterCancelDrawState(false);
  }
}

function handleShapeFillAfterMove(event) {
  const pointer = canvas.getPointer(canvas.e);
  const currentZoomState = getCurrentZoomState();
  const { height, width } = getImageProperties();
  const imageHeight = height * currentZoomState;
  const imageWidth = width * currentZoomState;
  if (pointer.x < 0 || imageWidth / currentZoomState < pointer.x
    || pointer.y < 0 || imageHeight / currentZoomState < pointer.y) {
    if (event.target.shapeName === 'point') {
      defaultFillSelectedPolygonViaPoint();
    } else {
      defaultShapeFill(event.target.id);
    }
  }
  setShapeMovingState(false);
}

function shapeMouseOutEvents(event) {
  if (!getBoundingBoxScalingState() && !getShapeMovingState()) {
    if (event.target.shapeName === 'point') {
      defaultFillSelectedPolygonViaPoint();
    } else {
      defaultShapeFill(event.target.id);
    }
  } else {
    removeBoundingBoxFillWhenScaling = true;
  }
}

// look at this
function polygonMouseUpEvents(event) {
  mouseIsDown = false;
  if (event.target && event.target.shapeName === 'bndBox') {
    if (boundingBoxMoved) { boundingBoxMoved = false; }
    if (getBoundingBoxScalingState()) {
      setBoundingBoxScalingState(false);
      if (removeBoundingBoxFillWhenScaling) {
        shapeMouseOutEvents(event);
        removeBoundingBoxFillWhenScaling = false;
      }
    }
    canvas.bringToFront(event.target);
    canvas.bringToFront(labelObject);
    clearControlSelectedObject();
  } else if (polygonMoved) {
    selectShape(event.target.id);
    validateAndFixOutOfBoundsPolygonShapePointsAfterMove(event.target);
    setEditablePolygonWhenPolygonMoved(event);
    highlightShapeFill(event.target.id);
    canvas.bringToFront(labelObject);
    setLastPolygonActionWasMoveState(true);
  } else if (newPolygonSelected) {
    if (finishedAddingNewPoints) {
      finishedAddingNewPoints = false;
    } else {
      selectShape(event.target.id);
    }
    canvas.bringToFront(event.target);
    setEditablePolygonOnClick(event);
    canvas.bringToFront(labelObject);
  } else if (polygonPointMoved) {
    resetPolygonSelectableAreaAfterPointMoved();
    setSessionDirtyState(true);
  } else if (event.target && event.target.shapeName === 'polygon') {
    selectShape(event.target.id);
    sendPolygonPointsToFront(canvas);
  } else if (!event.target && getPolygonEditingStatus()) {
    deselectShape();
    setPolygonNotEditableOnClick();
  } else if (selectedShapeId != null || shapeSetToInvisible) {
    deselectShape();
    shapeSetToInvisible = false;
  }
  if (getShapeMovingState()) {
    handleShapeFillAfterMove(event);
    if (polygonMoved) { polygonMoved = false; }
    setSessionDirtyState(true);
  }
}

function polygonMoveEvents(event) {
  if (event.target) {
    setShapeMovingState(true);
    const { shapeName } = event.target;
    if (shapeName === 'polygon') {
      preventOutOfBoundsShapesOnMove(event.target, canvas);
      if (getPolygonEditingStatus()) {
        removePolygonPoints();
      }
      labelObject.setCoords();
      labelObject.top = event.target.top - event.target.labelOffsetTop;
      labelObject.left = event.target.left - event.target.labelOffsetLeft;
      polygonMoved = true;
    } else if (shapeName === 'point') {
      preventOutOfBoundsPointsOnMove(event.target, canvas);
      if (event.target.pointId === 0) {
        movePolygonPoint(event, labelObject);
      } else {
        movePolygonPoint(event);
      }
      resetPolygonSelectableAreaAfterPointMoved();
      polygonPointMoved = true;
    } else if (shapeName === 'bndBox') {
      preventOutOfBoundsShapesOnMove(event.target, canvas);
      labelObject.setCoords();
      labelObject.top = event.target.top;
      labelObject.left = event.target.left + labelProperies.boundingBoxOffsetProperties().left;
      if (event.target.isGeneratedViaML) {
        event.target.isGeneratedViaML = false;
      }
      boundingBoxMoved = true;
    }
  }
}

function boundingBoxScalingEvents(event) {
  handleBoundingBoxScalingEvents(event, labelObject, canvas);
  setSessionDirtyState(true);
}

function shapeMouseOverEvents(event) {
  if (event.target && event.target.shapeName !== 'label') {
    if (event.target.MLPallette) {
      setMLGeneratedPalletteToOriginal(event.target);
    }
    if (event.target.shapeName === 'point') {
      highlightSelectedPolygonViaPoint();
    } else {
      highlightShapeFill(event.target.id);
    }
  }
}

function removeEditedPolygonId() {
  selectedShapeId = null;
}

function removeActiveLabelObject() {
  labelObject = null;
}

function setShapeToInvisible() {
  selectedShapeId = null;
  shapeSetToInvisible = true;
}

function assignSetEditablePolygonOnClickFunc() {
  setEditablePolygonOnClick = setEditablePolygonOnClickFunc;
}

function skipMouseUpEvent() {
  canvas.__eventListeners['mouse:down'] = [];
  canvas.on('mouse:down', (e) => {
    polygonMouseDownEvents(e);
  });
  assignSetEditablePolygonOnClickFunc();
}

function prepareCanvasForDefaultEvents(canvasObj, polygonObjId, afterAddPoints) {
  canvas = canvasObj;
  zoomOverflowElement = document.getElementById('zoom-overflow');
  // selected add then remove -> remve will null it
  // selected remove then add -> add will null it
  // selected
  if (polygonObjId !== undefined && polygonObjId !== null) {
    selectedShapeId = polygonObjId;
    labelObject = getLabelById(selectedShapeId);
    selectShape(selectedShapeId);
  }
  if (afterAddPoints) {
    selectedShapeId = null;
    newPolygonSelected = true;
    finishedAddingNewPoints = true;
    lastShapeSelectedIsBoundingBox = false;
    setEditablePolygonOnClick = skipMouseUpEvent;
  } else {
    setEditablePolygonOnClick = setEditablePolygonOnClickFunc;
  }
  setRemovingPointsAfterCancelDrawState(false);
}

// function validateBoundingBoxFullyOnCanvas(boundingBox) {
//   if (boundingBox.left + boundingBox.width > canvas.width) {
//     const surplus = boundingBox.left + boundingBox.width - canvas.width;
//     boundingBox.width -= surplus + 2;
//   } else if (boundingBox.top + boundingBox.height > canvas.height) {
//     const surplus = boundingBox.top + boundingBox.height - canvas.height;
//     boundingBox.height -= surplus + 2;
//   }
// }
// remove this if the bug is fixed for scaling in top-right/bottom-left

function getLastSelectedShapeId() {
  return selectedShapeId;
}

function getScrollWidth() {
  // create a div with the scroll
  const div = document.createElement('div');
  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';

  // must put it in the document, otherwise sizes will be 0
  document.body.append(div);
  const scrollWidth = div.offsetWidth - div.clientWidth;
  div.remove();
  return scrollWidth * 2;
}

function boundingBoxScalingWhenScrolling(event, newPositionTop) {
  if (event.transform.corner === 'mb') {
    if (event.target.top < newPositionTop) {
      event.target.set({ top: event.target.top });
    }
    event.target.set({ height: Math.abs(event.target.top - newPositionTop) });
  } else if (event.transform.corner === 'mt') {
    if (event.target.top > newPositionTop) {
      const newHeight = Math.abs(event.target.top - newPositionTop + event.target.height);
      event.target.set({ height: newHeight });
      event.target.set({ top: newPositionTop });
    } else if (newPositionTop < event.target.top + event.target.height) {
      const newHeight = Math.abs(event.target.height - (newPositionTop - event.target.top));
      event.target.set({ height: newHeight });
      event.target.set({ top: newPositionTop });
    }
  }
}

function topOverflowScroll(event) {
  const currentScrollTopOffset = zoomOverflowElement.scrollTop / getCurrentZoomState();
  const newPositionTop = canvas.getPointer(event.e).y - currentScrollTopOffset;
  if (event.target.shapeName === 'bndBox') {
    if (event.transform.action === 'scaleY') {
      boundingBoxScalingWhenScrolling(event, newPositionTop);
    } else {
      event.target.top = newPositionTop - event.transform.offsetY;
    }
  } else
  if (event.target.shapeName === 'polygon') {
    event.target.top = newPositionTop - event.transform.offsetY;
  } else if (event.target.shapeName === 'point') {
    event.target.top = newPositionTop;
  }
}

function bottomOverflowScroll(event, stubHeight, scrollWidth) {
  const canvasHeight = stubHeight + scrollWidth;
  const canvasBottom = zoomOverflowElement.scrollTop + zoomOverflowElement.offsetHeight;
  const result = canvasHeight - canvasBottom;
  const newPositionTop = canvas.getPointer(event.e).y + (result / getCurrentZoomState());
  if (event.target.shapeName === 'bndBox') {
    if (event.transform.action === 'scaleY') {
      boundingBoxScalingWhenScrolling(event, newPositionTop);
    } else {
      event.target.top = newPositionTop - event.transform.offsetY;
    }
  } else if (event.target.shapeName === 'polygon') {
    event.target.top = newPositionTop - event.transform.offsetY;
  } else if (event.target.shapeName === 'point') {
    event.target.top = newPositionTop;
  }
}

function defaultScroll(event) {
  const currentVerticalScrollDelta = event.e.deltaY / getCurrentZoomState();
  const newPositionTop = canvas.getPointer(event.e).y + currentVerticalScrollDelta;
  if (event.target.shapeName === 'bndBox') {
    if (event.transform.action === 'scaleY') {
      boundingBoxScalingWhenScrolling(event, newPositionTop);
    } else {
      event.target.top = newPositionTop - event.transform.offsetY;
    }
  } else if (event.target.shapeName === 'polygon') {
    event.target.top = newPositionTop - event.transform.offsetY;
  } else if (event.target.shapeName === 'point') {
    const currentHorizontalScrollDelta = event.e.deltaX / getCurrentZoomState();
    event.target.left = canvas.getPointer(event.e).x + currentHorizontalScrollDelta;
    event.target.top = newPositionTop;
  }
}

function shapeScrollEvents(event) {
  if (mouseIsDown) {
    if (event.target.shapeName === 'point' || event.target.shapeName === 'polygon' || event.target.shapeName === 'bndBox') {
      const currentZoom = getCurrentZoomState();
      if (currentZoom > 1.00001) {
        const stubElement = document.getElementById('stub');
        const stubMarginTop = stubElement.style.marginTop;
        const stubHeightSubstring = stubMarginTop.substring(0, stubMarginTop.length - 2);
        const stubHeight = parseInt(stubHeightSubstring, 10);
        const currentBotLocation = zoomOverflowElement.scrollTop + zoomOverflowElement.offsetHeight;
        const futureBotLocation = currentBotLocation + event.e.deltaY;
        const scrollWidth = getDoubleScrollCanvasState() ? getScrollWidth() : getScrollWidth() / 2;
        if (zoomOverflowElement.scrollTop + event.e.deltaY < 0) {
          topOverflowScroll(event);
        } else if (futureBotLocation > stubHeight + scrollWidth) {
          bottomOverflowScroll(event, stubHeight, scrollWidth);
        } else {
          defaultScroll(event);
        }
        polygonMoveEvents(event);
      }
    }
  }
}

export {
  programaticallyDeselectBoundingBox, getLastSelectedShapeId,
  shapeScrollEvents, removeActiveLabelObject, shapeMouseOverEvents,
  polygonMouseDownEvents, polygonMouseUpEvents, shapeMouseOutEvents,
  programaticallySelectBoundingBox, setShapeToInvisible, polygonMoveEvents,
  prepareCanvasForDefaultEvents, boundingBoxScalingEvents, removeEditedPolygonId,
};
