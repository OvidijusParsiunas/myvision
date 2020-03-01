import { getSettingsPopUpOpenState, getExportDatasetsPopUpOpenState } from '../buttonClickEvents/facadeWorkersUtils/stateMachine';

const buttonPopups = {};
const HOVER_TIMEOUT = 500;
const SWITCH_BUTTON_DISPLAY_PERSISTANCE_TIMEOUT = 200;

let activePopup = null;
let persistButtonPopupDisplay = false;
const pendingButtonPopups = [];
let doNotDisplayButtonAfterTimeoutState = false;

function assignToolkitButtonHoverEvents() {
  buttonPopups.default = document.getElementById('default-button-popup');
  buttonPopups.boundingBox = document.getElementById('bounding-box-button-popup');
  buttonPopups.polygon = document.getElementById('polygon-button-popup');
  buttonPopups.addPoints = document.getElementById('add-points-button-popup');
  buttonPopups.removePoints = document.getElementById('remove-points-button-popup');
  buttonPopups.removeShape = document.getElementById('remove-shape-button-popup');
  buttonPopups.exportDatasets = document.getElementById('export-datasets-button-popup');
  buttonPopups.uploadDatasets = document.getElementById('upload-datasets-button-popup');
  buttonPopups.machineLearning = document.getElementById('machine-learning-button-modal');
  buttonPopups.zoomIn = document.getElementById('zoom-in-button-popup');
  buttonPopups.zoomOut = document.getElementById('zoom-out-button-popup');
  buttonPopups.uploadImages = document.getElementById('upload-images-button-popup');
  buttonPopups.settings = document.getElementById('settings-button-popup');
}

function removeActiveButtonPopup() {
  doNotDisplayButtonAfterTimeoutState = true;
  if (activePopup) {
    activePopup.style.display = 'none';
    activePopup = null;
  }
}

function displayPopup(middlewareChecks, id) {
  for (let i = 0; i < middlewareChecks.length; i += 1) {
    if (!middlewareChecks[i]()) return;
  }
  pendingButtonPopups[0].style.display = 'block';
  activePopup = buttonPopups[id];
}

function checkIfSettingsButtonNotUp(event) {
  if (event.target.id === 'settingsButton') {
    if (!getSettingsPopUpOpenState()) {
      return true;
    }
    return false;
  }
  return true;
}

function checkIfExportDatasetsButtonNotUp(event) {
  if (event.target.id === 'exportDatasetsButton') {
    if (!getExportDatasetsPopUpOpenState()) {
      return true;
    }
    return false;
  }
  return true;
}

function checkIfSettingsButtonNotUpMiddleware(event) {
  return checkIfSettingsButtonNotUp(event);
}

function checkIfExportDatasetsButtonNotUpMiddleware(event) {
  return checkIfExportDatasetsButtonNotUp(event);
}

window.mouseEnterLeftSideBar = () => {
  doNotDisplayButtonAfterTimeoutState = false;
};

window.mouseEnterToolkitButton = (event, id) => {
  if (event.target.tagName === 'BUTTON') {
    pendingButtonPopups.unshift(buttonPopups[id]);
    if (persistButtonPopupDisplay) {
      displayPopup([checkIfSettingsButtonNotUpMiddleware.bind(this, event),
        checkIfExportDatasetsButtonNotUpMiddleware.bind(this, event)], id);
    } else {
      setTimeout(() => {
        if (pendingButtonPopups.length === 1 && buttonPopups[id] === pendingButtonPopups[0]
            && !doNotDisplayButtonAfterTimeoutState) {
          displayPopup([checkIfSettingsButtonNotUp.bind(this, event),
            checkIfExportDatasetsButtonNotUp.bind(this, event)], id);
        }
        doNotDisplayButtonAfterTimeoutState = false;
      }, HOVER_TIMEOUT);
    }
  }
};

window.mouseLeaveToolkitButton = (event) => {
  if (event.target.tagName === 'BUTTON') {
    if (activePopup !== null) {
      activePopup.style.display = 'none';
      activePopup = null;
      persistButtonPopupDisplay = true;
      setTimeout(() => {
        persistButtonPopupDisplay = false;
      }, SWITCH_BUTTON_DISPLAY_PERSISTANCE_TIMEOUT);
    }
    pendingButtonPopups.pop();
  }
  doNotDisplayButtonAfterTimeoutState = false;
};

export { assignToolkitButtonHoverEvents, removeActiveButtonPopup };
