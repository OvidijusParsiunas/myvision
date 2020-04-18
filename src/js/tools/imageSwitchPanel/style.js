let nextButtonElement = null;
let previousButtonElement = null;
let imageNameElement = null;
let imageNameElementMinWidth = 0;
const IMAGE_ELEMENT_SIDE_PADDING = 40;

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

function setImageNameElementToActive() {
  imageNameElement.style.color = ACTIVE_COLOR;
}

function setImageNameElementToDefault() {
  imageNameElement.innerHTML = DEFAULT_IMAGE_NAME;
  imageNameElement.style.color = '';
}

function setNameElementMinWidth() {
  const imageNameElementWidth = imageNameElement.clientWidth
    - IMAGE_ELEMENT_SIDE_PADDING;
  if (imageNameElementWidth > imageNameElementMinWidth) {
    imageNameElement.style.minWidth = `${imageNameElementWidth}px`;
    imageNameElementMinWidth = imageNameElementWidth;
  }
}

function updateImageNameElement(imageName, images, currentlySelectedImageId, firstFromMany) {
  imageNameElement.innerHTML = imageName;
  setNameElementMinWidth();
  if (images.length === 1) {
    setImageNameElementToActive();
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
  imageNameElement = document.getElementById('image-name');
  [previousButtonElement, nextButtonElement] = document.getElementsByClassName('image-switch-button');
}

function initialiseImageSwitchPanelFunctionality() {
  findImageSwitchElements();
}

export {
  updateImageNameElement,
  setImageNameElementToDefault,
  initialiseImageSwitchPanelFunctionality,
};
