import {
  setEditablePolygon, movePolygonPoint,
  removePolygonPoints, displayPolygonPointsAfterMove,
  setEditablePolygonAfterMoving, resetPolygonSelectableArea,
  sendPolygonPointsToFront, getPolygonEditingStatus,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils';
import { getLabelById } from '../../../objects/label/label';
import labelProperies from '../../../objects/label/properties';
import {
  setRemovingPointsAfterCancelDrawState, setLastPolygonActionWasMoveState,
  getRemovingPointsAfterCancelDrawState, getCurrentZoomState, getDoubleScrollCanvasState,
} from '../../../../tools/toolkit/buttonClickEvents/facadeWorkersUtils/stateManager';
import { highlightLabelInTheList, removeHighlightOfListLabel } from '../../../../tools/labelList/labelListHighlightUtils';
import { highlightShapeFill, defaultShapeFill } from '../../../objects/allShapes/allShapes';
import { updateNumberOfUncheckedMLImages } from '../../../../tools/imageList/imageListML';
import { getImageProperties } from '../../../../tools/toolkit/buttonClickEvents/facadeWorkersUtils/uploadFile/drawImageOnCanvas';

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
let mouseIsDown = false;
let zoomOverflowElement = null;

let bottomPositionBeforeOverflow = 0;
let topPositionBeforeOverflow = 0;
let leftPositionBeforeOverflow = 0;
let rightPositionBeforeOverflow = 0;

function programaticallySelectBoundingBox(boundingBoxObj) {
  canvas.setActiveObject(boundingBoxObj);
}

function programaticallyDeselectBoundingBox() {
  canvas.discardActiveObject();
  canvas.renderAll();
}

function setEditablePolygonOnClickFunc(event) {
  if (getPolygonEditingStatus()) {
    // selecting another polygon without moving the first one
    removePolygonPoints();
  }
  setEditablePolygon(canvas, event.target);
  selectedShapeId = event.target.id;
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

function setEditablePolygonWhenPolygonMoved(event) {
  if (newPolygonSelected) {
    setEditablePolygonAfterMoving(canvas, event.target);
    selectedShapeId = event.target.id;
  } else {
    displayPolygonPointsAfterMove();
  }
  polygonMoved = false;
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
      removeHighlightOfListLabel();
      if (event.target.MLPallette) {
        setMLGeneratedPalletteToOriginal(event.target);
        highlightShapeFill(event.target.id);
      }
      highlightLabelInTheList(event.target.id);
      if (getPolygonEditingStatus()) {
        setPolygonNotEditableOnClick();
        newPolygonSelected = false;
      }
      selectedShapeId = event.target.id;
      labelObject = getLabelById(event.target.id);
      lastShapeSelectedIsBoundingBox = true;
      preventActiveObjectsAppearInFront(canvas);
    } else {
      if (event.target.shapeName === 'polygon' && event.target.id !== selectedShapeId) {
        if (lastShapeSelectedIsBoundingBox) {
          removeHighlightOfListLabel();
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

function clearShapeOverflowValues() {
  bottomPositionBeforeOverflow = 0;
  topPositionBeforeOverflow = 0;
  leftPositionBeforeOverflow = 0;
  rightPositionBeforeOverflow = 0;
}

// look at this
function polygonMouseUpEvents(event) {
  mouseIsDown = false;
  clearShapeOverflowValues();
  if (event.target && event.target.shapeName === 'bndBox') {
    if (boundingBoxMoved) {
      clearShapeOverflowValues();
      boundingBoxMoved = false;
    }
    canvas.bringToFront(event.target);
    canvas.bringToFront(labelObject);
  } else if (polygonMoved) {
    highlightLabelInTheList(event.target.id);
    setEditablePolygonWhenPolygonMoved(event);
    highlightShapeFill(event.target.id);
    canvas.bringToFront(labelObject);
    clearShapeOverflowValues();
    setLastPolygonActionWasMoveState(true);
  } else if (newPolygonSelected) {
    if (finishedAddingNewPoints) {
      finishedAddingNewPoints = false;
    } else {
      highlightLabelInTheList(event.target.id);
    }
    canvas.bringToFront(event.target);
    setEditablePolygonOnClick(event);
    canvas.bringToFront(labelObject);
  } else if (polygonPointMoved) {
    resetPolygonSelectableAreaAfterPointMoved();
    clearShapeOverflowValues();
  } else if (event.target && event.target.shapeName === 'polygon') {
    highlightLabelInTheList(event.target.id);
    sendPolygonPointsToFront(canvas);
  } else if (!event.target && getPolygonEditingStatus()) {
    removeHighlightOfListLabel();
    setPolygonNotEditableOnClick();
  } else if (selectedShapeId != null || shapeSetToInvisible) {
    removeHighlightOfListLabel();
    shapeSetToInvisible = false;
  }
}

// the zoom is not properly showing the full images

function preventOutOfBoundsZoomed(shape) {
  shape.setCoords();
  const { scrollLeft, scrollTop } = zoomOverflowElement;
  const { height, width } = getImageProperties();
  const imageHeight = height * getCurrentZoomState();
  const imageWidth = width * getCurrentZoomState();
  // multiple if statements because of corners
  // the first min/max arg is consistently changed as the user keeps scrolling past the boundary
  // the second min/max arg makes sure it doesn't go too far
  // top
  if (shape.getBoundingRect().top < -scrollTop) {
    shape.top = Math.max(shape.top, topPositionBeforeOverflow);
  } else {
    topPositionBeforeOverflow = shape.top;
  }
  // left
  if (shape.getBoundingRect().left < -scrollLeft) {
    shape.left = Math.max(shape.left, leftPositionBeforeOverflow);
  } else {
    leftPositionBeforeOverflow = shape.left;
  }
  // bottom
  if (scrollTop + shape.getBoundingRect().top + shape.getBoundingRect().height > imageHeight) {
    shape.top = Math.min(shape.top, bottomPositionBeforeOverflow);
  } else {
    bottomPositionBeforeOverflow = shape.top;
  }
  // right
  if (scrollLeft + shape.getBoundingRect().left + shape.getBoundingRect().width > imageWidth) {
    shape.left = Math.min(shape.left, rightPositionBeforeOverflow);
  } else {
    rightPositionBeforeOverflow = shape.left;
  }
}

function preventOutOfBoundsDefault(shape) {
  shape.setCoords();
  // top
  if (shape.getBoundingRect().top < 0) {
    shape.top = Math.max(shape.top, 0);
  }
  // left
  if (shape.getBoundingRect().left < 0) {
    shape.left = Math.max(shape.left, 0);
  }
  // bottom
  if (shape.getBoundingRect().top + shape.getBoundingRect().height > canvas.height) {
    shape.top = Math.min(shape.top, (canvas.height / getCurrentZoomState())
     - (shape.getBoundingRect().height / getCurrentZoomState()));
  }
  // right
  if (shape.getBoundingRect().left + shape.getBoundingRect().width > canvas.width) {
    shape.left = Math.min(shape.left, (canvas.width / getCurrentZoomState()
     - (shape.getBoundingRect().width / getCurrentZoomState())));
  }
}

function preventOutOfBoundsPointsZoomed(shape) {
  shape.setCoords();
  const { scrollLeft, scrollTop } = zoomOverflowElement;
  const { height, width } = getImageProperties();
  const imageHeight = height * getCurrentZoomState();
  const imageWidth = width * getCurrentZoomState();
  // multiple if statements because of corners
  // the first min/max arg is consistently changed as the user keeps scrolling past the boundary
  // the second min/max arg makes sure it doesn't go too far
  // top
  if (shape.getBoundingRect().top + (shape.getBoundingRect().height / 2) < -scrollTop) {
    shape.top = Math.max(shape.top, topPositionBeforeOverflow);
  } else {
    topPositionBeforeOverflow = shape.top;
  }
  // left
  if (shape.getBoundingRect().left + (shape.getBoundingRect().width / 2) < -scrollLeft) {
    shape.left = Math.max(shape.left, leftPositionBeforeOverflow);
  } else {
    leftPositionBeforeOverflow = shape.left;
  }
  // bottom
  if (scrollTop + shape.getBoundingRect().top + (shape.getBoundingRect().height / 2)
   > imageHeight) {
    shape.top = Math.min(shape.top, bottomPositionBeforeOverflow);
  } else {
    bottomPositionBeforeOverflow = shape.top;
  }
  // right
  if (scrollLeft + shape.getBoundingRect().left + (shape.getBoundingRect().width / 2)
  > imageWidth) {
    shape.left = Math.min(shape.left, rightPositionBeforeOverflow);
  } else {
    rightPositionBeforeOverflow = shape.left;
  }
}

function preventOutOfBoundsPointsDefault(shape) {
  shape.setCoords();
  // top
  if (shape.getBoundingRect().top + (shape.getBoundingRect().height / 2) < 0) {
    shape.top = Math.max(shape.top, 0);
  }
  // left
  if (shape.getBoundingRect().left + (shape.getBoundingRect().width / 2) < 0) {
    shape.left = Math.max(shape.left, 0);
  }
  // bottom
  if (shape.getBoundingRect().top + (shape.getBoundingRect().height / 2) > canvas.height) {
    shape.top = Math.min(shape.top, (canvas.height / getCurrentZoomState())
     - (shape.getBoundingRect().height / getCurrentZoomState() / 2));
  }
  // right
  if (shape.getBoundingRect().left + (shape.getBoundingRect().width / 2) > canvas.width) {
    shape.left = Math.min(shape.left, (canvas.width / getCurrentZoomState()
     - (shape.getBoundingRect().width / getCurrentZoomState() / 2)));
  }
}

function preventOutOfBounds(shape) {
  if (getCurrentZoomState() > 1.00001) {
    if (shape.shapeName === 'point') {
      preventOutOfBoundsPointsZoomed(shape);
    } else {
      preventOutOfBoundsZoomed(shape);
    }
  } else if (shape.shapeName === 'point') {
    preventOutOfBoundsPointsDefault(shape);
  } else {
    preventOutOfBoundsDefault(shape);
  }
}

// potentially refactor this by assigning individual move functions
function polygonMoveEvents(event) {
  if (event.target) {
    const { shapeName } = event.target;
    if (shapeName === 'polygon') {
      preventOutOfBounds(event.target);
      if (getPolygonEditingStatus()) {
        removePolygonPoints();
      }
      labelObject.setCoords();
      labelObject.top = event.target.top - event.target.labelOffsetTop;
      labelObject.left = event.target.left - event.target.labelOffsetLeft;
      polygonMoved = true;
    } else if (shapeName === 'point') {
      preventOutOfBounds(event.target);
      if (event.target.pointId === 0) {
        movePolygonPoint(event, labelObject);
      } else {
        movePolygonPoint(event);
      }
      resetPolygonSelectableAreaAfterPointMoved();
      polygonPointMoved = true;
    } else if (shapeName === 'bndBox') {
      preventOutOfBounds(event.target);
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

// set styling
function shapeMouseOutEvents(event) {
  defaultShapeFill(event.target.id);
}

function shapeMouseOverEvents(event) {
  if (event.target && event.target.shapeName !== 'point' && event.target.shapeName !== 'label') {
    if (event.target.MLPallette) {
      setMLGeneratedPalletteToOriginal(event.target);
    }
    highlightShapeFill(event.target.id);
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

function setEditPolygonEventObjects(canvasObj, polygonObjId, afterAddPoints) {
  canvas = canvasObj;
  zoomOverflowElement = document.getElementById('zoom-overflow');
  // selected add then remove -> remve will null it
  // selected remove then add -> add will null it
  // selected
  if (polygonObjId !== undefined && polygonObjId !== null) {
    selectedShapeId = polygonObjId;
    labelObject = getLabelById(selectedShapeId);
    highlightLabelInTheList(selectedShapeId);
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

// strategy for when zoomed in
// disable the blocking
// readjust when zooming out (cut it)
// find if canvas edge visible on zoom out and cut!

// or change the boundaries depending on how far the scroll is
// scale changes depending on the zoom

let left1 = 0;
let top1 = 0;
let scale1x = 0;
let scale1y = 0;
let width1 = 0;
let height1 = 0;

function boundingBoxScalingEvents(event) {
  if (event.target.shapeName === 'bndBox') {
    const boundingBox = event.target;
    boundingBox.setCoords();
    const brNew = boundingBox.getBoundingRect();
    if (((brNew.width + brNew.left) >= canvas.width)
     || ((brNew.height + brNew.top) >= boundingBox.canvas.height)
     || ((brNew.left < 0) || (brNew.top < 0))) {
      boundingBox.left = left1;
      boundingBox.top = top1;
      boundingBox.scaleX = scale1x;
      boundingBox.scaleY = scale1y;
      boundingBox.width = width1;
      boundingBox.height = height1;
    } else {
      left1 = boundingBox.left;
      top1 = boundingBox.top;
      scale1x = boundingBox.scaleX;
      scale1y = boundingBox.scaleY;
      width1 = boundingBox.width;
      height1 = boundingBox.height;
      boundingBox.width *= boundingBox.scaleX;
      boundingBox.height *= boundingBox.scaleY;
      boundingBox.scaleX = 1;
      boundingBox.scaleY = 1;
      labelObject.left = event.target.left + labelProperies.boundingBoxOffsetProperties().left;
      labelObject.top = event.target.top;
    }
  }
}

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
  setEditPolygonEventObjects, boundingBoxScalingEvents, removeEditedPolygonId,
};
