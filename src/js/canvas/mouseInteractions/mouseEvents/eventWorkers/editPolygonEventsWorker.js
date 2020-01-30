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
  getShapeMovingState, setShapeMovingState,
  getBoundingBoxScalingState, setBoundingBoxScalingState,
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

let tempScalingLeft = 0;
let tempScalingTop = 0;
let tempScalingScaleX = 0;
let tempScalingScaleY = 0;
let tempScalingWidth = 0;
let tempScalingHeight = 0;

function setDefaultScalingValues(boundingBox, pointer) {
  tempScalingLeft = boundingBox.left;
  tempScalingTop = boundingBox.top;
  tempScalingScaleX = boundingBox.scaleX;
  tempScalingScaleY = boundingBox.scaleY;
  tempScalingWidth = boundingBox.width;
  tempScalingHeight = boundingBox.height;
  if (controlSelected.topLeft) {
    if (boundingBox.width <= 0) {
      boundingBox.left = originalBoundingBoxRightCoordinate;
      boundingBox.width = 1;
    } else {
      boundingBox.left = pointer.x;
      boundingBox.width = originalBoundingBoxRightCoordinate - pointer.x;
    }
    if (boundingBox.height <= 0) {
      boundingBox.top = originalBoundingBoxBottomCoordinate;
      boundingBox.height = 1;
    } else {
      boundingBox.top = pointer.y;
      boundingBox.height = originalBoundingBoxBottomCoordinate - pointer.y;
    }
  } else if (controlSelected.topRight) {
    if (boundingBox.width <= 0) {
      boundingBox.left = originalBoundingBoxLeftCoordinate;
      boundingBox.width = 1;
    } else {
      boundingBox.left = originalBoundingBoxLeftCoordinate;
      boundingBox.width = pointer.x - originalBoundingBoxLeftCoordinate;
    }
    if (boundingBox.height <= 0) {
      boundingBox.top = originalBoundingBoxBottomCoordinate;
      boundingBox.height = 1;
    } else {
      boundingBox.top = pointer.y;
      boundingBox.height = originalBoundingBoxBottomCoordinate - pointer.y;
    }
  } else if (controlSelected.bottomLeft) {
    if (boundingBox.width <= 0) {
      boundingBox.left = originalBoundingBoxRightCoordinate;
      boundingBox.width = 1;
    } else {
      boundingBox.left = pointer.x;
      boundingBox.width = originalBoundingBoxRightCoordinate - pointer.x;
    }
    if (boundingBox.height <= 0) {
      boundingBox.top = originalBoundingBoxTopCoordinate;
      boundingBox.height = 1;
    } else {
      boundingBox.top = originalBoundingBoxTopCoordinate;
      boundingBox.height = pointer.y - originalBoundingBoxTopCoordinate;
    }
  } else if (controlSelected.bottomRight) {
    if (boundingBox.width <= 0) {
      boundingBox.left = originalBoundingBoxLeftCoordinate;
      boundingBox.width = 1;
    } else {
      boundingBox.left = originalBoundingBoxLeftCoordinate;
      boundingBox.width = pointer.x - originalBoundingBoxLeftCoordinate;
    }
    if (boundingBox.height <= 0) {
      boundingBox.top = originalBoundingBoxTopCoordinate;
      boundingBox.height = 1;
    } else {
      boundingBox.top = originalBoundingBoxTopCoordinate;
      boundingBox.height = pointer.y - originalBoundingBoxTopCoordinate;
    }
  } else {
    boundingBox.width *= boundingBox.scaleX;
    boundingBox.height *= boundingBox.scaleY;
  }
  boundingBox.scaleX = 1;
  boundingBox.scaleY = 1;
  labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
  labelObject.top = boundingBox.top;
}

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

let originalDimensions = 0;
let originalDimensionsWidth = 0;
let originalBoundingBoxBottomCoordinate = 0;
let originalBoundingBoxLeftCoordinate = 0;
let originalBoundingBoxTopCoordinate = 0;
let originalBoundingBoxRightCoordinate = 0;
const controlSelected = {
  middleTop: false,
  topRight: false,
  middleRight: false,
  bottomRight: false,
  middleBottom: false,
  bottomLeft: false,
  middleLeft: false,
  topLeft: false,
};

