import { setButtonToActive, setButtonToDefault, setButtonToDisabled } from './styling';

const state = { ACTIVE: 'active', DEFAULT: 'default', DISABLED: 'disabled' };
let removePointsState = state.DEFAULT;
let addPointsState = state.DEFAULT;
let removePolygonPointsButtonElement = null;
let addPolygonPointsButtonElement = null;

function setPolygonEditingButtonsToDefault() {
  setButtonToDefault(removePolygonPointsButtonElement);
  removePointsState = state.DEFAULT;
  setButtonToDefault(addPolygonPointsButtonElement);
  addPointsState = state.DEFAULT;
}

function setPolygonEditingButtonsToDisabled() {
  setButtonToDisabled(removePolygonPointsButtonElement);
  removePointsState = state.DISABLED;
  setButtonToDisabled(addPolygonPointsButtonElement);
  addPointsState = state.DISABLED;
}

function setAddPointsButtonToActive() {
  setButtonToActive(addPolygonPointsButtonElement);
  addPointsState = state.ACTIVE;
  if (removePointsState === state.ACTIVE) setButtonToDefault(removePolygonPointsButtonElement);
}

function setAddPointsButtonToDefault() {
  setButtonToDefault(addPolygonPointsButtonElement);
  addPointsState = state.DEFAULT;
}

function setRemovePointsButtonToActive() {
  setButtonToActive(removePolygonPointsButtonElement);
  removePointsState = state.ACTIVE;
  if (addPointsState === state.ACTIVE) setButtonToDefault(addPolygonPointsButtonElement);
}

function setRemovePointsButtonToDefault() {
  setButtonToDefault(removePolygonPointsButtonElement);
  removePointsState = state.DEFAULT;
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