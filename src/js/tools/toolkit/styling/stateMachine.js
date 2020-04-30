import { setButtonToActive, setButtonToDefault, setButtonToDisabled } from './styling';
import { getPolygonDrawingInProgressState } from '../../stateMachine';
import { getAllExistingShapes } from '../../../canvas/objects/allShapes/allShapes';

const state = { ACTIVE: 'active', DEFAULT: 'default', DISABLED: 'disabled' };
let removePointsState = state.DEFAULT;
let addPointsState = state.DEFAULT;
let createBoundingBoxState = state.DEFAULT;
let createPolygonState = state.DEFAULT;
let editShapesState = state.DEFAULT;
let removePolygonPointsButtonElement = null;
let addPolygonPointsButtonElement = null;
let removeShapeButtonElement = null;
let editShapesButtonElement = null;
let zoomInButtonElement = null;
let zoomOutButtonElement = null;
let createBoundingBoxButton = null;
let createPolygonButton = null;

function polygonsPresentInCurrentImage() {
  const currentShapes = getAllExistingShapes();
  const shapeIds = Object.keys(currentShapes);
  for (let i = 0; i < shapeIds.length; i += 1) {
    if (currentShapes[shapeIds[i]].shapeRef.shapeName === 'polygon') return true;
  }
  return false;
}

function setEditShapesButtonToDefault() {
  setButtonToDefault(editShapesButtonElement);
  editShapesState = state.DEFAULT;
}

function setEditShapesButtonToDisabled() {
  setButtonToDisabled(editShapesButtonElement);
  editShapesState = state.DISABLED;
}

function setCreateBoundingBoxButtonToDefault() {
  setButtonToDefault(createBoundingBoxButton);
  createBoundingBoxState = state.DEFAULT;
}

function setCreatePolygonButtonToDefault() {
  setButtonToDefault(createPolygonButton);
  createPolygonState = state.DEFAULT;
}

function setEditShapesButtonToActive() {
  setButtonToActive(editShapesButtonElement);
  editShapesState = state.ACTIVE;
  if (createBoundingBoxState === state.ACTIVE) setCreateBoundingBoxButtonToDefault();
  if (createPolygonState === state.ACTIVE) setCreatePolygonButtonToDefault();
}

function setCreateBoundingBoxButtonToDisabled() {
  setButtonToDisabled(createBoundingBoxButton);
  createBoundingBoxState = state.DISABLED;
}

function setCreateBoundingBoxButtonToActive() {
  setButtonToActive(createBoundingBoxButton);
  createBoundingBoxState = state.ACTIVE;
  if (editShapesState === state.ACTIVE) setEditShapesButtonToDefault();
  if (createPolygonState === state.ACTIVE) setCreatePolygonButtonToDefault();
}

function setCreatePolygonButtonToDisabled() {
  setButtonToDisabled(createPolygonButton);
  createPolygonState = state.DISABLED;
}

function setCreatePolygonButtonToActive() {
  setButtonToActive(createPolygonButton);
  createPolygonState = state.ACTIVE;
  if (createBoundingBoxState === state.ACTIVE) setCreateBoundingBoxButtonToDefault();
  if (editShapesState === state.ACTIVE) setEditShapesButtonToDefault();
}

function setAddPointsDisabled() {
  setButtonToDisabled(addPolygonPointsButtonElement);
  addPointsState = state.DISABLED;
}

function setRemovePointsDisabled() {
  setButtonToDisabled(removePolygonPointsButtonElement);
  removePointsState = state.DISABLED;
}

function setAddPointsDefault() {
  setButtonToDefault(addPolygonPointsButtonElement);
  addPointsState = state.DEFAULT;
}

function setRemovePointsDefault() {
  setButtonToDefault(removePolygonPointsButtonElement);
  removePointsState = state.DEFAULT;
}

function setAddPointsActive() {
  setButtonToActive(addPolygonPointsButtonElement);
  addPointsState = state.ACTIVE;
}

function setRemovePointsActive() {
  setButtonToActive(removePolygonPointsButtonElement);
  removePointsState = state.ACTIVE;
}

function setRemoveShapeButtonToDefault() {
  setButtonToDefault(removeShapeButtonElement);
}

function setRemoveShapeButtonToDisabled() {
  setButtonToDisabled(removeShapeButtonElement);
}