function clearControlSelectedObject() {
  Object.keys(controlSelected).forEach((key) => {
    controlSelected[key] = false;
  });
}

let removeBoundingBoxFillWhenScaling = false;

let originalWidth = 0;
let originalHeight = 0;

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
      originalDimensions = event.target.top + event.target.height;
      originalDimensionsWidth = event.target.left + event.target.width;
      originalBoundingBoxTopCoordinate = event.target.top;
      if (event.transform.corner) {
        setBoundingBoxScalingState(true);
        switch (event.transform.corner) {
          case 'ml':
            // should be called right coordinate
            originalBoundingBoxLeftCoordinate = event.target.left + event.target.width;
            controlSelected.middleLeft = true;
            break;
          case 'mt':
            originalBoundingBoxBottomCoordinate = event.target.top + event.target.height;
            controlSelected.middleTop = true;
            break;
          case 'tl':
            originalHeight = event.target.height;
            originalWidth = event.target.width;
            originalBoundingBoxRightCoordinate = event.target.left + event.target.width;
            originalBoundingBoxBottomCoordinate = event.target.top + event.target.height;
            controlSelected.topLeft = true;
            break;
          case 'tr':
            originalWidth = event.target.width;
            originalHeight = event.target.height;
            originalBoundingBoxRightCoordinate = event.target.left + event.target.width;
            originalBoundingBoxBottomCoordinate = event.target.top + event.target.height;
            originalBoundingBoxLeftCoordinate = event.target.left;
            controlSelected.topRight = true;
            break;
          case 'mr':
            controlSelected.middleRight = true;
            originalBoundingBoxLeftCoordinate = event.target.left;
            break;
          case 'br':
            originalWidth = event.target.width;
            originalHeight = event.target.height;
            originalBoundingBoxRightCoordinate = event.target.left + event.target.width;
            originalBoundingBoxBottomCoordinate = event.target.top + event.target.height;
            originalBoundingBoxLeftCoordinate = event.target.left;
            controlSelected.bottomRight = true;
            break;
          case 'mb':
            controlSelected.middleBottom = true;
            break;
          case 'bl':
            controlSelected.bottomLeft = true;
            originalWidth = event.target.width;
            originalHeight = event.target.height;
            originalBoundingBoxRightCoordinate = event.target.left + event.target.width;
            originalBoundingBoxBottomCoordinate = event.target.top + event.target.height;
            originalBoundingBoxLeftCoordinate = event.target.left;
            break;
          default:
            clearControlSelectedObject();
            break;
        }
      }
      highlightLabelInTheList(event.target.id);
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
    highlightLabelInTheList(event.target.id);
    setEditablePolygonWhenPolygonMoved(event);
    highlightShapeFill(event.target.id);
    canvas.bringToFront(labelObject);
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
  if (getShapeMovingState()) { setShapeMovingState(false); }
}

// the zoom is not properly showing the full images
// the right and bottom boundaries may look off when zoomed in (after above fix)

// have condition for if certain zoom, allow the bounding box edge to be increased

// will need to look at points boundaries when the full image is shown and
// zoom scaling is fully fixed

function preventShapesOutOfBounds(shape) {
  shape.setCoords();
  // multiple if statements because of corners
  // top
  if (shape.top < 0) {
    shape.top = 0;
  }
  // left
  if (shape.left < 0) {
    shape.left = 0;
  }
  if (getCurrentZoomState() > 1.00001) {
    const { height, width } = getImageProperties();
    const imageHeight = height * getCurrentZoomState();
    const imageWidth = width * getCurrentZoomState();
    // right
    if (shape.left + shape.width > imageWidth / getCurrentZoomState()
    - (getCurrentZoomState())) {
      shape.left = imageWidth / getCurrentZoomState() - shape.width - 2;
    }
    // bottom
    if (shape.top + shape.height > imageHeight / getCurrentZoomState()
    - getCurrentZoomState()) {
      shape.top = imageHeight / getCurrentZoomState() - shape.height - 2;
    }
  } else {
    // right
    if (shape.left + shape.width > canvas.width - 2.5) {
      shape.left = canvas.width - shape.width - 2.5;
    }
    // bottom
    if (shape.top + shape.height > canvas.height - 2) {
      shape.top = canvas.height - shape.height - 2;
    }
  }
}

