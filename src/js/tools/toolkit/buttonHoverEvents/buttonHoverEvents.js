import { getSettingsPopUpOpenState } from '../buttonClickEvents/facadeWorkersUtils/stateManager';

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
  buttonPopups.downloadDatasets = document.getElementById('download-datasets-button-popup');
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

function displaySettingsPopup(id) {
  pendingButtonPopups[0].style.display = 'block';
  activePopup = buttonPopups[id];
}

window.mouseEnterToolkitButton = (event, id) => {
  if (event.target.tagName === 'BUTTON') {
    pendingButtonPopups.unshift(buttonPopups[id]);
    if (persistButtonPopupDisplay) {
      pendingButtonPopups[0].style.display = 'block';
      activePopup = buttonPopups[id];
    } else {
      setTimeout(() => {
        if (pendingButtonPopups.length === 1 && buttonPopups[id] === pendingButtonPopups[0]
            && !doNotDisplayButtonAfterTimeoutState) {
          if (event.target.id === 'settingsButton') {
            if (!getSettingsPopUpOpenState()) {
              displaySettingsPopup(id);
            }
          } else {
            displaySettingsPopup(id);
          }
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
