import { getSettingsPopupOpenState, getExportDatasetsPopupOpenState } from '../../state';
import IS_FIREFOX from '../../utils/browserType';

const buttonPopovers = {};
const HOVER_TIMEOUT = 500;
const SWITCH_BUTTON_DISPLAY_PERSISTANCE_TIMEOUT = 200;
let hasUploadImagesButtonBeenClicked = false;

const pendingbuttonPopovers = [];
let activePopover = null;
let persistButtonPopoverDisplay = false;
let doNotDisplayButtonAfterTimeoutState = false;

function setDoNotDisplayButtonAfterTimeoutStateToFalse() {
  doNotDisplayButtonAfterTimeoutState = false;
}

function assignLeftSideBarMouseEnterEvent() {
  document.getElementById('left-side-bar').addEventListener('mouseenter', () => {
    doNotDisplayButtonAfterTimeoutState = false;
  });
}

function checkIfSettingsButtonNotUp(event) {
  if (event.target.id === 'settings-button') {
    if (!getSettingsPopupOpenState()) {
      return true;
    }
    return false;
  }
  return true;
}

function checkIfExportDatasetsButtonNotUp(event) {
  if (event.target.id === 'export-datasets-button') {
    if (!getExportDatasetsPopupOpenState()) {
      return true;
    }
    return false;
  }
  return true;
}

function displayPopover(middlewareChecks, id) {
  for (let i = 0; i < middlewareChecks.length; i += 1) {
    if (!middlewareChecks[i]()) return;
  }
  pendingbuttonPopovers[0].style.display = 'block';
  activePopover = buttonPopovers[id];
}

function checkIfButtonShouldBeDisplayedAfterAfterTimeout() {
  // in firefox, removeActiveButtonPopover is only triggered when an image/images
  // have started to upload, resultantly setting the doNotDisplayButtonAfterTimeoutState
  // property after mouseleave has been triggered, this is a fix to the issue
  if (IS_FIREFOX && hasUploadImagesButtonBeenClicked) {
    hasUploadImagesButtonBeenClicked = false;
    return false;
  }
  return true;
}

function removeActiveButtonPopover() {
  if (checkIfButtonShouldBeDisplayedAfterAfterTimeout()) {
    doNotDisplayButtonAfterTimeoutState = true;
  }
  if (activePopover) {
    activePopover.style.display = 'none';
    activePopover = null;
  }
}

function checkIfSettingsButtonNotUpMiddleware(event) {
  return checkIfSettingsButtonNotUp(event);
}

function checkIfExportDatasetsButtonNotUpMiddleware(event) {
  return checkIfExportDatasetsButtonNotUp(event);
}

function mouseEnterCoreButton(event, id) {
  const { tagName } = event.target;
  if (tagName === 'BUTTON' || tagName === 'A') {
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
}

function mouseLeaveCoreButton(event) {
  const { tagName } = event.target;
  if (tagName === 'BUTTON' || tagName === 'A') {
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
}

function addPopoverFunctionalityToButton(buttonElementId, popoverElementId) {
  const buttonElement = document.getElementById(buttonElementId);
  const popoverElement = document.getElementById(popoverElementId);
  buttonElement.addEventListener('mouseenter', (event) => {
    mouseEnterCoreButton(event, popoverElement.id);
  });
  buttonElement.addEventListener('mouseleave', (event) => {
    mouseLeaveCoreButton(event);
  });
  buttonPopovers[popoverElement.id] = popoverElement;
}

// firefox bug fix for displaying popovers after uploading an image
function removeUploadImagesButtonPopoverBugFix() {
  const uploadDatasetsButton = document.getElementById('upload-images-button');
  uploadDatasetsButton.addEventListener('mouseup', () => {
    hasUploadImagesButtonBeenClicked = true;
  });
}

function addPopoverFunctionalityToButtons() {
  addPopoverFunctionalityToButton('edit-shapes-button', 'edit-shapes-button-popover');
  addPopoverFunctionalityToButton('create-bounding-box-button', 'bounding-box-button-popover');
  addPopoverFunctionalityToButton('create-polygon-button', 'polygon-button-popover');
  addPopoverFunctionalityToButton('add-points-button', 'add-points-button-popover');
  addPopoverFunctionalityToButton('remove-points-button', 'remove-points-button-popover');
  addPopoverFunctionalityToButton('upload-datasets-button', 'upload-datasets-button-popover');
  addPopoverFunctionalityToButton('export-datasets-button', 'export-datasets-button-popover');
  addPopoverFunctionalityToButton('machine-learning-button', 'machine-learning-button-popover');
  addPopoverFunctionalityToButton('zoom-in-button', 'zoom-in-button-popover');
  addPopoverFunctionalityToButton('zoom-out-button', 'zoom-out-button-popover');
  addPopoverFunctionalityToButton('settings-button', 'settings-button-popover');
  addPopoverFunctionalityToButton('upload-images-button', 'upload-images-button-popover');
  addPopoverFunctionalityToButton('remove-labels-button', 'remove-labels-button-popover');
  addPopoverFunctionalityToButton('remove-images-button', 'remove-images-button-popover');
  addPopoverFunctionalityToButton('previous-image-button', 'previous-image-button-popover');
  addPopoverFunctionalityToButton('next-image-button', 'next-image-button-popover');
  addPopoverFunctionalityToButton('title-github-mark-container', 'github-mark-button-popover');
}

function initialiseCoreButtonPopovers() {
  addPopoverFunctionalityToButtons();
  assignLeftSideBarMouseEnterEvent();
  if (IS_FIREFOX) removeUploadImagesButtonPopoverBugFix();
}

export {
  removeActiveButtonPopover,
  initialiseCoreButtonPopovers,
  setDoNotDisplayButtonAfterTimeoutStateToFalse,
};