function preventOutOfBoundsPoints(shape) {
  shape.setCoords();
  // multiple if statements because of corners
  // top
  if (shape.top + shape.height / 2 < 0) {
    shape.top = 0;
  }
  // left
  if (shape.left + shape.width / 2 < 0) {
    shape.left = 0;
  }
  if (getCurrentZoomState() > 1.00001) {
    const { height, width } = getImageProperties();
    const imageHeight = height * getCurrentZoomState();
    const imageWidth = width * getCurrentZoomState();
    // right
    if (shape.left + shape.width / 2
      > imageWidth / getCurrentZoomState() + 0.75) {
      shape.left = imageWidth / getCurrentZoomState() - shape.width / 2;
    }
    // bottom
    if (shape.top + shape.height / 2
      > imageHeight / getCurrentZoomState() + 1) {
      shape.top = imageHeight / getCurrentZoomState() - shape.height / 2 + 1;
    }
  } else {
    // right
    if (shape.left + shape.width / 2 > canvas.width + 1.5) {
      shape.left = canvas.width - shape.width / 2 + 1.5;
    }
    // bottom
    if (shape.top + shape.height / 2 > canvas.height + 1.5) {
      shape.top = canvas.height - shape.height / 2 + 1.5;
    }
  }
}

function preventOutOfBounds(shape) {
  if (shape.shapeName === 'point') {
    preventOutOfBoundsPoints(shape);
  } else {
    preventShapesOutOfBounds(shape);
  }
}

