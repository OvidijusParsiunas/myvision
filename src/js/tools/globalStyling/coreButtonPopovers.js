import { getSettingsPopUpOpenState, getExportDatasetsPopUpOpenState } from '../stateMachine';

const buttonPopovers = {};
const HOVER_TIMEOUT = 500;
const SWITCH_BUTTON_DISPLAY_PERSISTANCE_TIMEOUT = 200;

const pendingbuttonPopovers = [];
let activePopover = null;
let persistButtonPopoverDisplay = false;
let doNotDisplayButtonAfterTimeoutState = false;

function initialiseCoreButtonPopovers() {
  buttonPopovers.default = document.getElementById('default-button-popover');
  buttonPopovers.boundingBox = document.getElementById('bounding-box-button-popover');
  buttonPopovers.polygon = document.getElementById('polygon-button-popover');
  buttonPopovers.addPoints = document.getElementById('add-points-button-popover');
  buttonPopovers.removePoints = document.getElementById('remove-points-button-popover');
  buttonPopovers.removeShape = document.getElementById('remove-shape-button-popover');
  buttonPopovers.exportDatasets = document.getElementById('export-datasets-button-popover');
  buttonPopovers.uploadDatasets = document.getElementById('upload-datasets-button-popover');
  buttonPopovers.machineLearning = document.getElementById('machine-learning-button-popover');
  buttonPopovers.zoomIn = document.getElementById('zoom-in-button-popover');
  buttonPopovers.zoomOut = document.getElementById('zoom-out-button-popover');
  buttonPopovers.settings = document.getElementById('settings-button-popover');
  buttonPopovers.uploadImages = document.getElementById('upload-images-button-popover');
  buttonPopovers.removeImages = document.getElementById('remove-images-button-popover');
}

function removeActiveButtonPopover() {
  doNotDisplayButtonAfterTimeoutState = true;
  if (activePopover) {
    activePopover.style.display = 'none';
    activePopover = null;
  }
}

function displayPopover(middlewareChecks, id) {
  for (let i = 0; i < middlewareChecks.length; i += 1) {
    if (!middlewareChecks[i]()) return;
  }
  pendingbuttonPopovers[0].style.display = 'block';
  activePopover = buttonPopovers[id];
}

function checkIfSettingsButtonNotUp(event) {
  if (event.target.id === 'settings-button') {
    if (!getSettingsPopUpOpenState()) {
      return true;
    }
    return false;
  }
  return true;
}

function checkIfExportDatasetsButtonNotUp(event) {
  if (event.target.id === 'export-datasets-button') {
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

window.mouseEnterCoreButton = (event, id) => {
  if (event.target.tagName === 'BUTTON') {
    pendingbuttonPopovers.unshift(buttonPopovers[id]);
    if (persistButtonPopoverDisplay) {
      displayPopover([checkIfSettingsButtonNotUpMiddleware.bind(this, event),
        checkIfExportDatasetsButtonNotUpMiddleware.bind(this, event)], id);
    } else {
      setTimeout(() => {
        if (pendingbuttonPopovers.length === 1 && buttonPopovers[id] === pendingbuttonPopovers[0]
            && !doNotDisplayButtonAfterTimeoutState) {
          displayPopover([checkIfSettingsButtonNotUp.bind(this, event),
            checkIfExportDatasetsButtonNotUp.bind(this, event)], id);
        }
        doNotDisplayButtonAfterTimeoutState = false;
      }, HOVER_TIMEOUT);
    }
  }
};

window.mouseLeaveCoreButton = (event) => {
  if (event.target.tagName === 'BUTTON') {
    if (activePopover !== null) {
      activePopover.style.display = 'none';
      activePopover = null;
      persistButtonPopoverDisplay = true;
      setTimeout(() => {
        persistButtonPopoverDisplay = false;
      }, SWITCH_BUTTON_DISPLAY_PERSISTANCE_TIMEOUT);
    }
    pendingbuttonPopovers.pop();
  }
  doNotDisplayButtonAfterTimeoutState = false;
};

export { initialiseCoreButtonPopovers, removeActiveButtonPopover };
