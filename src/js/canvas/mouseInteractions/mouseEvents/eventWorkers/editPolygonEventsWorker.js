import {
  setEditablePolygon, movePolygonPoint,
  removePolygonPoints, displayPolygonPointsAfterMove,
  setEditablePolygonAfterMoving, resetPolygonSelectableArea,
  sendPolygonPointsToFront, getPolygonEditingStatus,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils';
import { getLabelById } from '../../../objects/label/label';
import labelProperies from '../../../objects/label/properties';
import { setRemovingPointsAfterCancelDrawState } from '../../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';
import { highlightLabelInTheList, removeHighlightOfListLabel } from '../../../../tools/labelList/highlightLabelList';

let canvas = null;
let polygonMoved = false;
let labelObject = null;
let polygonPointMoved = false;
let selectedShapeId = null;
let newPolygonSelected = false;
let setEditablePolygonOnClick = null;
let finishedAddingNewPoints = false;
let lastShapeSelectedIsBoundingBox = false;

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

// label in the list should be highlighted upon selecting shape
// use different colours for different labels
// investigate the potential of having a rightclick menu to manipulate shapes
// in add or remove points modes, send all objects to the front

// reduce nested if statements in code
function polygonMouseDownEvents(event) {
  if (event.target) {
    enableActiveObjectsAppearInFront(canvas);
    if (event.target.shapeName === 'bndBox') {
      removeHighlightOfListLabel();
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
}

// look at this
function polygonMouseUpEvents(event) {
  if (event.target && event.target.shapeName === 'bndBox') {
    canvas.bringToFront(event.target);
    canvas.bringToFront(labelObject);
  } else if (polygonMoved) {
    highlightLabelInTheList(event.target.id);
    setEditablePolygonWhenPolygonMoved(event);
    canvas.bringToFront(labelObject);
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
    sendPolygonPointsToFront();
  } else if (!event.target && getPolygonEditingStatus()) {
    removeHighlightOfListLabel();
    setPolygonNotEditableOnClick();
  } else if (selectedShapeId != null) {
    removeHighlightOfListLabel();
  }
}

// potentially refactor this by assigning individual move functions
function polygonMoveEvents(event) {
  if (event.target) {
    const { shapeName } = event.target;
    if (shapeName === 'polygon') {
      if (getPolygonEditingStatus()) {
        removePolygonPoints();
      }
      labelObject.left = event.target.left - event.target.labelOffsetLeft;
      labelObject.top = event.target.top - event.target.labelOffsetTop;
      polygonMoved = true;
    } else if (shapeName === 'point') {
      if (event.target.pointId === 0) {
        movePolygonPoint(event, labelObject);
      } else {
        movePolygonPoint(event);
      }
      polygonPointMoved = true;
    } else if (shapeName === 'bndBox') {
      labelObject.left = event.target.left + labelProperies.boundingBoxOffsetProperties.left;
      labelObject.top = event.target.top;
    }
  }
}

// set styling
function polygonMouseOutEvents(event) {
  event.target.set('fill', 'rgba(255,0,0,0.01)');
}

function pointMouseOverEvents(event) {
  if (event.target && event.target.shapeName !== 'point' && event.target.shapeName !== 'label') {
    event.target.set('fill', 'rgba(255,0,0,0.2)');
    canvas.renderAll();
  }
}

function removeEditedPolygonId() {
  selectedShapeId = null;
}

function setEditPolygonEventObjects(canvasObj, polygonObjId, afterAddPoints) {
  canvas = canvasObj;
  if (polygonObjId !== 'undefined' && polygonObjId !== null) {
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

function boundingBoxScalingEvents(event) {
  if (event.target.shapeName === 'bndBox') {
    const boundingBox = event.target;
    boundingBox.width *= boundingBox.scaleX;
    boundingBox.height *= boundingBox.scaleY;
    boundingBox.scaleX = 1;
    boundingBox.scaleY = 1;
    labelObject.left = event.target.left;
    labelObject.top = event.target.top;
  }
}

function boundingBoxMouseOutEvents(event) {
  event.target.set('fill', 'rgba(255,0,0,0');
}

export {
  polygonMouseDownEvents, polygonMouseUpEvents,
  polygonMoveEvents, removeEditedPolygonId,
  polygonMouseOutEvents, pointMouseOverEvents,
  setEditPolygonEventObjects, boundingBoxScalingEvents,
  boundingBoxMouseOutEvents, programaticallySelectBoundingBox,
  programaticallyDeselectBoundingBox,
};
