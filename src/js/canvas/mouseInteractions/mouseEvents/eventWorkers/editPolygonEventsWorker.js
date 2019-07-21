import {
  setEditablePolygon, movePolygonPoint,
  removePolygonPoints, displayPolygonPointsAfterMove,
  setEditablePolygonAfterMoving, resetPolygonSelectableArea,
  sendPolygonPointsToFront, getPolygonEditingStatus,
} from '../../../objects/polygon/alterPolygon/alterPolygon';
import { enableActiveObjectsAppearInFront, preventActiveObjectsAppearInFront } from '../../../utils/canvasUtils';
import { getLabelById } from '../../../objects/label/label';
import { setRemovingPointsAfterCancelDrawState } from '../../../../tools/toolkit/buttonEvents/facadeWorkersUtils/stateManager';

let canvas = null;
let polygonMoved = false;
let labelObject = null;
let polygonPointMoved = false;
let selectedPolygonId = null;
let newPolygonSelected = false;
let setEditablePolygonOnClick = null;
let selectedPolygonLabelPointId = null;

function setEditablePolygonOnClickFunc(event) {
  if (getPolygonEditingStatus()) {
    // selecting another polygon without moving the first one
    removePolygonPoints();
  }
  setEditablePolygon(canvas, event.target);
  selectedPolygonId = event.target.id;
  getLabelById(event.target.id);
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
    selectedPolygonId = event.target.id;
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
  selectedPolygonId = null;
}

// fix issue where hover would change the colour of the label text
// label should be in front but not clickable
// smart system where label would readjust upon mouse up if it's edges are outside of canvas
// stop shapes from being able to move outside of canvas

// reduce nested if statements in code
function polygonMouseDownEvents(event) {
  if (event.target) {
    enableActiveObjectsAppearInFront(canvas);
    if (event.target.shapeName === 'bndBox') {
      if (getPolygonEditingStatus()) {
        setPolygonNotEditableOnClick();
        newPolygonSelected = false;
      }
      labelObject = getLabelById(event.target.id);
    } else {
      if (event.target.shapeName === 'polygon' && event.target.id !== selectedPolygonId) {
        labelObject = getLabelById(event.target.id);
        selectedPolygonLabelPointId = event.target.labelPointId;
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
  } else if (polygonMoved) {
    setEditablePolygonWhenPolygonMoved(event);
  } else if (newPolygonSelected) {
    canvas.bringToFront(event.target);
    setEditablePolygonOnClick(event);
  } else if (polygonPointMoved) {
    resetPolygonSelectableAreaAfterPointMoved();
  } else if (event.target && event.target.shapeName === 'polygon') {
    sendPolygonPointsToFront();
  } else if (!event.target && getPolygonEditingStatus()) {
    setPolygonNotEditableOnClick();
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
      if (event.target.pointId === selectedPolygonLabelPointId) {
        movePolygonPoint(event, labelObject);
      } else {
        movePolygonPoint(event);
      }
      polygonPointMoved = true;
    } else if (shapeName === 'bndBox') {
      labelObject.left = event.target.left;
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
  selectedPolygonId = null;
}

function setEditPolygonEventObjects(canvasObj, polygonObjId, afterAddPoints) {
  canvas = canvasObj;
  if (polygonObjId) {
    selectedPolygonId = polygonObjId;
    labelObject = getLabelById(polygonObjId);
  }
  if (afterAddPoints) {
    newPolygonSelected = true;
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
  boundingBoxMouseOutEvents,
};
