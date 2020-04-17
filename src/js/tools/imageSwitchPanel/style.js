let nextButtonElement = null;
let previousButtonElement = null;
let currentImageNameElement = null;

const ACTIVE_COLOR = 'black';
const ACTIVE_CURSOR = 'pointer';
const DEFAULT_IMAGE_NAME = 'Image name';

function setPreviousButtonElementToActive() {
  previousButtonElement.style.color = ACTIVE_COLOR;
  previousButtonElement.style.cursor = ACTIVE_CURSOR;
}

function setPreviousButtonElementToDefault() {
  previousButtonElement.style.color = '';
  previousButtonElement.style.cursor = '';
}

function setNextButtonElementToActive() {
  nextButtonElement.style.color = ACTIVE_COLOR;
  nextButtonElement.style.cursor = ACTIVE_CURSOR;
}

function setNextButtonElementToDefault() {
  nextButtonElement.style.color = '';
  nextButtonElement.style.cursor = '';
}

function setCurrentImageNameElementToActive() {
  currentImageNameElement.style.color = ACTIVE_COLOR;
}

function setCurrentImageNameElementToDefault() {
  currentImageNameElement.innerHTML = DEFAULT_IMAGE_NAME;
  currentImageNameElement.style.color = '';
}

function changeCurrentImageName(imageName, images, currentlySelectedImageId, firstFromMany) {
  currentImageNameElement.innerHTML = imageName;
  if (images.length === 1) {
    setCurrentImageNameElementToActive();
    if (firstFromMany) {
      setNextButtonElementToActive();
    } else {
      setNextButtonElementToDefault();
      setPreviousButtonElementToDefault();
    }
  } else if (images.length > 1) {
    if (images.length - 1 === currentlySelectedImageId) {
      if (firstFromMany) {
        setNextButtonElementToActive();
      } else {
        setNextButtonElementToDefault();
      }
      setPreviousButtonElementToActive();
    } else if (currentlySelectedImageId === 0) {
      setPreviousButtonElementToDefault();
      setNextButtonElementToActive();
    } else {
      setNextButtonElementToActive();
      setPreviousButtonElementToActive();
    }
  }
}

function findImageSwitchElements() {
  currentImageNameElement = document.getElementById('current-image-name');
  [previousButtonElement, nextButtonElement] = document.getElementsByClassName('image-switch-button');
}

function initialiseImageSwitchPanelFunctionality() {
  findImageSwitchElements();
}

export {
  changeCurrentImageName,
  setCurrentImageNameElementToDefault,
  initialiseImageSwitchPanelFunctionality,
};
