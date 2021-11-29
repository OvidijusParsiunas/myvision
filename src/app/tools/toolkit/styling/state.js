import {
  setButtonToActive, setButtonToDefault, setButtonToDisabled, setButtonToGreyDefault,
} from './styling.js';
import { getPolygonDrawingInProgressState } from '../../state.js';
import { getAllExistingShapes } from '../../../canvas/objects/allShapes/allShapes.js';

const state = { ACTIVE: 'active', DEFAULT: 'default', DISABLED: 'disabled' };
let removePointsState = state.DEFAULT;
let addPointsState = state.DEFAULT;
let createBoundingBoxState = state.DEFAULT;
let createPolygonState = state.DEFAULT;
let editShapesState = state.DEFAULT;
let removePolygonPointsButtonElement = null;
let addPolygonPointsButtonElement = null;
let removeLabelsButtonElement = null;
let editShapesButtonElement = null;
let zoomInButtonElement = null;
let zoomOutButtonElement = null;
let createBoundingBoxButtonElement = null;
let createPolygonButtonElement = null;
let removeImagesButtonElement = null;

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

function getEditShapesButtonState() {
  return editShapesState;
}

function setCreateBoundingBoxButtonToDefault() {
  setButtonToDefault(createBoundingBoxButtonElement);
  createBoundingBoxState = state.DEFAULT;
}

function setCreateBoundingBoxButtonToDisabled() {
  setButtonToDisabled(createBoundingBoxButtonElement);
  createBoundingBoxState = state.DISABLED;
}

function getCreateBoundingBoxButtonState() {
  return createBoundingBoxState;
}

function setCreatePolygonButtonToDefault() {
  setButtonToDefault(createPolygonButtonElement);
  createPolygonState = state.DEFAULT;
}

function setCreatePolygonButtonToDisabled() {
  setButtonToDisabled(createPolygonButtonElement);
  createPolygonState = state.DISABLED;
}

function getCreatePolygonButtonState() {
  return createPolygonState;
}

function setRemoveImagesButtonDefault() {
  setButtonToGreyDefault(removeImagesButtonElement);
}

function setRemoveImagesButtonsDisabled() {
  setButtonToDisabled(removeImagesButtonElement);
}

function setAddPointsDefault() {
  setButtonToDefault(addPolygonPointsButtonElement);
  addPointsState = state.DEFAULT;
}

function setAddPointsDisabled() {
  setButtonToDisabled(addPolygonPointsButtonElement);
  addPointsState = state.DISABLED;
}

function setAddPointsActive() {
  setButtonToActive(addPolygonPointsButtonElement);
  addPointsState = state.ACTIVE;
}

function getAddPointsButtonState() {
  return addPointsState;
}

function setRemovePointsDefault() {
  setButtonToDefault(removePolygonPointsButtonElement);
  removePointsState = state.DEFAULT;
}

function setRemovePointsDisabled() {
  setButtonToDisabled(removePolygonPointsButtonElement);
  removePointsState = state.DISABLED;
}

function setRemovePointsActive() {
  setButtonToActive(removePolygonPointsButtonElement);
  removePointsState = state.ACTIVE;
}

function getRemovePointsButtonState() {
  return removePointsState;
}

function setRemoveLabelsButtonToDefault() {
  setButtonToDefault(removeLabelsButtonElement);
}

function setRemoveLabelsButtonToDisabled() {
  setButtonToDisabled(removeLabelsButtonElement);
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

function setCreatePolygonButtonToActive() {
  setButtonToActive(createPolygonButtonElement);
  createPolygonState = state.ACTIVE;
  if (createBoundingBoxState === state.ACTIVE) setCreateBoundingBoxButtonToDefault();
  if (editShapesState === state.ACTIVE) setEditShapesButtonToDefault();
}

function setEditShapesButtonToActive() {
  setButtonToActive(editShapesButtonElement);
  editShapesState = state.ACTIVE;
  if (createBoundingBoxState === state.ACTIVE) setCreateBoundingBoxButtonToDefault();
  if (createPolygonState === state.ACTIVE) setCreatePolygonButtonToDefault();
}

function setCreateBoundingBoxButtonToActive() {
  setButtonToActive(createBoundingBoxButtonElement);
  createBoundingBoxState = state.ACTIVE;
  if (editShapesState === state.ACTIVE) setEditShapesButtonToDefault();
  if (createPolygonState === state.ACTIVE) setCreatePolygonButtonToDefault();
}

function setAddPointsButtonToActive() {
  setAddPointsActive();
  if (createBoundingBoxState === state.ACTIVE) setCreateBoundingBoxButtonToDefault();
  if (createPolygonState === state.ACTIVE) setCreatePolygonButtonToDefault();
  if (removePointsState === state.ACTIVE) setRemovePointsDefault();
}

function setRemovePointsButtonToActive() {
  setRemovePointsActive();
  if (createBoundingBoxState === state.ACTIVE) setCreateBoundingBoxButtonToDefault();
  if (createPolygonState === state.ACTIVE
    && !getPolygonDrawingInProgressState()) setCreatePolygonButtonToDefault();
  if (addPointsState === state.ACTIVE) setAddPointsDefault();
}

function setInitialToolkitButtonStyling() {
  setAddPointsDisabled();
  setRemovePointsDisabled();
  setZoomInButtonToDisabled();
  setZoomOutButtonToDisabled();
  setEditShapesButtonToDisabled();
  setRemoveImagesButtonsDisabled();
  setCreatePolygonButtonToActive();
  setRemoveLabelsButtonToDisabled();
  setCreatePolygonButtonToDisabled();
  setCreateBoundingBoxButtonToDisabled();
}

function identifyToolkitButtons() {
  editShapesButtonElement = document.getElementById('edit-shapes-button');
  removePolygonPointsButtonElement = document.getElementById('remove-points-button');
  addPolygonPointsButtonElement = document.getElementById('add-points-button');
  removeLabelsButtonElement = document.getElementById('remove-labels-button');
  zoomInButtonElement = document.getElementById('zoom-in-button');
  zoomOutButtonElement = document.getElementById('zoom-out-button');
  createBoundingBoxButtonElement = document.getElementById('create-bounding-box-button');
  createPolygonButtonElement = document.getElementById('create-polygon-button');
  removeImagesButtonElement = document.getElementById('remove-images-button');
}

function initiateToolkitButtonsStyling() {
  identifyToolkitButtons();
  setInitialToolkitButtonStyling();
}

export {
  getAddPointsButtonState,
  getEditShapesButtonState,
  setZoomInButtonToDefault,
  setZoomInButtonToDisabled,
  setZoomOutButtonToDefault,
  getRemovePointsButtonState,
  setZoomOutButtonToDisabled,
  setAddPointsButtonToActive,
  getCreatePolygonButtonState,
  setAddPointsButtonToDefault,
  setEditShapesButtonToActive,
  setRemoveImagesButtonDefault,
  setEditShapesButtonToDefault,
  setRemovePointsButtonToActive,
  setEditShapesButtonToDisabled,
  initiateToolkitButtonsStyling,
  setRemoveLabelsButtonToDefault,
  setRemoveImagesButtonsDisabled,
  setRemovePointsButtonToDefault,
  setCreatePolygonButtonToActive,
  setRemoveLabelsButtonToDisabled,
  getCreateBoundingBoxButtonState,
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
