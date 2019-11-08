const buttonPopups = {};
const HOVER_TIMEOUT = 500;
const SWITCH_BUTTON_DISPLAY_PERSISTANCE_TIMEOUT = 200;

let activePopup = null;
let persistButtonPopupDisplay = false;
const pendingButtonPopups = [];

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
  if (activePopup) {
    activePopup.style.display = 'none';
    activePopup = null;
  }
}

window.mouseEnterToolkitButton = (event, id) => {
  if (event.target.tagName === 'BUTTON') {
    pendingButtonPopups.unshift(buttonPopups[id]);
    if (persistButtonPopupDisplay) {
      pendingButtonPopups[0].style.display = 'block';
      activePopup = buttonPopups[id];
    } else {
      setTimeout(() => {
        if (pendingButtonPopups.length === 1 && buttonPopups[id] === pendingButtonPopups[0]) {
          pendingButtonPopups[0].style.display = 'block';
          activePopup = buttonPopups[id];
        }
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
};

export { assignToolkitButtonHoverEvents, removeActiveButtonPopup };