function setZoomInButtonToDefault() {
  setButtonToDefault(zoomInButtonElement);
}

function setZoomInButtonToDisabled() {
  setButtonToDisabled(zoomInButtonElement);
}

function setZoomOutButtonToDefault() {
  setButtonToDefault(zoomOutButtonElement);
}

function setZoomOutButtonToDisabled() {
  setButtonToDisabled(zoomOutButtonElement);
}

function setPolygonEditingButtonsToDisabled() {
  if (!polygonsPresentInCurrentImage()) {
    setRemovePointsDisabled();
    setAddPointsDisabled();
    return true;
  }
  return false;
}

function setAddPointsButtonToDefault() {
  if (polygonsPresentInCurrentImage() && !getPolygonDrawingInProgressState()) {
    setAddPointsDefault();
  } else {
    setAddPointsDisabled();
  }
}

function setRemovePointsButtonToDefault() {
  if (polygonsPresentInCurrentImage() || getPolygonDrawingInProgressState()) {
    setRemovePointsDefault();
  } else {
    setRemovePointsDisabled();
  }
}

function setPolygonEditingButtonsToDefault() {
  setAddPointsButtonToDefault();
  setRemovePointsButtonToDefault();
}

function setAddPointsButtonToActive() {
  setAddPointsActive();
  if (removePointsState === state.ACTIVE) setRemovePointsDefault();
}

function setRemovePointsButtonToActive() {
  setRemovePointsActive();
  if (addPointsState === state.ACTIVE) setAddPointsDefault();
}

function setInitialToolkitButtonStyling() {
  setAddPointsDisabled();
  setRemovePointsDisabled();
  setZoomInButtonToDisabled();
  setZoomOutButtonToDisabled();
  setEditShapesButtonToDisabled();
  setCreatePolygonButtonToActive();
  setRemoveShapeButtonToDisabled();
  setCreatePolygonButtonToDisabled();
  setCreateBoundingBoxButtonToDisabled();
}

function identifyToolkitButtons() {
  editShapesButtonElement = document.getElementById('edit-shapes-button');
  removePolygonPointsButtonElement = document.getElementById('remove-points-button');
  addPolygonPointsButtonElement = document.getElementById('add-points-button');
  removeShapeButtonElement = document.getElementById('remove-shape-button');
  zoomInButtonElement = document.getElementById('zoom-in-button');
  zoomOutButtonElement = document.getElementById('zoom-out-button');
  createBoundingBoxButton = document.getElementById('create-bounding-box-button');
  createPolygonButton = document.getElementById('create-polygon-button');
}

function initiateToolkitButtonsStyling() {
  identifyToolkitButtons();
  setInitialToolkitButtonStyling();
}

export {
  setZoomInButtonToDefault,
  setZoomInButtonToDisabled,
  setZoomOutButtonToDefault,
  setZoomOutButtonToDisabled,
  setAddPointsButtonToActive,
  setAddPointsButtonToDefault,
  setEditShapesButtonToActive,
  setEditShapesButtonToDefault,
  setRemovePointsButtonToActive,
  setEditShapesButtonToDisabled,
  initiateToolkitButtonsStyling,
  setRemoveShapeButtonToDefault,
  setRemoveShapeButtonToDisabled,
  setRemovePointsButtonToDefault,
  setCreatePolygonButtonToActive,
  setCreatePolygonButtonToDefault,
  setCreatePolygonButtonToDisabled,
  setPolygonEditingButtonsToDefault,
  setPolygonEditingButtonsToDisabled,
  setCreateBoundingBoxButtonToActive,
  setCreateBoundingBoxButtonToDefault,
  setCreateBoundingBoxButtonToDisabled,
};


// function getSetterFunc(newState) {
//   if (newState === state.ACTIVE) {
//     return setButtonToActive;
//   }
//   if (newState === state.DEFAULT) {
//     return setButtonToDefault;
//   }
//   return setButtonToDisabled;
// }

// function setPolygonEditingButtonsState(newState) {
//   const setterFunc = getSetterFunc(state);
//   setterFunc(removePolygonPointsButtonElement);
//   removePointsState = newState;
//   setterFunc(addPolygonPointsButtonElement);
//   addPointsState = newState;
// }
