import { getNumberOfShapeTypes } from '../../globalStatistics/globalStatistics';
import { setButtonToActive, setButtonToDefault, setButtonToDisabled } from './styling';
import { getPolygonDrawingInProgressState, getCurrentImageId } from '../../stateMachine';
import getAllImageData from '../../imageList/imageData';

const state = { ACTIVE: 'active', DEFAULT: 'default', DISABLED: 'disabled' };
let removePointsState = state.DEFAULT;
let addPointsState = state.DEFAULT;
let removePolygonPointsButtonElement = null;
let addPolygonPointsButtonElement = null;

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

function setPolygonEditingButtonsToDisabled() {
  setRemovePointsDisabled();
  setAddPointsDisabled();
}

function setAddPointsButtonToDefault() {
  // console.log(getAllImageData()[getCurrentImageId()]);
  if (getNumberOfShapeTypes().polygons > 0) {
    setAddPointsDefault();
  } else {
    setAddPointsDisabled();
  }
}

function setRemovePointsButtonToDefault() {
  if (getNumberOfShapeTypes().polygons > 0 || getPolygonDrawingInProgressState()) {
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

function identifyToolkitButtons() {
  removePolygonPointsButtonElement = document.getElementById('remove-points-button');
  addPolygonPointsButtonElement = document.getElementById('add-points-button');
}

function setInitialToolkitButtonStyling() {
  setButtonToDisabled(removePolygonPointsButtonElement);
  setButtonToDisabled(addPolygonPointsButtonElement);
}

function initiateToolkitButtonsStyling() {
  identifyToolkitButtons();
  setInitialToolkitButtonStyling();
}

export {
  setAddPointsButtonToActive,
  setAddPointsButtonToDefault,
  setRemovePointsButtonToActive,
  initiateToolkitButtonsStyling,
  setRemovePointsButtonToDefault,
  setPolygonEditingButtonsToDefault,
  setPolygonEditingButtonsToDisabled,
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