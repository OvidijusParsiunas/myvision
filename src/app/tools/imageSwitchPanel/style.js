import { getScreenSizeDelta } from '../globalStyling/screenSizeDelta.js';

let nextButtonElement = null;
let previousButtonElement = null;
let imageNameElement = null;
let imageNameElementMinWidth = 0;
let imageElementSidePaddingLength = 37;

const ACTIVE_COLOR = 'black';
const DEFAULT_IMAGE_NAME = 'Image name';
const ENABLED_TOOLKIT_BUTTON_CLASS = 'toolkit-button-default';
const DISABLED_TOOLKIT_BUTTON_CLASS = 'toolkit-button-disabled';
const ENABLED_IMAGE_SWITCH_BUTTON_CLASS = 'image-switch-button-enabled';

function disableButton(element) {
  element.classList.replace(ENABLED_TOOLKIT_BUTTON_CLASS, DISABLED_TOOLKIT_BUTTON_CLASS);
  element.classList.remove(ENABLED_IMAGE_SWITCH_BUTTON_CLASS);
}

function enableButton(element) {
  element.classList.replace(DISABLED_TOOLKIT_BUTTON_CLASS, ENABLED_TOOLKIT_BUTTON_CLASS);
  element.classList.add(ENABLED_IMAGE_SWITCH_BUTTON_CLASS);
}

function setImageNameElementToActive() {
  imageNameElement.style.color = ACTIVE_COLOR;
}

function setImageNameElementToDefault() {
  imageNameElement.innerHTML = DEFAULT_IMAGE_NAME;
  imageNameElement.style.color = '';
}

function setNameElementMinWidth() {
  const imageNameElementWidth = imageNameElement.clientWidth - imageElementSidePaddingLength;
  if (imageNameElementWidth > imageNameElementMinWidth) {
    imageNameElement.style.minWidth = `${imageNameElementWidth}px`;
    imageNameElementMinWidth = imageNameElementWidth;
  }
}

function updateImageNameElement(imageName, images, currentlySelectedImageId, isfirstFromMany) {
  imageNameElement.innerHTML = imageName;
  setNameElementMinWidth();
  if (images.length === 1) {
    setImageNameElementToActive();
    if (isfirstFromMany) {
      enableButton(nextButtonElement);
    } else {
      disableButton(nextButtonElement);
      disableButton(previousButtonElement);
    }
  } else if (images.length > 1) {
    if (images.length - 1 === currentlySelectedImageId) {
      if (isfirstFromMany) {
        enableButton(nextButtonElement);
      } else {
        disableButton(nextButtonElement);
      }
      enableButton(previousButtonElement);
    } else if (currentlySelectedImageId === 0) {
      disableButton(previousButtonElement);
      enableButton(nextButtonElement);
    } else {
      enableButton(nextButtonElement);
      enableButton(previousButtonElement);
    }
  }
}

function findImageSwitchElements() {
  imageNameElement = document.getElementById('image-name');
  [previousButtonElement, nextButtonElement] = document.getElementsByClassName('image-switch-button');
}

function initialiseImageSwitchPanelFunctionality() {
  findImageSwitchElements();
  imageElementSidePaddingLength /= getScreenSizeDelta();
}

export {
  updateImageNameElement,
  setImageNameElementToDefault,
  initialiseImageSwitchPanelFunctionality,
};