// potentially refactor this by assigning individual move functions
function polygonMoveEvents(event) {
  if (event.target) {
    setShapeMovingState(true);
    const { shapeName } = event.target;
    if (shapeName === 'polygon') {
      preventOutOfBounds(event.target, event.e);
      if (getPolygonEditingStatus()) {
        removePolygonPoints();
      }
      labelObject.setCoords();
      labelObject.top = event.target.top - event.target.labelOffsetTop;
      labelObject.left = event.target.left - event.target.labelOffsetLeft;
      polygonMoved = true;
    } else if (shapeName === 'point') {
      preventOutOfBounds(event.target, event.e);
      if (event.target.pointId === 0) {
        movePolygonPoint(event, labelObject);
      } else {
        movePolygonPoint(event);
      }
      resetPolygonSelectableAreaAfterPointMoved();
      polygonPointMoved = true;
    } else if (shapeName === 'bndBox') {
      preventOutOfBounds(event.target, event.e);
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
  if (!getBoundingBoxScalingState() && !getShapeMovingState()) {
    defaultShapeFill(event.target.id);
  } else {
    removeBoundingBoxFillWhenScaling = true;
  }
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

function preventScalingTop(boundingBox) {
  boundingBox.top = 0;
  boundingBox.scaleX = tempScalingScaleX;
  boundingBox.scaleY = tempScalingScaleY;
  boundingBox.height = originalDimensions;
}

function preventScalingLeft(boundingBox) {
  boundingBox.left = 0;
  boundingBox.scaleX = tempScalingScaleX;
  boundingBox.scaleY = tempScalingScaleY;
  boundingBox.width = originalDimensionsWidth;
}

function preventScalingTopLeft(boundingBox) {
  boundingBox.scaleX = 1;
  boundingBox.scaleY = 1;
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

function boundingBoxScalingEvents(event) {
  if (event.target.shapeName !== 'bndBox') return;
  const boundingBox = event.target;
  const { height, width } = getImageProperties();
  const imageHeight = height * getCurrentZoomState();
  const imageWidth = width * getCurrentZoomState();
  boundingBox.setCoords();
  const pointer = canvas.getPointer(canvas.e);
  let changed = false;
  let topBlocking = false;
  let rightBlocking = false;
  let leftBlocking = false;
  // top
  // make sure that the bounding box cannot be reflected when top is 0
  if (boundingBox.top <= 0) {
    console.log('1');
    topBlocking = true;
    if (controlSelected.topLeft) {
      changed = true;
      boundingBox.top = 0;
      boundingBox.height = originalBoundingBoxBottomCoordinate;
      if (boundingBox.width <= 0) {
        boundingBox.left = originalBoundingBoxRightCoordinate - 1;
        boundingBox.width = 1;
      } else {
        boundingBox.left = pointer.x;
        boundingBox.width = originalBoundingBoxRightCoordinate - pointer.x;
      }
      labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
      labelObject.top = boundingBox.top;
      preventScalingTopLeft(boundingBox);
    } else if (controlSelected.topRight) {
      changed = true;
      boundingBox.height = originalBoundingBoxBottomCoordinate;
      boundingBox.top = 0;
      if (boundingBox.width <= 0) {
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        boundingBox.width = 1;
      } else {
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        boundingBox.width = pointer.x - originalBoundingBoxLeftCoordinate;
      }
      labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
      labelObject.top = boundingBox.top;
      preventScalingTopLeft(boundingBox);
    } else if (controlSelected.middleTop) {
      changed = true;
      preventScalingTop(boundingBox);
    }
  } else if (controlSelected.middleTop) {
    boundingBox.height = originalBoundingBoxBottomCoordinate - pointer.y;
  }
  // left
  if (boundingBox.left <= 0) {
    leftBlocking = true;
    if (controlSelected.topLeft) {
      changed = true;
      if (!topBlocking) {
        if (boundingBox.height <= 0) {
          boundingBox.top = originalBoundingBoxBottomCoordinate - 1;
          boundingBox.height = 1;
        } else {
          boundingBox.top = pointer.y;
          boundingBox.height = originalBoundingBoxBottomCoordinate - pointer.y;
        }
      }
      boundingBox.left = 0;
      boundingBox.width = originalBoundingBoxRightCoordinate;
      labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
      labelObject.top = boundingBox.top;
      preventScalingTopLeft(boundingBox);
    } else if (controlSelected.bottomLeft) {
      changed = true;
      if (boundingBox.height <= 0) {
        boundingBox.top = originalBoundingBoxTopCoordinate;
        boundingBox.height = 1;
      } else {
        boundingBox.top = originalBoundingBoxTopCoordinate;
        boundingBox.height = pointer.y - originalBoundingBoxTopCoordinate;
      }
      boundingBox.left = 0;
      boundingBox.width = originalBoundingBoxRightCoordinate;
      labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
      labelObject.top = boundingBox.top;
      preventScalingTopLeft(boundingBox);
    } else if (controlSelected.middleLeft) {
      changed = true;
      preventScalingLeft(boundingBox);
    }
  } else if (controlSelected.middleLeft) {
    boundingBox.width = originalBoundingBoxLeftCoordinate - pointer.x;
  }
  if (getCurrentZoomState() > 1.00001) {
    // right
    console.log('3');
    if ((boundingBox.width + boundingBox.left) > imageWidth / getCurrentZoomState()) {
      rightBlocking = true;
      if (controlSelected.topRight) {
        changed = true;
        if (!topBlocking) {
          if (boundingBox.height <= 0) {
            boundingBox.top = originalBoundingBoxBottomCoordinate - 1;
            boundingBox.height = 1;
          } else {
            boundingBox.top = pointer.y;
            boundingBox.height = originalBoundingBoxBottomCoordinate - pointer.y;
          }
        }
        boundingBox.width = imageWidth / getCurrentZoomState() - boundingBox.left - 2;
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else if (controlSelected.bottomRight) {
        changed = true;
        if (boundingBox.height <= 0) {
          boundingBox.top = originalBoundingBoxTopCoordinate;
          boundingBox.height = 1;
        } else {
          boundingBox.top = originalBoundingBoxTopCoordinate;
          boundingBox.height = pointer.y - originalBoundingBoxTopCoordinate;
        }
        boundingBox.width = imageWidth / getCurrentZoomState() - boundingBox.left - 2;
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else {
        boundingBox.width = imageWidth / getCurrentZoomState() - boundingBox.left - 2;
      }
    }
    // bottom
    if ((boundingBox.height + boundingBox.top) > imageHeight / getCurrentZoomState()) {
      console.log('4');
      if (controlSelected.bottomRight) {
        changed = true;
        if (!rightBlocking) {
          if (boundingBox.width <= 0) {
            boundingBox.left = originalBoundingBoxLeftCoordinate;
            boundingBox.width = 1;
          } else {
            boundingBox.left = originalBoundingBoxLeftCoordinate;
            boundingBox.width = pointer.x - originalBoundingBoxLeftCoordinate;
          }
        }
        boundingBox.height = imageHeight / getCurrentZoomState() - boundingBox.top - 2;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else if (controlSelected.bottomLeft) {
        changed = true;
        if (!leftBlocking) {
          if (boundingBox.width <= 0) {
            boundingBox.left = originalBoundingBoxRightCoordinate - 1;
            boundingBox.width = 1;
          } else {
            boundingBox.width = originalBoundingBoxRightCoordinate - pointer.x;
            boundingBox.left = pointer.x;
          }
        }
        boundingBox.height = imageHeight / getCurrentZoomState() - boundingBox.top - 2;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else {
        boundingBox.height = imageHeight / getCurrentZoomState() - boundingBox.top - 2;
      }
    }
  } else {
    // right
    console.log('5');
    if ((boundingBox.width + boundingBox.left) > canvas.width) {
      rightBlocking = true;
      if (controlSelected.topRight) {
        changed = true;
        if (!topBlocking) {
          if (boundingBox.height <= 0) {
            boundingBox.top = originalBoundingBoxBottomCoordinate - 1;
            boundingBox.height = 1;
          } else {
            boundingBox.top = pointer.y;
            boundingBox.height = originalBoundingBoxBottomCoordinate - pointer.y;
          }
        }
        boundingBox.width = canvas.width - boundingBox.left - 2;
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else if (controlSelected.bottomRight) {
        changed = true;
        if (boundingBox.height <= 0) {
          boundingBox.top = originalBoundingBoxTopCoordinate;
          boundingBox.height = 1;
        } else {
          boundingBox.top = originalBoundingBoxTopCoordinate;
          boundingBox.height = pointer.y - originalBoundingBoxTopCoordinate;
        }
        boundingBox.width = canvas.width - boundingBox.left - 2;
        boundingBox.left = originalBoundingBoxLeftCoordinate;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else {
        boundingBox.width = canvas.width - boundingBox.left - 2;
      }
    }
    // bottom
    if ((boundingBox.height + boundingBox.top) > canvas.height) {
      console.log('6');
      if (controlSelected.bottomRight) {
        changed = true;
        if (!rightBlocking) {
          if (boundingBox.width <= 0) {
            boundingBox.left = originalBoundingBoxLeftCoordinate;
            boundingBox.width = 1;
          } else {
            boundingBox.left = originalBoundingBoxLeftCoordinate;
            boundingBox.width = pointer.x - originalBoundingBoxLeftCoordinate;
          }
        }
        boundingBox.height = canvas.height - boundingBox.top;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else if (controlSelected.bottomLeft) {
        changed = true;
        if (!leftBlocking) {
          if (boundingBox.width <= 0) {
            boundingBox.left = originalBoundingBoxRightCoordinate - 1;
            boundingBox.width = 1;
          } else {
            boundingBox.width = originalBoundingBoxRightCoordinate - pointer.x;
            boundingBox.left = pointer.x;
          }
        }
        boundingBox.height = canvas.height - boundingBox.top - 2;
        labelObject.left = boundingBox.left + labelProperies.boundingBoxOffsetProperties().left;
        labelObject.top = boundingBox.top;
      } else {
        boundingBox.height = canvas.height - boundingBox.top - 2;
      }
    }
  }
  if (!changed) {
    console.log('7');
    setDefaultScalingValues(boundingBox, pointer);
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
